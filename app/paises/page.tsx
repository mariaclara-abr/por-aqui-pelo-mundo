import type { Metadata } from "next";
import { getCountries } from "@/lib/queries";
import DestinationGrid from "@/components/DestinationGrid";
import { buildOpenGraph } from "@/lib/metadata";

export const revalidate = 60;

const TITLE = "Explorar países";
const DESCRIPTION =
  "Todos os países com curadoria de Rejane Abrantes: cada lugar foi visitado e avaliado pessoalmente. Escolha um país para ver cidades, atrações e roteiros.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/paises" },
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION }),
};

export default async function PaisesPage() {
  const countries = await getCountries();

  return (
    <main className="flex flex-1 flex-col">
      <DestinationGrid
        countries={countries.filter((country) => country.status === "published")}
        comingSoonCountries={countries.filter((country) => country.status === "draft")}
      />
    </main>
  );
}
