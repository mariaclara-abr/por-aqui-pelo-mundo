import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTravelTipBySlug, getTravelTips } from "@/lib/queries";
import { getTipDestinations } from "@/lib/tip-destinations";
import { linkify } from "@/components/Linkify";
import { buildOpenGraph, truncateToSentence } from "@/lib/metadata";
import { renderBold } from "@/lib/text-formatting";
import UpdatedAt from "@/components/UpdatedAt";
import JsonLd, { articleLd } from "@/components/JsonLd";

export const revalidate = 60;

export async function generateStaticParams() {
  const tips = await getTravelTips();
  return tips.map((tip) => ({ slug: tip.slug }));
}

const plain = (title: string) => title.replaceAll("**", "");

export async function generateMetadata(
  props: PageProps<"/dicas-de-viagem/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const tip = await getTravelTipBySlug(slug);
  if (!tip) notFound();

  const title = plain(tip.title);
  // Dica Premium: a descrição não pode vazar o conteúdo travado.
  const description = tip.is_premium
    ? `Dica Premium de ${tip.category}: ${title}`
    : truncateToSentence(tip.content, 155);

  return {
    title,
    description,
    alternates: { canonical: `/dicas-de-viagem/${tip.slug}` },
    openGraph: buildOpenGraph({ title, description, type: "article" }),
  };
}

export default async function DicaPage(
  props: PageProps<"/dicas-de-viagem/[slug]">,
) {
  const { slug } = await props.params;
  const tip = await getTravelTipBySlug(slug);
  if (!tip) notFound();
  // Dica Premium: só o título é lido, o conteúdo travado não vaza.
  const destinations =
    (await getTipDestinations([
      { ...tip, content: tip.is_premium ? "" : tip.content },
    ]))[tip.id];

  return (
    <main className="flex-1 px-4 py-14 sm:px-6 sm:py-20">
      <JsonLd
        data={articleLd({
          title: plain(tip.title),
          description: tip.is_premium
            ? `Dica Premium de ${tip.category}: ${plain(tip.title)}`
            : truncateToSentence(tip.content, 155),
          path: `/dicas-de-viagem/${tip.slug}`,
          createdAt: tip.created_at,
          updatedAt: tip.updated_at,
        })}
      />
      <article className="mx-auto max-w-2xl">
        <Link
          href="/dicas-de-viagem"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-oliva hover:text-terracota"
        >
          Caderno de bordo
        </Link>
        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-terracota">
          {tip.category}
        </p>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-tinta sm:text-5xl">
          {renderBold(tip.title)}
        </h1>

        {tip.is_premium ? (
          // ponytail: o conteúdo Premium nunca vai no HTML; assinante lê pelo
          // modal em /dicas-de-viagem. Se quiser liberar aqui, checar assinatura no servidor.
          <div className="mt-10 rounded-card border border-terracota/25 bg-branco p-6 sm:p-8">
            <p className="font-serif text-xl text-tinta">
              Esta anotação é exclusiva para assinantes Premium.
            </p>
            <Link
              href="/premium"
              className="mt-5 inline-block rounded-card bg-terracota px-5 py-3 text-sm font-semibold text-branco"
            >
              Conhecer o Premium
            </Link>
          </div>
        ) : (
          <p className="mt-10 whitespace-pre-line text-left font-serif text-lg leading-[1.75] text-tinta sm:text-xl">
            {linkify(tip.content)}
          </p>
        )}

        {destinations.length > 0 && (
          <nav aria-label="Destinos citados" className="mt-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-oliva">
              Destinos citados
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {destinations.map((d) => (
                <li key={d.href}>
                  <Link
                    href={d.href}
                    className="inline-block rounded-full border border-terracota/40 px-4 py-1.5 text-sm text-terracota transition-colors hover:bg-terracota hover:text-branco"
                  >
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <UpdatedAt date={tip.updated_at} className="mt-10" />

        <div className="mt-6 flex items-center gap-3 border-t border-tinta/10 pt-5 text-terracota">
          <span className="font-serif text-lg italic">por aqui</span>
          <span className="h-px flex-1 bg-terracota/25" aria-hidden="true" />
        </div>
      </article>
    </main>
  );
}
