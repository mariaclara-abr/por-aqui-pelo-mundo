// Globo 3D da tela de geração do roteiro Premium (canvas 2D, projeção ortográfica).
// Inspirado no "wireframe dotted globe": terra em pontos de meia-tinta, aqui na
// paleta do site (mar em verde oliva profundo, terra em areia, países da viagem em
// terracota) e com profundidade de verdade: só o hemisfério virado para nós é
// desenhado, com pontos menores e mais fracos perto da borda, luz e sombra em
// degraus (sem gradiente) e o eixo inclinado.
//
// Atenção: a projeção do d3 NÃO descarta os pontos do outro lado da esfera quando
// chamada ponto a ponto (devolve a posição espelhada). Por isso a rotação e a
// profundidade são calculadas aqui, e só se desenha o que está na frente.

import { geoContains, geoDistance, geoEquirectangular, geoGraticule, geoOrthographic, geoPath, geoRotation } from "d3-geo";
import type { Feature, FeatureCollection } from "geojson";
import type { DestinoCena } from "@/lib/premium-roteiro/destino";

const MAR = "#4A5D43"; // oliva
const AREIA = "#F0E6D2";
const TERRA = "#C1653A";
const TINTA = "#2B2620";

const RAD = Math.PI / 180;

// Inclinação do eixo (como num globo de mesa) e latitude do centro enquanto gira.
const GAMA = -12;
const PHI_LIVRE = -16;
// Velocidade do giro livre, em graus por segundo (uma volta a cada ~33 s). Sempre
// no mesmo sentido: a superfície anda para a direita, como a Terra vista do espaço.
export const GIRO_GRAUS_POR_S = 11;
// Distância entre pontos de terra e de mar, em graus: define o "grão" da meia-tinta.
const PASSO_TERRA = 2.3;
const PASSO_MAR = 3.6;

// ---------- dados ----------

let terraPromise: Promise<FeatureCollection | null> | null = null;

// O mapa vem do próprio site (public/geo), baixado uma única vez por visita.
export function carregarTerra(): Promise<FeatureCollection | null> {
  terraPromise ??= fetch("/geo/paises-110m.json")
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => (j?.type === "FeatureCollection" && Array.isArray(j.features) ? (j as FeatureCollection) : null))
    .catch(() => null);
  return terraPromise;
}

// ---------- geometria da esfera ----------

type Vetor = [number, number, number];

// Ponto da esfera como vetor unitário (x aponta para o ponto lng 0 lat 0, y para lng 90, z para o polo norte).
export function vetor(lng: number, lat: number): Vetor {
  const f = lat * RAD;
  const l = lng * RAD;
  return [Math.cos(f) * Math.cos(l), Math.cos(f) * Math.sin(l), Math.sin(f)];
}

// Matriz 3x3 da rotação [λ, φ, γ] do d3, em linhas: profundidade (positiva = virado
// para nós), direita e cima. Aplicada a um vetor da esfera, dá a posição já girada.
export function matrizRotacao(lambda: number, phi: number): Float64Array {
  const girar = geoRotation([lambda, phi, GAMA]);
  const coluna = (lng: number, lat: number) => {
    const [l, f] = girar([lng, lat]);
    return vetor(l, f);
  };
  const ex = coluna(0, 0);
  const ey = coluna(90, 0);
  const ez = coluna(0, 90);
  return Float64Array.of(ex[0], ey[0], ez[0], ex[1], ey[1], ez[1], ex[2], ey[2], ez[2]);
}

export type Alvo = [number, number]; // coordenadas normalizadas na esfera (x à direita, y para baixo)

// Faixa do disco (raio 1) onde o destino pode parar: quadrante superior esquerdo,
// longe da borda e acima da parte que o card esconde, de frente para o avião.
const ZONA = { x: [-0.66, -0.4], y: [-0.42, -0.12] } as const;
const CENTRO_ZONA: Alvo = [(ZONA.x[0] + ZONA.x[1]) / 2, (ZONA.y[0] + ZONA.y[1]) / 2];
// Onde o marcador fica quando não há cidade para virar de frente.
export const ZONA_PADRAO = CENTRO_ZONA;

const foraDe = (v: number, [min, max]: readonly [number, number] | readonly number[]) => (v < min ? min - v : v > max ? v - max : 0);

