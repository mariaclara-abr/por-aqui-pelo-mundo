import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import AdminNav from "@/components/admin/AdminNav";

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

  return (
    <div className="flex flex-1 flex-col sm:flex-row">
      <AdminNav />
      <main className="flex-1 px-4 py-8 sm:px-8">{children}</main>
    </div>
  );
}
