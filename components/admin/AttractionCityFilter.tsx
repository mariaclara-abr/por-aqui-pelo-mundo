"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Database } from "@/types/database";

type City = Database["public"]["Tables"]["cities"]["Row"] & {
  countries: Database["public"]["Tables"]["countries"]["Row"];
};

export default function AttractionCityFilter({ cities }: { cities: City[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showCities, setShowCities] = useState(false);

  const selectedCities =
    searchParams.get("cidades")?.split(",").filter(Boolean) ?? [];

  function navigate(params: URLSearchParams) {
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function toggleCity(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    const next = selectedCities.includes(id)
      ? selectedCities.filter((cityId) => cityId !== id)
      : [...selectedCities, id];

    if (next.length > 0) {
      params.set("cidades", next.join(","));
    } else {
      params.delete("cidades");
    }
    navigate(params);
  }

  function clearCities() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("cidades");
    navigate(params);
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowCities((prev) => !prev)}
          aria-pressed={showCities}
          aria-expanded={showCities}
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            showCities || selectedCities.length > 0
              ? "border-terracota bg-terracota text-white"
              : "border-terracota/30 text-terracota hover:border-terracota"
          }`}
        >
          Filtrar
          {selectedCities.length > 0 ? ` (${selectedCities.length})` : ""}
        </button>
      </div>

      {showCities && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={clearCities}
            aria-pressed={selectedCities.length === 0}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              selectedCities.length === 0
                ? "border-terracota bg-terracota text-white"
                : "border-terracota/30 text-terracota hover:border-terracota"
            }`}
          >
            Todas
          </button>
          {cities.map((city) => {
            const active = selectedCities.includes(city.id);
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => toggleCity(city.id)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-terracota bg-terracota text-white"
                    : "border-terracota/30 text-terracota hover:border-terracota"
                }`}
              >
                {city.name}, {city.countries.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
