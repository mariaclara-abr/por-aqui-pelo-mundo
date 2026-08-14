"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import {
  getUserItineraries,
  type ItinerarySummary,
} from "@/lib/itinerary-queries";
import {
  getVisitedCountries,
  type VisitedCountry,
} from "@/lib/profile-queries";
import ProfileForm from "@/components/perfil/ProfileForm";
import PreferencesForm from "@/components/perfil/PreferencesForm";
import VisitedCountriesForm from "@/components/perfil/VisitedCountriesForm";
import ItineraryHistory from "@/components/perfil/ItineraryHistory";
import SignOutButton from "@/components/perfil/SignOutButton";

export default function PerfilClient() {
  const { user, profile, loading } = useAuth();
  const [itineraries, setItineraries] = useState<ItinerarySummary[] | null>(
    null,
  );
  const [visitedCountries, setVisitedCountries] = useState<
    VisitedCountry[] | null
  >(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    getUserItineraries(user.id)
      .then((data) => {
        if (!cancelled) setItineraries(data);
      })
      .catch((error) => {
        console.error("Não foi possível carregar os roteiros:", error);
      });

    getVisitedCountries(user.id)
      .then((data) => {
        if (!cancelled) setVisitedCountries(data);
      })
      .catch((error) => {
        console.error("Não foi possível carregar os países visitados:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading || !profile || !user) {
    return <p className="mt-8 text-oliva">Carregando perfil...</p>;
  }

  return (
    <div className="mt-8 flex flex-col gap-12">
      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-xl text-tinta">Dados do perfil</h2>
          <Link
            href={`/perfil/${profile.username}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-terracota px-3 py-1 text-xs font-medium text-terracota transition-colors hover:bg-terracota/10"
          >
            <svg
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5 fill-none stroke-current"
              strokeWidth={1.6}
            >
              <path
                d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="10" r="2.3" />
            </svg>
            Visualizar meu perfil público
          </Link>
        </div>
        <div className="mt-4 max-w-xl">
          <ProfileForm profile={profile} />
        </div>
      </section>

      <section className="border-t border-tinta/10 pt-8">
        <h2 className="font-serif text-xl text-tinta">
          Preferências de viagem
        </h2>
        <div className="mt-4 max-w-xl">
          <PreferencesForm
            userId={user.id}
            initialPreferences={profile.preferences}
          />
        </div>
      </section>

      <section className="border-t border-tinta/10 pt-8">
        <h2 className="font-serif text-xl text-tinta">Países visitados</h2>
        <div className="mt-4 max-w-xl">
          {visitedCountries === null ? (
            <p className="text-oliva">Carregando países...</p>
          ) : (
            <VisitedCountriesForm
              userId={user.id}
              initialVisited={visitedCountries}
            />
          )}
        </div>
      </section>

      <section className="border-t border-tinta/10 pt-8">
        <h2 className="font-serif text-xl text-tinta">Meus roteiros</h2>
        <div className="mt-4">
          {itineraries === null ? (
            <p className="text-oliva">Carregando roteiros...</p>
          ) : (
            <ItineraryHistory userId={user.id} initialItineraries={itineraries} />
          )}
        </div>
      </section>

      <section className="border-t border-tinta/10 pt-8">
        <SignOutButton />
      </section>
    </div>
  );
}
