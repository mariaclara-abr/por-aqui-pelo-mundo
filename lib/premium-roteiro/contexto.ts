// Contexto que a IA recebe no roteiro Premium: catálogo real das cidades, dicas do
// Caderno de Bordo, respostas da autora e parceiros afiliados. É a única fonte
// de links e dados do catálogo: o código só deixa passar link que está aqui.

import { createAdminClient } from "@/lib/supabase-admin";
import { SITE_URL } from "@/lib/metadata";
import { AFFILIATE_PROGRAMS } from "@/lib/affiliates";

const EUROPA = new Set([
  "alemanha", "belgica", "espanha", "franca", "grecia", "holanda", "inglaterra",
  "italia", "monaco", "portugal", "suica",
]);

const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
const clip = (s: string | null | undefined, n: number) =>
  s ? s.replace(/\s+/g, " ").trim().slice(0, n) : "";
const lista = <T,>(v: T | T[] | null | undefined): T[] =>
  v == null ? [] : Array.isArray(v) ? v : [v];
const cats = (c: unknown) => (Array.isArray(c) ? c.join(", ") : String(c ?? ""));

export interface CidadeContexto {
  slug: string;
  nome: string;
  paisSlug: string;
  paisNome: string;
}

export interface Contexto {
  texto: string;
  urlsPermitidas: Set<string>;
  cidades: CidadeContexto[];
  // Atrações por cidade (nome e nota), para a etapa de pesquisa saber o que vale checar.
  nomesPorCidade: Record<string, string[]>;
}

// "40% de desconto com o cupom Poraquipelomundo" -> { percentual: 40, cupom: "Poraquipelomundo" }
function parseBeneficio(benefit?: string) {
  const m = benefit?.match(/(\d+)% de desconto com o cupom (\S+)/);
  return m ? { percentual: Number(m[1]), cupom: m[2] } : null;
}

