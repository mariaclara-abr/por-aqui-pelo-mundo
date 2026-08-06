"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase-browser";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function AuthStatus() {
  const { user, profile, isAuthor, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearHoverTimeout() {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }

  useEffect(() => {
    return () => clearHoverTimeout();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        clearHoverTimeout();
        setIsOpen(false);
        setPinned(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleMouseEnter() {
    if (pinned) return;
    clearHoverTimeout();
    setIsOpen(true);
  }

  function handleMouseLeave() {
    if (pinned) return;
    clearHoverTimeout();
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  }

  function handleAvatarClick() {
    clearHoverTimeout();
    if (pinned) {
      setPinned(false);
      setIsOpen(false);
    } else {
      setPinned(true);
      setIsOpen(true);
    }
  }

  function requestSignOut() {
    clearHoverTimeout();
    setIsOpen(false);
    setPinned(false);
    setConfirmingSignOut(true);
  }

  async function confirmSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setSigningOut(false);
    setConfirmingSignOut(false);
  }

  if (loading) {
    return <div className="h-9 w-9" />;
  }

  if (!user) {
    return (
      <Link
        href="/entrar"
        className="rounded-full border border-terracota/30 px-4 py-1.5 text-sm text-terracota transition-colors hover:border-terracota"
      >
        Entrar
      </Link>
    );
  }

  const initial = (profile?.display_name || profile?.username || user.email || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={handleAvatarClick}
        aria-label="Menu da conta"
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-oliva text-sm font-medium text-white"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          initial
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-oliva/15 bg-branco p-2 shadow-md">
          <Link
            href="/perfil"
            onClick={() => setIsOpen(false)}
            className="block truncate rounded-lg px-3 py-1.5 text-sm text-tinta transition-colors hover:bg-areia hover:text-terracota"
          >
            {profile?.display_name || profile?.username}
          </Link>
          {isAuthor && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-tinta hover:bg-areia"
            >
              Painel
            </Link>
          )}
          <button
            type="button"
            onClick={requestSignOut}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-tinta hover:bg-areia"
          >
            Sair
          </button>
        </div>
      )}

      {confirmingSignOut && (
        <ConfirmDialog
          message="Tem certeza que quer sair da sua conta?"
          confirmLabel="Sim, sair"
          pendingLabel="Saindo..."
          pending={signingOut}
          onConfirm={confirmSignOut}
          onCancel={() => setConfirmingSignOut(false)}
        />
      )}
    </div>
  );
}
