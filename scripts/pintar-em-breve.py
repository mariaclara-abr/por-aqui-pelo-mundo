#!/usr/bin/env python3
"""Pinta em código (numpy + PIL) o fundo da página "em breve": um lago ao
entardecer com montanhas nevadas, reflexos, anéis na água e uma gaivota.

Uso: python3 scripts/pintar-em-breve.py <paisagem|retrato> <saida.png> [multiplicador]
Depois converta para AVIF (como as outras aquarelas do site), em public/:
  node -e "require('sharp')('saida.png').avif({quality:76,effort:6}).toFile('public/em-breve-paisagem.avif')"

A cena vive em coordenadas de "mundo" (x 0..1600, horizonte em y = 800) e cada
formato só escolhe um recorte dela. O céu fica escuro até perto das montanhas
de propósito: o texto da página é branco e precisa de contraste sobre ele
(ver components/ComingSoonPage.tsx).
"""
import math
import sys

import numpy as np
from PIL import Image, ImageDraw

HORIZON = 800.0


def rgb(r, g, b):
    return np.array([r, g, b], np.float32) / 255.0


def mul(r, g, b):
    """Cor de camada transparente (0..1 por canal): quanto cada canal passa."""
    return np.array([r, g, b], np.float32)


# ---------------------------------------------------------------- recorte


class View:
    def __init__(self, x0, y0, w_world, h_world, scale):
        self.x0, self.y0, self.s = x0, y0, scale
        self.w, self.h = int(round(w_world * scale)), int(round(h_world * scale))
        yy, xx = np.mgrid[0 : self.h, 0 : self.w].astype(np.float32)
        self.xx, self.yy = xx, yy
        self.wx = xx / scale + x0  # coordenadas de mundo de cada pixel
        self.wy = yy / scale + y0

    def px(self, pts):
        return [((x - self.x0) * self.s, (y - self.y0) * self.s) for x, y in pts]

    def py(self, y):
        return (y - self.y0) * self.s

    def rows(self, y_from, y_to):
        """Fatia de linhas (como View) entre duas alturas de mundo."""
        a = int(round(self.py(y_from)))
        b = int(round(self.py(y_to)))
        sub = View.__new__(View)
        sub.__dict__.update(self.__dict__)
        sub.h = b - a
        sub.xx, sub.yy = self.xx[a:b], self.yy[a:b]
        sub.wx, sub.wy = self.wx[a:b], self.wy[a:b]
        return sub


# ---------------------------------------------------------------- ruido


def vn(V, cu, cv=None, ang=0.0, seed=0):
    """Ruído de valor suave; cu/cv = tamanho da célula (px) ao longo/ao largo do ângulo."""
    cv = cu if cv is None else cv
    G = 256
    grid = np.random.default_rng(seed).random((G, G)).astype(np.float32)
    c, s = math.cos(ang), math.sin(ang)
    u = (V.xx * c + V.yy * s) / cu + seed * 7.13
    v = (-V.xx * s + V.yy * c) / cv + seed * 3.71
    u0, v0 = np.floor(u).astype(np.int32), np.floor(v).astype(np.int32)
    fu, fv = u - u0, v - v0
    fu, fv = fu * fu * (3 - 2 * fu), fv * fv * (3 - 2 * fv)
    i0, j0, i1, j1 = u0 % G, v0 % G, (u0 + 1) % G, (v0 + 1) % G
    a, b, c_, d = grid[j0, i0], grid[j0, i1], grid[j1, i0], grid[j1, i1]
    return (a * (1 - fu) + b * fu) * (1 - fv) + (c_ * (1 - fu) + d * fu) * fv


def fbm(V, cell, octaves=3, seed=0, ang=0.0, aniso=1.0):
    tot, amp, norm = 0, 1.0, 0
    for i in range(octaves):
        cu = max(cell / 2**i, 1.5)
        tot = tot + amp * vn(V, cu * aniso, cu, ang, seed + i * 11)
        norm += amp
        amp *= 0.5
    return tot / norm


