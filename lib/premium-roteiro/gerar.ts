// Geração do roteiro Premium em duas chamadas à IA:
//  1. pesquisa: busca na web só os fatos oficiais que o roteiro precisa (entrada no
//     país, ingressos, deslocamentos, clima, câmbio), devolvidos como texto com fonte;
//  2. composição: recebe o script oficial, o catálogo, as dicas, os parceiros e esses
//     fatos, e devolve o documento em JSON com formato garantido pela API.
// O código então valida (links só do contexto, sem travessões) e guarda o resultado.
// O Word é montado depois, em docx.ts.

import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import { createAdminClient } from "@/lib/supabase-admin";
import { buildPreferenceLines, type LodgingInput, type OrganizePreferencesInput } from "@/lib/ai";
import { SCRIPT_INTERNACIONAL_COMPLETO } from "@/lib/prompts/roteiro-internacional-completo";
import { montarContexto, type Contexto } from "@/lib/premium-roteiro/contexto";
import type { DestinoCena } from "@/lib/premium-roteiro/destino";
import { SCHEMA_RESPOSTA, type Roteiro, type RespostaIA } from "@/lib/premium-roteiro/tipos";

// Pesquisa e composição podem usar modelos diferentes (ex.: pesquisa em Haiku para
// baratear). Hoje os dois são Sonnet 5.5, o modelo testado.
const MODELO_PESQUISA = "claude-sonnet-5-5";
const MODELO_COMPOSICAO = "claude-sonnet-5-5";
const MAX_BUSCAS = 30;

// O que o servidor guarda de cada pedido (coluna `entrada`).
export interface EntradaPremium {
  citySlugs: string[];
  userDefinedOrder: boolean;
  numDays: number;
  startDate: string | null;
  preferences: OrganizePreferencesInput;
  lodging: LodgingInput;
  // Cena da tela de geração (globo e avião); não é usado pela IA.
  destino?: DestinoCena | null;
}

export interface Uso {
  entrada: number;
  saida: number;
  buscas: number;
}

// ---------- prompts ----------

const ADAPTACAO_PREMIUM = `

ADAPTAÇÃO PARA ESTA CHAMADA (prevalece sobre o script acima)
- A saída é SOMENTE o JSON do schema fornecido. O código monta o Word, então ignore as instruções de aparência (cores, fontes, tabelas em Word, sumário, rodapé, capa em uma página, título "PLANO B", símbolos de cabeçalho do Plano B, nome do arquivo, entrega e mensagens de chat). Aplique TODO o conteúdo do script: Regra Zero, tom impessoal, atrações e links do catálogo, hospedagem, ordem das cidades, metodologia, progressão de energia, Plano B em todos os dias, dicas, parceiros e a estrutura de seções.
- Regra Zero: se faltar informação ou houver inconsistência, devolva as perguntas em "perguntas" e deixe "roteiro" com strings vazias e arrays vazios. Sem perguntas, "perguntas" é uma lista vazia.
- Marcação nos textos: **negrito**, //itálico//, ~~destaque terracota~~ e [[texto|url]] para links. Emojis dos tipos de lugar (👨‍🍳 ☕ ⛰️ 🛍️ 🏖️ 🎟️ 🅿️) vão direto no texto. Nunca use travessão nem meia-risca.
- Links: use SOMENTE URLs que aparecem no contexto (catálogo e parceiros), exatamente como estão. Nunca invente URL. Fontes oficiais consultadas entram em "fontes" como texto, sem link.
- FATOS PESQUISADOS: use os valores de lá (preços, regras, horários, durações, câmbio) e cite a fonte em "fontes", com o mês e o ano da consulta. O que não estiver no contexto nem nos fatos fica "confirmar" ou "a cotar". Se os fatos divergirem de uma dica do Caderno de Bordo, prevalece o fato pesquisado.
- Onde cada coisa vai: capa.dados é a tabela da capa (Viajantes, Datas, Saída e volta, Ordem das cidades, Atração indispensável, Compromisso fixo, Perfil e ritmo, Orçamento, Deslocamento, Hospedagem e voos, Documentos); capa.cidades traz uma cidade por linha. visaoGeral.dias é a tabela dia a dia. voos, hospedagem e observacoes seguem a ordem do script (documentos e dicasGerais são marcadores "**Palavra-chave:** texto"). Cada cidade traz cabecalho, dadosChave, apresentacao, dicas (caixa "Dicas Por Aqui Pelo Mundo"), transporte, dias e ondeComer. Em cada dia: titulo "Dia N | dia da semana, data" (com "(manhã)" ou "(tarde)" se o dia é dividido), tema, itens (texto da linha e descrição breve só na primeira vez que a atração aparece; vazia nas repetições), avisos ("**DICA:** ..." ou "**IMPORTANTE:** ...") e planoB (só o conteúdo de cada situação, sem símbolo nem rótulo: o código os põe). A numeração dos capítulos também é do código.
- Tabela de Orçamento: inclua as linhas de seguro viagem e eSIM ou chip de celular (valor "a cotar") e use o formato padrão de parceiros do script na coluna de observação.
- Dias da semana: confira cada data. A data de hoje é informada no pedido.`;

