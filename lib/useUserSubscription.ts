"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase-browser";

interface SubscriptionRow {
  plan_type: string;
  itinerary_id: string | null;
  expiration_date: string | null;
  tips_unlock_expiration: string | null;
}

interface SubscriptionState {
  loading: boolean;
  isPremium: boolean;
  // Premium ilimitado, ou compra avulsa do roteiro ainda dentro da janela de
  // dicas desbloqueadas (ver ROTEIRO_UNICO_TIPS_UNLOCK_DAYS).
  hasUnlockedTips: boolean;
  roteiroUnicoItineraryIds: Set<string>;
}

const EMPTY_STATE: SubscriptionState = {
  loading: false,
  isPremium: false,
  hasUnlockedTips: false,
  roteiroUnicoItineraryIds: new Set(),
};

function deriveState(rows: SubscriptionRow[]): SubscriptionState {
  const now = Date.now();

  const isPremium = rows.some(
    (row) =>
      (row.plan_type === "premium_mensal" || row.plan_type === "premium_anual") &&
      (!row.expiration_date || new Date(row.expiration_date).getTime() > now),
  );

  const hasUnlockedTips =
    isPremium ||
    rows.some(
      (row) =>
        row.plan_type === "roteiro_unico_1pais" &&
        row.tips_unlock_expiration &&
        new Date(row.tips_unlock_expiration).getTime() > now,
    );

  const roteiroUnicoItineraryIds = new Set(
    rows
      .filter((row) => row.plan_type === "roteiro_unico_1pais" && row.itinerary_id)
      .map((row) => row.itinerary_id as string),
  );

  return { loading: false, isPremium, hasUnlockedTips, roteiroUnicoItineraryIds };
}

// Espelha o padrão de lib/auth.tsx: consulta `subscriptions` direto pelo
// client do Supabase (RLS só deixa o usuário ver as próprias linhas), sempre
// resolvendo o novo estado dentro de um .then() — nunca chamando setState de
// forma síncrona a partir do efeito.
export function useUserSubscription() {
  const { user } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    ...EMPTY_STATE,
    loading: true,
  });

  const refresh = useCallback(() => {
    if (!user) {
      return Promise.resolve().then(() => setState(EMPTY_STATE));
    }

    const supabase = createClient();
    return supabase
      .from("subscriptions")
      .select("plan_type, itinerary_id, expiration_date, tips_unlock_expiration")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .then(({ data }) => {
        setState(deriveState(data ?? []));
      });
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function hasRoteiroUnicoFor(itineraryId: string) {
    return state.roteiroUnicoItineraryIds.has(itineraryId);
  }

  return { ...state, hasRoteiroUnicoFor, refresh };
}
