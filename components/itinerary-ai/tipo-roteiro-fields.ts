import type { TipoRoteiro } from "@/lib/prompts/roteiro-scripts";

export interface ExtraField {
  key: string;
  label: string;
  hint?: string;
  multi?: boolean;
  options: string[];
  // Opções que, quando marcadas, abrem um campo de texto.
  textOn?: string[];
  placeholder?: string;
  // Marca o campo como obrigatório (selo na tela e checagem antes de gerar).
  required?: boolean;
  // Campo de texto livre, sem opções.
  text?: boolean;
}

export const TIPO_TABS: { value: TipoRoteiro; label: string; description: string }[] = [
  {
    value: "internacional",
    label: "Viagem internacional",
    description: "Cidades e atrações de um destino fora do Brasil, dia a dia.",
  },
  {
    value: "parque_disney",
    label: "Parque da Disney",
    description: "Roteiro hora a hora dentro de um parque temático.",
  },
  {
    value: "nacional",
    label: "Viagem nacional",
    description: "Serra, praia ou capital: destinos dentro do Brasil.",
  },
];

const SIM_NAO_INDEFINIDO = ["Sim", "Não", "Ainda não decidi"];

export const INTERNACIONAL_FIELDS: ExtraField[] = [
  {
    key: "saida",
    label: "Cidade de saída",
    required: true,
    text: true,
    options: [],
    placeholder: "Ex.: São Paulo (capital)",
  },
  {
    key: "volta",
    label: "Volta para o mesmo lugar?",
    required: true,
    options: ["Volta para o mesmo lugar", "Volta para outro lugar"],
    textOn: ["Volta para outro lugar"],
    placeholder: "Cidade de volta",
  },
  {
    key: "flex_datas",
    label: "Flexibilidade das datas",
    options: ["Datas fixas", "Flexível"],
    textOn: ["Flexível"],
    placeholder: "Qual mês ou intervalo? Ex.: julho de 2027",
  },
  {
    key: "orcamento_inclui",
    label: "O que o orçamento inclui",
    multi: true,
    options: ["Passagens", "Alimentação", "Ingressos", "Transporte", "Hospedagem"],
  },
  {
    key: "hospedagem",
    label: "Tipo de hospedagem",
    options: ["Hotel", "Resort", "Apart-hotel", "Airbnb ou casa inteira", "Ainda não decidi"],
  },
  {
    key: "tem_hotel",
    label: "Você já tem hotel?",
    hint: "Se não tem, a IA indica um bairro-base por cidade e planeja os dias a partir dele. Hotéis do site aparecem só como opção.",
    options: ["Sim, já escolhi", "Ainda não"],
    textOn: ["Sim, já escolhi"],
    placeholder: "Nome e endereço do hotel (ponto fixo do roteiro)",
  },
  {
    key: "deslocamento",
    label: "Como pretende se deslocar",
    required: true,
    multi: true,
    options: [
      "A pé e transporte público",
      "Vou alugar carro",
      "Táxi/motoristas de aplicativo",
      "A IA pode recomendar",
      "Ainda não decidi",
    ],
  },
  {
    key: "compromissos",
    label: "Compromissos fixos",
    hint: "Jantares, ingressos já comprados, eventos. Informe a cidade e a data se puder.",
    text: true,
    options: [],
    placeholder: "Ex.: jantar com vista para a Torre Eiffel, Paris, 12/07",
  },
  {
    key: "imperdivel",
    label: "Alguma atração é imperdível?",
    hint: "A IA coloca primeiro no dia, em horário favorável.",
    text: true,
    options: [],
    placeholder: "Nome da atração do site",
  },
  {
    key: "ideias",
    label: "Só os clássicos ou também ideias menos óbvias?",
    options: ["Só os clássicos", "Clássicos e algumas ideias diferentes"],
  },
  {
    key: "restricao_alimentar",
    label: "Restrição alimentar",
    multi: true,
    options: [
      "Ninguém tem restrição alimentar",
      "Vegetariano",
      "Vegano",
      "Alergia",
      "Restrição religiosa",
      "Outra",
    ],
    textOn: ["Alergia", "Outra"],
  },
  {
    key: "mobilidade_saude",
    label: "Restrição de mobilidade ou condição de saúde",
    multi: true,
    options: [
      "Ninguém tem restrições ou condições",
      "Dificuldade de caminhar longas distâncias",
      "Cadeira de rodas ou carrinho de bebê",
      "Condição de saúde",
    ],
    textOn: ["Condição de saúde"],
  },
  {
    key: "ocasiao",
    label: "Ocasião especial",
    options: [
      "Não, viagem comum",
      "Lua de mel",
      "Aniversário de casamento",
      "Aniversário de alguém do grupo",
      "Comemoração especial",
      "Outra",
    ],
    textOn: ["Outra"],
  },
  {
    key: "passaporte",
    label: "Passaporte válido?",
    hint: "Só para orientar as dicas, não bloqueia nada.",
    options: ["Sim", "Não", "Não sei"],
  },
  {
    key: "primeira_vez",
    label: "É a primeira vez no destino?",
    options: ["Sim", "Não"],
  },
  {
    key: "idiomas",
    label: "Idiomas que o grupo fala",
    text: true,
    options: [],
    placeholder: "Ex.: português, um pouco de inglês",
  },
];

