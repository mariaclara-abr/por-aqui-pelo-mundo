import { getCountries } from "@/lib/queries";
import CurationRating, { RATING_LABELS } from "@/components/CurationRating";

export default async function SobrePage() {
  const countries = await getCountries();

  return (
    <main className="flex-1">
      <div className="flex aspect-[4/3] w-full items-center justify-center bg-branco sm:aspect-[21/9]">
        <span className="font-serif text-lg text-oliva">
          Foto da autora em breve
        </span>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs uppercase tracking-widest text-oliva">
          Sobre a autora
        </p>
        <h1 className="mt-2 font-serif text-3xl text-tinta sm:text-4xl">
          [Nome da autora]
        </h1>

        <div className="mt-8 flex flex-col gap-5 leading-relaxed text-tinta">
          <p>
            Sou mãe, avó e viajante desde muito antes de existir aplicativo de
            viagem. Ao longo de mais de vinte anos, viajei pelo Brasil e pelo
            exterior — quase sempre em família, com criança pequena no colo,
            mala de mão cheia de remédio e paciência para roteiro que precisa
            mudar em cima da hora.
          </p>
          <p>
            Cada lugar que aparece aqui eu visitei de verdade, ou visitei
            junto com alguém da família em quem confio. Não é uma lista
            genérica: é o que eu realmente recomendaria para outra família
            que está planejando a próxima viagem.
          </p>
        </div>

        <div className="mt-10 flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-branco">
          <span className="text-sm text-oliva">Foto de viagem em breve</span>
        </div>

        <div className="mt-10 flex flex-col gap-5 leading-relaxed text-tinta">
          <h2 className="font-serif text-2xl text-tinta">
            Por que esse site existe
          </h2>
          <p>
            A maior parte do conteúdo de viagem por aí é feito para
            mochileiro sozinho ou casal sem filhos — e o que sobra costuma
            ser só uma nota média de milhares de estranhos, sem contexto
            nenhum sobre se aquele lugar faz sentido pra sua família. Esse
            site nasceu pra preencher esse espaço: transformar experiência
            real de viagem em planejamento fácil, pensado especialmente para
            famílias.
          </p>
        </div>

        <blockquote className="mt-10 border-l-4 border-terracota pl-5">
          <p className="font-serif text-xl italic text-tinta sm:text-2xl">
            &ldquo;A IA organiza a viagem. Quem escolhe os lugares é quem
            realmente esteve lá.&rdquo;
          </p>
        </blockquote>

        <div className="mt-10 flex flex-col gap-5 leading-relaxed text-tinta">
          <h2 className="font-serif text-2xl text-tinta">
            Como funciona a nota da curadoria
          </h2>
          <p>
            Cada atração recebe de 1 a 5 estrelas — mas não é uma média de
            avaliações de usuários, e sim minha opinião pessoal sobre o
            lugar, com base na experiência de quem realmente esteve lá.
          </p>
          <div className="flex flex-col gap-4 rounded-xl bg-branco p-5">
            {[5, 4, 3, 2, 1].map((value) => (
              <div key={value} className="flex items-center gap-3">
                <CurationRating rating={value} showLabel={false} size="sm" />
                <span className="text-sm text-tinta">
                  {RATING_LABELS[value]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-branco">
          <span className="text-sm text-oliva">Foto de viagem em breve</span>
        </div>

        <div className="mt-10">
          <h2 className="font-serif text-2xl text-tinta">
            Destinos já visitados
          </h2>
          <p className="mt-2 text-oliva">
            Alguns dos lugares já cobertos pela curadoria.
          </p>
          {countries.length === 0 ? (
            <p className="mt-4 text-oliva">Novos destinos em breve.</p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {countries.map((country) => (
                <span
                  key={country.id}
                  className="rounded-full border border-oliva/30 px-4 py-1.5 text-sm text-oliva"
                >
                  {country.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