def gblur(a, sx, sy=None):
    sy = sx if sy is None else sy
    if sx <= 0 and sy <= 0:
        return a
    h, w = a.shape[:2]
    ph, pw = int(3 * sy) + 1, int(3 * sx) + 1
    pad = [(ph, ph), (pw, pw)] + [(0, 0)] * (a.ndim - 2)
    p = np.pad(a, pad, mode="edge")
    H, W = p.shape[:2]
    fy = np.fft.fftfreq(H)[:, None]
    fx = np.fft.rfftfreq(W)[None, :]
    k = np.exp(-2 * np.pi**2 * ((sx * fx) ** 2 + (sy * fy) ** 2)).astype(np.float32)

    def one(ch):
        return np.fft.irfft2(np.fft.rfft2(ch) * k, s=(H, W))

    if a.ndim == 2:
        out = one(p)
    else:
        out = np.stack([one(p[..., c]) for c in range(a.shape[2])], -1)
    return out[ph : ph + h, pw : pw + w].astype(np.float32)


def warp(a, dx, dy):
    h, w = a.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    x = np.clip(xx + dx, 0, w - 1.001)
    y = np.clip(yy + dy, 0, h - 1.001)
    x0, y0 = x.astype(np.int32), y.astype(np.int32)
    fx, fy = x - x0, y - y0
    if a.ndim == 3:
        fx, fy = fx[..., None], fy[..., None]
    top = a[y0, x0] * (1 - fx) + a[y0, x0 + 1] * fx
    bot = a[y0 + 1, x0] * (1 - fx) + a[y0 + 1, x0 + 1] * fx
    return (top * (1 - fy) + bot * fy).astype(np.float32)


def smooth(lo, hi, x):
    t = np.clip((x - lo) / (hi - lo), 0, 1)
    return t * t * (3 - 2 * t)


# ---------------------------------------------------------------- formas


def fill(V, polys, ss=2):
    """Rasteriza uma ou mais listas de pontos de mundo em uma máscara 0..1."""
    im = Image.new("L", (V.w * ss, V.h * ss), 0)
    d = ImageDraw.Draw(im)
    for pts in polys:
        d.polygon([(x * ss, y * ss) for x, y in V.px(pts)], fill=255)
    return np.asarray(im.resize((V.w, V.h), Image.BOX), np.float32) / 255.0


def jag(pts, rough, depth, seed):
    """Subdivide a linha acrescentando irregularidade (cristas de montanha)."""
    r = np.random.default_rng(seed)
    out = list(pts)
    for _ in range(depth):
        nxt = [out[0]]
        for (x1, y1), (x2, y2) in zip(out, out[1:]):
            L = math.hypot(x2 - x1, y2 - y1) or 1
            nx, ny = -(y2 - y1) / L, (x2 - x1) / L
            d = (r.random() - 0.5) * 2 * rough * L
            nxt += [((x1 + x2) / 2 + nx * d, (y1 + y2) / 2 + ny * d), (x2, y2)]
        out = nxt
        rough *= 0.6
    return out


def organic(V, m, amp=2.0, seed=0, rough=0.35):
    """Borda de aquarela: deforma de leve e re-afia com ruído fino."""
    s = V.s
    dx = (fbm(V, 70 * s, 3, seed) - 0.5) * 2 * amp * s
    dy = (fbm(V, 70 * s, 3, seed + 3) - 0.5) * 2 * amp * s
    m = warp(m, dx, dy)
    n = fbm(V, 5 * s, 2, seed + 7) - 0.5
    return np.clip((gblur(m, 0.9 * s) + n * rough - 0.5) * 3.5 + 0.5, 0, 1)


