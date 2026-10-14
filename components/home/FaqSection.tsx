import Link from "next/link";

const faqs = [
  {
    question: "Quem faz a curadoria do Por Aqui Pelo Mundo?",
    answer:
      "A Rejane Abrantes. Desde 2017 ela planeja cada detalhe das viagens da própria família, de passagens e hospedagem ao roteiro dia a dia. Tudo o que aparece aqui foi visitado, testado e avaliado por ela antes de virar recomendação.",
  },
  {
    question: "Qual a diferença para sites de avaliação ou roteiros prontos?",
    answer:
      "Aqui não existe média de notas de desconhecidos nem lista genérica. Cada atração tem a nota da própria Rejane, com dicas de quem esteve lá com crianças e a dois. Você recebe um olhar experiente, não uma multidão de opiniões.",
  },
  {
    question: "Como funciona o roteiro personalizado?",
    answer:
      "Você conta seu ritmo, seus interesses e quem viaja com você. A IA aplica o método de planejamento da Rejane sobre os lugares que ela avaliou e monta um roteiro completo, dia a dia, com ordem, horários e tempo ideal em cada atração.",
  },
  {
    question: "A IA inventa lugares?",
    answer:
      "Não. A IA organiza a curadoria da Rejane, nunca cria atrações do zero. É como ter a experiência dela aplicada à sua viagem, em minutos.",
  },
  {
    question: "Serve para quem viaja com crianças?",
    answer:
      "Sim, e é justamente aí que o planejamento faz mais diferença. A Rejane é mãe de dois filhos e monta roteiros equilibrados para todas as idades, com pausas e escolhas que funcionam para a família inteira.",
  },
  {
    question: "Posso alterar o roteiro depois de pronto?",
    answer:
      "Pode. Você faz as alterações que quiser no roteiro montado pela IA e ainda consegue acessá-lo sem internet durante a viagem.",
  },
  {
    question: "O que vem no acesso premium?",
    answer:
      "Roteiro sob medida montado pela IA com a curadoria da Rejane, todas as dicas desbloqueadas, acesso offline e suporte prioritário. Há opção de 7 dias para uma viagem ou de um mês completo.",
  },
];

export default function FaqSection() {
  return (
    <section
      aria-labelledby="faq-title"
      className="relative border-t border-oliva/15 bg-branco px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[url('/author-paper.svg')] bg-[length:256px_256px] opacity-20"
      />
      <div className="relative mx-auto grid max-w-[1440px] gap-9 sm:gap-12 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)] lg:grid-rows-[min-content_1fr] lg:gap-x-12 lg:gap-y-8 xl:gap-x-16">
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="flex items-center gap-3 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-oliva">
            <span aria-hidden="true" className="h-px w-8 shrink-0 bg-terracota" />
            Antes de fazer as malas
          </p>
          <h2
            id="faq-title"
            className="mt-4 font-serif text-4xl leading-tight tracking-tight text-tinta sm:text-5xl"
          >
            Perguntas
            <br />
            <span className="text-oliva">frequentes</span>
          </h2>
          <p className="mt-5 max-w-sm text-left text-sm leading-7 text-oliva sm:text-base">
            Da curadoria ao seu roteiro, tire suas dúvidas e comece a planejar
            a próxima viagem com mais confiança.
          </p>
        </div>

        <div className="min-w-0 self-start rounded-xl border border-oliva/15 bg-areia/45 px-4 sm:px-7 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="group border-b border-oliva/15 last:border-b-0"
            >
              <summary className="flex min-h-20 cursor-pointer list-none items-start gap-3 rounded-lg py-5 text-tinta hover:text-oliva focus-visible:outline-oliva motion-safe:transition-colors sm:gap-5 sm:py-6 [&::-webkit-details-marker]:hidden">
                <span
                  aria-hidden="true"
                  className="mt-1.5 shrink-0 font-sans text-[11px] font-medium tabular-nums text-oliva"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-serif text-lg leading-snug sm:text-xl">
                  {faq.question}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-oliva/20 text-oliva group-open:border-oliva group-open:bg-oliva group-open:text-branco group-hover:border-oliva/50 motion-safe:transition-colors"
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-3.5">
                    <path d="M3 8h10" />
                    <path d="M8 3v10" className="origin-center group-open:scale-y-0 motion-safe:transition-transform motion-safe:duration-200" />
                  </svg>
                </span>
              </summary>
              <div className="pb-6 pl-7 sm:pl-9 sm:pr-12">
                <p className="border-l-2 border-terracota/60 pl-4 text-left text-sm leading-7 text-tinta/80 sm:pl-5 sm:text-base">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>

        <div className="self-start lg:col-start-1 lg:row-start-2">
          <div className="max-w-sm border-t border-oliva/20 pt-6">
            <p className="text-left font-serif text-xl text-tinta">Tudo pronto para o próximo destino?</p>
            <Link
              href="/meu-roteiro/organizar-com-ia"
              className="group mt-4 inline-flex min-h-12 items-center gap-4 rounded-lg bg-oliva px-5 py-3.5 text-sm font-medium text-branco hover:bg-tinta focus-visible:outline-oliva motion-safe:transition-colors motion-safe:duration-200"
            >
              <span>Montar meu roteiro personalizado</span>
              <span aria-hidden="true" className="shrink-0 text-lg leading-none motion-safe:transition-transform motion-safe:group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
