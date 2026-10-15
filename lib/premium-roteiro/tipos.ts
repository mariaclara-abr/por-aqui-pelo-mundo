// Modelo do roteiro Premium: o que a IA devolve (JSON com formato garantido) e
// de onde o código monta o Word. Toda a aparência (cores, fontes, símbolos do
// Plano B, tabelas) fica no código; a IA só escolhe e escreve o conteúdo.
//
// Texto com marcação inline: **negrito**, //itálico//, ~~terracota~~ (destaque)
// e [[texto|url]] para link. Emojis dos tipos de lugar vão direto no texto.

export type Texto = string;

export type TipoPlanoB = "chuva" | "calor" | "frio" | "fechado" | "imprevisto";
export const TIPOS_PLANO_B: TipoPlanoB[] = ["chuva", "calor", "frio", "fechado", "imprevisto"];

export interface Dia {
  // "Dia 3 | sábado, 3 de julho" (com "(manhã)" ou "(tarde)" se o dia é dividido).
  titulo: string;
  // Tema do dia, em destaque ("Acrópole e jantar com vista").
  tema: string;
  // Frase curta de abertura do dia; vazio se não houver.
  abertura: Texto;
  itens: { texto: Texto; descricao: Texto }[];
  // "**DICA:** ..." ou "**IMPORTANTE:** ..."
  avisos: Texto[];
  planoB: { tipo: TipoPlanoB; texto: Texto }[];
}

export interface Cidade {
  nome: string;
  pais: string;
  // "Atenas, Grécia / Hospedagem: bairro recomendado, Koukaki"
  cabecalho: string;
  // Linha em itálico: fuso, clima da época, moeda.
  dadosChave: Texto;
  apresentacao: Texto;
  dicas: Texto[];
  transporte: Texto;
  dias: Dia[];
  ondeComer: { intro: Texto; linhas: { local: Texto; observacao: Texto }[]; nota: Texto };
}

export interface Roteiro {
  capa: {
    // Uma cidade por linha, em caixa alta (o código converte).
    cidades: string[];
    // "Grécia, Alemanha e Reino Unido"
    paises: string;
    // "01 a 15 de julho de 2027"
    datas: string;
    dados: { rotulo: string; valor: Texto }[];
  };
  visaoGeral: {
    dias: { dia: string; data: string; cidade: string; foco: Texto }[];
    nota: Texto;
  };
  voos: {
    trechos: { trecho: Texto; duracao: string; observacao: Texto }[];
    nota: Texto;
    fuso: Texto;
    aeroportoCentro: { cidade: string; opcoes: Texto }[];
  };
  hospedagem: {
    intro: Texto;
    linhas: { cidade: string; bairro: Texto; porque: Texto }[];
    nota: Texto;
  };
  observacoes: {
    documentos: Texto[];
    dicasGerais: Texto[];
    ingressos: { atracao: Texto; valor: Texto; observacao: Texto }[];
    orcamento: {
      titulo: string;
      linhas: { item: Texto; valor: Texto; observacao: Texto }[];
      nota: Texto;
    };
  };
  cidades: Cidade[];
  verificar: Texto[];
  fontes: Texto[];
}

// O que a IA devolve: perguntas (Regra Zero) OU o roteiro. Quando há perguntas,
// `roteiro` vem vazio e o código ignora.
export interface RespostaIA {
  perguntas: string[];
  roteiro: Roteiro;
}

const str = { type: "string" } as const;
const arr = (items: object) => ({ type: "array", items }) as const;
const obj = (properties: Record<string, object>) =>
  ({ type: "object", properties, required: Object.keys(properties), additionalProperties: false }) as const;

const texto = str;

const dia = obj({
  titulo: str,
  tema: str,
  abertura: texto,
  itens: arr(obj({ texto, descricao: texto })),
  avisos: arr(texto),
  planoB: arr(obj({ tipo: { type: "string", enum: TIPOS_PLANO_B }, texto })),
});

const cidade = obj({
  nome: str,
  pais: str,
  cabecalho: str,
  dadosChave: texto,
  apresentacao: texto,
  dicas: arr(texto),
  transporte: texto,
  dias: arr(dia),
  ondeComer: obj({
    intro: texto,
    linhas: arr(obj({ local: texto, observacao: texto })),
    nota: texto,
  }),
});

const roteiro = obj({
  capa: obj({
    cidades: arr(str),
    paises: str,
    datas: str,
    dados: arr(obj({ rotulo: str, valor: texto })),
  }),
  visaoGeral: obj({
    dias: arr(obj({ dia: str, data: str, cidade: str, foco: texto })),
    nota: texto,
  }),
  voos: obj({
    trechos: arr(obj({ trecho: texto, duracao: str, observacao: texto })),
    nota: texto,
    fuso: texto,
    aeroportoCentro: arr(obj({ cidade: str, opcoes: texto })),
  }),
  hospedagem: obj({
    intro: texto,
    linhas: arr(obj({ cidade: str, bairro: texto, porque: texto })),
    nota: texto,
  }),
  observacoes: obj({
    documentos: arr(texto),
    dicasGerais: arr(texto),
    ingressos: arr(obj({ atracao: texto, valor: texto, observacao: texto })),
    orcamento: obj({
      titulo: str,
      linhas: arr(obj({ item: texto, valor: texto, observacao: texto })),
      nota: texto,
    }),
  }),
  cidades: arr(cidade),
  verificar: arr(texto),
  fontes: arr(texto),
});

// JSON Schema enviado em output_config.format (formato garantido pela API).
export const SCHEMA_RESPOSTA = obj({ perguntas: arr(str), roteiro });