def strokes(V, specs, seed, amp=0.8):
    """Pinceladas afuniladas (neve, grotas). Cada uma: (x, y, ângulo_graus, comprimento, largura)."""
    r = np.random.default_rng(seed)
    polys = []
    for x, y, ang, L, w in specs:
        a = math.radians(ang)
        dx, dy = math.cos(a), math.sin(a)
        nx, ny = -dy, dx
        n = 9
        wob = r.normal(0, 0.10, n + 1).cumsum() * w
        left, right = [], []
        for i in range(n + 1):
            t = i / n
            cx, cy = x + dx * L * t + nx * wob[i], y + dy * L * t + ny * wob[i]
            ww = w * (1 - t) ** 0.8 * 0.5
            left.append((cx + nx * ww, cy + ny * ww))
            right.append((cx - nx * ww, cy - ny * ww))
        polys.append(left + right[::-1])
    return organic(V, fill(V, polys), amp, seed + 9, 0.3)


def streaks_along(top, xs, ang, rng, lens, widths, drop=4):
    """Pinceladas que nascem na crista (lista `top`) nas posições xs e descem em `ang`."""
    tx, ty = [p[0] for p in top], [p[1] for p in top]
    out = []
    for x in xs:
        y = float(np.interp(x, tx, ty))
        out.append((x, y + drop, ang + rng.normal(0, 4), rng.uniform(*lens), rng.uniform(*widths)))
    return out


def snowcap(V, ridge, m, depth, var, cu, seed):
    """Neve que desce da crista: profundidade varia ao longo de x e fica rasgada embaixo."""
    pts = sorted(ridge)
    ridge_y = np.interp(V.wx, [p[0] for p in pts], [p[1] for p in pts])
    d = V.wy - ridge_y
    n1 = vn(V, cu * V.s, 4000, 0.0, seed)
    n2 = vn(V, 16 * V.s, 16 * V.s, 0.0, seed + 1)
    n3 = vn(V, cu * V.s * 0.35, 4000, 0.0, seed + 4)
    thr = np.maximum(depth * (0.5 + 0.75 * n1 + 0.45 * n3) + var * (n2 - 0.5), 9)
    sn = smooth(-3, 3, thr - d) * (d > -6)
    sn = organic(V, sn, 1.0, seed + 2, 0.12) * m
    return sn


# ---------------------------------------------------------------- tinta


def over(canvas, color, m, opacity=1.0):
    a = (m * opacity)[..., None]
    canvas[:] = canvas * (1 - a) + color * a


def glaze(canvas, color, m, strength=1.0):
    """Camada transparente (multiplica): escurece e tinge sem apagar o que há embaixo."""
    a = (m * strength)[..., None]
    canvas[:] = canvas * (1 - a * (1 - color))


def pigment(V, seed, vary=0.10, grain=0.03):
    n = fbm(V, 110 * V.s, 3, seed) - 0.5
    g = vn(V, 1.6, 1.6, 0.3, seed + 5) - 0.5
    return (1 + vary * 2 * n + grain * 2 * g)[..., None]


def wet_edge(V, m, k=0.30, r=3.0):
    return np.clip(m - gblur(m, r * V.s), 0, 1)[..., None] * k


def paint(canvas, V, m, color, seed, opacity=1.0, edge=0.30, vary=0.10):
    col = color * pigment(V, seed, vary) * (1 - wet_edge(V, m, edge))
    over(canvas, col, m, opacity)


# ---------------------------------------------------------------- cena

SKY = [
    (-400, (34, 76, 118)),
    (200, (44, 92, 136)),
    (450, (54, 104, 146)),
    (565, (60, 110, 150)),
    (605, (90, 128, 170)),
    (650, (144, 152, 192)),
    (697, (200, 168, 194)),
    (742, (238, 188, 170)),
    (776, (246, 178, 128)),
    (801, (240, 150, 100)),
]

SNOW = rgb(238, 226, 232)