const SISTEMA_PESQUISA = `Você pesquisa fatos oficiais e atuais de viagem para montar um roteiro. Use a ferramenta de busca na web (fontes oficiais primeiro: governos, sites das atrações, operadoras de transporte). Não escreva o roteiro. Entregue uma lista curta de FATOS, um por linha, no formato:
- assunto | valor ou regra | fonte (site) | mês/ano da consulta
Regras: só inclua o que encontrou em fonte confiável; se duas fontes divergirem, registre as duas e diga qual parece oficial; se não achar, escreva "não confirmado" para o assunto. Preços por faixa de idade quando existirem. Nunca invente. Sem travessões.`;

function listaPesquisa(ctx: Contexto) {
  const nomes = Object.entries(ctx.nomesPorCidade)
    .map(([cidade, lista]) => `${cidade}: ${lista.slice(0, 25).join("; ")}`)
    .join("\n");
  return `Pesquise, no mínimo:
1. Entrada em cada país (autorização de viagem como ETIAS e ETA: valor, onde solicitar, isenção por idade; validade mínima do passaporte).
2. Ingressos e regras das atrações abaixo que tenham ingresso, horário marcado ou reserva (valor por faixa de idade, horário de funcionamento, dias fechados, necessidade de reserva e prazo). Foque nas mais famosas de cada cidade.
3. Deslocamentos: duração e trajeto aeroporto → centro em cada cidade; duração dos voos entre as cidades do roteiro; se há voo direto São Paulo → destino.
4. Clima e luz no mês da viagem (temperatura média, pôr do sol aproximado) e fuso em relação a Brasília.
5. Câmbio atual das moedas locais para o real (cite a data), tipo de tomada, e se existe Tax Free hoje em cada país.
6. Restaurantes: só para cidades que não tenham restaurantes na lista, 3 a 4 opções confiáveis para o perfil do grupo.

Atrações do catálogo por cidade (para saber o que checar):
${nomes}`;
}

// ---------- entrada em texto ----------

function entradaEmTexto(e: EntradaPremium, ctx: Contexto) {
  const ordem = ctx.cidades.map((c) => `${c.nome} (${c.paisNome})`).join(" > ");
  const linhas = [
    `Destinos: ${ordem}.`,
    e.citySlugs.length > 1
      ? e.userDefinedOrder
        ? "Ordem das cidades definida pelo viajante (respeitar exatamente)."
        : "Ordem das cidades: o viajante NÃO definiu; a IA decide a melhor ordem e justifica."
      : null,
    `Duração: ${e.numDays} dia(s)${e.startDate ? `, começando em ${e.startDate}` : ""}.`,
    ...buildPreferenceLines(e.preferences),
    e.lodging.hasHotel === true
      ? `Hospedagem: já tem hotel: ${e.lodging.hotelDetails ?? "(sem nome informado)"}. O hotel é o ponto fixo de cada dia.`
      : e.lodging.hasHotel === false
        ? "Hospedagem: ainda NÃO tem hotel; indicar o bairro recomendado por cidade."
        : null,
  ];
  return linhas.filter(Boolean).join("\n");
}

// ---------- chamadas ----------

function cliente() {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY não configurada no servidor.");
  return new Anthropic();
}