// Rotação [λ, φ] que leva (lat, lng) para dentro da ZONA do disco, COM O PONTO VIRADO
// PARA NÓS e o eixo inclinado. Entre as várias soluções, prefere a vista mais natural:
// a de latitude do centro mais próxima de (latitude do destino - 19°), limitada entre
// 25°S e 45°N, em vez de olhar o globo de cima do polo.
export function orientacaoPara(lat: number, lng: number) {
  const [px, py, pz] = vetor(lng, lat);
  const phiPreferido = Math.max(-45, Math.min(25, -(lat - 19)));
  const posicao = (l: number, f: number) => {
    const m = matrizRotacao(l, f);
    return {
      profundidade: m[0] * px + m[1] * py + m[2] * pz,
      x: m[3] * px + m[4] * py + m[5] * pz,
      y: -(m[6] * px + m[7] * py + m[8] * pz),
    };
  };
  const custo = (l: number, f: number) => {
    const p = posicao(l, f);
    // Do outro lado da esfera o ponto apareceria espelhado: não serve.
    if (p.profundidade < 0.2) return Infinity;
    const fora = foraDe(p.x, ZONA.x) ** 2 + foraDe(p.y, ZONA.y) ** 2;
    const centro = (p.x - CENTRO_ZONA[0]) ** 2 + (p.y - CENTRO_ZONA[1]) ** 2;
    return 400 * fora + 0.0006 * (f - phiPreferido) ** 2 + 0.4 * centro;
  };
  let melhor = { l: 0, f: PHI_LIVRE, c: Infinity };
  for (let l = -180; l < 180; l += 5) {
    for (let f = -85; f <= 85; f += 5) {
      const c = custo(l, f);
      if (c < melhor.c) melhor = { l, f, c };
    }
  }
  for (const passo of [1, 0.2, 0.04]) {
    const base = melhor;
    for (let dl = -5 * passo; dl <= 5 * passo; dl += passo) {
      for (let df = -5 * passo; df <= 5 * passo; df += passo) {
        const c = custo(base.l + dl, base.f + df);
        if (c < melhor.c) melhor = { l: base.l + dl, f: base.f + df, c };
      }
    }
  }
  const p = posicao(melhor.l, melhor.f);
  return { lambda: melhor.l, phi: melhor.f, ponto: [p.x, p.y] as Alvo, profundidade: p.profundidade };
}

// ---------- pontos de terra e de mar ----------

interface Pontos {
  // Vetores unitários (x, y, z em sequência); `visitado` marca terra de país da viagem.
  terra: Float32Array;
  visitado: Uint8Array;
  nTerra: number;
  mar: Float32Array;
  nMar: number;
}

// Pontos em linhas de latitude (mais pontos perto do equador, menos perto dos polos,
// para a densidade ficar uniforme na esfera). A "terra" vem de uma máscara
// equirretangular desenhada com os polígonos dos países.
function construirPontos(terra: FeatureCollection, destino: DestinoCena | null): Pontos {
  const vazio: Pontos = { terra: new Float32Array(0), visitado: new Uint8Array(0), nTerra: 0, mar: new Float32Array(0), nMar: 0 };
  const L = 1440;
  const A = 720;
  const mascara = document.createElement("canvas");
  mascara.width = L;
  mascara.height = A;
  const ctx = mascara.getContext("2d", { willReadFrequently: true });
  if (!ctx) return vazio;
  const proj = geoEquirectangular().scale(L / (2 * Math.PI)).translate([L / 2, A / 2]);
  ctx.beginPath();
  geoPath(proj, ctx)(terra);
  ctx.fill();
  const dados = ctx.getImageData(0, 0, L, A).data;
  const ehTerra = (lng: number, lat: number) => {
    const x = Math.min(L - 1, Math.floor(((lng + 180) / 360) * L));
    const y = Math.min(A - 1, Math.floor(((90 - lat) / 180) * A));
    return dados[(y * L + x) * 4 + 3] > 127;
  };

  const paises = new Set(destino?.paises ?? []);
  const visitados = terra.features.filter((f) => paises.has(String(f.id)));
  const cidades = destino?.cidades ?? [];
  const raio = 2.7 * RAD; // cobre países pequenos (Mônaco) que o mapa 110m não tem

  const grade = (passo: number, aceita: (lng: number, lat: number) => boolean, marcar?: (lng: number, lat: number) => number) => {
    const vetores: number[] = [];
    const marcas: number[] = [];
    let linha = 0;
    for (let lat = -62; lat <= 76; lat += passo, linha++) {
      const n = Math.max(1, Math.round((360 * Math.cos(lat * RAD)) / passo));
      for (let i = 0; i < n; i++) {
        const lng = -180 + ((i + (linha % 2) * 0.5) * 360) / n;
        if (!aceita(lng, lat)) continue;
        vetores.push(...vetor(lng, lat));
        if (marcar) marcas.push(marcar(lng, lat));
      }
    }
    return { vetores: Float32Array.from(vetores), marcas: Uint8Array.from(marcas) };
  };

  const t = grade(PASSO_TERRA, ehTerra, (lng, lat) => {
    const ponto: [number, number] = [lng, lat];
    const dentro =
      visitados.some((f: Feature) => geoContains(f, ponto)) || cidades.some((c) => geoDistance(ponto, [c.lng, c.lat]) < raio);
    return dentro ? 1 : 0;
  });
  const m = grade(PASSO_MAR, (lng, lat) => !ehTerra(lng, lat));
  return { terra: t.vetores, visitado: t.marcas, nTerra: t.marcas.length, mar: m.vetores, nMar: m.vetores.length / 3 };
}

