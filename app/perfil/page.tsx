import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import PerfilClient from "@/components/perfil/PerfilClient";
import { getActivePremium } from "@/lib/subscription";
import { PLANS } from "@/lib/stripe";
import { formatPtDate, formatStampDate } from "@/lib/premium-dates";
import { buildOpenGraph } from "@/lib/metadata";

const TITLE = "Meu perfil";
const DESCRIPTION = "Gerencie seus dados de conta e preferências de viagem.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false },
  alternates: { canonical: "/perfil" },
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION }),
};

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/entrar");
  }

  const premium = await getActivePremium(supabase, user.id);

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-3xl text-tinta sm:text-4xl">
          Meu Perfil
        </h1>
        <PerfilClient
          premium={
            premium && {
              planLabel: PLANS[premium.plan_type].label,
              validUntil: premium.expiration_date
                ? formatPtDate(new Date(premium.expiration_date))
                : null,
              stampDate: formatStampDate(new Date(premium.purchase_date)),
            }
          }
        />
      </div>
    </main>
  );
}
