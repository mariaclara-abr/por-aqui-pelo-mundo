"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { linkify } from "@/components/Linkify";

const PREVIEW_PARAGRAPHS = 2;

function Paragraph({ text }: { text: string }) {
  if (text.startsWith("## ")) {
    return <h3 className="font-serif text-xl text-tinta">{text.slice(3)}</h3>;
  }
  return <p className="whitespace-pre-line text-left">{linkify(text)}</p>;
}

// Cabeçalho em colagem: foto de destaque grande, capa menor por cima e um
// bloco de cor atrás (sem foto de destaque, a capa ocupa o lugar dela). O texto mostra os primeiros parágrafos; "Ler mais" abre
// o resto numa faixa de fundo claro logo abaixo.
export default function DestinationHeader({
  title,
  parent,
  coverImage,
  coverStyle,
  photo,
  description,
  children,
}: {
  title: string;
  parent: { href: string; label: string };
  coverImage: string;
  coverStyle?: CSSProperties;
  photo?: string | null;
  description: string | null;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  // Prévia: as primeiras linhas (há descrições com parágrafos separados por
  // linha em branco e outras só por quebra simples). O resto mantém os blocos.
  const text = (description ?? "").trim();
  const preview = text.split(/\n\s*/).slice(0, PREVIEW_PARAGRAPHS);
  let cut = 0;
  for (const line of preview) cut = text.indexOf(line, cut) + line.length;
  const rest = text
    .slice(cut)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <header>
      {children}
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
        <div className="relative mx-auto mb-[12%] aspect-[20/19] w-full max-w-md lg:max-w-xl">
          <div aria-hidden="true" className="absolute left-[18%] top-[10%] h-[42%] w-[26%] bg-terracota/80" />
          <div className="absolute right-0 top-0 aspect-[3/4] w-[62%] overflow-hidden">
            <Image
              src={photo ?? coverImage}
              alt={photo ? `Paisagem de ${title}` : title}
              fill
              priority
              sizes="(min-width: 1024px) 360px, 62vw"
              className="object-cover"
              style={photo ? undefined : coverStyle}
            />
          </div>
          {photo && (
            <div className="absolute bottom-0 left-0 aspect-[4/3] w-[55%] overflow-hidden">
              <Image
                src={coverImage}
                alt={title}
                fill
                priority
                sizes="(min-width: 1024px) 320px, 55vw"
                className="object-cover"
                style={coverStyle}
              />
            </div>
          )}
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="absolute left-[58%] top-[90.2%] w-[22%] text-oliva"
          >
            <path id="selo-circulo" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" fill="none" />
            <text className="fill-current font-serif uppercase italic" fontSize={title.length > 14 ? 7 : 9}>
              <textPath href="#selo-circulo" textLength="232" lengthAdjust="spacing">
                Por aqui pelo mundo · {title} ·
              </textPath>
            </text>
          </svg>
        </div>

        <div className="min-w-0">
          <Link
            href={parent.href}
            className="text-sm text-oliva transition-colors hover:text-terracota"
          >
            {parent.label}
          </Link>
          <h1 className="mt-3 font-serif text-5xl leading-none text-tinta sm:text-6xl">
            {title}
          </h1>
          {preview.length > 0 && (
            <div className="mt-6 max-w-xl space-y-4 text-sm leading-7 text-tinta/80 sm:text-base">
              {preview.map((p) => (
                <Paragraph key={p} text={p} />
              ))}
            </div>
          )}
          {rest.length > 0 && (
            <button
              type="button"
              aria-expanded={open}
              aria-controls="destino-texto"
              onClick={() => setOpen((v) => !v)}
              className="mt-6 text-sm text-tinta underline decoration-terracota decoration-1 underline-offset-[6px] transition-colors hover:text-terracota"
            >
              {open ? "Ler menos" : "Ler mais"}
            </button>
          )}
        </div>
      </div>

      {open && (
        <div
          id="destino-texto"
          className="relative left-1/2 right-1/2 -mx-[50vw] mt-16 w-screen bg-[#FAF6EF] px-4 py-10 sm:px-6 sm:py-14 lg:px-10"
        >
          <div className="mx-auto max-w-[1100px] space-y-4 text-sm leading-7 text-tinta/80 sm:text-base lg:columns-2 lg:gap-16 [&>*]:break-inside-avoid">
            {rest.map((p) => (
              <Paragraph key={p} text={p} />
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