// ---------- o globo ----------

const suave = (s: number) => s * s * (3 - 2 * s);

export class Globo {
  private ctx: CanvasRenderingContext2D;
  private proj = geoOrthographic().clipAngle(90).precision(0.6);
  private graticula = geoGraticule().step([20, 20])();
  private pontos: Pontos | null = null;
  private visitadosFC: FeatureCollection | null = null;
  private cidade: Vetor | null;
  private tamanho = 0;
  lambda = 0;
  phi = PHI_LIVRE;
  // Giro livre até travar: a rotação acompanha uma curva de Hermite que parte da
  // velocidade do giro e termina parada exatamente no ponto combinado.
  private trava: { t: number; dur: number; l0: number; f0: number; dl: number; df: number } | null = null;
  // 0..1: a parada terminou (o marcador do destino aparece junto).
  travado = 0;
  // Tempo desde que o avião encostou (s); -1 enquanto não encostou.
  pouso = -1;

  constructor(
    private canvas: HTMLCanvasElement,
    private destino: DestinoCena | null,
    private estatico: boolean,
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D indisponível.");
    this.ctx = ctx;
    const primeira = destino?.cidades[0];
    this.cidade = primeira ? vetor(primeira.lng, primeira.lat) : null;
  }

  // `lado` em px CSS; o canvas é quadrado e a esfera ocupa o centro, com folga para o brilho.
  definirTamanho(lado: number, dpr: number) {
    this.tamanho = lado;
    this.canvas.width = Math.round(lado * dpr);
    this.canvas.height = Math.round(lado * dpr);
    this.canvas.style.width = `${lado}px`;
    this.canvas.style.height = `${lado}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  get raio() {
    return this.tamanho / 2 - 12;
  }

  definirTerra(terra: FeatureCollection | null) {
    this.pontos = terra ? construirPontos(terra, this.destino) : null;
    const paises = new Set(this.destino?.paises ?? []);
    this.visitadosFC = terra
      ? { type: "FeatureCollection", features: terra.features.filter((f) => paises.has(String(f.id))) }
      : null;
  }

  // Retoma já parado (depois de redimensionar a janela).
  fixar(lambda: number, phi: number) {
    this.lambda = lambda;
    this.phi = phi;
    this.trava = { t: 1, dur: 1, l0: lambda, f0: phi, dl: 0, df: 0 };
    this.travado = 1;
  }

  // Começa a parada em (λ, φ). Continua girando no mesmo sentido antes de frear.
  travar(lambda: number, phi: number, duracao = 4.6) {
    if (this.trava || this.travado >= 1) return;
    let dl = (((lambda - this.lambda) % 360) + 360) % 360;
    if (dl < 160) dl += 360;
    this.trava = { t: 0, dur: duracao, l0: this.lambda, f0: this.phi, dl, df: phi - this.phi };
    if (this.estatico) this.concluirTrava();
  }

  private concluirTrava() {
    if (!this.trava) return;
    this.lambda = this.trava.l0 + this.trava.dl;
    this.phi = this.trava.f0 + this.trava.df;
    this.trava.t = this.trava.dur;
    this.travado = 1;
  }

  // Avança o tempo (s) e desenha. Devolve o quanto da parada já aconteceu (0 a 1).
  quadro(dt: number): number {
    if (this.trava && this.travado < 1) {
      this.trava.t = Math.min(this.trava.dur, this.trava.t + dt);
      const s = this.trava.t / this.trava.dur;
      const s2 = s * s;
      const s3 = s2 * s;
      const h00 = 2 * s3 - 3 * s2 + 1;
      const h10 = s3 - 2 * s2 + s;
      const h01 = -2 * s3 + 3 * s2;
      const v0 = this.estatico ? 0 : GIRO_GRAUS_POR_S;
      this.lambda = h00 * this.trava.l0 + h10 * this.trava.dur * v0 + h01 * (this.trava.l0 + this.trava.dl);
      this.phi = this.trava.f0 + this.trava.df * suave(s);
      if (s >= 1) this.travado = 1;
    } else if (!this.trava && !this.estatico) {
      this.lambda += GIRO_GRAUS_POR_S * dt;
    }
    if (this.pouso >= 0) this.pouso += dt;
    this.desenhar();
    return this.trava ? this.trava.t / this.trava.dur : 0;
  }

  private desenhar() {
    const { ctx, tamanho: C } = this;
    if (!C) return;
    const cx = C / 2;
    const cy = C / 2;
    const R = this.raio;
    const k = R / 190;
    const m = matrizRotacao(this.lambda, this.phi);
    this.proj.scale(R).translate([cx, cy]).rotate([this.lambda, this.phi, GAMA]);
    const caminho = geoPath(this.proj, ctx);

    ctx.clearRect(0, 0, C, C);

    // Brilho quente em volta da esfera: discos translúcidos de terracota, em degraus.
    for (const [dr, alfa] of [[19, 0.05], [12, 0.06], [6, 0.08]] as const) {
      ctx.beginPath();
      ctx.arc(cx, cy, R + dr * k, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(193,101,58,${alfa})`;
      ctx.fill();
    }

