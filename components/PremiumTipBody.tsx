"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { linkify } from "@/components/Linkify";
import { useUserSubscription } from "@/lib/useUserSubscription";

const BODY = "whitespace-pre-line text-left font-serif text-lg leading-[1.75] text-tinta sm:text-xl";

/** Dica Premium: o trecho público vem no HTML; o texto completo só para quem tem acesso. */
export default function PremiumTipBody({ tipId, teaser }: { tipId: string; teaser: string }) {
  const { hasUnlockedTips } = useUserSubscription();
  const [full, setFull] = useState<string | null>(null);

  useEffect(() => {
    if (!hasUnlockedTips) return;
    fetch(`/api/travel-tips/${tipId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setFull(data?.content ?? null))
      .catch(() => {});
  }, [hasUnlockedTips, tipId]);

  if (full) return <p className={`mt-10 ${BODY}`}>{linkify(full)}</p>;

  return (
    <>
      <p className={`mt-10 ${BODY}`}>{teaser}</p>
      <div className="paywall mt-8 rounded-card border border-terracota/25 bg-branco p-6 sm:p-8">
        <p className="font-serif text-xl text-tinta">
          O restante desta anotação é exclusivo para assinantes Premium.
        </p>
        <Link
          href="/premium"
          className="mt-5 inline-block rounded-card bg-terracota px-5 py-3 text-sm font-semibold text-branco"
        >
          Conhecer o Premium
        </Link>
      </div>
    </>
  );
}
