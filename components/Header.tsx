"use client";

import Link from "next/link";
import SearchBox from "@/components/SearchBox";
import AuthStatus from "@/components/AuthStatus";
import NavDrawer from "@/components/NavDrawer";
import NotificationBell from "@/components/NotificationBell";
import RoteiroIndicator from "@/components/RoteiroIndicator";
import PlaneLaunchIcon from "@/components/PlaneLaunchIcon";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-tinta/5 bg-areia/80 px-2.5 py-2.5 shadow-[0_2px_16px_-4px_rgba(43,38,32,0.08)] backdrop-blur-md sm:px-6 sm:py-4 lg:px-10">
      <div className="relative mx-auto flex max-w-[1440px] items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <NavDrawer />
          <Link
            href="/"
            aria-label="Por Aqui Pelo Mundo: início"
            className="hidden min-w-0 items-center gap-2 font-serif text-xl text-tinta transition-colors hover:text-terracota md:flex"
          >
            <PlaneLaunchIcon size={20} />
            <span className="truncate">Por Aqui Pelo Mundo</span>
          </Link>
        </div>

        <Link
          href="/"
          aria-label="Por Aqui Pelo Mundo: início"
          className="absolute left-1/2 flex max-w-[calc(100%-112px)] -translate-x-1/2 items-center gap-1.5 whitespace-nowrap font-serif text-base text-tinta md:hidden"
        >
          <PlaneLaunchIcon size={18} />
          <span className="hidden min-[390px]:inline">Por Aqui Pelo Mundo</span>
          <span className="min-[390px]:hidden">Por Aqui</span>
        </Link>

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-3 md:flex">
            <SearchBox />
            <NotificationBell />
          </div>
          <RoteiroIndicator />
          <div className="hidden md:block">
            <AuthStatus />
          </div>
        </div>
      </div>
    </header>
  );
}
