"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  getUserItineraries,
  type ItinerarySummary,
} from "@/lib/itinerary-queries";
import ProfileForm from "@/components/perfil/ProfileForm";
import PreferencesForm from "@/components/perfil/PreferencesForm";
import ItineraryHistory from "@/components/perfil/ItineraryHistory";
import SignOutButton from "@/components/perfil/SignOutButton";

export default function PerfilClient() {
  const { user, profile, loading } = useAuth();
  const [itineraries, setItineraries] = useState<ItinerarySummary[] | null>(
    null,
  );

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
        <h2 className="font-serif text-xl text-tinta">Dados do perfil</h2>
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
