import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { getActiveItineraryForAI } from "@/lib/itinerary-ai";
import { canUseAIForItinerary } from "@/lib/subscription";
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

  const [itinerary, { data: profile }] = await Promise.all([
    getActiveItineraryForAI(user.id),
    supabase.from("profiles").select("preferences").eq("id", user.id).single(),
  ]);

  const preferences = parseUserPreferences(profile?.preferences);
  const access = itinerary
    ? await canUseAIForItinerary(supabase, user.id, itinerary)
    : null;

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/meu-roteiro"
          className="text-sm text-oliva transition-colors hover:text-terracota"
        >
          ← Voltar para o roteiro
        </Link>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h1 className="font-serif text-3xl text-tinta sm:text-4xl">
            Organizar com IA
          </h1>
          <span className="rounded-full bg-terracota/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-terracota">
            Premium
          </span>
        </div>
        <p className="mt-2 max-w-xl text-oliva">
          A IA organiza a ordem, os dias e os horários das atrações que você já
          escolheu, e pode sugerir outros lugares da curadoria nas mesmas
          cidades. Sugestões vêm marcadas como tal e você pode excluí-las a
          qualquer momento; o que já está no seu roteiro nunca é removido.
        </p>

        <div className="mt-8">
          <OrganizarComIAClient
            itinerary={itinerary}
            preferences={preferences}
            access={access}
          />
        </div>
      </div>
    </main>
  );
}
