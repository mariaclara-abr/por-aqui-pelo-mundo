import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createPackCheckoutUrl, isPackId } from "@/lib/checkout";
import { safePath } from "@/lib/safe-path";

interface RequestBody {
  plan?: string;
  return_to?: string;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as RequestBody | null;
  if (!body?.plan || !isPackId(body.plan)) {
    return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
  }

  const url = await createPackCheckoutUrl(
    { id: user.id, email: user.email },
    body.plan,
    new URL(request.url).origin,
    safePath(body.return_to, "/meu-roteiro/organizar-com-ia"),
  );

  return NextResponse.json({ url });
}
