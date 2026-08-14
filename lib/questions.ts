import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase-browser";
import type { Database, QuestionStatus } from "@/types/database";

type PublicProfile = Database["public"]["Views"]["public_profiles"]["Row"];

export interface QuestionProfile {
  id: string;
  username: string | null;
  displayName: string;
  avatarUrl: string | null;
}

interface BaseQuestion {
  id: string;
  question: string;
  status: QuestionStatus;
  createdAt: string;
  asker: QuestionProfile;
  answer: {
    id: string;
    answer: string;
    createdAt: string;
    updatedAt: string;
    author: QuestionProfile;
  } | null;
}

export interface AttractionQuestion extends BaseQuestion {
  attractionId: string;
}

export interface CountryQuestion extends BaseQuestion {
  countryId: string;
}

export interface CityQuestion extends BaseQuestion {
  cityId: string;
}

function toProfile(
  profile: PublicProfile | undefined,
  fallbackId: string,
): QuestionProfile {
  return {
    id: fallbackId,
    username: profile?.username ?? null,
    displayName: profile?.display_name || profile?.username || "Viajante",
    avatarUrl: profile?.avatar_url ?? null,
  };
}

// "mais recentes ou mais respondidas primeiro": perguntas já respondidas sobem
// para o topo (para não ficarem escondidas atrás de pendentes antigas) e,
// dentro de cada grupo, as mais recentes aparecem primeiro.
function sortQuestions<T extends BaseQuestion>(questions: T[]): T[] {
  return [...questions].sort((a, b) => {
    if (a.status !== b.status) {
      if (a.status === "respondida") return -1;
      if (b.status === "respondida") return 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export async function getAttractionQuestions(
  attractionId: string,
): Promise<AttractionQuestion[]> {
  const { data: questions, error } = await supabase
    .from("attraction_questions")
    .select(
      "id, attraction_id, question, status, created_at, user_id, attraction_answers(id, answer, created_at, updated_at, author_id)",
    )
    .eq("attraction_id", attractionId)
    // Perguntas ocultas nunca reaparecem, nem para a autora — mesmo que a RLS
    // permita a ela enxergar essas linhas (necessário para a operação de
    // ocultar funcionar), a UI trata "oculta" como definitivo.
    .in("status", ["pendente", "respondida"])
    .order("created_at", { ascending: false });

  if (error) throw error;

  const profileIds = new Set<string>();
  for (const question of questions) {
    profileIds.add(question.user_id);
    if (question.attraction_answers) {
      profileIds.add(question.attraction_answers.author_id);
    }
  }

  const { data: profiles, error: profilesError } =
    profileIds.size === 0
      ? { data: [] as PublicProfile[], error: null }
      : await supabase
          .from("public_profiles")
          .select("*")
          .in("id", [...profileIds]);

  if (profilesError) throw profilesError;
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));

  const mapped = questions.map((question): AttractionQuestion => {
    const answer = question.attraction_answers;
    return {
      id: question.id,
      attractionId: question.attraction_id,
      question: question.question,
      status: question.status,
      createdAt: question.created_at,
      asker: toProfile(profileById.get(question.user_id), question.user_id),
      answer: answer
        ? {
            id: answer.id,
            answer: answer.answer,
            createdAt: answer.created_at,
            updatedAt: answer.updated_at,
            author: toProfile(profileById.get(answer.author_id), answer.author_id),
          }
        : null,
    };
  });

  return sortQuestions(mapped);
}

export async function getAllPendingQuestions() {
  const { data, error } = await supabase
    .from("attraction_questions")
    .select(
      "id, question, created_at, user_id, attractions(id, name, slug, cities(name, slug, countries(slug)))",
    )
    .eq("status", "pendente")
    .order("created_at", { ascending: true });

  if (error) throw error;

  const askerIds = [...new Set(data.map((question) => question.user_id))];
  const { data: profiles, error: profilesError } =
    askerIds.length === 0
      ? { data: [] as PublicProfile[], error: null }
      : await supabase.from("public_profiles").select("*").in("id", askerIds);

  if (profilesError) throw profilesError;
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));

  return data.map((question) => ({
    id: question.id,
    question: question.question,
    createdAt: question.created_at,
    asker: toProfile(profileById.get(question.user_id), question.user_id),
    attraction: question.attractions,
  }));
}

export async function getPendingQuestionsCount() {
  const { count, error } = await supabase
    .from("attraction_questions")
    .select("*", { count: "exact", head: true })
    .eq("status", "pendente");

  if (error) throw error;
  return count ?? 0;
}

export async function askQuestion(
  attractionId: string,
  userId: string,
  question: string,
) {
  const client = createClient();
  const { error } = await client.from("attraction_questions").insert({
    attraction_id: attractionId,
    user_id: userId,
    question: question.trim(),
  });
  if (error) throw error;
}

export async function submitAnswer(
  questionId: string,
  authorId: string,
  answer: string,
) {
  const client = createClient();
  const { error } = await client.from("attraction_answers").insert({
    question_id: questionId,
    author_id: authorId,
    answer: answer.trim(),
  });
  if (error) throw error;
}

export async function editAnswer(answerId: string, answer: string) {
  const client = createClient();
  const { error } = await client
    .from("attraction_answers")
    .update({ answer: answer.trim(), updated_at: new Date().toISOString() })
    .eq("id", answerId);
  if (error) throw error;
}

