// Fundo ilustrado da tela de geração do roteiro Premium: papel areia com manchas de
// aquarela (sol de fim de tarde, faixas de céu, colinas e ciprestes), órbitas em
// volta do globo, nuvens e pássaros à deriva. Só cores da paleta do site, em
// transparência. Tudo decorativo (aria-hidden pelo pai).

const AREIA = "#F0E6D2";
const OLIVA = "#4A5D43";
const TERRA = "#C1653A";
const TINTA = "#2B2620";

// Inclinação das órbitas (graus), parecida com a do eixo do globo.
export const ORBITA_INCLINACAO = -16;

// Elipses das órbitas em volta do globo (raios em px), da interna para a externa.
export function orbitas(R: number) {
  return [R * 1.36, R * 1.78].map((rx) => ({ rx, ry: rx * 0.27 }));
}

// Filtros SVG reutilizados: borda irregular de aquarela e grão de papel.
export function Filtros() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <filter id="cena-aquarela" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="11" result="ruido" />
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale="9" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
        <filter id="cena-colina" x="-5%" y="-30%" width="110%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="21" result="ruido" />
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="cena-nuvem" x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="ruido" />
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="cena-papel" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="2" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.17  0 0 0 0 0.15  0 0 0 0 0.13  0 0 0 0.07 0" />
        </filter>
      </defs>
    </svg>
  );
}

