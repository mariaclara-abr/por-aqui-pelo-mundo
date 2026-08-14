import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPublicItineraries,
  getPublicProfileByUsername,
  getVisitedCountries,
} from "@/lib/profile-queries";
import PublicItineraryList from "@/components/perfil/PublicItineraryList";
import { buildOpenGraph } from "@/lib/metadata";

function formatMemberSince(iso: string) {
  const formatted = new Date(iso).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  return `Está no Por Aqui Pelo Mundo desde ${formatted}`;
}

export async function generateMetadata(
  props: PageProps<"/perfil/[username]">,
): Promise<Metadata> {
  const { username } = await props.params;
  const profile = await getPublicProfileByUsername(username).catch(() => null);
  if (!profile) {
    notFound();
  }

  const title = `${profile.displayName} (@${profile.username})`;
  const description = `Perfil de ${profile.displayName} no Por Aqui Pelo Mundo.`;

  return {
    title,
    description,
    robots: { index: false },
    alternates: { canonical: `/perfil/${profile.username}` },
    openGraph: buildOpenGraph({ title, description }),
  };
}

export default async function PublicProfilePage(
  props: PageProps<"/perfil/[username]">,
) {
  const { username } = await props.params;
  const profile = await getPublicProfileByUsername(username).catch(() => null);
  if (!profile) {
    notFound();
  }

  const [itineraries, visitedCountries] = await Promise.all([
    getPublicItineraries(profile.id).catch(() => []),
    getVisitedCountries(profile.id).catch(() => []),
  ]);

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-oliva text-2xl font-medium text-white">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                {profile.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 className="font-serif text-3xl text-tinta sm:text-4xl">
              {profile.displayName}
            </h1>
            <p className="text-oliva">@{profile.username}</p>
            <p className="mt-1 text-sm text-oliva">
              {formatMemberSince(profile.memberSince)}
            </p>
          </div>
        </div>

        {visitedCountries.length > 0 && (
          <section className="mt-10">
            <h2 className="font-serif text-xl text-tinta">
              Países visitados
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {visitedCountries.map((country) => (
                <span
                  key={country.id}
                  className="rounded-full bg-oliva/10 px-3 py-1 text-xs text-oliva"
                >
                  {country.name}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10 border-t border-tinta/10 pt-8">
          <h2 className="font-serif text-xl text-tinta">Roteiros</h2>
          <div className="mt-4">
            <PublicItineraryList itineraries={itineraries} />
          </div>
        </section>
      </div>
    </main>
  );
}
