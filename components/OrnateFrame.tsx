import type { ReactNode } from "react";

// Moldura ornamental estilo "Diário de bordo": linhas duplas, fitas e volutas
// nos cantos. Desenhada num viewBox fixo (1000 x 1094), então escala sem
// deformar; o conteúdo ocupa o miolo, de proporção 9:10, que é a mesma da foto
// da autora.
const W = 1000;
const H = 1094;
// Faixa ocupada pela moldura ao redor do conteúdo, em unidades do viewBox.
const BAND = 80;

const THIN = 2.6;
const THICK = 6;

// Cada canto é o mesmo desenho espelhado.
const CORNER_TRANSFORMS = [
  undefined,
  `translate(${W} 0) scale(-1 1)`,
  `translate(0 ${H}) scale(1 -1)`,
  `translate(${W} ${H}) scale(-1 -1)`,
];

function Corner() {
  return (
    <>
      <path d="M68 50C52 34 28 34 18 60C12 84 20 140 38 190C36 196 32 202 26 206C34 204 42 196 41 186C31 150 24 116 27 92C30 68 50 54 68 50Z" />
      <g fill="none" stroke="currentColor" strokeWidth={THIN} strokeLinecap="round">
        <path d="M150 50C112 50 80 52 68 78C58 112 66 180 46 236" />
        <path d="M98 51C72 56 54 86 49 130C45 170 49 205 42 236" />
        <circle cx="44" cy="246" r="9" />
        <path d="M100 53C114 54 122 62 118 70C114 77 104 74 105 67C106 63 111 62 113 66" />
        <path d="M172 40C158 40 150 46 156 60" strokeWidth={THICK} />
      </g>
      <circle cx="44" cy="246" r="2.8" />
      <circle cx="111.5" cy="67" r="2.6" />
      <path d="M158 61C172 56 190 58 204 68C188 75 166 75 158 66Z" />
    </>
  );
}

export default function OrnateFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden="true"
        className="block h-auto w-full text-areia"
        fill="currentColor"
      >
        {CORNER_TRANSFORMS.map((transform, i) => (
          <g key={i} transform={transform}>
            <Corner />
          </g>
        ))}
        <g fill="none" stroke="currentColor" strokeLinecap="round">
          <path
            d={`M170 40H${W - 170}M170 ${H - 40}H${W - 170}M40 262V${H - 262}M${W - 40} 262V${H - 262}`}
            strokeWidth={THICK}
          />
          <path
            d={`M150 50H${W - 150}M150 ${H - 50}H${W - 150}M50 262V${H - 262}M${W - 50} 262V${H - 262}`}
            strokeWidth={THIN}
          />
        </g>
      </svg>
      <div
        className="absolute"
        style={{
          inset: `${(BAND / H) * 100}% ${(BAND / W) * 100}%`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