// Nuvem cumulus desenhada à mão (viewBox 180 x 80), com contorno de tinta e sombra no fundo.
function Nuvem({ largura, opacidade }: { largura: number; opacidade: number }) {
  return (
    <svg width={largura} height={(largura * 80) / 180} viewBox="0 0 180 80" style={{ opacity: opacidade }} aria-hidden="true">
      <g filter="url(#cena-nuvem)">
        <path d="M20 68 Q92 82 168 66 L168 72 Q92 88 18 76Z" fill={OLIVA} opacity="0.12" />
        <path
          d="M18 72 C4 72 -2 54 14 48 C12 32 32 22 46 32 C52 14 82 8 98 26 C112 14 140 22 142 42 C160 38 178 52 168 68 C166 72 160 74 154 74 Z"
          fill="#FFFFFF"
          stroke={TINTA}
          strokeOpacity="0.26"
          strokeWidth="1.3"
        />
        <path d="M50 52 C58 45 70 45 77 52 M104 46 C112 40 124 41 130 48 M30 62 C40 58 50 58 58 62" fill="none" stroke={TINTA} strokeOpacity="0.14" strokeWidth="1.1" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Passaros({ largura }: { largura: number }) {
  return (
    <svg width={largura} height={largura * 0.5} viewBox="0 0 40 20" aria-hidden="true">
      <path d="M2 12 Q8 4 14 11 Q18 5 24 10 M26 14 Q31 8 36 13" fill="none" stroke={TINTA} strokeOpacity="0.5" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

interface NuvemDef {
  topo: number; // fração da altura do céu
  largura: number;
  duracao: number; // s para atravessar a cena
  fase: number; // 0..1: onde ela está no instante 0
  opacidade: number;
}

const ATRAS: NuvemDef[] = [
  { topo: 0.06, largura: 150, duracao: 150, fase: 0.62, opacidade: 0.85 },
  { topo: 0.3, largura: 210, duracao: 190, fase: 0.18, opacidade: 0.9 },
  { topo: 0.52, largura: 120, duracao: 130, fase: 0.82, opacidade: 0.8 },
  { topo: 0.16, largura: 110, duracao: 230, fase: 0.4, opacidade: 0.7 },
];
const FRENTE: NuvemDef[] = [{ topo: 0.74, largura: 170, duracao: 110, fase: 0.3, opacidade: 0.95 }];

function Derivando({ def, ceu, w, children }: { def: NuvemDef; ceu: number; w: number; children: React.ReactNode }) {
  return (
    <div
      className="cena-deriva absolute left-0"
      style={
        {
          top: def.topo * ceu,
          "--cena-largura": `${w + 80}px`,
          animationDuration: `${def.duracao}s`,
          animationDelay: `-${def.fase * def.duracao}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

// Linha de colina: soma de senoides (determinística), do canto esquerdo ao direito,
// fechada por baixo. `base` e `amp` em px.
function colina(w: number, h: number, base: number, amp: number, freq: number, fase: number) {
  let d = `M0,${h} L0,${base}`;
  for (let x = 0; x <= w + 12; x += 12) {
    const t = (x / w) * Math.PI * 2;
    const y = base - amp * Math.sin(t * freq + fase) - amp * 0.5 * Math.sin(t * freq * 2.3 + fase * 1.7);
    d += ` L${x},${y.toFixed(1)}`;
  }
  return d + ` L${w},${h} Z`;
}

function altura(base: number, amp: number, freq: number, fase: number, w: number, x: number) {
  const t = (x / w) * Math.PI * 2;
  return base - amp * Math.sin(t * freq + fase) - amp * 0.5 * Math.sin(t * freq * 2.3 + fase * 1.7);
}

// Cipreste desenhado como silhueta.
function cipreste(x: number, y: number, alto: number) {
  const l = alto * 0.16;
  return `M${x},${y - alto} C${x + l},${y - alto * 0.62} ${x + l * 1.1},${y - alto * 0.12} ${x},${y} C${x - l * 1.1},${y - alto * 0.12} ${x - l},${y - alto * 0.62} ${x},${y - alto}Z`;
}

export default function CenaFundo({
  w,
  h,
  ceu,
  camada,
  movel,
  globo,
}: {
  w: number;
  h: number;
  ceu: number; // altura da faixa de céu (topo do card)
  camada: "tras" | "frente";
  movel: boolean;
  globo: { cx: number; cy: number; R: number };
}) {
  if (camada === "frente") {
    return (
      <>
        {FRENTE.map((d, i) => (
          <Derivando key={i} def={d} ceu={ceu} w={w}>
            <Nuvem largura={movel ? d.largura * 0.7 : d.largura} opacidade={d.opacidade} />
          </Derivando>
        ))}
      </>
    );
  }

  const solX = w * (movel ? 0.2 : 0.15);
  const solR = ceu * (movel ? 0.2 : 0.22);
  const solY = ceu * 0.6;
  const longe = { base: ceu * 0.86, amp: ceu * 0.035, freq: 1.3, fase: 0.6 };
  const perto = { base: ceu * 0.95, amp: ceu * 0.03, freq: 1.8, fase: 2.4 };
  const ciprestes = movel
    ? []
    : [0.035, 0.06, 0.085, 0.915, 0.94, 0.965].map((f, i) => {
        const x = w * f;
        const alto = ceu * (0.1 + 0.06 * ((i * 7) % 3) / 2);
        return cipreste(x, altura(perto.base, perto.amp, perto.freq, perto.fase, w, x) + 3, alto);
      });
  return (
    <>
      <svg width={w} height={h} className="absolute inset-0" aria-hidden="true">
        <rect width={w} height={h} fill={AREIA} />

        {/* Céu: lavados de oliva no alto e faixas de terracota que esquentam perto do horizonte. */}
        <g filter="url(#cena-aquarela)">
          <ellipse cx={w * 0.64} cy={ceu * 0.04} rx={w * 0.28} ry={ceu * 0.15} fill={OLIVA} opacity="0.08" />
          <rect x={-20} y={ceu * 0.58} width={w + 40} height={ceu} fill={TERRA} opacity="0.045" />
          <rect x={-20} y={ceu * 0.7} width={w + 40} height={ceu} fill={TERRA} opacity="0.055" />
          <rect x={-20} y={ceu * 0.81} width={w + 40} height={ceu} fill={TERRA} opacity="0.07" />
        </g>

        {/* Sol baixo, escondido em parte pelas colinas. */}
        <g filter="url(#cena-aquarela)">
          <circle cx={solX} cy={solY} r={solR} fill={TERRA} opacity="0.24" />
          <circle cx={solX} cy={solY} r={solR} fill="none" stroke={TERRA} strokeOpacity="0.38" strokeWidth="2.2" />
          <circle cx={solX + solR * 0.1} cy={solY - solR * 0.12} r={solR * 0.64} fill={TERRA} opacity="0.1" />
        </g>
        <circle cx={solX} cy={solY} r={solR * 1.4} fill="none" stroke={TERRA} strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2 7" strokeLinecap="round" />
        <circle cx={solX} cy={solY} r={solR * 1.78} fill="none" stroke={TERRA} strokeOpacity="0.16" strokeWidth="1" strokeDasharray="1 9" strokeLinecap="round" />

        {/* Estrelinhas de quatro pontas, na parte alta do céu. */}
        {[
          [0.34, 0.12, 5],
          [0.52, 0.22, 3.5],
          [0.43, 0.06, 3],
          [0.7, 0.14, 4],
        ].map(([fx, fy, r], i) => (
          <path
            key={i}
            d={`M${w * fx},${ceu * fy - r} Q${w * fx},${ceu * fy} ${w * fx + r},${ceu * fy} Q${w * fx},${ceu * fy} ${w * fx},${ceu * fy + r} Q${w * fx},${ceu * fy} ${w * fx - r},${ceu * fy} Q${w * fx},${ceu * fy} ${w * fx},${ceu * fy - r}Z`}
            fill={TERRA}
            opacity={movel && i > 1 ? 0 : 0.55}
          />
        ))}

        {/* Colinas em duas camadas, com ciprestes. */}
        <g filter="url(#cena-colina)">
          <path d={colina(w, h, longe.base, longe.amp, longe.freq, longe.fase)} fill={OLIVA} opacity="0.15" />
          <path d={colina(w, h, perto.base, perto.amp, perto.freq, perto.fase)} fill={OLIVA} opacity="0.26" />
          {ciprestes.map((d, i) => (
            <path key={i} d={d} fill={OLIVA} opacity="0.6" />
          ))}
        </g>

        {/* Órbitas atrás do globo (a metade da frente é desenhada por cima dele). */}
        <g transform={`translate(${globo.cx} ${globo.cy}) rotate(${ORBITA_INCLINACAO})`}>
          {orbitas(globo.R).map((o, i) => (
            <ellipse
              key={i}
              rx={o.rx}
              ry={o.ry}
              fill="none"
              stroke={TERRA}
              strokeOpacity={i === 0 ? 0.4 : 0.34}
              strokeWidth="1.1"
              strokeDasharray={i === 0 ? undefined : "2 7"}
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Grão de papel */}
        <rect width={w} height={h} filter="url(#cena-papel)" />
      </svg>
      {ATRAS.slice(0, movel ? 3 : 4).map((d, i) => (
        <Derivando key={i} def={d} ceu={ceu} w={w}>
          <Nuvem largura={movel ? d.largura * 0.7 : d.largura} opacidade={d.opacidade} />
        </Derivando>
      ))}
      <Derivando def={{ topo: 0.4, largura: 40, duracao: 95, fase: 0.5, opacidade: 1 }} ceu={ceu} w={w}>
        <Passaros largura={movel ? 26 : 40} />
      </Derivando>
      <Derivando def={{ topo: 0.46, largura: 30, duracao: 105, fase: 0.45, opacidade: 1 }} ceu={ceu} w={w}>
        <Passaros largura={movel ? 18 : 28} />
      </Derivando>
    </>
  );
}
