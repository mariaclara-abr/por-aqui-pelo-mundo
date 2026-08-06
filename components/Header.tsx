"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBox from "@/components/SearchBox";
import AuthStatus from "@/components/AuthStatus";
import NavDrawer from "@/components/NavDrawer";
import RoteiroIndicator from "@/components/RoteiroIndicator";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="border-b border-tinta/10 bg-areia px-4 py-4 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <NavDrawer />
          {!isHome && (
            <Link
              href="/"
              aria-label="Voltar para o início"
              title="Voltar para o início"
              className="group relative flex min-w-0 flex-1 items-center gap-2 font-serif text-xl text-tinta"
            >
              <span className="relative flex min-w-0 items-center gap-2">
                <img
                  src="/assets/simbolo.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="shrink-0"
                />
                <span className="truncate">Por Aqui Pelo Mundo</span>
                <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-tinta px-2 py-1 text-xs text-branco opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  Voltar para o início
                </span>
              </span>
            </Link>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <SearchBox />
          <RoteiroIndicator />
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
