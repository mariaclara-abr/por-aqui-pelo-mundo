import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import PerfilClient from "@/components/perfil/PerfilClient";

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/entrar");
  }

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-3xl text-tinta sm:text-4xl">
          Meu Perfil
        </h1>
        <PerfilClient />
      </div>
    </main>
  );
}
