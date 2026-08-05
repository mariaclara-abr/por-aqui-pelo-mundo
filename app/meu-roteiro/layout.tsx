import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildOpenGraph } from "@/lib/metadata";

// app/meu-roteiro/page.tsx é "use client" (metadata só é suportada em
// Server Components), então a metadata da rota vive aqui, num layout que
// só repassa os filhos — nenhuma UI nova.

const TITLE = "Meu roteiro";
const DESCRIPTION =
  "Organize sua viagem: adicione atrações, veja o mapa do roteiro, calcule distâncias entre paradas e exporte tudo para o Google Maps.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false },
  alternates: { canonical: "/meu-roteiro" },
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION }),
};

export default function MeuRoteiroLayout({ children }: { children: ReactNode }) {
  return children;
}
