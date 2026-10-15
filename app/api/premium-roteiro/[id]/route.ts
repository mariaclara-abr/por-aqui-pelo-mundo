import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

// Gerando há mais que isso é considerado travado (função encerrada pela plataforma).
const TRAVADO_MS = 12 * 60 * 1000;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  // RLS: só enxerga os próprios roteiros.
  const { data: linha } = await supabase
    .from("premium_roteiros")
    .select("id, status, etapa, entrada, perguntas, erro, ajustes_incluidos, ajustes_usados, ajustes_extras, updated_at")
    .eq("id", id)
    .maybeSingle();
  if (!linha) return NextResponse.json({ error: "Roteiro não encontrado." }, { status: 404 });

  let { status, erro } = linha;
  if (status === "gerando" && Date.now() - new Date(linha.updated_at).getTime() > TRAVADO_MS) {
    status = "erro";
    erro = "A geração demorou mais que o esperado. Tente gerar de novo.";
    await createAdminClient().from("premium_roteiros").update({ status, erro }).eq("id", id);
  }

  return NextResponse.json({
    id: linha.id,
    status,
    etapa: linha.etapa,
    // Há quanto tempo a fase atual começou (calculado aqui, sem depender do relógio da pessoa).
    etapaHaMs: Math.max(0, Date.now() - new Date(linha.updated_at).getTime()),
    destino: (linha.entrada as { destino?: unknown } | null)?.destino ?? null,
    perguntas: linha.perguntas,
    erro,
    ajustesRestantes: linha.ajustes_incluidos + linha.ajustes_extras - linha.ajustes_usados,
  });
}