export const DISNEY_FIELDS: ExtraField[] = [
  {
    key: "parques",
    label: "Quais parques vai visitar?",
    multi: true,
    options: [
      "Magic Kingdom",
      "Epcot",
      "Hollywood Studios",
      "Animal Kingdom",
      "Universal Studios",
      "Islands of Adventure",
      "Outro",
      "Ainda não decidi",
    ],
    textOn: ["Outro"],
  },
  {
    key: "hotel_rede",
    label: "Vai se hospedar em hotel da rede do parque?",
    options: SIM_NAO_INDEFINIDO,
  },
  {
    key: "ingressos",
    label: "Ingressos já comprados?",
    options: ["Sim, todos", "Parcialmente", "Ainda não comprei"],
  },
  {
    key: "restricoes_grupo",
    label: "Alguém no grupo tem...",
    multi: true,
    options: [
      "Medo de brinquedo radical",
      "Altura abaixo do mínimo exigido",
      "Nenhuma dessas restrições",
    ],
  },
  {
    key: "prioridade_parque",
    label: "Prioridade dentro do parque",
    options: ["Ver tudo com calma", "Maximizar atrações por dia", "Equilíbrio"],
  },
  {
    key: "addons",
    label: "Orçamento para add-ons pagos",
    options: ["Não pretendo comprar", "Limitado", "Moderado", "Sem limite"],
  },
  {
    key: "das",
    label: "Alguém tem direito a acomodação especial de fila (DAS)?",
    options: ["Sim", "Não", "Não sei o que é isso"],
  },
];

export const NACIONAL_FIELDS: ExtraField[] = [
  {
    key: "tem_hotel",
    label: "Você já tem o local?",
    hint: "Se ainda não tem, o roteiro indica hotéis do site e um bairro bem localizado.",
    options: ["Sim, já escolhi", "Ainda não"],
    textOn: ["Sim, já escolhi"],
    placeholder: "Nome do hotel e, se possível, o bairro/endereço",
  },
  {
    key: "tipo_destino",
    label: "Tipo de destino",
    options: [
      "Natureza/serra com bate-voltas",
      "Praia",
      "Cidade grande ou capital",
      "Mistura de mais de um tipo",
    ],
  },
  {
    key: "deslocamento",
    label: "Como pretende se deslocar",
    multi: true,
    options: [
      "Carro próprio",
      "Vou alugar carro",
      "Transporte compartilhado ou van de turismo",
      "Táxi/motoristas de aplicativo",
      "Só a pé e transporte público",
      "A IA pode recomendar",
    ],
  },
  {
    key: "trilhas",
    label: "Disposição física para trilhas",
    options: [
      "Nenhuma trilha",
      "Trilhas leves (até 2h)",
      "Trilhas moderadas",
      "Trilhas pesadas, com preparo físico",
    ],
  },
  {
    key: "gastronomia",
    label: "Interesse em gastronomia regional/típica",
    options: ["É prioridade", "Interessante, mas não prioridade", "Pouco interesse"],
  },
  {
    key: "flexibilidade",
    label: "Flexibilidade de datas por clima",
    options: ["Datas fixas, sem flexibilidade", "1-2 dias de flexibilidade", "Totalmente flexíveis"],
  },
  {
    key: "interesses_nacional",
    label: "Interesses",
    hint: "O que não pode faltar no seu roteiro?",
    multi: true,
    options: [
      "Natureza e trilhas",
      "Praia",
      "Cultura local",
      "Gastronomia",
      "Compras",
      "Vida noturna",
      "Outro",
    ],
    textOn: ["Outro"],
    placeholder: "Escreva o que você quer no roteiro",
  },
];