def sky(V):
    ys = np.array([p[0] for p in SKY], np.float32)
    cols = np.array([p[1] for p in SKY], np.float32) / 255.0
    img = np.stack([np.interp(V.wy, ys, cols[:, c]) for c in range(3)], -1).astype(np.float32)
    shift = np.clip((V.wx - 800) / 800, -1, 1)
    img[..., 0] *= 1 - 0.07 * shift
    img[..., 1] *= 1 + 0.05 * shift
    img[..., 2] *= 1 - 0.03 * shift
    # pinceladas horizontais de pigmento
    streak = fbm(V, 26 * V.s, 2, 21, 0.0, aniso=14) - 0.5
    blot = fbm(V, 220 * V.s, 3, 31) - 0.5
    img = img * (1 + 0.040 * streak[..., None] * 2 + 0.050 * blot[..., None] * 2)
    # brilho do sol baixo, atrás das montanhas
    gx = (V.wx - 1010) / 700
    gy = (V.wy - 800) / 250
    glow = (np.exp(-(gx**2 + gy**2) * 1.7) * (V.wy < 802))[..., None]
    img = img + (rgb(255, 184, 128) - img) * glow * 0.5
    wisp = smooth(0.55, 0.8, fbm(V, 18 * V.s, 2, 41, 0.0, aniso=22)) * smooth(640, 700, V.wy) * (1 - smooth(770, 800, V.wy))
    img = img + (rgb(252, 206, 184) - img) * (wisp * 0.32)[..., None]
    cloud = smooth(0.50, 0.78, fbm(V, 14 * V.s, 3, 51, 0.0, aniso=26)) * smooth(520, 590, V.wy) * (1 - smooth(640, 690, V.wy))
    img = img + (rgb(150, 160, 200) - img) * (cloud * 0.30)[..., None]
    return np.clip(img, 0, 1)


def mountain(canvas, V, top, seed, rough, color, base=840, amp=2.2, soft=0.0):
    ridge = jag(top, rough, 5, seed)
    m = organic(V, fill(V, [ridge + [(ridge[-1][0], base), (ridge[0][0], base)]]), amp, seed)
    if soft:
        m = gblur(m, soft * V.s)
    paint(canvas, V, m, color, seed + 1)
    return m, ridge


def face(V, m, line, side, seed):
    """Máscara de uma face (esquerda/direita de uma linha de divisão) dentro da montanha m."""
    far = -400 if side == "left" else 2200
    poly = jag(line, 0.05, 4, seed) + [(far, line[-1][1] + 200), (far, line[0][1] - 300)]
    return organic(V, fill(V, [poly]), 2.0, seed + 5) * m


def cap(canvas, V, ridge, m, depth, var, cu, seed, color=SNOW, opacity=0.95):
    sn = snowcap(V, ridge, m, depth, var, cu, seed)
    over(canvas, color * pigment(V, seed + 3, 0.04), sn, opacity)
    return sn


