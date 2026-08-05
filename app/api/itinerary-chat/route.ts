import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import {
  addAttractionToItineraryChat,
  getActiveItineraryForAI,
  removeAttractionFromItineraryChat,
  renameItineraryChat,
  reorderItineraryItemsChat,
  searchAttractionsForChat,
} from "@/lib/itinerary-ai";
import { runItineraryChat, type ChatMessage } from "@/lib/itinerary-chat";

interface RequestBody {
  message?: string;
  history?: ChatMessage[];
}

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY = 20;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  // TODO: Premium feature - checar aqui se o usuário tem assinatura ativa
  // (ou está em trial) antes de liberar o chat. Por enquanto, qualquer
  // usuário logado pode usar.

  const body = (await request.json().catch(() => null)) as RequestBody | null;
  const message = body?.message?.trim();

  if (!message) {
    return NextResponse.json({ error: "Mensagem vazia." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Mensagem muito longa (máximo ${MAX_MESSAGE_LENGTH} caracteres).` },
      { status: 400 },
    );
  }

  const history: ChatMessage[] = Array.isArray(body?.history)
    ? body.history
        .filter(
          (m): m is ChatMessage =>
            (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string",
        )
        .slice(-MAX_HISTORY)
    : [];

  let itinerary;
  try {
    itinerary = await getActiveItineraryForAI(user.id);
  } catch {
    return NextResponse.json(
      { error: "Não foi possível carregar o roteiro." },
      { status: 500 },
    );
  }

  if (!itinerary) {
    return NextResponse.json(
      { error: "Você ainda não tem um roteiro em planejamento." },
      { status: 400 },
    );
  }

  const itineraryId = itinerary.itineraryId;

  try {
    const result = await runItineraryChat(
      [...history, { role: "user", content: message }],
      { itineraryTitle: itinerary.title, items: itinerary.attractions },
      {
        searchAttractions: (query) => searchAttractionsForChat(query),
        addAttraction: (attractionId) =>
          addAttractionToItineraryChat(itineraryId, attractionId, user.id),
        removeAttraction: (attractionId) =>
          removeAttractionFromItineraryChat(itineraryId, attractionId),
        reorderItinerary: (attractionIds) =>
          reorderItineraryItemsChat(itineraryId, attractionIds),
        renameItinerary: (title) => renameItineraryChat(itineraryId, title),
      },
    );

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao processar seu pedido.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
