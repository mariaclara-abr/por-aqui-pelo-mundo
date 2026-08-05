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
    <header className="border-b border-tinta/10 bg-areia px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <NavDrawer />
          {!isHome && (
            <Link
              href="/"
              className="min-w-0 flex-1 truncate font-serif text-xl text-tinta"
            >
              Por Aqui Pelo Mundo
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
