import { linkify } from "@/components/Linkify";
import CopyCoupon from "@/components/CopyCoupon";

export type Natura = { store_url: string | null; coupon_code: string | null; conditions: string | null };

const isNatura = (url: string) => /natura\.com/i.test(url);

export type Perk = { description: string; url: string; ctaLabel: string };

type PerkRow = {
  exclusive_perk_description: string | null;
  exclusive_perk_url: string | null;
  exclusive_perk_cta_label: string | null;
  exclusive_perk_2_description: string | null;
  exclusive_perk_2_url: string | null;
  exclusive_perk_2_cta_label: string | null;
  exclusive_perk_3_description: string | null;
  exclusive_perk_3_url: string | null;
  exclusive_perk_3_cta_label: string | null;
};

// Converte as colunas da atração nos três espaços de parceria.
export function perksFromRow(row?: Partial<PerkRow> | null): Perk[] {
  return ["exclusive_perk", "exclusive_perk_2", "exclusive_perk_3"].map((p) => {
    const get = (k: string) => (row as Record<string, string | null> | null | undefined)?.[`${p}_${k}`] ?? "";
    return { description: get("description"), url: get("url"), ctaLabel: get("cta_label") };
  });
}

// Cada espaço é independente: só aparece quando tem descrição.
// Cards da Natura (link natura.com): usam o link e o cupom do cadastro central.
export default function ExclusivePerks({ perks, natura }: { perks: Perk[]; natura?: Natura | null }) {
  return perks
    .filter((perk) => perk.description.trim())
    .map((perk, index) => {
      const nat = natura && isNatura(perk.url) ? natura : null;
      const url = nat?.store_url || perk.url;
      return (
      <section
        key={index}
        className="mt-6 rounded-xl border-2 border-terracota bg-terracota/5 p-5"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-terracota">
          Exclusivo Por Aqui Pelo Mundo
        </p>
        <p className="mt-2 leading-relaxed text-tinta whitespace-pre-line">
          {linkify(perk.description)}
        </p>
        {nat?.coupon_code && <CopyCoupon code={nat.coupon_code} conditions={nat.conditions} />}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="btn btn-terracota btn-cheio mt-4"
          >
            {perk.ctaLabel || "Aproveitar parceria"}
          </a>
        )}
      </section>
      );
    });
}
