"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase-browser";
import { getCitiesByCountry, getCountries } from "@/lib/queries";
import ConfirmDialog from "@/components/ConfirmDialog";
import SearchBox from "@/components/SearchBox";

type CountryItem = { id: string; name: string; slug: string };
type CityItem = { id: string; name: string; slug: string };

export default function NavDrawer() {
  const { user, isAuthor } = useAuth();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const [destinosOpen, setDestinosOpen] = useState(false);
  const [countries, setCountries] = useState<CountryItem[] | null>(null);
  const [loadingCountries, setLoadingCountries] = useState(false);

  const [expandedCountry, setExpandedCountry] = useState<CountryItem | null>(
    null,
  );
  const [cities, setCities] = useState<CityItem[] | null>(null);
  const [loadingCities, setLoadingCities] = useState(false);

  const expandedCountrySlug = expandedCountry?.slug ?? null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function close() {
    setIsOpen(false);
    setDestinosOpen(false);
    setCountries(null);
    setExpandedCountry(null);
    setCities(null);
  }

  function navigate(href: string) {
    close();
    router.push(href);
  }

  async function confirmSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setSigningOut(false);
    setConfirmingSignOut(false);
    close();
  }

  function toggleDestinos() {
    const next = !destinosOpen;
    setDestinosOpen(next);
    if (!next) {
      setExpandedCountry(null);
      setCities(null);
      return;
    }

    setLoadingCountries(true);
    setCountries(null);
    getCountries()
      .then(setCountries)
      .finally(() => setLoadingCountries(false));
  }

  function handleCountryClick(country: CountryItem) {
    if (expandedCountrySlug === country.slug) {
      navigate(`/${country.slug}`);
      return;
    }
    setExpandedCountry(country);
    setLoadingCities(true);
    setCities(null);
    getCitiesByCountry(country.slug)
      .then(setCities)
      .finally(() => setLoadingCities(false));
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menu"
        className="flex h-11 w-11 items-center justify-center rounded-full text-tinta transition-colors hover:bg-tinta/5 hover:text-terracota sm:h-9 sm:w-9"
      >
        <svg
          viewBox="0 0 20 20"
          className="h-5 w-5 fill-none stroke-current"
          strokeWidth={2}
        >
          <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
        </svg>
      </button>

      {mounted &&
        createPortal(
          <>
            <div
              onClick={close}
              aria-hidden="true"
              className={`fixed inset-0 z-[1100] bg-tinta/50 transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            />

            <div
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              className={`fixed inset-y-0 left-0 z-[1101] flex w-80 max-w-[85vw] flex-col bg-oliva shadow-lg transition-transform duration-300 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex items-center gap-2 border-b border-branco/15 px-4 py-4">
                <div className="w-8 shrink-0" />
                <p className="flex-1 truncate text-center font-serif text-lg text-branco">
                  Menu
                </p>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Fechar menu"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-branco transition-colors hover:text-terracota"
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="h-5 w-5 fill-none stroke-current"
                    strokeWidth={2}
                  >
                    <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                <div className="mb-3 md:hidden">
                  <SearchBox variant="drawer" onNavigate={close} />
                </div>
                <nav className="flex flex-col gap-1">
                  <MenuItem
                    chevron
                    expanded={destinosOpen}
                    onClick={toggleDestinos}
                  >
                    Destinos
                  </MenuItem>

                  {destinosOpen && (
                    <div className="ml-3 flex flex-col gap-1 border-l border-branco/15 pl-3">
                      {renderList({
                        loading: loadingCountries,
                        items: countries,
                        emptyLabel: "Nenhum destino cadastrado ainda.",
                        renderItem: (country) => (
                          <div
                            key={country.id}
                            className="flex flex-col gap-1"
                          >
                            <MenuItem
                              chevron
                              expanded={expandedCountrySlug === country.slug}
                              onClick={() => handleCountryClick(country)}
                            >
                              {country.name}
                            </MenuItem>

                            {expandedCountrySlug === country.slug && (
                              <div className="ml-3 flex flex-col gap-1 border-l border-branco/15 pl-3">
                                {renderList({
                                  loading: loadingCities,
                                  items: cities,
                                  emptyLabel:
                                    "Nenhuma cidade cadastrada ainda.",
                                  renderItem: (city) => (
                                    <MenuItem
                                      key={city.id}
                                      onClick={() =>
                                        navigate(
                                          `/${country.slug}/${city.slug}`,
                                        )
                                      }
                                    >
                                      {city.name}
                                    </MenuItem>
                                  ),
                                })}
                              </div>
                            )}
                          </div>
                        ),
                      })}
                    </div>
                  )}

                  <MenuItem onClick={() => navigate("/meu-roteiro")}>
                    Meus Roteiros
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/notificacoes")}>
                    Avisos
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/sobre")}>
                    Sobre a autora
                  </MenuItem>
                  {user && (
                    <MenuItem onClick={() => navigate("/perfil")}>
                      Meu Perfil
                    </MenuItem>
                  )}
                  {isAuthor && (
                    <MenuItem onClick={() => navigate("/admin")}>
                      Painel
                    </MenuItem>
                  )}
                  <div className="my-2 border-t border-branco/15" />
                  {user ? (
                    <MenuItem onClick={() => setConfirmingSignOut(true)}>
                      Sair
                    </MenuItem>
                  ) : (
                    <MenuItem onClick={() => navigate("/entrar")}>
                      Entrar
                    </MenuItem>
                  )}
                </nav>
              </div>
            </div>
          </>,
          document.body,
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
    </>
  );
}

function renderList<T>({
  loading,
  items,
  emptyLabel,
  renderItem,
}: {
  loading: boolean;
  items: T[] | null;
  emptyLabel: string;
  renderItem: (item: T) => React.ReactNode;
}) {
  if (loading || !items) {
    return <p className="px-3 py-2 text-sm text-areia/70">Carregando...</p>;
  }

  if (items.length === 0) {
    return <p className="px-3 py-2 text-sm text-areia/70">{emptyLabel}</p>;
  }

  return <>{items.map(renderItem)}</>;
}

function MenuItem({
  onClick,
  chevron,
  expanded,
  children,
}: {
  onClick: () => void;
  chevron?: boolean;
  expanded?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-branco/10"
    >
      <span
        className={
          chevron && expanded
            ? "text-branco transition-colors group-hover:text-terracota group-hover:underline group-hover:underline-offset-2"
            : "text-branco"
        }
      >
        {children}
      </span>
      {chevron && (
        <svg
          viewBox="0 0 20 20"
          className={`h-4 w-4 shrink-0 fill-none stroke-current text-areia/70 transition-transform ${
            expanded ? "rotate-90" : ""
          }`}
          strokeWidth={2}
        >
          <path
            d="M8 4l6 6-6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