    // Mar.
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = MAR;
    ctx.fill();

    const p = this.pontos;
    if (p) {
      // Textura do mar: pontinhos de areia bem fracos, só do hemisfério da frente.
      ctx.beginPath();
      for (let i = 0; i < p.nMar; i++) {
        const vx = p.mar[i * 3];
        const vy = p.mar[i * 3 + 1];
        const vz = p.mar[i * 3 + 2];
        const prof = m[0] * vx + m[1] * vy + m[2] * vz;
        if (prof <= 0.05) continue;
        const x = cx + R * (m[3] * vx + m[4] * vy + m[5] * vz);
        const y = cy - R * (m[6] * vx + m[7] * vy + m[8] * vz);
        ctx.moveTo(x + 0.8 * k, y);
        ctx.arc(x, y, 0.8 * k, 0, Math.PI * 2);
      }
      ctx.fillStyle = "rgba(240,230,210,0.16)";
      ctx.fill();
    }

    // Meridianos e paralelos.
    ctx.beginPath();
    caminho(this.graticula);
    ctx.strokeStyle = "rgba(240,230,210,0.13)";
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Países da viagem: mancha de terracota por baixo dos pontos.
    if (this.visitadosFC) {
      ctx.beginPath();
      caminho(this.visitadosFC);
      ctx.fillStyle = "rgba(193,101,58,0.5)";
      ctx.fill();
      ctx.strokeStyle = "rgba(240,230,210,0.7)";
      ctx.lineWidth = 0.9;
      ctx.stroke();
    }

