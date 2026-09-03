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

// Painel da autora: perguntas de atrações, cidades e países combinadas numa
// única lista, para ela não precisar visitar três telas separadas.
export type AdminQuestionSubjectType = "attraction" | "city" | "country";

interface AdminQuestionSubject {
  name: string;
  breadcrumb: string | null;
  href: string;
}

export interface AdminPendingQuestion {
  id: string;
  subjectType: AdminQuestionSubjectType;
  question: string;
  createdAt: string;
  asker: QuestionProfile;
  subject: AdminQuestionSubject | null;
}

export interface AdminAnsweredQuestion extends AdminPendingQuestion {
  answer: {
    id: string;
    answer: string;
    createdAt: string;
    updatedAt: string;
    author: QuestionProfile;
  } | null;
}

async function fetchProfilesById(
  ids: string[],
): Promise<Map<string, PublicProfile>> {
  if (ids.length === 0) return new Map();
  const { data, error } = await supabase
    .from("public_profiles")
    .select("*")
    .in("id", ids);
  if (error) throw error;
  return new Map(data.map((profile) => [profile.id, profile]));
}

function toAttractionSubject(
  attraction: {
    name: string;
    slug: string;
    cities: { name: string; slug: string; countries: { slug: string } | null } | null;
  } | null,
): AdminQuestionSubject | null {
  if (!attraction?.cities?.countries) return null;
  return {
    name: attraction.name,
    breadcrumb: attraction.cities.name,
    href: `/${attraction.cities.countries.slug}/${attraction.cities.slug}/${attraction.slug}`,
  };
}

function toCitySubject(
  city: {
    name: string;
    slug: string;
    countries: { name: string; slug: string } | null;
  } | null,
): AdminQuestionSubject | null {
  if (!city?.countries) return null;
  return {
    name: city.name,
    breadcrumb: city.countries.name,
    href: `/${city.countries.slug}/${city.slug}`,
  };
}

function toCountrySubject(
  country: { name: string; slug: string } | null,
): AdminQuestionSubject | null {
  if (!country) return null;
  return { name: country.name, breadcrumb: null, href: `/${country.slug}` };
}

interface RawAdminQuestion {
  id: string;
  subjectType: AdminQuestionSubjectType;
  question: string;
  createdAt: string;
  userId: string;
  subject: AdminQuestionSubject | null;
  answer: {
    id: string;
    answer: string;
    createdAt: string;
    updatedAt: string;
    authorId: string;
  } | null;
}

// Sempre pede o join da resposta, mesmo para pendentes (onde ele vem nulo,
// já que uma pergunta pendente não tem resposta ainda): assim o select fica
// uma string literal, o que o Supabase precisa para inferir os tipos da
// query corretamente. Uma string montada dinamicamente por status faz o
// Supabase cair num tipo de erro de parser.
async function fetchAdminQuestions(
  status: "pendente" | "respondida",
): Promise<RawAdminQuestion[]> {
  const [attractionRes, cityRes, countryRes] = await Promise.all([
    supabase
      .from("attraction_questions")
      .select(
        "id, question, created_at, user_id, attractions(name, slug, cities(name, slug, countries(slug))), attraction_answers(id, answer, created_at, updated_at, author_id)",
      )
      .eq("status", status),
    supabase
      .from("city_questions")
      .select(
        "id, question, created_at, user_id, cities(name, slug, countries(name, slug)), city_answers(id, answer, created_at, updated_at, author_id)",
      )
      .eq("status", status),
    supabase
      .from("country_questions")
      .select(
        "id, question, created_at, user_id, countries(name, slug), country_answers(id, answer, created_at, updated_at, author_id)",
      )
      .eq("status", status),
  ]);

  if (attractionRes.error) throw attractionRes.error;
  if (cityRes.error) throw cityRes.error;
  if (countryRes.error) throw countryRes.error;

  function toAnswer(
    raw: { id: string; answer: string; created_at: string; updated_at: string; author_id: string } | null,
  ) {
    if (!raw) return null;
    return {
      id: raw.id,
      answer: raw.answer,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
      authorId: raw.author_id,
    };
  }

  const attractionRows: RawAdminQuestion[] = attractionRes.data.map((q) => ({
    id: q.id,
    subjectType: "attraction",
    question: q.question,
    createdAt: q.created_at,
    userId: q.user_id,
    subject: toAttractionSubject(q.attractions),
    answer: toAnswer(q.attraction_answers),
  }));

  const cityRows: RawAdminQuestion[] = cityRes.data.map((q) => ({
    id: q.id,
    subjectType: "city",
    question: q.question,
    createdAt: q.created_at,
    userId: q.user_id,
    subject: toCitySubject(q.cities),
    answer: toAnswer(q.city_answers),
  }));

  const countryRows: RawAdminQuestion[] = countryRes.data.map((q) => ({
    id: q.id,
    subjectType: "country",
    question: q.question,
    createdAt: q.created_at,
    userId: q.user_id,
    subject: toCountrySubject(q.countries),
    answer: toAnswer(q.country_answers),
  }));

  return [...attractionRows, ...cityRows, ...countryRows];
}

