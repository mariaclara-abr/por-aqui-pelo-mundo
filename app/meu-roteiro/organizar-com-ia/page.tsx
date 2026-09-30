import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-server";
import { getActiveItineraryForAI } from "@/lib/itinerary-ai";
import { getDestinationPickerCities } from "@/lib/queries";
import { parseUserPreferences } from "@/types/database";
import OrganizarComIAClient from "@/components/itinerary-ai/OrganizarComIAClient";
import { buildOpenGraph } from "@/lib/metadata";

const TITLE = "Organizar com IA";
const DESCRIPTION =
  "Deixe a IA sugerir a ordem, os dias e os horários das atrações do seu roteiro.";

// robots noindex já vem herdado de app/meu-roteiro/layout.tsx.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/meu-roteiro/organizar-com-ia" },
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION }),
};

export default async function OrganizarComIAPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/entrar");
  }

  const [itinerary, { data: profile }, destinationCities] = await Promise.all([
    getActiveItineraryForAI(user.id),
    supabase.from("profiles").select("preferences").eq("id", user.id).single(),
    getDestinationPickerCities(),
  ]);

  const preferences = parseUserPreferences(profile?.preferences);

  return (
    <main className="relative flex-1 bg-oliva bg-[url('/itinerary-atlas.svg')] bg-[length:960px_640px] bg-top-left bg-repeat-y px-4 pt-7 pb-12 sm:bg-[length:100%_auto] sm:bg-top sm:px-6 sm:pt-10 sm:pb-16 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/meu-roteiro"
          className="inline-flex min-h-11 items-center text-sm text-areia/85 transition-colors hover:text-branco focus-visible:outline-areia"
        >
          ← Voltar para o roteiro
        </Link>

        <section className="relative grid items-center gap-8 border-b border-areia/25 pt-6 pb-9 text-branco sm:pt-8 sm:pb-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.55fr)] lg:gap-12">
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-areia">
              <span aria-hidden="true" className="h-px w-8 bg-areia/60" />
              Experiência premium
            </span>
            <h1 className="mt-5 max-w-xl text-balance font-serif text-4xl leading-[1.08] sm:text-5xl lg:text-[3.5rem]">
              Sua viagem, no ritmo certo.
            </h1>
            <p className="mt-5 max-w-xl text-left text-sm leading-6 text-areia/90 sm:text-base sm:leading-7">
              A IA transforma suas escolhas em um roteiro fluido: encontra a melhor ordem,
              distribui os dias e sugere horários para você aproveitar cada lugar com calma.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs text-areia sm:text-sm">
              <span className="flex items-center gap-2"><span aria-hidden="true" className="text-areia/65">✦</span> Trajetos mais inteligentes</span>
              <span className="flex items-center gap-2"><span aria-hidden="true" className="text-areia/65">✦</span> Sugestões da curadoria</span>
              <span className="flex items-center gap-2"><span aria-hidden="true" className="text-areia/65">✦</span> Seu jeito de viajar</span>
            </div>
          </div>
          <div aria-hidden="true" className="pointer-events-none hidden select-none md:block">
            <Image
              src="/ia-roteiro-ilustracao.png"
              alt=""
              width={620}
              height={628}
              sizes="(min-width: 1280px) 360px, (min-width: 768px) 30vw, 1px"
              className="mx-auto h-auto w-full max-w-[360px]"
            />
          </div>
        </section>

        <div className="mt-7">
          <OrganizarComIAClient
            itinerary={itinerary}
            preferences={preferences}
            destinationCities={destinationCities}
            userId={user.id}
          />
        </div>
      </div>
    </main>
  );
}
