import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import PerfilClient from "@/components/perfil/PerfilClient";
import { buildOpenGraph } from "@/lib/metadata";

const TITLE = "Meu perfil";
const DESCRIPTION = "Gerencie seus dados de conta e preferências de viagem.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false },
  alternates: { canonical: "/perfil" },
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION }),
};

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/entrar");
  }

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-3xl text-tinta sm:text-4xl">
          Meu Perfil
        </h1>
        <PerfilClient />
      </div>
    </main>
  );
}
