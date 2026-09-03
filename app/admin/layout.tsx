import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getPendingQuestionsCount } from "@/lib/questions";
import AdminNav from "@/components/admin/AdminNav";

// Painel interno, protegido por login + role "author" abaixo — nunca deve
// ser indexado. Um título só para todo o painel é suficiente aqui: nenhuma
// dessas 11 páginas é pública, então não há ganho de SEO em título único
// por página (diferente das rotas de conteúdo do site).
export const metadata: Metadata = {
  title: "Painel administrativo",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "author") {
    redirect("/");
  }

  const pendingQuestionsCount = await getPendingQuestionsCount();

  return (
    <div className="flex flex-1 flex-col sm:flex-row">
      <AdminNav pendingQuestionsCount={pendingQuestionsCount} />
      <main className="flex-1 px-4 py-8 sm:px-8">{children}</main>
    </div>
  );
}
