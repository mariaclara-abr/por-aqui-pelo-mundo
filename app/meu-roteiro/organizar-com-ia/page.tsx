import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
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
    <main className="relative flex-1 overflow-hidden px-4 py-7 sm:px-6 sm:py-10 lg:px-10">
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[440px] w-[min(1100px,120vw)] -translate-x-1/2 rounded-b-[48%] bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.92),_rgba(255,255,255,0)_68%)]" />
      <div className="mx-auto max-w-6xl">
        <Link
          href="/meu-roteiro"
          className="text-sm text-oliva transition-colors hover:text-terracota"
        >
          ← Voltar para o roteiro
        </Link>

        <section className="relative mt-5 overflow-hidden rounded-[28px] border border-white/80 bg-tinta px-6 py-9 text-branco shadow-[0_22px_55px_-30px_rgba(43,38,32,0.75)] sm:px-10 sm:py-12">
          <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full border border-areia/20" />
          <div className="absolute top-12 right-10 h-36 w-36 rounded-full border border-terracota/50" />
          <div className="absolute right-24 bottom-[-72px] h-48 w-48 rounded-full bg-terracota/20 blur-2xl" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-areia/25 bg-branco/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-areia">
              <span className="h-1.5 w-1.5 rounded-full bg-terracota" />
              Experiência premium
            </span>
            <h1 className="mt-5 font-serif text-4xl leading-[1.02] sm:text-5xl">
              Sua viagem, no ritmo certo.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-areia/85 sm:text-base">
              A IA transforma suas escolhas em um roteiro fluido: encontra a melhor ordem,
              distribui os dias e sugere horários para você aproveitar cada lugar com calma.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-areia/90">
              <span className="flex items-center gap-2"><span className="text-terracota">✦</span> Trajetos mais inteligentes</span>
              <span className="flex items-center gap-2"><span className="text-terracota">✦</span> Sugestões da curadoria</span>
              <span className="flex items-center gap-2"><span className="text-terracota">✦</span> Seu jeito de viajar</span>
            </div>
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
