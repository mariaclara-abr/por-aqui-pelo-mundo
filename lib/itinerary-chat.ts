// Chat que permite ao usuário pedir alterações no roteiro em linguagem
// natural. A IA nunca escreve no banco diretamente: ela só pode chamar as
// ferramentas abaixo, cuja implementação real vive em lib/itinerary-ai.ts e
// roda sob a RLS do usuário autenticado da requisição. Se a IA tentar usar um
// id de atração que não existe, a ferramenta correspondente falha e o erro
// volta pra ela — nunca inventamos um lugar para satisfazer o pedido.

import type { AIAttraction } from "@/lib/itinerary-ai";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-5";
const MAX_TOOL_ITERATIONS = 5;

const MUTATING_TOOLS = new Set([
  "add_attraction",
  "remove_attraction",
  "reorder_itinerary",
  "rename_itinerary",
]);

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ItineraryChatContext {
  itineraryTitle: string;
  items: AIAttraction[];
}

export interface ChatToolExecutors {
  searchAttractions: (query: string) => Promise<unknown>;
  addAttraction: (attractionId: string) => Promise<unknown>;
  removeAttraction: (attractionId: string) => Promise<unknown>;
  reorderItinerary: (attractionIds: string[]) => Promise<unknown>;
  renameItinerary: (title: string) => Promise<unknown>;
}

const TOOLS = [
  {
    name: "search_attractions",
    description:
      "Busca atrações já cadastradas na curadoria do site pelo nome (ou parte do nome). Use sempre antes de adicionar um lugar que o usuário mencionou, para achar o id real dele.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Nome ou parte do nome do lugar" },
      },
      required: ["query"],
    },
  },
  {
    name: "add_attraction",
    description:
      "Adiciona uma atração ao roteiro do usuário. Use um id retornado por search_attractions ou já presente na lista de atrações do roteiro atual — nunca invente um id.",
    input_schema: {
      type: "object",
      properties: { attraction_id: { type: "string" } },
      required: ["attraction_id"],
    },
  },
  {
    name: "remove_attraction",
    description: "Remove uma atração do roteiro do usuário, pelo id.",
    input_schema: {
      type: "object",
      properties: { attraction_id: { type: "string" } },
      required: ["attraction_id"],
    },
  },
  {
    name: "reorder_itinerary",
    description:
      "Define a ordem completa das atrações do roteiro. Inclua TODOS os ids das atrações do roteiro atual (inclusive as que não mudam de posição), na nova ordem desejada.",
    input_schema: {
      type: "object",
      properties: {
        attraction_ids: { type: "array", items: { type: "string" } },
      },
      required: ["attraction_ids"],
    },
  },
  {
    name: "rename_itinerary",
    description: "Muda o título do roteiro.",
    input_schema: {
      type: "object",
      properties: { title: { type: "string" } },
      required: ["title"],
    },
  },
];

function buildSystemPrompt(context: ItineraryChatContext): string {
  const itemsList =
    context.items.length > 0
      ? context.items
          .map((a, i) => `${i + 1}. id="${a.id}" ${a.name} (${a.cityName}) — ${a.category}`)
          .join("\n")
      : "(o roteiro está vazio no momento)";

  return `Você é a assistente do site de viagens "Por Aqui Pelo Mundo" e ajuda o viajante a AJUSTAR o roteiro dele por meio de comandos em linguagem natural, usando as ferramentas disponíveis.

Regras importantes:
- Só existem lugares reais: você só pode adicionar atrações que já estão na curadoria do site. Nunca invente nomes, lugares ou ids. Se não tiver certeza do id de algo que o usuário mencionou, use search_attractions antes de agir.
- Se a busca não encontrar nada parecido com o pedido, diga isso claramente ao usuário em vez de inventar algo.
- Sempre execute a alteração pedida através de uma ferramenta — não diga que fez algo sem realmente chamar a ferramenta correspondente.
- Se o pedido for ambíguo (por exemplo, duas atrações com nomes parecidos), pergunte qual delas antes de agir.
- Depois de executar as ações necessárias, responda em português, de forma breve e amigável, confirmando exatamente o que foi feito.

Roteiro atual: "${context.itineraryTitle}"
Atrações no roteiro agora:
${itemsList}`;
}

