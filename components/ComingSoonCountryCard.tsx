"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase-browser";
import { getOrCreateVisitorId } from "@/lib/visitor-id";
import type { Database } from "@/types/database";

type Country = Database["public"]["Tables"]["countries"]["Row"];

function hasRegisteredInterest(countryId: string): boolean {
  try {
    const raw = localStorage.getItem("paam_interested_countries");
    const ids: string[] = raw ? JSON.parse(raw) : [];
    return ids.includes(countryId);
  } catch {
    return false;
  }
}

function rememberInterest(countryId: string) {
  try {
    const raw = localStorage.getItem("paam_interested_countries");
    const ids: string[] = raw ? JSON.parse(raw) : [];
    if (!ids.includes(countryId)) {
      localStorage.setItem(
        "paam_interested_countries",
        JSON.stringify([...ids, countryId]),
      );
    }
  } catch {
    // localStorage indisponível (ex: modo privado): a página ainda funciona,
    // só perde a lembrança entre sessões.
  }
}

export default function ComingSoonCountryCard({
  country,
}: {
  country: Country;
}) {
  const [interested, setInterested] = useState(false);
  const [sending, setSending] = useState(false);

  // Checado só depois de montar (não no primeiro render) pra não divergir do
  // HTML gerado no servidor, que não tem acesso ao localStorage do visitante.
  useEffect(() => {
    if (hasRegisteredInterest(country.id)) setInterested(true);
  }, [country.id]);

  async function handleInterest() {
    if (interested || sending) return;
    setSending(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await fetch("/api/country-interest", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        country_id: country.id,
        visitor_id: user ? undefined : getOrCreateVisitorId(),
      }),
    }).catch(() => {
      // Falhou silenciosamente: melhor deixar a pessoa tentar de novo do que
      // travar a interação com um erro.
    });

    rememberInterest(country.id);
    setInterested(true);
    setSending(false);
  }

  return (
    <div className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-branco shadow-sm">
      {country.cover_image_url ? (
        <Image
          src={country.cover_image_url}
          alt={country.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover grayscale transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="h-full w-full bg-areia" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <span className="absolute left-4 top-4 rounded-full bg-terracota px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white">
        Em breve
      </span>

      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
        <h2 className="font-serif text-xl text-white">{country.name}</h2>

        <button
          type="button"
          onClick={handleInterest}
          disabled={sending || interested}
          className="shrink-0 text-xs font-medium text-white underline-offset-2 transition-opacity duration-200 hover:underline sm:opacity-0 sm:group-hover:opacity-100"
        >
          {interested ? "Interesse registrado ✓" : "Tenho interesse"}
        </button>
      </div>
    </div>
  );
}
