import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

interface RequestBody {
  affiliate_program?: string;
  attraction_id?: string | null;
  context?: string | null;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const body = (await request.json().catch(() => null)) as RequestBody | null;
  if (!body?.affiliate_program) {
    return NextResponse.json(
      { error: "affiliate_program é obrigatório." },
      { status: 400 },
    );
  }

  const { error } = await supabase.from("affiliate_clicks").insert({
    user_id: user?.id ?? null,
    affiliate_program: body.affiliate_program,
    attraction_id: body.attraction_id ?? null,
    context: body.context ?? null,
  });

  if (error) {
    return NextResponse.json(
      { error: "Não foi possível registrar o clique." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
