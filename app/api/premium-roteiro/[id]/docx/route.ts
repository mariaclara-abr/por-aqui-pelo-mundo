import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { montarDocx } from "@/lib/premium-roteiro/docx";
import { carregarAquarelas } from "@/lib/premium-roteiro/aquarelas";
import type { Roteiro } from "@/lib/premium-roteiro/tipos";
import type { EntradaPremium } from "@/lib/premium-roteiro/gerar";

export const maxDuration = 60;

const MIME_DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  // RLS: só baixa os próprios roteiros.
  const { data: linha } = await supabase
    .from("premium_roteiros")
    .select("status, conteudo, entrada")
    .eq("id", id)
    .maybeSingle();
  if (!linha) return NextResponse.json({ error: "Roteiro não encontrado." }, { status: 404 });
  if (linha.status !== "pronto" || !linha.conteudo) {
    return NextResponse.json({ error: "O roteiro ainda não está pronto." }, { status: 409 });
  }

  const roteiro = linha.conteudo as unknown as Roteiro;
  const entrada = linha.entrada as unknown as EntradaPremium;
  const aquarelas = await carregarAquarelas(new URL(request.url).origin, entrada.citySlugs);
  const buffer = await montarDocx(roteiro, aquarelas);

  const nome =
    "Roteiro_" +
    roteiro.capa.cidades.join("_").normalize("NFD").replace(/[^\w]+/g, "").slice(0, 60) +
    ".docx";
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": MIME_DOCX,
      "Content-Disposition": `attachment; filename="${nome}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
