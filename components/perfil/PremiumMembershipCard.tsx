import PremiumStamp from "@/components/premium/PremiumStamp";

export interface PremiumMembership {
  planLabel: string;
  validUntil: string | null;
  stampDate: string;
}

export default function PremiumMembershipCard({
  premium,
}: {
  premium: PremiumMembership;
}) {
  return (
    <section className="flex max-w-xl items-center gap-5 rounded-card border border-oliva/20 bg-branco p-5 sm:gap-6 sm:p-6">
      <PremiumStamp
        date={premium.stampDate}
        delay={0.2}
        className="h-24 w-24 shrink-0 sm:h-28 sm:w-28"
      />
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-terracota">
          Membro Premium
        </p>
        <h2 className="mt-1 font-serif text-xl text-tinta sm:text-2xl">
          {premium.planLabel}
        </h2>
        {premium.validUntil && (
          <p className="mt-1 text-left text-sm text-oliva">
            Acesso até {premium.validUntil}
          </p>
        )}
      </div>
    </section>
  );
}