async function pesquisar(e: EntradaPremium, ctx: Contexto): Promise<{ texto: string; uso: Uso }> {
  const client = cliente();
  const uso: Uso = { entrada: 0, saida: 0, buscas: 0 };
  const hoje = new Date().toISOString().slice(0, 10);
  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `Hoje é ${hoje}.\n\nViagem:\n${entradaEmTexto(e, ctx)}\n\n${listaPesquisa(ctx)}`,
    },
  ];
  let texto = "";
  // Cada pausa (pause_turn) continua a mesma pesquisa; 6 rodadas é folga de sobra.
  for (let rodada = 0; rodada < 6; rodada++) {
    const msg = await client.messages
      .stream({
        model: MODELO_PESQUISA,
        max_tokens: 16000,
        system: SISTEMA_PESQUISA,
        tools: [{ type: "web_search_20260209", name: "web_search", max_uses: MAX_BUSCAS }],
        output_config: { effort: "low" },
        messages,
      })
      .finalMessage();
    uso.entrada += msg.usage.input_tokens;
    uso.saida += msg.usage.output_tokens;
    uso.buscas += msg.usage.server_tool_use?.web_search_requests ?? 0;
    for (const bloco of msg.content) if (bloco.type === "text") texto += bloco.text + "\n";
    if (msg.stop_reason !== "pause_turn") break;
    messages.push({ role: "assistant", content: msg.content });
  }
  return { texto: texto.trim(), uso };
}

async function compor(
  e: EntradaPremium,
  ctx: Contexto,
  fatos: string,
): Promise<{ resposta: RespostaIA; uso: Uso }> {
  const client = cliente();
  const hoje = new Date().toISOString().slice(0, 10);
  const msg = await client.messages
    .stream({
      model: MODELO_COMPOSICAO,
      max_tokens: 48000,
      system: SCRIPT_INTERNACIONAL_COMPLETO + ADAPTACAO_PREMIUM,
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA_RESPOSTA } },
      messages: [
        {
          role: "user",
          content:
            `Hoje é ${hoje}.\n\n# RESPOSTAS DO QUESTIONÁRIO (usuário Premium)\n${entradaEmTexto(e, ctx)}\n\n` +
            `# FATOS PESQUISADOS (fontes oficiais; use e cite)\n${fatos || "(nenhum fato pesquisado)"}\n\n${ctx.texto}`,
        },
      ],
    })
    .finalMessage();
  if (msg.stop_reason === "max_tokens") throw new Error("O roteiro ficou longo demais para gerar de uma vez.");
  if (msg.stop_reason === "refusal") throw new Error("A IA não pôde gerar este roteiro.");
  const bloco = msg.content.find((b) => b.type === "text");
  if (!bloco || bloco.type !== "text") throw new Error("Resposta inesperada da IA.");
  return {
    resposta: JSON.parse(bloco.text) as RespostaIA,
    uso: { entrada: msg.usage.input_tokens, saida: msg.usage.output_tokens, buscas: 0 },
  };
}

// ---------- validação ----------

// Aplica `fn` a toda string do roteiro, em qualquer profundidade.
function mapStrings<T>(valor: T, fn: (s: string) => string): T {
  if (typeof valor === "string") return fn(valor) as T;
  if (Array.isArray(valor)) return valor.map((v) => mapStrings(v, fn)) as T;
  if (valor && typeof valor === "object") {
    return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, mapStrings(v, fn)])) as T;
  }
  return valor;
}

// Rede de segurança: links só do contexto (nunca confia em URL da IA) e sem travessões.
export function validarRoteiro(roteiro: Roteiro, permitidas: Set<string>) {
  let removidos = 0;
  const limpo = mapStrings(roteiro, (s) =>
    s
      .replace(/\[\[([^|\]]*)\|([^\]]*)\]\]/g, (_m, nome: string, url: string) => {
        if (permitidas.has(url)) return `[[${nome}|${url}]]`;
        removidos += 1;
        return nome;
      })
      // \u2014 e \u2013 são o travessão e a meia-risca (escritos em código: o projeto não os usa em texto).
      .replace(/\s[\u2014\u2013]\s/g, ", ")
      .replace(/[\u2014\u2013]/g, "-"),
  );
  if (limpo.cidades.length === 0 || limpo.cidades.every((c) => c.dias.length === 0)) {
    throw new Error("A IA não devolveu nenhum dia de roteiro.");
  }
  return { roteiro: limpo, linksRemovidos: removidos };
}

