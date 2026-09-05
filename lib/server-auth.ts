import { createClient } from "@/lib/supabase-server";

// Conteúdo com status "draft" ("em breve") fica visível só para a autora,
// que pode assim conferir a prévia da página antes de publicar.
export async function checkIsAuthor(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  return profile?.role === "author";
}