def scene(V):
    s = V.s
    canvas = sky(V)
    rng = np.random.default_rng(7)

    # --- planalto nevado à esquerda (neblina lavanda)
    fl_top = [(140, 704), (205, 690), (272, 680), (330, 683), (392, 680), (440, 688), (500, 702), (560, 724), (640, 764), (700, 806)]
    m, ridge = mountain(canvas, V, fl_top, 101, 0.05, rgb(166, 144, 164), soft=1.2)
    cap(canvas, V, ridge, m, 40, 26, 16, 110, rgb(236, 224, 234))
    glaze(canvas, mul(0.82, 0.76, 0.86), smooth(720, 806, V.wy) * m, 0.8)

    # --- cume pequeno atrás do pico
    fc_top = [(330, 748), (380, 716), (430, 690), (480, 673), (540, 668), (600, 678)]
    m, ridge = mountain(canvas, V, fc_top, 121, 0.06, rgb(154, 128, 148), soft=1.0)
    cap(canvas, V, ridge, m, 16, 14, 12, 130)

    # --- maciço distante à direita
    fr_top = [(780, 706), (840, 686), (900, 671), (960, 662), (1030, 659), (1100, 664), (1170, 668), (1240, 678), (1300, 692), (1345, 734), (1385, 790), (1400, 806)]
    m, ridge = mountain(canvas, V, fr_top, 141, 0.05, rgb(170, 138, 138), soft=0.9)
    cap(canvas, V, ridge, m, 26, 26, 14, 150, rgb(238, 226, 232))
    warm = smooth(1060, 1130, V.wx) * (1 - smooth(1230, 1300, V.wx)) * smooth(676, 700, V.wy) * (1 - smooth(752, 790, V.wy)) * m
    glaze(canvas, mul(1.0, 0.78, 0.60), gblur(warm, 7 * s), 0.9)

    # --- pico central
    top = [(300, 792), (400, 748), (470, 712), (540, 676), (590, 650), (628, 636), (672, 656), (700, 676), (738, 698), (770, 706), (800, 728), (850, 760), (930, 784), (1000, 806)]
    m, ridge = mountain(canvas, V, top, 201, 0.07, rgb(172, 126, 112), amp=2.4)
    cap(canvas, V, ridge, m, 20, 22, 12, 210, rgb(240, 224, 228), 0.92)
    left = face(V, m, [(628, 636), (640, 668), (650, 700), (674, 744), (700, 786), (712, 806)], "left", 202)
    glaze(canvas, mul(0.62, 0.58, 0.72), gblur(left, 1.5 * s), 0.95)
    low = smooth(715, 800, V.wy) * (V.wx > 690) * m
    glaze(canvas, mul(1.0, 0.82, 0.64), gblur(low, 6 * s), 0.55)
    fios = streaks_along(ridge, rng.uniform(650, 860, 11), 70, rng, (26, 64), (3, 6), 6) + streaks_along(ridge, rng.uniform(440, 620, 9), 112, rng, (26, 60), (3, 6), 6)
    over(canvas, rgb(244, 230, 232), strokes(V, fios, 270, 0.6) * m, 0.8)
    facets = np.zeros_like(m)
    for i in range(7):
        x = rng.uniform(560, 860)
        y = float(np.interp(x, [p[0] for p in sorted(ridge)], [p[1] for p in sorted(ridge)]))
        facets = np.maximum(facets, strokes(V, [(x, y + 8, 90 + (x - 628) * 0.07, rng.uniform(50, 120), rng.uniform(8, 18))], 230 + i, 1.5))
    glaze(canvas, mul(0.86, 0.82, 0.88), gblur(facets, 2 * s) * m, 0.3)

    # --- neblina quente na base do que está distante
    over(canvas, rgb(248, 198, 170), smooth(690, 802, V.wy), 0.34)

    # --- montanha escura da esquerda
    lf_top = [(-80, 598), (40, 602), (88, 614), (130, 640), (180, 676), (240, 722), (300, 758), (360, 780), (430, 796), (480, 806)]
    m, ridge = mountain(canvas, V, lf_top, 301, 0.06, rgb(40, 44, 60), amp=2.6)
    lit = np.clip(m - warp(m, np.full(m.shape, -5.0 * s, np.float32), np.full(m.shape, 7.0 * s, np.float32)), 0, 1)
    over(canvas, rgb(124, 98, 116), gblur(lit, 1.2 * s) * (V.wy < 770) * 1.5, 0.6)
    glaze(canvas, mul(0.55, 0.58, 0.66), smooth(750, 806, V.wy) * m, 0.8)

    # --- montanha iluminada da direita
    rf_top = [(1090, 808), (1152, 790), (1216, 762), (1270, 722), (1330, 684), (1400, 640), (1460, 604), (1520, 584), (1580, 570), (1680, 556)]
    m, ridge = mountain(canvas, V, rf_top, 401, 0.07, rgb(196, 124, 78), amp=2.6)
    cap(canvas, V, ridge, m, 12, 24, 9, 410, rgb(236, 218, 214), 0.92)
    glaze(canvas, mul(0.62, 0.56, 0.60), smooth(690, 806, V.wy) * m, 0.85)
    glaze(canvas, mul(0.74, 0.68, 0.74), smooth(1380, 1700, V.wx) * m, 0.8)
    over(canvas, rgb(238, 222, 218), strokes(V, streaks_along(ridge, rng.uniform(1380, 1650, 7), 98, rng, (26, 70), (3, 5), 6), 420, 0.6) * m * (1 - smooth(720, 780, V.wy)), 0.6)

    # --- faixa escura da margem no horizonte
    shore = organic(V, fill(V, [jag([(430, 799), (700, 797.5), (1000, 797.5), (1160, 799)], 0.02, 5, 501) + [(1160, 806), (430, 806)]]), 1, 502)
    over(canvas, rgb(88, 66, 72), shore, 0.7)
    return canvas


