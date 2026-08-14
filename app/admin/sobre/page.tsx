import { getAboutPageContent, getAboutVisitedCountries } from "@/lib/queries";
import AboutPageForm from "@/components/admin/AboutPageForm";
import AboutVisitedCountriesForm from "@/components/admin/AboutVisitedCountriesForm";

export default async function AdminSobrePage() {
  const [about, visitedCountries] = await Promise.all([
    getAboutPageContent(),
    getAboutVisitedCountries(),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl text-tinta">Sobre a autora</h1>
      <p className="mt-1 text-sm text-oliva">
        Edite o texto e as fotos da página pública &ldquo;Sobre a
        autora&rdquo;.
      </p>
      <div className="mt-6">
        <AboutPageForm about={about} />
      </div>

      <h2 className="mt-10 font-serif text-xl text-tinta">
        Destinos já visitados
      </h2>
      <p className="mt-1 text-sm text-oliva">
        Lista de países exibida no fim da página pública.
      </p>
      <div className="mt-6">
        <AboutVisitedCountriesForm initialCountries={visitedCountries} />
      </div>
    </div>
  );
}
