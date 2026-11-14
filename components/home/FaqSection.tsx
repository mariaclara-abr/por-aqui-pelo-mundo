import Image from "next/image";
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
      "Pode. Você faz as alterações que quiser no roteiro montado pela IA e pode salvá-lo em PDF para levar com você na viagem.",
  },
  {
    question: "O que vem no acesso premium?",
    answer:
      "Roteiro sob medida montado pela IA com a curadoria da Rejane e todas as dicas Premium do site desbloqueadas. Você escolhe entre 1 roteiro (R$ 89,90), 4 roteiros (R$ 299,90) ou 8 roteiros (R$ 499,90). Cada país do roteiro usa 1 crédito, e os roteiros podem ser usados em até 6 meses após a compra.",
  },
];

export default function FaqSection() {
  return (
    <section
      aria-labelledby="faq-title"
      className="bg-[#FAF6EF] px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-24"
    >
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="min-w-0">
          <h2
            id="faq-title"
            className="font-serif text-4xl leading-tight tracking-tight text-tinta sm:text-5xl"
          >
            Perguntas
            <br />
            frequentes
          </h2>

          <div className="mt-8 border-t border-oliva/30 sm:mt-10">
            {faqs.map((faq, index) => (
              <details key={faq.question} className="group border-b border-oliva/30">
                <summary className="flex cursor-pointer list-none items-center gap-3 py-4 text-tinta hover:text-oliva focus-visible:outline-oliva motion-safe:transition-colors [&::-webkit-details-marker]:hidden">
                  <span className="flex-1 font-sans text-sm leading-snug sm:text-[15px]">
                    {index + 1}. {faq.question}
                  </span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="size-4 shrink-0 text-oliva"
                  >
                    <path d="M3 8h10" />
                    <path d="M8 3v10" className="origin-center group-open:scale-y-0 motion-safe:transition-transform motion-safe:duration-200" />
                  </svg>
                </summary>
                <p className="pb-5 pr-8 text-left text-[13px] leading-6 text-tinta/75 sm:text-sm">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <Link
            href="/meu-roteiro/organizar-com-ia"
            className="btn btn-oliva group mt-8"
          >
            <span>Montar meu roteiro personalizado</span>
          </Link>
        </div>

        <Image
          src="/faq-atenas.jpg"
          alt="Colunas do Partenon, na Acrópole de Atenas, contra o céu azul"
          width={1200}
          height={1600}
          className="mx-auto aspect-[3/4] w-full max-w-md object-cover lg:max-w-none"
        />
      </div>
    </section>
  );
}
