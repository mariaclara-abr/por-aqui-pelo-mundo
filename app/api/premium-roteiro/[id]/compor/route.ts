import { NextResponse } from "next/server";
import { after } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { executarComposicao } from "@/lib/premium-roteiro/gerar";

// Etapa 2 da geração: chamada só pelo próprio servidor (etapa 1), com a chave de
// serviço. Cada etapa tem seus 300 s, o limite do plano gratuito da Vercel.
export const maxDuration = 300;

function autorizado(request: Request) {
  const esperado = Buffer.from(`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""}`);
  const recebido = Buffer.from(request.headers.get("authorization") ?? "");
  return esperado.length > 7 && recebido.length === esperado.length && timingSafeEqual(recebido, esperado);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!autorizado(request)) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  const { id } = await params;
  after(() => executarComposicao(id));
  return NextResponse.json({ ok: true }, { status: 202 });
}
