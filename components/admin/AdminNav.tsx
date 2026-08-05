"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Painel" },
  { href: "/admin/paises", label: "Países" },
  { href: "/admin/cidades", label: "Cidades" },
  { href: "/admin/atracoes", label: "Atrações" },
  { href: "/admin/perguntas", label: "Perguntas" },
  { href: "/admin/afiliados", label: "Afiliados" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-tinta/10 bg-branco px-4 py-3 sm:w-48 sm:flex-none sm:flex-col sm:border-b-0 sm:border-r sm:px-3 sm:py-6">
      {LINKS.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-terracota text-white"
                : "text-tinta hover:bg-areia"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