interface AnthropicContentBlock {
  type: string;
  text?: string;
  id?: string;
  name?: string;
  input?: Record<string, unknown>;
}

async function executeTool(
  name: string,
  input: Record<string, unknown>,
  executors: ChatToolExecutors,
): Promise<{ ok: true; value: unknown } | { ok: false; error: string }> {
  try {
    switch (name) {
      case "search_attractions": {
        const query = input.query;
        if (typeof query !== "string" || !query.trim()) {
          return { ok: false, error: "Consulta de busca vazia." };
        }
        return { ok: true, value: { results: await executors.searchAttractions(query) } };
      }
      case "add_attraction": {
        const attractionId = input.attraction_id;
        if (typeof attractionId !== "string") {
          return { ok: false, error: "attraction_id inválido." };
        }
        return { ok: true, value: await executors.addAttraction(attractionId) };
      }
      case "remove_attraction": {
        const attractionId = input.attraction_id;
        if (typeof attractionId !== "string") {
          return { ok: false, error: "attraction_id inválido." };
        }
        return { ok: true, value: await executors.removeAttraction(attractionId) };
      }
      case "reorder_itinerary": {
        const ids = input.attraction_ids;
        if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string")) {
          return { ok: false, error: "attraction_ids inválido." };
        }
        return { ok: true, value: await executors.reorderItinerary(ids) };
      }
      case "rename_itinerary": {
        const title = input.title;
        if (typeof title !== "string") {
          return { ok: false, error: "title inválido." };
        }
        return { ok: true, value: await executors.renameItinerary(title) };
      }
      default:
        return { ok: false, error: `Ferramenta desconhecida: ${name}` };
    }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Erro desconhecido.",
    };
  }
}

export async function runItineraryChat(
  history: ChatMessage[],
  context: ItineraryChatContext,
  executors: ChatToolExecutors,
): Promise<{ reply: string; changed: boolean }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY não configurada no servidor.");
  }

  const messages: { role: string; content: unknown }[] = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));
  let changed = false;

  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: buildSystemPrompt(context),
        tools: TOOLS,
        messages,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(
        `Falha ao chamar a API da Anthropic (${response.status}): ${errorBody.slice(0, 300)}`,
      );
    }

    const data = await response.json();
    const content = data?.content as AnthropicContentBlock[] | undefined;
    if (!Array.isArray(content)) {
      throw new Error("Resposta inesperada da API da Anthropic.");
    }

    const toolUseBlocks = content.filter(
      (block): block is AnthropicContentBlock & { id: string; name: string; input: Record<string, unknown> } =>
        block.type === "tool_use" &&
        typeof block.id === "string" &&
        typeof block.name === "string",
    );

    if (toolUseBlocks.length === 0) {
      const textBlock = content.find((block) => block.type === "text");
      return { reply: textBlock?.text ?? "Pronto.", changed };
    }

    messages.push({ role: "assistant", content });

    const toolResults = [];
    for (const block of toolUseBlocks) {
      const result = await executeTool(block.name, block.input ?? {}, executors);
      if (MUTATING_TOOLS.has(block.name) && result.ok) {
        changed = true;
      }
      toolResults.push({
        type: "tool_result",
        tool_use_id: block.id,
        content: JSON.stringify(result.ok ? result.value : { error: result.error }),
        ...(result.ok ? {} : { is_error: true }),
      });
    }

    messages.push({ role: "user", content: toolResults });
  }

  throw new Error("Não consegui concluir esse pedido — tente descrever de outro jeito.");
}
