import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { hasUnlockedTipsAccess } from "@/lib/subscription";

// Texto completo de uma dica Premium: só para quem tem acesso liberado.
export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/travel-tips/[id]">,
) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !(await hasUnlockedTipsAccess(supabase, user.id))) {
    return NextResponse.json({ error: "Conteúdo exclusivo Premium." }, { status: 403 });
  }

  const { data } = await supabase.from("travel_tips").select("content").eq("id", id).maybeSingle();
  if (!data) return NextResponse.json({ error: "Dica não encontrada." }, { status: 404 });
  return NextResponse.json({ content: data.content });
}
