import { NextResponse } from "next/server";
import { searchDestinations } from "@/lib/queries";
import { createClient } from "@/lib/supabase-server";

// Países "em breve" (status draft) só aparecem na busca para a autora, que
// assim consegue conferir o conteúdo antes de publicar (mesma regra da
// página de país).
async function checkIsAuthor(): Promise<boolean> {
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  if (query.length > 100) {
    return NextResponse.json({ error: "Busca muito longa." }, { status: 400 });
  }

  try {
    const isAuthor = await checkIsAuthor();
    const results = await searchDestinations(query, isAuthor);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível realizar a busca." },
      { status: 500 },
    );
  }
}