export async function hideQuestion(questionId: string) {
  const client = createClient();
  const { error } = await client
    .from("attraction_questions")
    .update({ status: "oculta" })
    .eq("id", questionId);
  if (error) throw error;
}

export async function getCityQuestions(
  cityId: string,
): Promise<CityQuestion[]> {
  const { data: questions, error } = await supabase
    .from("city_questions")
    .select(
      "id, city_id, question, status, created_at, user_id, city_answers(id, answer, created_at, updated_at, author_id)",
    )
    .eq("city_id", cityId)
    .in("status", ["pendente", "respondida"])
    .order("created_at", { ascending: false });

  if (error) throw error;

  const profileIds = new Set<string>();
  for (const question of questions) {
    profileIds.add(question.user_id);
    if (question.city_answers) {
      profileIds.add(question.city_answers.author_id);
    }
  }

  const { data: profiles, error: profilesError } =
    profileIds.size === 0
      ? { data: [] as PublicProfile[], error: null }
      : await supabase
          .from("public_profiles")
          .select("*")
          .in("id", [...profileIds]);

  if (profilesError) throw profilesError;
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));

  const mapped = questions.map((question): CityQuestion => {
    const answer = question.city_answers;
    return {
      id: question.id,
      cityId: question.city_id,
      question: question.question,
      status: question.status,
      createdAt: question.created_at,
      asker: toProfile(profileById.get(question.user_id), question.user_id),
      answer: answer
        ? {
            id: answer.id,
            answer: answer.answer,
            createdAt: answer.created_at,
            updatedAt: answer.updated_at,
            author: toProfile(profileById.get(answer.author_id), answer.author_id),
          }
        : null,
    };
  });

  return sortQuestions(mapped);
}

export async function askCityQuestion(
  cityId: string,
  userId: string,
  question: string,
) {
  const client = createClient();
  const { error } = await client.from("city_questions").insert({
    city_id: cityId,
    user_id: userId,
    question: question.trim(),
  });
  if (error) throw error;
}

export async function submitCityAnswer(
  questionId: string,
  authorId: string,
  answer: string,
) {
  const client = createClient();
  const { error } = await client.from("city_answers").insert({
    question_id: questionId,
    author_id: authorId,
    answer: answer.trim(),
  });
  if (error) throw error;
}

export async function editCityAnswer(answerId: string, answer: string) {
  const client = createClient();
  const { error } = await client
    .from("city_answers")
    .update({ answer: answer.trim(), updated_at: new Date().toISOString() })
    .eq("id", answerId);
  if (error) throw error;
}

export async function hideCityQuestion(questionId: string) {
  const client = createClient();
  const { error } = await client
    .from("city_questions")
    .update({ status: "oculta" })
    .eq("id", questionId);
  if (error) throw error;
}

export async function getCountryQuestions(
  countryId: string,
): Promise<CountryQuestion[]> {
  const { data: questions, error } = await supabase
    .from("country_questions")
    .select(
      "id, country_id, question, status, created_at, user_id, country_answers(id, answer, created_at, updated_at, author_id)",
    )
    .eq("country_id", countryId)
    .in("status", ["pendente", "respondida"])
    .order("created_at", { ascending: false });

  if (error) throw error;

  const profileIds = new Set<string>();
  for (const question of questions) {
    profileIds.add(question.user_id);
    if (question.country_answers) {
      profileIds.add(question.country_answers.author_id);
    }
  }

  const { data: profiles, error: profilesError } =
    profileIds.size === 0
      ? { data: [] as PublicProfile[], error: null }
      : await supabase
          .from("public_profiles")
          .select("*")
          .in("id", [...profileIds]);

  if (profilesError) throw profilesError;
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));

  const mapped = questions.map((question): CountryQuestion => {
    const answer = question.country_answers;
    return {
      id: question.id,
      countryId: question.country_id,
      question: question.question,
      status: question.status,
      createdAt: question.created_at,
      asker: toProfile(profileById.get(question.user_id), question.user_id),
      answer: answer
        ? {
            id: answer.id,
            answer: answer.answer,
            createdAt: answer.created_at,
            updatedAt: answer.updated_at,
            author: toProfile(profileById.get(answer.author_id), answer.author_id),
          }
        : null,
    };
  });

  return sortQuestions(mapped);
}

export async function askCountryQuestion(
  countryId: string,
  userId: string,
  question: string,
) {
  const client = createClient();
  const { error } = await client.from("country_questions").insert({
    country_id: countryId,
    user_id: userId,
    question: question.trim(),
  });
  if (error) throw error;
}

export async function submitCountryAnswer(
  questionId: string,
  authorId: string,
  answer: string,
) {
  const client = createClient();
  const { error } = await client.from("country_answers").insert({
    question_id: questionId,
    author_id: authorId,
    answer: answer.trim(),
  });
  if (error) throw error;
}

export async function editCountryAnswer(answerId: string, answer: string) {
  const client = createClient();
  const { error } = await client
    .from("country_answers")
    .update({ answer: answer.trim(), updated_at: new Date().toISOString() })
    .eq("id", answerId);
  if (error) throw error;
}

export async function hideCountryQuestion(questionId: string) {
  const client = createClient();
  const { error } = await client
    .from("country_questions")
    .update({ status: "oculta" })
    .eq("id", questionId);
  if (error) throw error;
}