// ---------- execução em segundo plano, em duas etapas ----------

// Cada etapa roda numa execução própria da função (limite de 300 s no plano gratuito
// da Vercel): a 1 prepara e pesquisa, e chama a 2, que compõe e finaliza. O estado
// (etapa, fatos pesquisados) fica no banco, e a tela mostra o progresso por ele.

// Para testar sem gastar API: aponta para um JSON no formato RespostaIA. Só fora de produção.
function fixtureDeTeste(): RespostaIA | null {
  const caminho = process.env.PREMIUM_FIXTURE;
  if (!caminho || process.env.NODE_ENV === "production") return null;
  return JSON.parse(readFileSync(caminho, "utf8")) as RespostaIA;
}

function salvador(id: string) {
  const admin = createAdminClient();
  return (campos: Record<string, unknown>) =>
    admin
      .from("premium_roteiros")
      .update({ ...campos, updated_at: new Date().toISOString() })
      .eq("id", id);
}

async function carregar(id: string) {
  const { data, error } = await createAdminClient()
    .from("premium_roteiros")
    .select("entrada, pesquisa, uso")
    .eq("id", id)
    .single();
  if (error) throw error;
  return { entrada: data.entrada as unknown as EntradaPremium, pesquisa: data.pesquisa, uso: data.uso as unknown as Uso };
}

async function concluir(id: string, resposta: RespostaIA, ctx: Contexto, uso: Uso) {
  const salvar = salvador(id);
  if (resposta.perguntas.length > 0) {
    await salvar({ status: "perguntas", etapa: "concluido", perguntas: resposta.perguntas.slice(0, 8), uso });
    return;
  }
  await salvar({ etapa: "finalizando" });
  const { roteiro, linksRemovidos } = validarRoteiro(resposta.roteiro, ctx.urlsPermitidas);
  await salvar({ status: "pronto", etapa: "concluido", conteudo: roteiro, uso: { ...uso, linksRemovidos } });
}

// Etapa 1: catálogo e dicas, pesquisa na web, e chama a etapa 2.
export async function executarPesquisa(id: string, origem: string): Promise<void> {
  const salvar = salvador(id);
  try {
    const { entrada } = await carregar(id);
    const ctx = await montarContexto(entrada.citySlugs);

    const fixture = fixtureDeTeste();
    if (fixture) {
      await concluir(id, fixture, ctx, { entrada: 0, saida: 0, buscas: 0 });
      return;
    }

    await salvar({ etapa: "pesquisando" });
    const pesquisa = await pesquisar(entrada, ctx);
    await salvar({ etapa: "compondo", pesquisa: pesquisa.texto, uso: pesquisa.uso });

    // Segunda execução da função, com os seus próprios 300 s. Autenticada com a chave
    // de serviço, que só o servidor conhece.
    const resposta = await fetch(`${origem}/api/premium-roteiro/${id}/compor`, {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` },
    });
    if (!resposta.ok) throw new Error("Não foi possível iniciar a segunda etapa do roteiro.");
  } catch (erro) {
    await salvar({ status: "erro", erro: (erro instanceof Error ? erro.message : "Erro ao gerar o roteiro.").slice(0, 500) });
  }
}

// Etapa 2: composição do documento com os fatos pesquisados.
export async function executarComposicao(id: string): Promise<void> {
  const salvar = salvador(id);
  try {
    const { entrada, pesquisa, uso: usoPesquisa } = await carregar(id);
    const ctx = await montarContexto(entrada.citySlugs);
    const composicao = await compor(entrada, ctx, pesquisa ?? "");
    await concluir(id, composicao.resposta, ctx, {
      entrada: (usoPesquisa.entrada ?? 0) + composicao.uso.entrada,
      saida: (usoPesquisa.saida ?? 0) + composicao.uso.saida,
      buscas: usoPesquisa.buscas ?? 0,
    });
  } catch (erro) {
    await salvar({ status: "erro", erro: (erro instanceof Error ? erro.message : "Erro ao gerar o roteiro.").slice(0, 500) });
  }
}
