import CountryForm from "@/components/admin/CountryForm";

export default function NovoPaisPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-tinta">Novo país</h1>
      <div className="mt-6">
        <CountryForm />
      </div>
    </div>
  );
}