export const FIELDS_BY_TIPO: Record<TipoRoteiro, ExtraField[]> = {
  internacional: INTERNACIONAL_FIELDS,
  parque_disney: DISNEY_FIELDS,
  nacional: NACIONAL_FIELDS,
};

export const TIPO_HELP =
  "Se seu destino inclui um complexo de parques (ex: Orlando) mas você quer só saber quais parques visitar entre outras atrações da região, use 'Viagem internacional'. Se quer um roteiro detalhado hora a hora dentro de um parque específico da Disney (ou Universal, Beto Carrero etc.), use 'Parque da Disney'.";

// Quais blocos compartilhados aparecem em cada aba.
export const SHOWS = {
  profile: (t: TipoRoteiro) => t !== "parque_disney",
  pace: (t: TipoRoteiro) => t !== "parque_disney",
  budget: (t: TipoRoteiro) => t !== "parque_disney",
  interests: (t: TipoRoteiro) => t === "internacional",
};

// Legendas exibidas ao selecionar ritmo/orçamento. As quantidades por dia
// espelham FROM_SCRATCH_DAILY_COUNT_BY_PACE em lib/ai.ts.
export const PACE_HINTS: Record<string, string> = {
  tranquilo: "2 a 3 atrações por dia, com bastante tempo livre.",
  moderado: "4 a 6 atrações por dia, equilibrando passeios e pausas.",
  intenso: "7 a 10 atrações por dia, aproveitando o máximo do tempo.",
};

export const BUDGET_HINTS: Record<string, string> = {
  economico: "Prioriza opções gratuitas e de baixo custo.",
  moderado: "Equilibra custo e conforto, com algumas experiências pagas.",
  confortavel: "Aceita investir mais em conforto e boas experiências.",
  luxo: "Prioriza experiências premium, sem se preocupar com o custo.",
};

// Gasto médio por pessoa (R$, sem passagens). Estimativas editoriais: viagem
// internacional custa mais que nacional. Os valores abaixo são para 2 semanas
// (14 dias) e são escalados pela duração; a aba Disney não exibe o campo de
// orçamento geral, então não tem faixa aqui.
const BUDGET_BRL_2_SEMANAS: Partial<Record<TipoRoteiro, Record<string, [number, number | null]>>> = {
  internacional: {
    economico: [4000, 8000],
    moderado: [8000, 13000],
    confortavel: [13000, 20000],
    luxo: [20000, null],
  },
  nacional: {
    economico: [1000, 2500],
    moderado: [2500, 5000],
    confortavel: [5000, 9000],
    luxo: [9000, null],
  },
};

const BASE_DAYS = 14;

// Faixas de duração. O fator é o limite superior da faixa dividido por 14.
const DURATION_BUCKETS: { maxDays: number; refDays: number; label: string }[] = [
  { maxDays: 3, refDays: 3, label: "1 a 3 dias" },
  { maxDays: 7, refDays: 7, label: "4 dias a 1 semana" },
  { maxDays: 10, refDays: 10, label: "1 semana a 10 dias" },
  { maxDays: 14, refDays: 14, label: "11 dias a 2 semanas" },
  { maxDays: 21, refDays: 21, label: "15 dias a 3 semanas" },
  { maxDays: 30, refDays: 30, label: "22 dias a 1 mês" },
  { maxDays: 37, refDays: 37, label: "1 mês a 1 mês e uma semana" },
  { maxDays: 45, refDays: 45, label: "1 mês e uma semana a 1 mês e meio" },
  { maxDays: 51, refDays: 51, label: "1 mês e meio a 1 mês e 3 semanas" },
  { maxDays: 60, refDays: 60, label: "1 mês e 3 semanas a 2 meses" },
];

// Acima disso não há faixa: a pessoa informa o valor médio por pessoa.
export const MAX_DAYS_WITH_BUDGET_RANGE = 60;

const brl = (value: number) =>
  `R$ ${(Math.round(value / 100) * 100).toLocaleString("pt-BR")}`;

export function budgetHint(tipo: TipoRoteiro, budget: string, days: number): string {
  const text = BUDGET_HINTS[budget];
  const base = BUDGET_BRL_2_SEMANAS[tipo]?.[budget];
  const bucket = DURATION_BUCKETS.find((b) => days <= b.maxDays);
  if (!base || !bucket) return text;
  const factor = bucket.refDays / BASE_DAYS;
  const [min, max] = base;
  const range = max === null ? `acima de ${brl(min * factor)}` : `${brl(min * factor)} a ${brl(max * factor)}`;
  return `${text} Gasto médio: ${range} por pessoa para viagens de ${bucket.label}, sem contar passagens.`;
}
