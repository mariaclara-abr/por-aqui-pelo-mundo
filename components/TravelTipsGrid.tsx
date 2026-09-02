"use client";

import { useState } from "react";
import TravelTipCard from "@/components/TravelTipCard";
import TravelTipModal from "@/components/TravelTipModal";
import PremiumDialog from "@/components/PremiumDialog";
import { useUserSubscription } from "@/lib/useUserSubscription";
import type { Database } from "@/types/database";

type TravelTip = Database["public"]["Tables"]["travel_tips"]["Row"];

export default function TravelTipsGrid({ tips }: { tips: TravelTip[] }) {
  const { isPremium } = useUserSubscription();
  const [openTip, setOpenTip] = useState<TravelTip | null>(null);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);

  function handleCardClick(tip: TravelTip) {
    if (tip.is_premium && !isPremium) {
      setShowPremiumDialog(true);
      return;
    }
    setOpenTip(tip);
  }

  const categories: string[] = [];
  const tipsByCategory = new Map<string, TravelTip[]>();
  for (const tip of tips) {
    if (!tipsByCategory.has(tip.category)) {
      categories.push(tip.category);
      tipsByCategory.set(tip.category, []);
    }
    tipsByCategory.get(tip.category)!.push(tip);
  }

  return (
    <>
      <div className="flex flex-col">
        {categories.map((category, categoryIndex) => {
          const categoryTips = tipsByCategory.get(category)!;

          return (
            <section
              key={category}
              aria-labelledby={`tip-category-${categoryIndex}`}
              className="flex flex-col gap-7 border-b border-tinta/15 py-12 first:pt-0 last:border-b-0 last:pb-0 sm:gap-8 sm:py-16"
            >
              <div className="text-center">
                <p className="flex items-center justify-center gap-2 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-terracota">
                  <span>Capítulo {String(categoryIndex + 1).padStart(2, "0")}</span>
                  <span aria-hidden="true">•</span>
                  <span>
                    {categoryTips.length}{" "}
                    {categoryTips.length === 1 ? "anotação" : "anotações"}
                  </span>
                </p>
                <h3
                  id={`tip-category-${categoryIndex}`}
                  className="mt-2 font-serif text-2xl leading-tight text-tinta sm:text-3xl"
                >
                  {category}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {categoryTips.map((tip, tipIndex) => (
                  <TravelTipCard
                    key={tip.id}
                    title={tip.title}
                    isPremium={tip.is_premium}
                    chapter={categoryIndex + 1}
                    position={tipIndex + 1}
                    tone={categoryIndex % 2 === 0 ? "olive" : "terracotta"}
                    onClick={() => handleCardClick(tip)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {openTip && (
        <TravelTipModal
          title={openTip.title}
          content={openTip.content}
          category={openTip.category}
          onClose={() => setOpenTip(null)}
        />
      )}

      {showPremiumDialog && (
        <PremiumDialog
          itineraryId={null}
          countryCount={0}
          onClose={() => setShowPremiumDialog(false)}
        />
      )}
    </>
  );
}
