import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createPackCheckoutUrl, isPackId } from "@/lib/checkout";

// Destino do botão "Comprar" para quem ainda não está logado: manda para o
// login e, depois dele, volta aqui e segue direto para o Stripe.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const plan = searchParams.get("plano");
  if (!plan || !isPackId(plan)) return NextResponse.redirect(`${origin}/`);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    const next = encodeURIComponent(`/comprar?plano=${plan}`);
    return NextResponse.redirect(`${origin}/entrar?next=${next}`);
  }

  const url = await createPackCheckoutUrl(
    { id: user.id, email: user.email },
    plan,
    origin,
    "/meu-roteiro",
  );
  return NextResponse.redirect(url ?? `${origin}/meu-roteiro`);
}
