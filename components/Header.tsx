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
              className="flex min-w-0 flex-1 items-center gap-2 truncate font-serif text-xl text-tinta"
            >
              <img
                src="/assets/simbolo.svg"
                alt=""
                width={20}
                height={20}
                className="shrink-0"
              />
              <span className="truncate">Por Aqui Pelo Mundo</span>
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
