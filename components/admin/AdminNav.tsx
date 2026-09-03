"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Painel" },
  { href: "/admin/paises", label: "Países" },
  { href: "/admin/cidades", label: "Cidades" },
  { href: "/admin/atracoes", label: "Atrações" },
  { href: "/admin/dicas", label: "Dicas de viagem" },
  { href: "/admin/perguntas", label: "Perguntas" },
  { href: "/admin/avaliacoes", label: "Avaliações do site" },
  { href: "/admin/afiliados", label: "Afiliados" },
  { href: "/admin/sobre", label: "Sobre a autora" },
];

export default function AdminNav({
  pendingQuestionsCount = 0,
}: {
  pendingQuestionsCount?: number;
}) {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-1 overflow-x-auto border-b border-tinta/10 bg-branco px-4 py-3 sm:sticky sm:w-48 sm:flex-none sm:flex-col sm:self-start sm:overflow-y-auto sm:border-b-0 sm:border-r sm:px-3 sm:py-6"
      style={{
        top: "var(--header-height, 0px)",
        maxHeight: "calc(100vh - var(--header-height, 0px))",
      }}
    >
      {LINKS.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center justify-between gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-terracota text-white"
                : "text-tinta hover:bg-areia"
            }`}
          >
            {link.label}
            {link.href === "/admin/perguntas" && pendingQuestionsCount > 0 && (
              <span
                aria-label={`${pendingQuestionsCount} pergunta${pendingQuestionsCount > 1 ? "s" : ""} pendente${pendingQuestionsCount > 1 ? "s" : ""}`}
                className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium leading-none ${
                  active ? "bg-white text-terracota" : "bg-terracota text-white"
                }`}
              >
                {pendingQuestionsCount > 9 ? "9+" : pendingQuestionsCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
