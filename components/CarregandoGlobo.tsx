import type { CSSProperties } from "react";

// Carregamento: véu que embaça e tira a cor da tela, com um globo no centro e o
// avião da marca dando voltas nele, deixando o rastro pontilhado do site. Sem
// JavaScript de animação: o movimento é todo CSS (globals.css, "carregando-*"),
// então começa no primeiro quadro, antes mesmo de a página hidratar.

const LARGURA = 220;
const ALTURA = 140;
const CX = LARGURA / 2;
const CY = ALTURA / 2;
const R = 40; // raio do globo
const RX = 82; // órbita do avião
const RY = RX * 0.27; // mesma proporção das órbitas da cena do roteiro Premium
const INCLINACAO = -16; // mesma inclinação (graus) das órbitas da cena do Premium
const PONTOS = 36;
const MERIDIANOS = 3;

// Do vértice esquerdo pela frente (parte de baixo), depois por trás do globo.
// Por isso a primeira metade do caminho é a frente, e a segunda, o fundo.
const ROTA = `M${CX - RX},${CY} A${RX},${RY} 0 0 0 ${CX + RX},${CY} A${RX},${RY} 0 0 0 ${CX - RX},${CY}Z`;

// Paralelos vistos de cima, na mesma perspectiva da órbita: só a metade da frente.
function paralelo(latitude: number) {
  const rad = (latitude * Math.PI) / 180;
  const rx = R * Math.cos(rad);
  const y = CY - R * Math.sin(rad);
  return `M${CX - rx},${y} A${rx},${rx * 0.27} 0 0 0 ${CX + rx},${y}`;
}

export default function CarregandoGlobo() {
  return (
    <div
      role="status"
      className="carregando-veu fixed inset-0 z-[1300] grid place-items-center bg-areia/50 backdrop-blur-sm backdrop-saturate-[.3]"
    >
      <p className="absolute left-1/2 top-1/2 mt-16 -translate-x-1/2 whitespace-nowrap font-serif text-lg italic text-tinta/80">
        Carregando...
      </p>
      <div
        aria-hidden="true"
        className="carregando-cena relative isolate"
        style={
          {
            width: LARGURA,
            height: ALTURA,
            transform: `rotate(${INCLINACAO}deg)`,
            "--rota": `path("${ROTA}")`,
          } as CSSProperties
        }
      >
        {Array.from({ length: PONTOS }, (_, i) => {
          const s = i / PONTOS; // fração da volta em que o avião passa por este ponto
          return (
            <span
              key={i}
              className={`carregando-orbita carregando-ponto h-1 w-1 rounded-full bg-terracota ${s < 0.5 ? "z-[3]" : "z-0"}`}
              style={{
                offsetDistance: `${s * 100}%`,
                animationDelay: `calc(var(--volta) * ${-((1 - s) % 1)})`,
              }}
            />
          );
        })}

        <svg
          width={LARGURA}
          height={ALTURA}
          viewBox={`0 0 ${LARGURA} ${ALTURA}`}
          fill="none"
          className="absolute inset-0 z-[2] stroke-oliva"
        >
          <circle cx={CX} cy={CY} r={R} className="fill-branco" stroke="none" />
          <g strokeWidth="1.25" strokeOpacity="0.6">
            <path d={paralelo(0)} />
            <path d={paralelo(35)} />
            <path d={paralelo(-35)} />
            {Array.from({ length: MERIDIANOS }, (_, i) => {
              // Meio giro por ciclo, em fases igualmente espaçadas (60 graus). A
              // transformação inline é o quadro parado de quem reduz o movimento.
              const fase = i / MERIDIANOS + 1 / 9;
              return (
                <circle
                  key={i}
                  cx={CX}
                  cy={CY}
                  r={R}
                  vectorEffect="non-scaling-stroke"
                  className="carregando-meridiano"
                  style={{
                    transform: `scaleX(${Math.abs(Math.cos(fase * Math.PI))})`,
                    animationDelay: `calc(var(--giro) * ${-fase})`,
                  }}
                />
              );
            })}
          </g>
          <circle cx={CX} cy={CY} r={R} strokeWidth="2" />
        </svg>

        {/* Mesmo símbolo do cabeçalho (já em cache); "auto 70deg" desfaz a
            inclinação de 20 graus desenhada no arquivo, como no PlaneLaunchIcon. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/simbolo.svg"
          alt=""
          width={32}
          height={32}
          className="carregando-orbita carregando-aviao"
          style={{ offsetRotate: "auto 70deg" }}
        />
      </div>
    </div>
  );
}
