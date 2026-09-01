import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import TravelTipForm from "@/components/admin/TravelTipForm";

export default async function EditarDicaPage(
  props: PageProps<"/admin/dicas/[id]">,
) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data: tip } = await supabase
    .from("travel_tips")
    .select("*")
    .eq("id", id)
    .single();

  if (!tip) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-tinta">Editar dica</h1>
      <div className="mt-6">
        <TravelTipForm tip={tip} />
      </div>
    </div>
  );
}
