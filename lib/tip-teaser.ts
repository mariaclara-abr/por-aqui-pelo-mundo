import { truncateToSentence } from "@/lib/metadata";
import type { Database } from "@/types/database";

type TravelTip = Database["public"]["Tables"]["travel_tips"]["Row"];

const TEASER_MAX = 260;

/** Trecho público de uma dica (primeira frase(s)); o resto de uma dica Premium fica protegido. */
export const tipTeaser = (content: string) => truncateToSentence(content, TEASER_MAX);

/** Dicas Premium saem do servidor só com o trecho público no lugar do texto completo. */
export const withTeaser = (tips: TravelTip[]): TravelTip[] =>
  tips.map((t) => (t.is_premium ? { ...t, content: tipTeaser(t.content) } : t));
