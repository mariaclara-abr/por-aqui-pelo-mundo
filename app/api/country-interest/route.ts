import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

interface RequestBody {
  country_id?: string;
  visitor_id?: string;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const body = (await request.json().catch(() => null)) as RequestBody | null;
  if (!body?.country_id) {
    return NextResponse.json(
      { error: "country_id é obrigatório." },
      { status: 400 },
    );
  }

  const { error } = await supabase.from("country_interest").insert({
    country_id: body.country_id,
    user_id: user?.id ?? null,
    visitor_id: user ? null : (body.visitor_id ?? null),
  });

  // 23505: essa pessoa já registrou interesse nesse país antes, o que é
  // esperado (ex: recarregou a página) e não é um erro para o cliente.
  if (error && error.code !== "23505") {
    return NextResponse.json(
      { error: "Não foi possível registrar seu interesse." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
