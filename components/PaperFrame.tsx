import type { ReactNode } from "react";

// Moldura "papel artesanal rasgado": folha creme com borda irregular e fibrosa
// (filtro SVG), granulado, sombra suave, alfinete, fita, florzinha seca,
// lacre de cera e bilhete manuscrito. Inspirada na referência enviada pela autora do projeto.
const BRASS = "#A8814F";
const BRASS_DARK = "#8A6838";
const SHEET = "#F9F4E9";

const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' seed='4'/><feColorMatrix values='0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.25  0 0 0 0.22 0'/></filter><rect width='240' height='240' filter='url(#g)'/></svg>",
)}")`;

function Sprig() {
  const heads: [number, number][] = [
    [30, 22], [44, 14], [58, 20], [70, 12], [82, 24], [38, 40], [54, 36],
    [68, 38], [84, 44], [26, 58], [46, 56], [62, 58], [78, 62], [92, 70],
    [36, 30], [50, 26], [64, 30], [76, 34], [34, 48], [58, 46], [72, 50], [86, 56], [40, 66], [54, 68], [70, 72],
  ];
  return (
    <svg viewBox="0 0 120 190" className="h-full w-full" aria-hidden="true">
      <g fill="none" stroke="#B9976E" strokeWidth="1.2" strokeLinecap="round">
        <path d="M96 186 C92 130 70 90 46 56" />
        <path d="M82 120 C84 96 88 80 92 70" />
        <path d="M70 92 C60 70 44 50 30 22" />
        <path d="M62 80 C64 60 66 40 70 12" />
        <path d="M54 66 C50 50 46 30 44 14" />
        <path d="M84 100 C80 70 80 50 82 24" />
      </g>
      {heads.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="6.4" fill="#F4ECDD" stroke="#D8C3A3" strokeWidth="0.8" />
          <circle cx={x - 1.6} cy={y - 1.4} r="1.4" fill="#fff" opacity="0.9" />
        </g>
      ))}
    </svg>
  );
}

export default function PaperFrame({
  children,
  className = "",
  round = false,
  flip = false,
}: {
  children: ReactNode;
  className?: string;
  round?: boolean;
  /** espelha florzinha e lacre para o lado oposto */
  flip?: boolean;
}) {
  const shape = round ? "rounded-full" : "rounded-[2px]";
  const side = flip ? "left" : "right";
  const other = flip ? "right" : "left";
  return (
    <div className={`relative ${className}`}>
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <filter id="papel-rasgado" x="-6%" y="-6%" width="112%" height="112%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.018" numOctaves="6" seed="5" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="18" />
        </filter>
        <filter id="papel-rasgado-fibra" x="-6%" y="-6%" width="112%" height="112%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="5" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="12" />
        </filter>
      </svg>

      {/* bilhete manuscrito atrás da folha */}
      {!round && (
        <svg
          aria-hidden="true"
          viewBox="0 0 90 120"
          className="absolute -bottom-5 h-24 w-20 sm:h-32 sm:w-24"
          style={{ [other]: -18, transform: `rotate(${flip ? 8 : -6}deg)` }}
        >
          <rect width="90" height="120" fill="#E6D6B8" />
          <g fill="none" stroke="#8A7556" strokeWidth="1.1" strokeLinecap="round" opacity="0.75">
            {[16, 28, 40, 52, 64, 76, 88, 100].map((y, i) => (
              <path key={y} d={`M8 ${y} q6 -7 10 0 t10 0 t10 -2 t9 2 t${14 - (i % 3) * 4} 0`} />
            ))}
          </g>
        </svg>
      )}

      {/* folha: franja clara fibrosa + papel creme granulado, com sombra suave */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ filter: "drop-shadow(0 2px 5px rgba(43,38,32,0.22))" }}
      >
        <div
          className={`absolute -inset-[7px] bg-branco ${shape}`}
          style={{ filter: "url(#papel-rasgado-fibra)" }}
        />
        <div
          className={`absolute -inset-px ${shape}`}
          style={{
            backgroundColor: SHEET,
            backgroundImage: GRAIN,
            filter: "url(#papel-rasgado)",
          }}
        />
      </div>

      <div className="relative p-5 sm:p-8">{children}</div>

      {/* alfinete de latão */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 -top-1 z-20 h-5 w-5 -translate-x-1/2 rounded-full sm:h-6 sm:w-6"
        style={{
          backgroundColor: BRASS,
          boxShadow: "0 2px 3px rgba(43,38,32,0.35), inset 0 0 0 2px " + BRASS_DARK,
        }}
      >
        <span className="absolute left-[28%] top-[24%] h-[22%] w-[22%] rounded-full bg-branco/60" />
      </span>

      {!round && (
        <>
          {/* florzinha seca presa com fita */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute -top-14 z-10 h-40 w-28 sm:-top-24 sm:h-72 sm:w-48 ${flip ? "-scale-x-100" : ""}`}
            style={{ [side]: 12 }}
          >
            <Sprig />
          </div>
          <span
            aria-hidden="true"
            className="absolute top-24 z-20 h-6 w-[72px] sm:top-36 border border-branco/60 bg-branco/55 sm:h-7 sm:w-20"
            style={{ [side]: 10, transform: `rotate(${flip ? 28 : -28}deg)` }}
          />
          {/* lacre de cera */}
          <svg
            aria-hidden="true"
            viewBox="0 0 60 60"
            className="absolute -bottom-4 z-20 h-12 w-12 sm:h-16 sm:w-16"
            style={{ [other]: 4 }}
          >
            <circle cx="30" cy="30" r="28" fill={BRASS} style={{ filter: "drop-shadow(0 2px 2px rgba(43,38,32,0.35))" }} />
            <circle cx="30" cy="30" r="22" fill="none" stroke={BRASS_DARK} strokeWidth="1.6" />
            <g fill="none" stroke={BRASS_DARK} strokeWidth="1.6" strokeLinecap="round">
              <path d="M30 46 V22" />
              <path d="M30 40 q-9 -2 -11 -9 M30 40 q9 -2 11 -9 M30 32 q-7 -2 -8 -8 M30 32 q7 -2 8 -8 M30 24 q-3 -4 0 -8 q3 4 0 8" />
            </g>
          </svg>
        </>
      )}
    </div>
  );
}