export async function getAllPendingQuestions(): Promise<AdminPendingQuestion[]> {
  const rows = await fetchAdminQuestions("pendente");
  const profileById = await fetchProfilesById([
    ...new Set(rows.map((row) => row.userId)),
  ]);

  return rows
    .map((row): AdminPendingQuestion => ({
      id: row.id,
      subjectType: row.subjectType,
      question: row.question,
      createdAt: row.createdAt,
      asker: toProfile(profileById.get(row.userId), row.userId),
      subject: row.subject,
    }))
    .sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
}

export async function getAllAnsweredQuestions(): Promise<AdminAnsweredQuestion[]> {
  const rows = await fetchAdminQuestions("respondida");

  const profileIds = new Set<string>();
  for (const row of rows) {
    profileIds.add(row.userId);
    if (row.answer) profileIds.add(row.answer.authorId);
  }
  const profileById = await fetchProfilesById([...profileIds]);

  return rows
    .map((row): AdminAnsweredQuestion => ({
      id: row.id,
      subjectType: row.subjectType,
      question: row.question,
      createdAt: row.createdAt,
      asker: toProfile(profileById.get(row.userId), row.userId),
      subject: row.subject,
      answer: row.answer
        ? {
            id: row.answer.id,
            answer: row.answer.answer,
            createdAt: row.answer.createdAt,
            updatedAt: row.answer.updatedAt,
            author: toProfile(
              profileById.get(row.answer.authorId),
              row.answer.authorId,
            ),
          }
        : null,
    }))
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export async function getPendingQuestionsCount() {
  const [attraction, city, country] = await Promise.all([
    supabase
      .from("attraction_questions")
      .select("*", { count: "exact", head: true })
      .eq("status", "pendente"),
    supabase
      .from("city_questions")
      .select("*", { count: "exact", head: true })
      .eq("status", "pendente"),
    supabase
      .from("country_questions")
      .select("*", { count: "exact", head: true })
      .eq("status", "pendente"),
  ]);

  if (attraction.error) throw attraction.error;
  if (city.error) throw city.error;
  if (country.error) throw country.error;

  return (attraction.count ?? 0) + (city.count ?? 0) + (country.count ?? 0);
}

// Dispara a mutação certa (attraction/city/country) a partir do subjectType
// unificado usado pelo painel da autora.
export async function submitAdminAnswer(
  subjectType: AdminQuestionSubjectType,
  questionId: string,
  authorId: string,
  answer: string,
) {
  if (subjectType === "attraction") return submitAnswer(questionId, authorId, answer);
  if (subjectType === "city") return submitCityAnswer(questionId, authorId, answer);
  return submitCountryAnswer(questionId, authorId, answer);
}

export async function editAdminAnswer(
  subjectType: AdminQuestionSubjectType,
  answerId: string,
  answer: string,
) {
  if (subjectType === "attraction") return editAnswer(answerId, answer);
  if (subjectType === "city") return editCityAnswer(answerId, answer);
  return editCountryAnswer(answerId, answer);
}

export async function hideAdminQuestion(
  subjectType: AdminQuestionSubjectType,
  questionId: string,
) {
  if (subjectType === "attraction") return hideQuestion(questionId);
  if (subjectType === "city") return hideCityQuestion(questionId);
  return hideCountryQuestion(questionId);
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
