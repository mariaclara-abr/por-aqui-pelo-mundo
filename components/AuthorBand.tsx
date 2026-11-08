import Link from "next/link";
import Image from "next/image";
import type { Database } from "@/types/database";
import { imagePositionStyle, parseImagePosition } from "@/lib/image-position";
import CountUp from "@/components/CountUp";

type About = Database["public"]["Tables"]["about_page_content"]["Row"];

const STATS = [
  [25, "países visitados"],
  [9, "anos de experiência"],
  [8, "meses montando cada roteiro"],
] as const;

// Colagem de 3 fotos sobrepostas (principal, paisagem e retrato menor),
// no estilo de revista: borda fina clara só para separar as fotos.
const PHOTO = "relative self-start overflow-hidden border-[3px] border-areia";

export default function AuthorBand({ about }: { about: About }) {
  const name = about.author_name;

  return (
    <section className="bg-oliva bg-[url('/author-paper.svg')] bg-[length:256px_256px] bg-blend-soft-light">
      {/* largura presa à altura da tela para a seção inteira caber numa tela só */}
      <div className="mx-auto max-w-[min(72rem,calc((100svh-17rem)*1.85+5rem))] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="grid grid-cols-12 grid-rows-[auto_3rem_auto_auto] gap-x-3 lg:grid-rows-[auto_4rem_auto] lg:gap-x-6">
          <div className={`${PHOTO} col-start-1 col-end-8 row-start-1 row-end-3 aspect-[4/3] lg:col-end-5`}>
            {about.author_photo_url && (
              <Image
                src={about.author_photo_url}
                alt={name}
                fill
                sizes="(min-width: 1024px) 340px, 55vw"
                className="object-cover"
                style={imagePositionStyle(parseImagePosition(about.author_photo_position))}
              />
            )}
          </div>

          <div className="col-start-1 col-end-13 row-start-4 mt-8 lg:col-start-5 lg:row-start-1 lg:mt-0 lg:pb-5 lg:pl-4">
            <h2 className="font-serif text-3xl text-branco lg:text-4xl">{name}</h2>
            <p className="mt-2 text-xs uppercase tracking-widest text-areia/80">
              Quem está por trás da curadoria
            </p>
            <p className="mt-4 text-sm leading-relaxed text-areia/90">
              Desde 2017, planeja cada detalhe das viagens da própria família:
              passagens, hospedagem, transporte e roteiro dia a dia. Mãe de dois
              filhos, monta roteiros equilibrados para todas as idades, testados
              na prática antes de virarem recomendação aqui no site.
            </p>
            <Link
              href="/sobre"
              className="btn btn-terracota btn-cheio mt-5 w-fit font-medium hover:bg-terracota/85 hover:text-white"
            >
              Saiba mais sobre a autora
            </Link>
          </div>

          <div className={`${PHOTO} z-10 col-start-3 col-end-11 row-start-2 row-end-4 aspect-[16/10] lg:col-start-4 lg:col-end-10`}>
            <Image
              src="/autora/rejane-varanda-interlaken.jpg"
              alt={`${name} na varanda de um hotel alpino em Interlaken, na Suíça`}
              fill
              sizes="(min-width: 1024px) 520px, 65vw"
              className="object-cover object-[50%_70%]"
            />
          </div>

          <div className={`${PHOTO} z-20 col-start-9 col-end-13 row-start-3 mt-6 aspect-square lg:col-start-9 lg:col-end-12 lg:mt-6`}>
            <Image
              src="/autora/rejane-rooftop-acropole-atenas.jpg"
              alt={`${name} num rooftop com vista para a Acrópole, em Atenas`}
              fill
              sizes="(min-width: 1024px) 260px, 30vw"
              className="object-cover object-[50%_89%]"
            />
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-3 divide-x divide-areia/25 border-t border-areia/25 pt-6 text-center lg:mt-10 lg:pt-8">
          {STATS.map(([value, label]) => (
            <div key={label} className="flex flex-col-reverse gap-1.5 px-2">
              <dt className="text-[11px] uppercase leading-snug tracking-widest text-areia/80 sm:text-xs">
                {label}
              </dt>
              <dd className="font-serif text-4xl text-branco lg:text-5xl">
                <CountUp to={value} suffix="+" />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