export async function montarContexto(citySlugs: string[]): Promise<Contexto> {
  const admin = createAdminClient();
  const urls = new Set<string>();

  const { data: cidadesRows, error: cidadesErro } = await admin
    .from("cities")
    .select("id, slug, name, countries(slug, name)")
    .in("slug", citySlugs);
  if (cidadesErro) throw cidadesErro;

  const cidades: (CidadeContexto & { id: string })[] = citySlugs.flatMap((slug) => {
    const c = cidadesRows?.find((row) => row.slug === slug);
    if (!c) return [];
    const pais = Array.isArray(c.countries) ? c.countries[0] : c.countries;
    return [{ id: c.id, slug: c.slug, nome: c.name, paisSlug: pais?.slug ?? "", paisNome: pais?.name ?? "" }];
  });
  if (cidades.length === 0) throw new Error("Nenhuma cidade válida para o roteiro.");

  let texto = "# CONTEXTO DO CATÁLOGO (dados reais do banco). Use somente isto como fonte do catálogo.\n\n";
  const nomesPorCidade: Record<string, string[]> = {};

  for (const cidade of cidades) {
    const { data, error } = await admin
      .from("attractions")
      .select("name, slug, categories, curation_rating, average_visit_time, best_time_of_day, description, important_tips")
      .eq("city_id", cidade.id)
      .order("curation_rating", { ascending: false, nullsFirst: false })
      .order("name");
    if (error) throw error;
    texto += `## Cidade: ${cidade.nome}, ${cidade.paisNome} (${data.length} itens)\n`;
    nomesPorCidade[cidade.nome] = data.map((a) => a.name);
    for (const a of data) {
      const url = `${SITE_URL}/${cidade.paisSlug}/${cidade.slug}/${a.slug}`;
      urls.add(url);
      texto +=
        `- ${a.name} | url: ${url} | categorias: ${cats(a.categories)} | nota: ${a.curation_rating ?? "-"}` +
        ` | tempo: ${a.average_visit_time ?? "-"} | melhor horário: ${a.best_time_of_day ?? "-"}\n` +
        `  descrição: ${clip(a.description, 420)}\n` +
        (a.important_tips ? `  dicas: ${clip(a.important_tips, 300)}\n` : "");
    }
    texto += "\n";
  }

  // Dicas do Caderno de Bordo (Premium incluídas: quem gera é Premium).
  const { data: tips } = await admin.from("travel_tips").select("category, title, content").order("order");
  const nomes = cidades.flatMap((c) => [norm(c.nome), norm(c.paisNome)]).filter(Boolean);
  const europa = cidades.some((c) => EUROPA.has(c.paisSlug));
  const relevantes = (tips ?? []).filter((t) => {
    const cat = norm(t.category);
    return cat === "planejamento de viagem" || (europa && cat === "europa") || nomes.some((n) => cat.includes(n));
  });
  texto += `## DICAS DO CADERNO DE BORDO (${relevantes.length})\n`;
  for (const t of relevantes) {
    texto += `### [${t.category}] ${t.title}\n${clip(t.content, 1800)}\n`;
  }

  // Respostas da autora às perguntas dos leitores (cidade e país).
  texto += "\n## RESPOSTAS DA AUTORA ÀS PERGUNTAS DOS LEITORES (fonte de dicas por cidade/país)\n";
  const { data: cq } = await admin
    .from("city_questions")
    .select("question, cities(name), city_answers(answer)")
    .in("city_id", cidades.map((c) => c.id));
  for (const q of cq ?? []) {
    const cidade = Array.isArray(q.cities) ? q.cities[0] : q.cities;
    for (const a of lista(q.city_answers)) {
      texto += `- [${cidade?.name ?? ""}] P: ${clip(q.question, 300)} R: ${clip(a.answer, 900)}\n`;
    }
  }
  const paisSlugs = [...new Set(cidades.map((c) => c.paisSlug))];
  const { data: paises } = await admin.from("countries").select("id").in("slug", paisSlugs);
  const { data: kq } = await admin
    .from("country_questions")
    .select("question, countries(name), country_answers(answer)")
    .in("country_id", (paises ?? []).map((p) => p.id));
  for (const q of kq ?? []) {
    const pais = Array.isArray(q.countries) ? q.countries[0] : q.countries;
    for (const a of lista(q.country_answers)) {
      texto += `- [${pais?.name ?? ""}] P: ${clip(q.question, 300)} R: ${clip(a.answer, 900)}\n`;
    }
  }

  // Parceiros afiliados configurados (links e cupons exatos, nunca inventados).
  texto += "\n## PARCEIROS (afiliados cadastrados; links e cupons exatos)\n";
  for (const programa of AFFILIATE_PROGRAMS) {
    if (!programa.isConfigured || !programa.buildUrl) continue;
    if (programa.id === "mercadolivre" || programa.id === "natura") continue;
    const beneficio = parseBeneficio(programa.benefit);
    const dados = beneficio ? ` | percentual: ${beneficio.percentual}% | cupom: ${beneficio.cupom}` : "";
    const locais = programa.id === "booking" || programa.id === "getyourguide" ? cidades : [null];
    for (const cidade of locais) {
      const url = programa.buildUrl({
        cityName: cidade?.nome ?? "",
        countryName: cidade?.paisNome,
      });
      urls.add(url);
      texto += `- ${programa.label} | ${programa.checklistLabel}${cidade ? ` em ${cidade.nome}` : ""} | link: ${url}${dados}\n`;
    }
  }

  // Links que já aparecem no próprio contexto (descrições, dicas e respostas da autora)
  // também são permitidos, sem a pontuação do fim da frase.
  for (const u of texto.match(/https?:\/\/[^\s)\]|]+/g) ?? []) urls.add(u.replace(/[.,;:]+$/, ""));

  return { texto, urlsPermitidas: urls, cidades, nomesPorCidade };
}
