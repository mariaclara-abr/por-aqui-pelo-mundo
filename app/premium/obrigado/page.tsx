import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getActivePremium } from "@/lib/subscription";
import { PLANS } from "@/lib/stripe";
import { formatPtDate, formatStampDate } from "@/lib/premium-dates";
import PremiumThanks from "@/components/premium/PremiumThanks";
import type { PlanType } from "@/types/database";

export const metadata: Metadata = {
  title: "Seu Premium está ativo",
  robots: { index: false },
};

export default async function PremiumObrigadoPage(
  props: PageProps<"/premium/obrigado">,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");

  // Só em desenvolvimento: /premium/obrigado?preview=premium_anual simula a
  // compra recém-feita sem precisar de uma assinatura real no banco.
  const { preview } = await props.searchParams;
  const simulated: PlanType | null =
    process.env.NODE_ENV !== "production" &&
    (preview === "premium_mensal" || preview === "premium_anual")
      ? preview
      : null;

  const [premium, { data: profile }] = await Promise.all([
    simulated ? null : getActivePremium(supabase, user.id),
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  const planType = simulated ?? premium?.plan_type ?? null;
  const now = new Date();
  let expiration: Date | null = null;
  if (simulated) {
    expiration = new Date(now);
    expiration.setMonth(expiration.getMonth() + (PLANS[simulated].accessMonths ?? 0));
  } else if (premium?.expiration_date) {
    expiration = new Date(premium.expiration_date);
  }

  const fullName = profile?.display_name?.trim() || null;

  return (
    <PremiumThanks
      firstName={fullName?.split(" ")[0] ?? null}
      fullName={fullName}
      planLabel={planType ? PLANS[planType].label : null}
      validUntil={expiration ? formatPtDate(expiration) : null}
      stampDate={formatStampDate(premium ? new Date(premium.purchase_date) : now)}
      confirmed={!!planType}
    />
  );
}
