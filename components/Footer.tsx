import Link from "next/link";

const LINKS = [
  { label: "Meus roteiros", href: "/meu-roteiro" },
  { label: "Avisos", href: "/notificacoes" },
  { label: "Sobre a autora", href: "/sobre" },
  { label: "Destinos", href: "/#destinos" },
  { label: "Roteiros completos com IA", href: "/meu-roteiro/organizar-com-ia" },
];

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 fill-none stroke-current"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-tinta px-4 py-12 sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
        <a
          href="https://instagram.com/poraquipelomundo"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 text-areia transition-colors hover:text-terracota"
        >
          <InstagramIcon />
          <span className="font-serif text-lg">@poraquipelomundo</span>
        </a>

        <nav
          aria-label="Links do site"
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-areia/80 transition-colors hover:text-terracota"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
