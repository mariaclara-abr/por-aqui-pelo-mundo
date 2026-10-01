"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MotionConfig, motion } from "motion/react";
import PlaneLaunchIcon from "@/components/PlaneLaunchIcon";
import PremiumStamp from "@/components/premium/PremiumStamp";
import { COMPACT_BENEFITS, HERO_BENEFITS } from "@/components/PremiumDialog";

interface PremiumThanksProps {
  firstName: string | null;
  fullName: string | null;
  planLabel: string | null;
  validUntil: string | null;
  stampDate: string;
  // false enquanto o webhook do Stripe ainda não gravou a assinatura.
  confirmed: boolean;
}

// O webhook pode chegar alguns segundos depois do redirecionamento do
// checkout: enquanto isso a página se atualiza sozinha algumas vezes.
const CONFIRM_POLL_MS = 2500;
const CONFIRM_POLL_MAX = 6;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 10.5l3.5 3.5 7.5-8" />
    </svg>
  );
}

export default function PremiumThanks({
  firstName,
  fullName,
  planLabel,
  validUntil,
  stampDate,
  confirmed,
}: PremiumThanksProps) {
  const router = useRouter();

  useEffect(() => {
    if (confirmed) return;
    let attempts = 0;
    const id = window.setInterval(() => {
      router.refresh();
      attempts += 1;
      if (attempts >= CONFIRM_POLL_MAX) window.clearInterval(id);
    }, CONFIRM_POLL_MS);
    return () => window.clearInterval(id);
  }, [confirmed, router]);

  return (
    <MotionConfig reducedMotion="user">
      <main className="flex-1">
        <section className="relative isolate overflow-hidden">
          <Image
            src="/hero-por-do-sol.jpeg"
            alt="Pôr do sol visto pela janela do avião, com nuvens douradas acima da asa"
            fill
            preload
            sizes="100vw"
            className="-z-20 object-cover object-[60%_center] brightness-[0.65] sm:object-center"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-tinta/40" />

          <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-32 pt-14 text-center sm:px-6 sm:pb-40 sm:pt-20">
            <motion.div
              {...rise(0)}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-areia/60 bg-tinta/25"
            >
              <PlaneLaunchIcon size={34} autoPlayDelay={1200} />
            </motion.div>

            <motion.p
              {...rise(0.15)}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-areia/40 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-areia"
            >
              <CheckIcon className="h-3.5 w-3.5" />
              Pagamento confirmado
            </motion.p>

            <motion.h1
              {...rise(0.3)}
              className="mt-6 font-serif [font-size:min(2.75rem,11vw)] leading-[1.05] tracking-[-0.02em] text-balance text-branco sm:text-6xl lg:text-7xl"
            >
              {firstName ? `Obrigado, ${firstName}.` : "Obrigado por embarcar."}
              <span className="mt-1 block whitespace-nowrap leading-[1.15] text-areia [font-size:min(1em,7.2vw)]">
                Sua viagem começa agora.
              </span>
            </motion.h1>

            <motion.p
              {...rise(0.45)}
              className="mt-6 text-center text-base leading-relaxed text-balance text-areia sm:text-lg lg:text-[17px]"
            >
              Seu pagamento foi confirmado e{" "}
              {confirmed
                ? "o Premium já está ativo"
                : "estamos liberando o seu Premium, é questão de segundos"}
              . Obrigado por confiar em uma curadoria feita de viagens reais:
              cada lugar daqui foi visitado e avaliado de perto pela Rejane. É
              uma alegria ter você a bordo.
            </motion.p>
          </div>
        </section>

        <section className="relative z-10 -mt-24 px-4 sm:-mt-28 sm:px-6">
          <motion.div
            {...reveal()}
            className="mx-auto grid max-w-3xl overflow-hidden rounded-card bg-branco shadow-[0_2px_6px_rgba(43,38,32,0.1),0_26px_50px_-18px_rgba(43,38,32,0.45)] sm:grid-cols-[1fr_15rem]"
          >
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.16em] sm:text-[11px] sm:tracking-[0.2em]">
                <span className="whitespace-nowrap text-oliva">Cartão de embarque</span>
                <span className="whitespace-nowrap text-terracota">Classe Premium</span>
              </div>

              <p className="mt-7 text-[11px] uppercase tracking-[0.2em] text-oliva/70">
                Viajante
              </p>
              <p className="mt-1 font-serif text-3xl leading-tight text-tinta sm:text-4xl">
                {fullName ?? "Você"}
              </p>

              <div
                aria-hidden="true"
                className="mt-6 hidden items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-oliva min-[380px]:flex"
              >
                <span>Da ideia</span>
                <span className="h-0 flex-1 border-t-2 border-dotted border-terracota/60" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/simbolo.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="rotate-[70deg]"
                />
                <span className="h-0 flex-1 border-t-2 border-dotted border-terracota/60" />
                <span>ao roteiro pronto</span>
              </div>

              <dl className="mt-7 grid grid-cols-2 gap-6 border-t border-oliva/15 pt-6">
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-oliva/70">
                    Plano
                  </dt>
                  <dd className="mt-1 font-serif text-lg text-tinta sm:text-xl">
                    {planLabel ?? "Premium"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-oliva/70">
                    Válido até
                  </dt>
                  <dd className="mt-1 font-serif text-lg text-tinta sm:text-xl">
                    {validUntil ?? "Em ativação"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="relative flex flex-col items-center justify-center gap-3 border-t-2 border-dashed border-oliva/25 bg-areia/50 p-6 sm:border-l-2 sm:border-t-0">
              <span
                aria-hidden="true"
                className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-areia"
              />
              <span
                aria-hidden="true"
                className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-areia sm:-bottom-3 sm:-left-3 sm:right-auto sm:top-auto"
              />
              <PremiumStamp date={stampDate} />
              <p className="text-center text-[11px] uppercase tracking-[0.2em] text-oliva">
                Passagem liberada
              </p>
            </div>
          </motion.div>
        </section>

        <section className="mt-16 bg-oliva bg-[url('/author-paper.svg')] bg-[length:256px_256px] bg-blend-soft-light sm:mt-24">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[5fr_6fr] lg:gap-16 lg:px-10">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <motion.div {...reveal()}>
                <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-areia/80">
                  <span aria-hidden="true" className="h-px w-7 bg-terracota" />
                  Agora é seu
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-[1.1] tracking-[-0.02em] text-balance text-branco sm:text-5xl">
                  Tudo o que o{" "}
                  <span className="italic text-areia">Premium</span> abre para
                  você
                </h2>
                <p className="mt-4 max-w-md text-left text-base leading-7 text-areia/90">
                  A curadoria de sempre, agora com a IA organizando cada dia,
                  cada horário e cada trajeto do seu roteiro.
                </p>
                <Image
                  src="/ia-caderno-premium.webp"
                  alt="Caderno de viagem aberto, com mapa ilustrado de uma baía e anotações do roteiro"
                  width={1200}
                  height={800}
                  sizes="(min-width: 1024px) 480px, 90vw"
                  className="mt-8 h-auto w-full max-w-md select-none"
                />
              </motion.div>
            </div>

            <div>
              <ol className="grid gap-4">
                {HERO_BENEFITS.map(({ id, icon: Icon, title, detail }, index) => (
                  <motion.li
                    key={id}
                    {...reveal(index * 0.08)}
                    className="flex items-start gap-4 rounded-card bg-areia p-5 sm:gap-5 sm:p-6"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-terracota text-white sm:h-14 sm:w-14">
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif text-xl leading-snug text-tinta sm:text-2xl">
                        {title}
                      </h3>
                      <p className="mt-1 text-left text-sm leading-6 text-oliva first-letter:uppercase sm:text-base">
                        {detail}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="font-serif text-3xl leading-none text-oliva/25 sm:text-4xl"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </motion.li>
                ))}
              </ol>

              <motion.div
                {...reveal()}
                className="mt-4 rounded-card border border-areia/25 p-5 sm:p-6"
              >
                <h3 className="font-serif text-xl text-branco">E tem mais</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {COMPACT_BENEFITS.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-3 text-sm leading-6 text-areia"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracota text-white">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 text-center sm:px-6 sm:py-24">
          <motion.div {...reveal()} className="mx-auto max-w-xl">
            <h2 className="font-serif text-3xl leading-tight text-tinta sm:text-5xl">
              Por onde vamos começar?
            </h2>
            <p className="mt-4 text-center text-base text-oliva">
              Seu roteiro e as dicas exclusivas já estão à sua espera.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/meu-roteiro/organizar-com-ia"
                className="inline-flex min-h-12 items-center justify-center gap-4 rounded-lg bg-terracota px-7 py-3.5 text-base font-medium text-white transition-colors hover:bg-terracota/90"
              >
                Organizar meu roteiro com IA
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/dicas-de-viagem"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-oliva/40 px-7 py-3.5 text-base font-medium text-oliva transition-colors hover:border-oliva"
              >
                Explorar as dicas
              </Link>
            </div>
            <p className="mt-12 text-center font-serif text-lg italic text-balance text-oliva">
              Boa viagem, e obrigado por viajar com a gente.
            </p>
            <PremiumStamp
              decorative
              date={stampDate}
              delay={0.2}
              className="mx-auto mt-6 h-28 w-28"
            />
          </motion.div>
        </section>
      </main>
    </MotionConfig>
  );
}
