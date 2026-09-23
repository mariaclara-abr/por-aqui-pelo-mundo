"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { getOrCreateVisitorId } from "@/lib/visitor-id";
import { createClient } from "@/lib/supabase-browser";
import { useAuth } from "@/lib/auth";
import { imagePositionStyle, parseImagePosition } from "@/lib/image-position";
import type { Database } from "@/types/database";

type Attraction = Database["public"]["Tables"]["attractions"]["Row"] & {
  attraction_photos: Database["public"]["Tables"]["attraction_photos"]["Row"][];
};

function hasRegisteredInterest(attractionId: string): boolean {
  try {
    const raw = localStorage.getItem("paam_interested_attractions");
    const ids: string[] = raw ? JSON.parse(raw) : [];
    return ids.includes(attractionId);
  } catch {
    return false;
  }
}

function rememberInterest(attractionId: string) {
  try {
    const raw = localStorage.getItem("paam_interested_attractions");
    const ids: string[] = raw ? JSON.parse(raw) : [];
    if (!ids.includes(attractionId)) {
      localStorage.setItem(
        "paam_interested_attractions",
        JSON.stringify([...ids, attractionId]),
      );
    }
  } catch {
    // localStorage indisponível (ex: modo privado): a página ainda funciona,
    // só perde a lembrança entre sessões.
  }
}

export default function ComingSoonAttractionCard({
  attraction,
  countrySlug,
  citySlug,
}: {
  attraction: Attraction;
  countrySlug: string;
  citySlug: string;
}) {
  const { isAuthor } = useAuth();
  const [interested, setInterested] = useState(false);
  const [sending, setSending] = useState(false);

  // Checado só depois de montar (não no primeiro render) pra não divergir do
  // HTML gerado no servidor, que não tem acesso ao localStorage do visitante.
  useEffect(() => {
    if (hasRegisteredInterest(attraction.id)) setInterested(true);
  }, [attraction.id]);

  async function handleInterest(event: MouseEvent) {
    // Impede que o clique no botão dispare a navegação do card, que vira um
    // link para a autora conferir a prévia da atração.
    event.preventDefault();
    event.stopPropagation();
    if (interested || sending) return;
    setSending(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await fetch("/api/attraction-interest", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        attraction_id: attraction.id,
        visitor_id: user ? undefined : getOrCreateVisitorId(),
      }),
    }).catch(() => {
      // Falhou silenciosamente: melhor deixar a pessoa tentar de novo do que
      // travar a interação com um erro.
    });

    rememberInterest(attraction.id);
    setInterested(true);
    setSending(false);
  }

  const coverPhoto = [...attraction.attraction_photos].sort(
    (a, b) => a.order - b.order,
  )[0];

  const content = (
    <>
      {coverPhoto ? (
        <Image
          src={coverPhoto.url}
          alt={attraction.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover grayscale transition-transform duration-300 group-hover:scale-105"
          style={imagePositionStyle(parseImagePosition(coverPhoto.position))}
        />
      ) : (
        <div className="h-full w-full bg-areia" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <span className="absolute left-3 top-3 rounded-full bg-terracota px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white">
        Em breve
      </span>

      <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
        <h2 className="truncate font-serif text-lg text-white">
          {attraction.name}
        </h2>

        <button
          type="button"
          onClick={handleInterest}
          disabled={sending || interested}
          className="shrink-0 text-xs font-medium text-white underline-offset-2 transition-opacity duration-200 hover:underline sm:opacity-0 sm:group-hover:opacity-100"
        >
          {interested ? "Interesse registrado ✓" : "Tenho interesse"}
        </button>
      </div>
    </>
  );

  const className =
    "group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-branco shadow-sm";

  // Só a autora pode entrar na página da atração em breve, para conferir a
  // prévia de como ela vai ficar quando publicada.
  if (isAuthor) {
    return (
      <Link
        href={`/${countrySlug}/${citySlug}/${attraction.slug}`}
        className={className}
      >
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
