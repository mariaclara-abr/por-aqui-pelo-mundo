"use client";

// Cena atrás do card de progresso do roteiro Premium: fundo ilustrado, globo 3D
// girando à direita e o avião da marca voando em arco, da esquerda para a direita,
// conforme o roteiro fica pronto. Quando termina, o globo para com o primeiro
// destino virado para o avião, que encosta ali. Tudo decorativo (aria-hidden): o
// andamento de verdade continua no card.

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import CenaFundo, { Filtros, ORBITA_INCLINACAO, orbitas } from "@/components/itinerary-ai/CenaFundo";
import { Globo, ZONA_PADRAO, carregarTerra, orientacaoPara } from "@/lib/premium-roteiro/globo";
import type { DestinoCena } from "@/lib/premium-roteiro/destino";

const TERRA = "#C1653A";
const TINTA = "#2B2620";
const OLIVA = "#4A5D43";

// Silhueta do avião do símbolo da marca (/assets/simbolo.svg), apontando para cima.
const AVIAO =
  "M21,16V14L13,9V3.5C13,2.67 12.33,2 11.5,2C10.67,2 10,2.67 10,3.5V9L2,14V16L10,13.5V19L7.5,20.5V22L11.5,21L15.5,22V20.5L13,19V13.5L21,16Z";

const suave = (s: number) => s * s * (3 - 2 * s);
const entre = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// Medidas da cena, todas derivadas da largura (px). O céu ocupa o topo; o card
// começa em `ceu` e cobre a parte de baixo do globo.
export function medidas(w: number) {
  const movel = w < 640;
  const D = movel ? Math.min(250, w * 0.62) : Math.min(420, w * 0.4);
  const margem = movel ? 6 : 26;
  const cx = w - D / 2 - margem;
  const cy = D / 2 + (movel ? 12 : 20);
  const R = D / 2 - 12;
  const ceu = Math.round(cy + R * 0.62);
  return { movel, D, cx, cy, R, ceu };
}

// Curva do voo: sobe da esquerda, faz um arco e desce até encostar no globo. A
// chegada tem direção fixa (descendo para a direita), então o bico do avião toca o
// destino de frente.
function construirCaminho(S: { x: number; y: number }, M: { x: number; y: number }, bico: number, movel: boolean) {
  const chegada = ((movel ? 32 : 28) * Math.PI) / 180;
  const ux = Math.cos(chegada);
  const uy = Math.sin(chegada);
  const E = { x: M.x - ux * bico, y: M.y - uy * bico };
  const dist = Math.hypot(E.x - S.x, E.y - S.y);
  const saida = ((movel ? -62 : -56) * Math.PI) / 180;
  const C1 = { x: S.x + Math.cos(saida) * dist * 0.4, y: S.y + Math.sin(saida) * dist * 0.4 };
  const C2 = { x: E.x - ux * dist * 0.36, y: E.y - uy * dist * 0.36 };
  return `M${S.x},${S.y} C${C1.x},${C1.y} ${C2.x},${C2.y} ${E.x},${E.y}`;
}

interface Props {
  ativa: boolean;
  // 0..1: andamento da geração (sobe com as fases).
  progresso: number;
  // Roteiro pronto: o avião pousa.
  concluido: boolean;
  destino: DestinoCena | null;
  children: ReactNode;
}

