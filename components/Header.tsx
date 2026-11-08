"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBox from "@/components/SearchBox";
import AuthStatus from "@/components/AuthStatus";
import NavDrawer from "@/components/NavDrawer";
import RoteiroIndicator from "@/components/RoteiroIndicator";
import PlaneLaunchIcon from "@/components/PlaneLaunchIcon";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const isHome = usePathname() === "/";
  const [atTop, setAtTop] = useState(true);
  // Na home, o cabeçalho fica transparente sobre a foto da hero até a rolagem começar.
  const overHero = isHome && atTop;

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setAtTop(window.scrollY < 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Expõe a altura real do header (varia com o breakpoint) como variável CSS,
  // usada pelo menu do admin para saber onde grudar (sticky) sem sobrepor o header.
  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${element.getBoundingClientRect().height}px`,
      );
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      data-hero={overHero || undefined}
      className={`group/header sticky top-0 z-50 border-b px-2.5 py-2.5 transition-[background-color,border-color,box-shadow] duration-300 sm:px-6 sm:py-4 lg:px-10 ${
        overHero
          ? "border-transparent bg-transparent"
          : "border-tinta/5 bg-areia/80 shadow-[0_2px_16px_-4px_rgba(43,38,32,0.08)] backdrop-blur-md"
      }`}
    >
      <div className="relative mx-auto flex max-w-[1440px] items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <NavDrawer />
          <div className="hidden min-w-0 items-center gap-2 md:flex">
            <span className="flex group-data-hero/header:brightness-0 group-data-hero/header:invert">
              <PlaneLaunchIcon size={20} />
            </span>
            <Link
              href="/"
              aria-label="Por Aqui Pelo Mundo: início"
              className="min-w-0 font-serif text-xl font-light text-tinta transition-colors hover:text-terracota group-data-hero/header:text-white group-data-hero/header:hover:text-areia"
            >
              <span className="truncate">Por Aqui Pelo Mundo</span>
            </Link>
          </div>
        </div>

        <div className="absolute left-1/2 flex max-w-[calc(100%-112px)] -translate-x-1/2 items-center gap-1.5 whitespace-nowrap md:hidden">
          <span className="flex group-data-hero/header:brightness-0 group-data-hero/header:invert">
            <PlaneLaunchIcon size={18} />
          </span>
          <Link
            href="/"
            aria-label="Por Aqui Pelo Mundo: início"
            className="font-serif text-base font-light text-tinta group-data-hero/header:text-white"
          >
            <span className="hidden min-[390px]:inline">Por Aqui Pelo Mundo</span>
            <span className="min-[390px]:hidden">Por Aqui</span>
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-3 md:flex">
            <SearchBox />
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
