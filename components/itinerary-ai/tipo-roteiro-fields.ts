import type { TipoRoteiro } from "@/lib/prompts/roteiro-scripts";

export interface ExtraField {
  key: string;
  label: string;
  hint?: string;
  multi?: boolean;
  options: string[];
  // Opções que, quando marcadas, abrem um campo de texto.
  textOn?: string[];
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
    key: "hospedagem",
    label: "Tipo de hospedagem",
    options: ["Hotel", "Resort", "Apart-hotel", "Airbnb ou casa inteira", "Ainda não decidi"],
  },
  {
    key: "deslocamento",
    label: "Como pretende se deslocar",
    options: ["A pé e transporte público", "Vou alugar carro", "Ainda não decidi"],
  },
  {
    key: "restricao_alimentar",
    label: "Restrição alimentar",
    multi: true,
    options: ["Nenhuma", "Vegetariano", "Vegano", "Alergia", "Restrição religiosa", "Outra"],
    textOn: ["Alergia", "Outra"],
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
    options: [
      "Carro próprio",
      "Vou alugar carro",
      "Transporte compartilhado ou van de turismo",
      "Só a pé e transporte público",
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
