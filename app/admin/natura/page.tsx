import { createClient } from "@/lib/supabase-server";
import NaturaForm from "@/components/admin/NaturaForm";

export default async function AdminNaturaPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("natura_settings").select("*").eq("id", 1).single();
  if (error) throw error;

  return (
    <div>
      <h1 className="font-serif text-2xl text-tinta">Natura</h1>
      <p className="mt-1 text-sm text-oliva">
        Cupom do mês e link da loja usados em todos os cards de parceria da Natura (qualquer
        card cujo link seja natura.com).
      </p>
      <div className="mt-6">
        <NaturaForm settings={data} />
      </div>
    </div>
  );
}
