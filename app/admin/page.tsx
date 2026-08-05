import Link from "next/link";
import { getCounts } from "@/lib/queries";
import { getPendingQuestionsCount } from "@/lib/questions";

export default async function AdminPage() {
  const [counts, pendingQuestions] = await Promise.all([
    getCounts(),
    getPendingQuestionsCount(),
  ]);

  const cards = [
    {
      href: "/admin/paises",
      label: "Países",
      count: counts.countries,
      action: "Adicionar país",
      actionHref: "/admin/paises/novo",
    },
    {
      href: "/admin/cidades",
      label: "Cidades",
      count: counts.cities,
      action: "Adicionar cidade",
      actionHref: "/admin/cidades/novo",
    },
    {
      href: "/admin/atracoes",
      label: "Atrações",
      count: counts.attractions,
      action: "Adicionar atração",
      actionHref: "/admin/atracoes/novo",
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl text-tinta">Painel</h1>
      <p className="mt-1 text-sm text-oliva">
        Gerencie os países, cidades e atrações cadastrados no site.
      </p>

      <Link
        href="/admin/perguntas"
        className={`mt-8 flex items-center justify-between rounded-xl border p-5 transition-colors ${
          pendingQuestions > 0
            ? "border-terracota bg-terracota/5 hover:bg-terracota/10"
            : "border-oliva/15 bg-branco hover:bg-areia"
        }`}
      >
        <div>
          <p className="text-sm text-oliva">Perguntas pendentes</p>
          <p className="mt-1 font-serif text-3xl text-tinta">
            {pendingQuestions}
          </p>
        </div>
        <span className="text-sm font-medium text-terracota">
          Ver perguntas →
        </span>
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.href}
            className="rounded-xl border border-oliva/15 bg-branco p-5"
          >
            <Link href={card.href} className="block">
              <p className="text-sm text-oliva">{card.label}</p>
              <p className="mt-1 font-serif text-3xl text-tinta">
                {card.count}
              </p>
            </Link>
            <Link
              href={card.actionHref}
              className="mt-3 inline-block text-sm text-terracota hover:underline"
            >
              + {card.action}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
