import { getAboutPageContent } from "@/lib/queries";
import AboutPageForm from "@/components/admin/AboutPageForm";

export default async function AdminSobrePage() {
  const about = await getAboutPageContent();

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
    </div>
  );
}