export default function CenaGeracaoRoteiro({ ativa, progresso, concluido, destino, children }: Props) {
  const palco = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const caminho = useRef<SVGPathElement>(null);
  const previa = useRef<SVGPathElement>(null);
  const trilha = useRef<SVGPathElement>(null);
  const mascara = useRef<SVGPathElement>(null);
  const aviao = useRef<SVGGElement>(null);
  const rotulo = useRef<SVGGElement>(null);
  const satTras = useRef<SVGCircleElement>(null);
  const satFrente = useRef<SVGCircleElement>(null);
  const [tam, setTam] = useState({ w: 0, h: 0 });

  // O loop de animação lê estes valores sem reiniciar a cada atualização da tela.
  const vivo = useRef({ progresso, concluido });
  useEffect(() => {
    vivo.current = { progresso, concluido };
  });
  // O que já aconteceu sobrevive a um redimensionamento (que recria o globo).
  const memoria = useRef({ u: 0, travou: false, pousou: false });
  // O objeto do destino muda de identidade a cada consulta ao servidor; a chave
  // (o conteúdo) não, então a animação só reinicia se o destino mudar de verdade.
  const chaveDestino = destino ? JSON.stringify(destino) : "";
  const dest = useMemo<DestinoCena | null>(() => (chaveDestino ? JSON.parse(chaveDestino) : null), [chaveDestino]);
  const cidade = dest?.cidades[0];
  const orient = useMemo(() => (cidade ? orientacaoPara(cidade.lat, cidade.lng) : null), [cidade]);

  useLayoutEffect(() => {
    const el = palco.current;
    if (!el) return;
    const medir = () => setTam({ w: Math.round(el.clientWidth), h: Math.round(el.clientHeight) });
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { w, h } = tam;
  const m = medidas(w || 360);

  useEffect(() => {
    const cv = canvas.current;
    const cam = caminho.current;
    const pre = previa.current;
    const tri = trilha.current;
    const mas = mascara.current;
    const avi = aviao.current;
    const rot = rotulo.current;
    const st = satTras.current;
    const sf = satFrente.current;
    if (!ativa || !w || !cv || !cam || !pre || !tri || !mas || !avi || !rot || !st || !sf) return;

    const g = medidas(w);
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const globo = new Globo(cv, dest, reduzido);
    globo.definirTamanho(g.D, Math.min(2, window.devicePixelRatio || 1));

    const q = orient?.ponto ?? ZONA_PADRAO;
    const M = { x: g.cx + q[0] * g.R, y: g.cy + q[1] * g.R };

    const aviaoPx = g.movel ? 30 : 42;
    const escala = aviaoPx / 24;
    const escalaFim = 0.72;
    const bico = 10 * escala * escalaFim;
    const S = { x: g.movel ? 16 : 40, y: g.ceu * 0.8 };
    const d = construirCaminho(S, M, bico, g.movel);
    for (const el of [cam, pre, tri, mas]) el.setAttribute("d", d);
    const total = cam.getTotalLength();

    // Rótulo do destino: à esquerda do globo, ligado ao marcador por uma linha fina.
    const rotuloX = g.cx - g.R - 12;
    const mostrarRotulo = !!cidade && rotuloX > 90;
    rot.setAttribute("opacity", "0");

    let vivoLoop = true;
    carregarTerra().then((t) => {
      if (vivoLoop) globo.definirTerra(t);
    });

    const mem = memoria.current;
    if (mem.travou && orient) globo.fixar(orient.lambda, orient.phi);
    if (mem.pousou) globo.pouso = 99;

    let u = mem.u;
    let u0 = u;
    let travou = mem.travou;
    let pousou = mem.pousou;
    let tPouso = pousou ? 99 : 0;
    let ultimo = performance.now();
    let raf = 0;

    const quadro = (agora: number) => {
      const dt = Math.min(0.05, (agora - ultimo) / 1000);
      ultimo = agora;
      const { progresso: p, concluido: pronto } = vivo.current;

      if (pronto && !travou) {
        travou = true;
        u0 = u;
        if (orient) globo.travar(orient.lambda, orient.phi);
        else globo.travar(globo.lambda + 220, globo.phi);
      }
      const sGlobo = globo.quadro(dt);

      if (!travou) {
        // Antes do fim o avião avança devagar e para um pouco antes do globo.
        const alvoU = Math.min(0.86, p * 0.87);
        const passo = Math.min((alvoU - u) * (1 - Math.exp(-dt / 1.4)), 0.04 * dt);
        if (passo > 0) u += passo;
      } else {
        u = u0 + (1 - u0) * suave(sGlobo);
      }
      if (travou && sGlobo >= 1 && !pousou) {
        pousou = true;
        globo.pouso = 0;
      }
      if (pousou) tPouso += dt;
      mem.u = u;
      mem.travou = travou;
      mem.pousou = pousou;

      const L = u * total;
      const pt = cam.getPointAtLength(L);
      const a = cam.getPointAtLength(Math.max(0, L - 3));
      const b = cam.getPointAtLength(Math.min(total, L + 3));
      const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      const fim = suave(entre((u - 0.78) / 0.22, 0, 1));
      // Flutua de leve enquanto espera; ao se aproximar do globo, encolhe (perspectiva).
      const flutua = reduzido ? 0 : Math.sin(agora / 1250) * 2 * (1 - fim);
      const esc = escala * (1 - (1 - escalaFim) * fim);
      avi.setAttribute(
        "transform",
        `translate(${pt.x} ${pt.y + flutua}) rotate(${ang + 90}) scale(${esc}) translate(-11.5 -12)`,
      );
      mas.setAttribute("stroke-dashoffset", String(1 - u));
      if (mostrarRotulo) rot.setAttribute("opacity", String(suave(entre(tPouso / 0.9, 0, 1))));

      // Satélite na órbita externa (uma volta a cada 90 s), no mesmo sentido da superfície
      // do globo (na metade da frente anda para a direita); atrás do globo ele some.
      const orbita = orbitas(g.R)[1];
      const theta = reduzido ? 1.2 : 2.2 - (agora / 1000) * ((Math.PI * 2) / 90);
      const px = orbita.rx * Math.cos(theta);
      const py = orbita.ry * Math.sin(theta);
      const inc = (ORBITA_INCLINACAO * Math.PI) / 180;
      const sx = g.cx + px * Math.cos(inc) - py * Math.sin(inc);
      const sy = g.cy + px * Math.sin(inc) + py * Math.cos(inc);
      const naFrente = Math.sin(theta) > 0;
      for (const el of [st, sf]) {
        el.setAttribute("cx", String(sx));
        el.setAttribute("cy", String(sy));
      }
      st.setAttribute("opacity", naFrente ? "0" : "1");
      sf.setAttribute("opacity", naFrente ? "1" : "0");

      raf = requestAnimationFrame(quadro);
    };
    raf = requestAnimationFrame(quadro);

    return () => {
      vivoLoop = false;
      cancelAnimationFrame(raf);
    };
  }, [ativa, w, dest, orient, cidade]);

  const T = ativa ? m.ceu : 0;
  const rotuloX = m.cx - m.R - 12;
  // Onde o destino fica na esfera quando o globo para: o avião encosta aí.
  const marcador = {
    x: m.cx + (orient?.ponto ?? ZONA_PADRAO)[0] * m.R,
    y: m.cy + (orient?.ponto ?? ZONA_PADRAO)[1] * m.R,
  };

  return (
    <div ref={palco} className="relative" style={{ paddingTop: T }}>
      {ativa && w > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl bg-areia ring-1 ring-oliva/15"
        >
          <Filtros />
          <CenaFundo w={w} h={h} ceu={m.ceu} camada="tras" movel={m.movel} globo={{ cx: m.cx, cy: m.cy, R: m.R }} />
          <svg width={w} height={h} className="absolute inset-0">
            <circle ref={satTras} r="3.4" fill={TERRA} stroke="#fff" strokeWidth="1.2" opacity="0" />
          </svg>
          <canvas ref={canvas} className="absolute" style={{ left: m.cx - m.D / 2, top: m.cy - m.D / 2 }} />
          <CenaFundo w={w} h={h} ceu={m.ceu} camada="frente" movel={m.movel} globo={{ cx: m.cx, cy: m.cy, R: m.R }} />
          <svg width={w} height={h} className="absolute inset-0">
            <defs>
              <mask id="cena-trilha" maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h}>
                <path
                  ref={mascara}
                  fill="none"
                  stroke="#fff"
                  strokeWidth="14"
                  strokeLinecap="round"
                  pathLength="1"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                />
              </mask>
            </defs>
            <path ref={caminho} fill="none" stroke="none" />
            <path ref={previa} fill="none" stroke={TINTA} strokeOpacity="0.2" strokeWidth="1.6" strokeDasharray="1 9" strokeLinecap="round" />
            <path ref={trilha} fill="none" stroke={TERRA} strokeWidth="3.2" strokeDasharray="0.1 9" strokeLinecap="round" mask="url(#cena-trilha)" />
            <circle cx={m.movel ? 16 : 40} cy={m.ceu * 0.8} r="4" fill="none" stroke={TINTA} strokeOpacity="0.45" strokeWidth="1.2" />
            <g transform={`translate(${m.cx} ${m.cy}) rotate(${ORBITA_INCLINACAO})`}>
              {orbitas(m.R).map((o, i) => (
                <path
                  key={i}
                  d={`M${-o.rx},0 A${o.rx},${o.ry} 0 0 0 ${o.rx},0`}
                  fill="none"
                  stroke={TERRA}
                  strokeOpacity={i === 0 ? 0.8 : 0.6}
                  strokeWidth="1.1"
                  strokeDasharray={i === 0 ? undefined : "2 7"}
                  strokeLinecap="round"
                />
              ))}
            </g>
            <circle ref={satFrente} r="3.4" fill={TERRA} stroke="#fff" strokeWidth="1.2" opacity="0" />
            {cidade && (
              <g ref={rotulo} opacity="0">
                <path
                  d={`M${marcador.x - 8},${marcador.y + 8} L${marcador.x - 22},${marcador.y + 22} L${rotuloX + 4},${marcador.y + 22}`}
                  fill="none"
                  stroke={TINTA}
                  strokeOpacity="0.5"
                  strokeWidth="1"
                />
                <text x={rotuloX} y={marcador.y + 16} textAnchor="end" fontSize="17" fill={TINTA} stroke="#F0E6D2" strokeWidth="4" paintOrder="stroke" strokeLinejoin="round" className="font-serif" fontStyle="italic">
                  {cidade.nome}
                </text>
                <text x={rotuloX} y={marcador.y + 38} textAnchor="end" fontSize="10" letterSpacing="1.6" fill={OLIVA} stroke="#F0E6D2" strokeWidth="4" paintOrder="stroke" strokeLinejoin="round" className="font-sans" fontWeight="600">
                  {cidade.pais.toUpperCase()}
                </text>
              </g>
            )}
            {!cidade && <g ref={rotulo} opacity="0" />}
            <g ref={aviao}>
              <path d={AVIAO} fill={TERRA} stroke="#fff" strokeWidth="1.6" paintOrder="stroke" strokeLinejoin="round" />
            </g>
          </svg>
        </div>
      )}
      <div className={`relative z-10 ${ativa ? "px-3 pb-3 sm:px-6 sm:pb-6" : ""}`}>{children}</div>
    </div>
  );
}