def water(canvas, V):
    s = V.s
    hz = int(round(V.py(HORIZON)))
    depth = V.h - hz
    above = canvas[:hz]
    if above.shape[0] < depth:
        above = np.concatenate([np.repeat(above[:1], depth - above.shape[0], 0), above], 0)
    refl = above[-depth:][::-1].copy()
    sub = V.rows(HORIZON, HORIZON + depth / s)
    d = np.linspace(0, 1, depth, dtype=np.float32)[:, None]

    # borra com a profundidade
    b1 = gblur(refl, 1.6 * s, 7 * s)
    b2 = gblur(refl, 4 * s, 26 * s)
    t1 = np.clip(d * 2.2, 0, 1)[..., None]
    t2 = np.clip((d - 0.35) * 1.8, 0, 1)[..., None]
    refl = refl * (1 - t1) + b1 * t1
    refl = refl * (1 - t2) + b2 * t2

    # ondulação horizontal
    amp = (1.5 + 13 * d**1.2) * s
    dx = (fbm(sub, 140 * s, 2, 611, 0.0, aniso=4) - 0.5) * 2 * amp + np.sin(sub.yy / (7 * s) + fbm(sub, 90 * s, 2, 612) * 6) * amp * 0.45
    dy = (fbm(sub, 60 * s, 2, 613, 0.0, aniso=6) - 0.5) * 2 * (1.5 * s)
    refl = warp(refl, dx, dy)

    luma = (refl * np.array([0.299, 0.587, 0.114], np.float32)).sum(-1, keepdims=True)
    refl = (luma * 0.25 + refl * 0.75) * 0.88
    deep = rgb(54, 62, 88)
    k = (0.12 + 0.36 * d**0.9)[..., None]
    wat = refl * (1 - k) + deep * k

    # luz quente do horizonte refletida
    warm = ((1 - smooth(0.0, 0.42, d)) ** 1.2)[..., None]
    wat = wat + (rgb(252, 190, 150) - wat) * warm * 0.42

    # caminho de luz do sol e pinceladas horizontais
    st = fbm(sub, 30 * s, 2, 621, 0.0, aniso=12) - 0.5
    wat = wat * (1 + 0.10 * st[..., None] * 2)
    path = np.exp(-(((sub.wx - 1000) / 170) ** 2)) * (1 - d) ** 1.1
    glint = smooth(0.50, 0.74, fbm(sub, 8 * s, 2, 622, 0.0, aniso=40))
    wat = wat + (rgb(255, 216, 182) - wat) * (glint * path * 0.5)[..., None]

    canvas[hz : hz + depth] = wat


