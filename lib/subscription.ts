import { createClient } from "@/lib/supabase-server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

// A compra do "Roteiro Inteligente" avulso libera todas as dicas Premium do
// site por um período limitado, diferente do acesso ao próprio roteiro (que
// não expira).
export const ROTEIRO_UNICO_TIPS_UNLOCK_DAYS = 10;

export function computeTipsUnlockExpiration(
  purchaseDate: Date = new Date(),
): string {
  const expiration = new Date(purchaseDate);
  expiration.setDate(expiration.getDate() + ROTEIRO_UNICO_TIPS_UNLOCK_DAYS);
  return expiration.toISOString();
}

export function countDistinctCountries(
  attractions: { countrySlug: string }[],
): number {
  return new Set(attractions.map((a) => a.countrySlug)).size;
}

// Última assinatura Premium ativa e não expirada do usuário, se houver.
export async function getActivePremium(
  supabase: SupabaseServerClient,
  userId: string,
) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .in("plan_type", ["premium_mensal", "premium_anual"])
    .eq("is_active", true)
    .order("purchase_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  if (data.expiration_date && new Date(data.expiration_date) < new Date()) {
    return null;
  }
  return data;
}

// Compra avulsa do "Roteiro Inteligente" — só vale para o roteiro específico
// para o qual foi comprada (ver comentário na migration de subscriptions).
export async function hasRoteiroUnicoAccess(
  supabase: SupabaseServerClient,
  userId: string,
  itineraryId: string,
) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .eq("plan_type", "roteiro_unico_1pais")
    .eq("itinerary_id", itineraryId)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

export type AIAccessReason =
  | "premium"
  | "roteiro_unico"
  | "needs_payment"
  | "needs_premium";

export interface AIAccessResult {
  allowed: boolean;
  reason: AIAccessReason;
  countryCount: number;
}

// Ponto único de decisão sobre se o usuário pode usar "Organizar com IA"
// neste roteiro. Usado pela rota /api/generate-itinerary-ai (que é quem
// realmente barra a ação) tanto para roteiros já com atrações escolhidas
// quanto para o modo "montar do zero" (onde countryCount vem dos destinos
// selecionados, não de atrações confirmadas).
export async function canUseAIForItinerary(
  supabase: SupabaseServerClient,
  userId: string,
  itineraryId: string,
  countryCount: number,
): Promise<AIAccessResult> {
  const premium = await getActivePremium(supabase, userId);
  if (premium) {
    return { allowed: true, reason: "premium", countryCount };
  }

  if (countryCount <= 1) {
    const hasAccess = await hasRoteiroUnicoAccess(
      supabase,
      userId,
      itineraryId,
    );
    return {
      allowed: hasAccess,
      reason: hasAccess ? "roteiro_unico" : "needs_payment",
      countryCount,
    };
  }

  return { allowed: false, reason: "needs_premium", countryCount };
}
