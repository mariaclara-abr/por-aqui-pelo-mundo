import Image from "next/image";
import Link from "next/link";
import type { Database } from "@/types/database";
import { imagePositionStyle, parseImagePosition } from "@/lib/image-position";
import CountUp from "@/components/CountUp";

type About = Database["public"]["Tables"]["about_page_content"]["Row"];

const STATS = [
  [25, "países visitados"],
  [9, "anos de experiência"],
  [8, "meses montando cada roteiro"],
] as const;

// Cores tiradas da referência enviada pela autora do projeto (fora da paleta a pedido dela):
// fundo creme, faixa dos números um tom abaixo, divisórias e texto quase preto.
// As fotos não têm contorno: são separadas por faixas grossas da cor do fundo.
const PHOTO = "absolute overflow-hidden border-[#F3F1E6]";
// no desktop as fotos saem do posicionamento absoluto e viram células da grade
const DESK = "lg:relative lg:inset-auto lg:h-auto lg:w-auto";

// Celular: texto em cima e colagem numa caixa com fotos posicionadas em %.
// Desktop: grade (colunas nas proporções da referência) com altura presa à tela,
// para a seção caber numa tela só; o texto ocupa uma linha própria e nunca é cortado.
export default function AuthorBand({ about }: { about: About }) {
  const name = about.author_name;

  return (
    <section className="bg-[#F3F1E6] text-[#1D1D16]">
      {/* largura presa à altura da tela para a seção inteira caber numa tela só */}
      <div className="mx-auto w-full px-4 pb-4 pt-5 sm:px-6 lg:max-w-[76rem] lg:px-10 lg:pb-8 lg:pt-8">
        <div className="relative lg:grid lg:h-[clamp(24rem,calc(100svh-16.5rem),46rem)] lg:grid-cols-[26.3%_10.2%_4.1%_31.4%_10%_1fr] lg:grid-rows-[minmax(max-content,38%)_3.5rem_1fr_6%]">
          <div className="lg:col-start-4 lg:col-end-7 lg:row-start-1 lg:max-w-[34rem] lg:pb-6 lg:pt-1">
            <h2 className="font-lora text-[2rem] italic leading-tight text-[#282A23] lg:text-[2.1rem]">
              {name}
            </h2>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.08em] text-[#2E2D28] lg:text-[0.8rem]">
              Quem está por trás da curadoria
            </p>
            <p className="mt-2.5 !text-left text-sm leading-snug">
              Desde 2017, planeja cada detalhe das viagens da própria família:
              passagens, hospedagem, transporte e roteiro dia a dia. Mãe de dois
              filhos, monta roteiros equilibrados para todas as idades, testados
              na prática antes de virarem recomendação aqui no site.
            </p>
          </div>

          <div className="relative mt-4 aspect-[1/0.83] lg:contents">
            <div className={`${PHOTO} left-0 top-0 h-[60%] w-[54%] ${DESK} lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-3`}>
              {about.author_photo_url && (
                <Image
                  src={about.author_photo_url}
                  alt={name}
                  fill
                  sizes="(min-width: 1024px) 460px, 55vw"
                  className="object-cover object-[50%_60%]"
                  style={imagePositionStyle(parseImagePosition(about.author_photo_position))}
                />
              )}
            </div>

            <div className={`${PHOTO} z-10 left-[18%] top-[44%] h-[56%] w-[66%] border-[8px] ${DESK} lg:col-start-2 lg:col-end-6 lg:row-start-2 lg:row-end-5 lg:border-[18px]`}>
              <Image
                src="/autora/rejane-varanda-interlaken.jpg"
                alt={`${name} na varanda de um hotel alpino em Interlaken, na Suíça`}
                fill
                sizes="(min-width: 1024px) 700px, 70vw"
                className="object-cover object-[50%_60%]"
              />
            </div>

            <div className={`${PHOTO} z-20 right-0 top-[8%] h-[46%] w-[42%] border-[8px] ${DESK} lg:col-start-5 lg:col-end-7 lg:row-start-2 lg:row-end-4 lg:-mt-10 lg:border-[18px]`}>
              <Image
                src="/autora/rejane-por-do-sol-santorini.jpg"
                alt={`${name} ao pôr do sol em Santorini, na Grécia`}
                fill
                sizes="(min-width: 1024px) 360px, 42vw"
                className="object-cover object-[50%_20%]"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-center lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:mt-6 lg:justify-start lg:self-start">
            <Link href="/sobre" className="btn btn-sm btn-terracota btn-cheio">
              Saiba mais sobre a autora
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-[#E6E4D6]">
        <dl className="mx-auto grid max-w-[64rem] grid-cols-3 px-4 py-5 text-center sm:px-6 lg:py-7">
          {STATS.map(([value, label], i) => (
            <div
              key={label}
              className={`flex flex-col-reverse items-center gap-2 px-2 ${i > 0 ? "border-l border-[#D2CFC2]" : ""}`}
            >
              <dt className="text-[10px] font-medium uppercase leading-snug tracking-[0.04em] text-[#15140A] sm:text-xs">
                {label}
              </dt>
              <dd className="font-serif text-[2.1rem] font-light leading-none tracking-[-0.02em] lg:text-[3rem]">
                <CountUp to={value} suffix="+" />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
