import type { ReactNode } from "react";

export type LegalSection = { title: string; body: ReactNode };

export default function LegalPage({
  eyebrow,
  title,
  updatedAt,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <main className="flex-1 bg-areia/40">
      <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs uppercase tracking-widest text-oliva">{eyebrow}</p>
        <h1 className="mt-2 font-serif text-3xl text-tinta sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-oliva">Última atualização: {updatedAt}</p>
        <p className="mt-8 leading-relaxed text-tinta">{intro}</p>

        <div className="mt-10 flex flex-col gap-10">
          {sections.map((section, index) => (
            <section key={section.title}>
              <h2 className="font-serif text-xl text-tinta sm:text-2xl">
                {index + 1}. {section.title}
              </h2>
              <div className="mt-3 flex flex-col gap-3 leading-relaxed text-tinta [&_a]:text-terracota [&_a]:underline [&_li]:ml-5 [&_li]:list-disc">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