    // Terra em pontos: 4 faixas de profundidade (um fill por faixa e por cor).
    if (p) {
      const FAIXAS = 4;
      const grupos: number[][][] = [0, 1].map(() => Array.from({ length: FAIXAS }, () => [] as number[]));
      for (let i = 0; i < p.nTerra; i++) {
        const vx = p.terra[i * 3];
        const vy = p.terra[i * 3 + 1];
        const vz = p.terra[i * 3 + 2];
        const prof = m[0] * vx + m[1] * vy + m[2] * vz;
        if (prof <= 0) continue; // do outro lado da esfera: não desenha
        const x = cx + R * (m[3] * vx + m[4] * vy + m[5] * vz);
        const y = cy - R * (m[6] * vx + m[7] * vy + m[8] * vz);
        grupos[p.visitado[i]][Math.min(FAIXAS - 1, Math.floor(prof * FAIXAS))].push(x, y);
      }
      for (let g = 0; g < 2; g++) {
        for (let f = 0; f < FAIXAS; f++) {
          const prof = (f + 0.5) / FAIXAS; // 0 na borda, 1 no centro
          const raioPonto = k * (0.55 + 1.55 * prof) + (g ? 0.5 * k : 0);
          const alfa = 0.3 + 0.7 * prof;
          const lista = grupos[g][f];
          if (g) {
            // País da viagem: halo de areia por baixo, para o terracota se destacar do mar.
            ctx.beginPath();
            for (let j = 0; j < lista.length; j += 2) {
              ctx.moveTo(lista[j] + raioPonto + 1.3 * k, lista[j + 1]);
              ctx.arc(lista[j], lista[j + 1], raioPonto + 1.3 * k, 0, Math.PI * 2);
            }
            ctx.globalAlpha = alfa * 0.4;
            ctx.fillStyle = AREIA;
            ctx.fill();
          }
          ctx.beginPath();
          for (let j = 0; j < lista.length; j += 2) {
            ctx.moveTo(lista[j] + raioPonto, lista[j + 1]);
            ctx.arc(lista[j], lista[j + 1], raioPonto, 0, Math.PI * 2);
          }
          ctx.globalAlpha = alfa;
          ctx.fillStyle = g ? TERRA : AREIA;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    // Luz e sombra em degraus: a luz vem de cima e da esquerda.
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();
    for (const [desloc, raioLuz, alfa] of [[0.3, 1.0, 0.1], [0.2, 1.03, 0.1], [0.11, 1.05, 0.12]] as const) {
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.arc(cx - R * desloc, cy - R * desloc * 0.9, R * raioLuz, 0, Math.PI * 2, true);
      ctx.fillStyle = `rgba(43,38,32,${alfa})`;
      ctx.fill("evenodd");
    }
    // Fio de luz na borda de cima e da esquerda (dois degraus), em vez de um holofote.
    for (const [desloc, alfa] of [[0.04, 0.16], [0.085, 0.09]] as const) {
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.arc(cx + R * desloc, cy + R * desloc * 0.9, R, 0, Math.PI * 2, true);
      ctx.fillStyle = `rgba(240,230,210,${alfa})`;
      ctx.fill("evenodd");
    }
    ctx.restore();

    // Contorno da esfera.
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(240,230,210,0.6)";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    this.desenharMarcador(cx, cy, R, m);
  }

  // Marcador na primeira cidade: aparece quando a parada termina; ao pouso do avião
  // sai uma única onda (sem pulsar em ciclo).
  private desenharMarcador(cx: number, cy: number, R: number, m: Float64Array) {
    if (!this.cidade || this.travado <= 0) return;
    const [vx, vy, vz] = this.cidade;
    if (m[0] * vx + m[1] * vy + m[2] * vz <= 0.05) return; // do outro lado da esfera
    const x = cx + R * (m[3] * vx + m[4] * vy + m[5] * vz);
    const y = cy - R * (m[6] * vx + m[7] * vy + m[8] * vz);
    const { ctx } = this;
    const k = R / 190;
    const aparece = suave(Math.min(1, this.travado));
    if (this.pouso >= 0) {
      const t = Math.min(1, this.pouso / 1.6);
      const saida = 1 - Math.pow(1 - t, 3);
      ctx.beginPath();
      ctx.arc(x, y, (6 + 32 * saida) * k, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(240,230,210,${0.7 * (1 - t)})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }
    ctx.globalAlpha = aparece;
    ctx.beginPath();
    ctx.arc(x, y, 7.8 * k, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, 4.8 * k, 0, Math.PI * 2);
    ctx.fillStyle = TERRA;
    ctx.fill();
    ctx.strokeStyle = TINTA;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}