def rings(canvas, V, cx, cy):
    s, ss = V.s, 2
    im = Image.new("L", (V.w * ss, V.h * ss), 0)
    dk = Image.new("L", (V.w * ss, V.h * ss), 0)
    dr, dd = ImageDraw.Draw(im), ImageDraw.Draw(dk)
    px, py = (cx - V.x0) * s * ss, (cy - V.y0) * s * ss
    for i, r in enumerate([34, 58, 88, 124, 168, 220, 282, 350]):
        rx, ry = r * s * ss, r * 0.2 * s * ss
        a = int(255 * max(0.22, 1 - i * 0.1))
        dr.ellipse([px - rx, py - ry, px + rx, py + ry], outline=a, width=max(2, int(1.7 * s * ss)))
        rx2, ry2 = rx + 5 * s * ss, ry + 1.1 * s * ss
        dd.ellipse([px - rx2, py - ry2, px + rx2, py + ry2], outline=int(a * 0.7), width=max(2, int(2.2 * s * ss)))
    lt = np.asarray(im.resize((V.w, V.h), Image.BOX), np.float32) / 255.0
    dkn = np.asarray(dk.resize((V.w, V.h), Image.BOX), np.float32) / 255.0
    lt = gblur(lt, 0.7 * s) * (0.36 + 0.2 * fbm(V, 40 * s, 2, 631))
    dkn = gblur(dkn, 1.0 * s) * 0.22
    over(canvas, rgb(255, 232, 214), lt)
    glaze(canvas, mul(0.62, 0.62, 0.72), dkn, 1.0)


def gull(canvas, V, cx, cy, size=34, tilt=-0.18):
    ss = 4
    im = Image.new("L", (V.w * ss, V.h * ss), 0)
    d = ImageDraw.Draw(im)

    def bez(p0, p1, p2, n=24):
        return [((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t**2 * p2[0],
                 (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t**2 * p2[1]) for t in np.linspace(0, 1, n)]

    def wing(sign, span, lift):
        up = bez((0, 0), (sign * span * 0.45, -lift), (sign * span, -lift * 0.25 + 0.05))
        dn = bez((0, 0.14), (sign * span * 0.45, -lift * 0.55 + 0.1), (sign * span, -lift * 0.25 + 0.05))
        return up + dn[::-1]

    c, sn = math.cos(tilt), math.sin(tilt)

    def tr(pts):
        return [((cx - V.x0) * V.s * ss + (x * c - y * sn) * size * V.s * ss,
                 (cy - V.y0) * V.s * ss + (x * sn + y * c) * size * V.s * ss) for x, y in pts]

    d.polygon(tr(wing(-1, 1.0, 0.55)), fill=255)
    d.polygon(tr(wing(1, 0.92, 0.42)), fill=255)
    bx, by = (cx - V.x0) * V.s * ss, (cy - V.y0) * V.s * ss
    d.ellipse([bx - size * 0.12 * V.s * ss, by - size * 0.03 * V.s * ss, bx + size * 0.20 * V.s * ss, by + size * 0.15 * V.s * ss], fill=255)
    m = np.asarray(im.resize((V.w, V.h), Image.BOX), np.float32) / 255.0
    over(canvas, rgb(43, 38, 32), gblur(m, 0.5 * V.s), 0.92)


def finish(canvas, V):
    g = vn(V, 1.2, 1.2, 0.2, 901) - 0.5
    g2 = fbm(V, 3 * V.s, 2, 903, 0.7) - 0.5
    fibre = fbm(V, 40 * V.s, 2, 905, 0.0, aniso=0.25) - 0.5
    out = canvas * (1 + (0.030 * g + 0.022 * g2 + 0.018 * fibre)[..., None] * 2)
    return np.clip(out, 0, 1)


VIEWS = {
    "paisagem": dict(view=(0, 130, 1600, 900, 1.0), bird=(1290, 618, 38), rings=(930, 915)),
    "retrato": dict(view=(360, -224, 800, 1422, 1.1), bird=(985, 596, 40), rings=(930, 1040)),
}


def main():
    fmt, out = sys.argv[1], sys.argv[2]
    mult = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
    cfg = VIEWS[fmt]
    x0, y0, ww, hh, sc = cfg["view"]
    V = View(x0, y0, ww, hh, sc * mult)
    canvas = scene(V)
    water(canvas, V)
    rings(canvas, V, *cfg["rings"])
    gull(canvas, V, *cfg["bird"][:2], size=cfg["bird"][2])
    img = finish(canvas, V)
    Image.fromarray((img * 255 + 0.5).astype(np.uint8)).save(out)
    print(fmt, V.w, V.h)


if __name__ == "__main__":
    main()
