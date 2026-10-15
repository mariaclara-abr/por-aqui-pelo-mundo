// Monta o .docx do roteiro Premium a partir do Roteiro estruturado (tipos.ts).
// Formatação no estilo dos roteiros da Rejane (script oficial): A4, margens de 2 cm,
// Georgia nos títulos, Calibri no corpo, verde/terracota/areia do site.
// Cuidados contra folhas em branco: nunca há parágrafo vazio depois de tabela (o
// espaço vai no elemento seguinte), caixas de dicas podem dividir entre páginas e
// só linhas de tabela ficam inteiras.

import {
  AlignmentType,
  BorderStyle,
  Bookmark,
  Document,
  ExternalHyperlink,
  Footer,
  HeadingLevel,
  ImageRun,
  InternalHyperlink,
  Packer,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  WidthType,
  convertMillimetersToTwip,
} from "docx";
import type { Dia, Roteiro, TipoPlanoB } from "@/lib/premium-roteiro/tipos";

const VERDE = "3F5A45";
const TERRA = "B5653F";
const AREIA = "F3ECDD";
const LINK = "1F5FBF";
const INK = "2B2620";
const CINZA = "5A5148";

const cm = (v: number) => convertMillimetersToTwip(v * 10);
const PX_CM = 17; // largura útil da página em cm

// Aquarela pronta de cada país (PNG), já na ordem da capa.
export interface Aquarela {
  data: Buffer;
  largura: number;
  altura: number;
}

type Child = Paragraph | Table;

// ---------- texto com marcação ----------

const EMOJI = /([\u{1F000}-\u{1FAFF}☀-➿️‍]+)/u;
const EMOJI_INTEIRO = /^[\u{1F000}-\u{1FAFF}☀-➿️‍]+$/u;

interface Estilo {
  size?: number; // pontos
  color?: string;
  bold?: boolean;
  italics?: boolean;
  font?: string;
}

type Run = TextRun | ExternalHyperlink;

function runs(texto: string, base: Estilo = {}): Run[] {
  let bold = !!base.bold;
  let italics = !!base.italics;
  let terra = false;
  const out: Run[] = [];
  for (const tok of texto.split(/(\*\*|\/\/|~~|\[\[.*?\]\])/)) {
    if (tok === "**") bold = !bold;
    else if (tok === "//") italics = !italics;
    else if (tok === "~~") terra = !terra;
    else if (tok.startsWith("[[") && tok.endsWith("]]")) {
      const [nome, url] = tok.slice(2, -2).split("|");
      if (url) {
        out.push(
          new ExternalHyperlink({
            link: url,
            children: [
              new TextRun({
                text: nome,
                bold,
                italics,
                color: LINK,
                underline: {},
                size: base.size ? base.size * 2 : undefined,
              }),
            ],
          }),
        );
      } else {
        out.push(new TextRun({ text: nome, bold, italics, size: base.size ? base.size * 2 : undefined }));
      }
    } else if (tok) {
      for (const seg of tok.split(EMOJI)) {
        if (!seg) continue;
        if (EMOJI_INTEIRO.test(seg)) {
          // Símbolos e emojis nunca ficam em itálico nem em negrito.
          const simbolo = /[✖❄]/.test(seg);
          out.push(
            new TextRun({
              text: seg,
              font: simbolo ? "Segoe UI Symbol" : "Segoe UI Emoji",
              italics: false,
              bold: false,
              color: seg.includes("✖") ? "C0392B" : undefined,
              size: base.size ? base.size * 2 : undefined,
            }),
          );
        } else {
          out.push(
            new TextRun({
              text: seg,
              bold,
              italics,
              font: base.font,
              size: base.size ? base.size * 2 : undefined,
              color: terra ? TERRA : base.color,
            }),
          );
        }
      }
    }
  }
  return out;
}

interface OpcoesPara extends Estilo {
  after?: number; // pontos
  before?: number;
  indent?: number; // cm
  hanging?: number; // cm
  keep?: boolean;
  align?: (typeof AlignmentType)[keyof typeof AlignmentType];
}

// Espaço pendente depois de tabela: vai no próximo parágrafo, nunca num vazio.
let gap = 0;

function para(texto: string, o: OpcoesPara = {}) {
  const before = Math.max(o.before ?? 0, gap);
  gap = 0;
  return new Paragraph({
    children: runs(texto, o),
    alignment: o.align,
    keepNext: o.keep,
    spacing: { after: (o.after ?? 4) * 20, before: before * 20 },
    indent:
      o.indent !== undefined || o.hanging !== undefined
        ? { left: cm(o.indent ?? 0), hanging: o.hanging ? cm(o.hanging) : undefined }
        : undefined,
  });
}

function marcador(texto: string, o: OpcoesPara = {}) {
  return para("• " + texto, { after: 2, indent: 0.4 + (o.indent ?? 0), hanging: 0.4, ...o });
}

// ---------- títulos, âncoras e tabelas ----------

interface Capitulo {
  id: string;
  texto: string;
}
const TOC: Capitulo[] = [];

function titulo(texto: string, nivel: 1 | 2 | 3, o: { id?: string; quebra?: boolean; toc?: boolean } = {}) {
  const before = gap ? Math.max(gap, 12) : undefined;
  gap = 0;
  const heading = { 1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2, 3: HeadingLevel.HEADING_3 }[nivel];
  const filhos = runs(texto, { bold: true, color: VERDE, font: "Georgia" });
  const conteudo = o.id ? [new Bookmark({ id: o.id, children: filhos as TextRun[] })] : filhos;
  if (o.id && o.toc !== false) TOC.push({ id: o.id, texto: texto.replace(/\*\*|\/\/|~~|\[\[|\|.*?\]\]/g, "") });
  return new Paragraph({
    heading,
    pageBreakBefore: o.quebra,
    keepNext: true,
    spacing: before !== undefined ? { before: before * 20 } : undefined,
    children: conteudo,
  });
}

const BORDA = { style: BorderStyle.SINGLE, size: 4, color: "C9BFA8" };
const SEM_BORDA = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };

function celula(
  texto: string,
  largura: number,
  o: { fundo?: string; cor?: string; negrito?: boolean; size?: number; paras?: Paragraph[] } = {},
) {
  return new TableCell({
    width: { size: cm(largura), type: WidthType.DXA },
    shading: o.fundo ? { type: ShadingType.CLEAR, fill: o.fundo, color: "auto" } : undefined,
    margins: { top: 50, bottom: 50, left: 100, right: 100 },
    children: o.paras ?? [
      new Paragraph({
        spacing: { after: 0 },
        children: runs(texto, { size: o.size ?? 9.5, color: o.cor, bold: o.negrito }),
      }),
    ],
  });
}

// Duas tabelas coladas se fundiriam no Word: um parágrafo mínimo as separa.
let ultimoFoiTabela = false;
function separador(): Paragraph[] {
  if (!ultimoFoiTabela) return [];
  return [new Paragraph({ spacing: { after: 0, before: 0, line: 20 }, children: [new TextRun({ text: " ", size: 2 })] })];
}

function tabela(cabecalho: string[], linhas: string[][], larguras: number[], size = 9.5): Child[] {
  const sep = separador();
  const t = new Table({
    width: { size: cm(larguras.reduce((a, b) => a + b, 0)), type: WidthType.DXA },
    columnWidths: larguras.map(cm),
    layout: TableLayoutType.FIXED,
    alignment: AlignmentType.CENTER,
    borders: { top: BORDA, bottom: BORDA, left: BORDA, right: BORDA, insideHorizontal: BORDA, insideVertical: BORDA },
    rows: [
      new TableRow({
        tableHeader: true,
        cantSplit: true,
        children: cabecalho.map((h, i) => celula(h, larguras[i], { fundo: VERDE, cor: "FFFFFF", negrito: true, size })),
      }),
      ...linhas.map(
        (l) =>
          new TableRow({
            cantSplit: true,
            children: l.map((v, i) => celula(v, larguras[i], { size })),
          }),
      ),
    ],
  });
  ultimoFoiTabela = true;
  gap = 8;
  return [...sep, t];
}

// Caixa de dicas: uma célula areia, que pode dividir entre páginas.
function caixa(titulo_: string, linhas: string[], size = 9.5): Child[] {
  const sep = separador();
  const t = new Table({
    width: { size: cm(PX_CM), type: WidthType.DXA },
    columnWidths: [cm(PX_CM)],
    layout: TableLayoutType.FIXED,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "E0D5BB" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "E0D5BB" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "E0D5BB" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "E0D5BB" },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: cm(PX_CM), type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: AREIA, color: "auto" },
            margins: { top: 100, bottom: 100, left: 160, right: 160 },
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: runs("**" + titulo_ + "**", { size: 10.5, color: TERRA }),
              }),
              ...linhas.map(
                (l) =>
                  new Paragraph({
                    spacing: { after: 40 },
                    indent: { left: cm(0.4), hanging: cm(0.4) },
                    children: runs("• " + l, { size }),
                  }),
              ),
            ],
          }),
        ],
      }),
    ],
  });
  ultimoFoiTabela = true;
  gap = 8;
  return [...sep, t];
}

// Qualquer parágrafo normal depois de uma tabela zera o estado de "colada".
function p(...args: Parameters<typeof para>) {
  ultimoFoiTabela = false;
  return para(...args);
}
function h(...args: Parameters<typeof titulo>) {
  ultimoFoiTabela = false;
  return titulo(...args);
}
function b(texto: string, o: OpcoesPara = {}) {
  ultimoFoiTabela = false;
  return marcador(texto, o);
}

// ---------- Plano B ----------

const SIMBOLO_PLANO_B: Record<TipoPlanoB, { simbolo: string; rotulo: string }> = {
  chuva: { simbolo: "☔", rotulo: "Chuva" },
  calor: { simbolo: "☀️", rotulo: "Calor" },
  frio: { simbolo: "❄", rotulo: "Frio ou vento" },
  fechado: { simbolo: "✖", rotulo: "Fechado ou lotado" },
  imprevisto: { simbolo: "!", rotulo: "Imprevisto" },
};

function planoB(linhas: Dia["planoB"]): Paragraph[] {
  if (linhas.length === 0) return [];
  return [
    p("~~**PLANO B**~~", { after: 1, before: 4, keep: true }),
    ...linhas.map((l) => {
      const s = SIMBOLO_PLANO_B[l.tipo] ?? SIMBOLO_PLANO_B.imprevisto;
      const simbolo = s.simbolo === "!" ? "~~**!**~~" : s.simbolo;
      return p(`${simbolo} //**${s.rotulo}:** ${l.texto}//`, { size: 10, after: 1, indent: 0.4, hanging: 0.4 });
    }),
  ];
}

// ---------- documento ----------

function diaParagrafos(d: Dia, id: string): Paragraph[] {
  const out: Paragraph[] = [h(d.titulo, 3, { id, toc: false }), p(`~~**${d.tema}**~~`, { size: 11.5, after: 4, keep: true })];
  if (d.abertura) out.push(p(d.abertura, { after: 3 }));
  for (const item of d.itens) {
    out.push(b(item.texto, { after: item.descricao ? 1 : 2, keep: !!item.descricao }));
    if (item.descricao) out.push(p(`//${item.descricao}//`, { size: 9.5, after: 4, indent: 0.4, color: CINZA }));
  }
  for (const a of d.avisos) out.push(p(a, { after: 3 }));
  out.push(...planoB(d.planoB));
  return out;
}

function intervaloDias(c: Roteiro["cidades"][number]) {
  const n = c.dias.map((d) => d.titulo.match(/Dia (\d+)/)?.[1]).filter(Boolean);
  return n.length > 1 ? ` (Dias ${n[0]} a ${n[n.length - 1]})` : n.length === 1 ? ` (Dia ${n[0]})` : "";
}

export async function montarDocx(r: Roteiro, aquarelas: Aquarela[]): Promise<Buffer> {
  TOC.length = 0;
  gap = 0;
  ultimoFoiTabela = false;
  const filhos: Child[] = [];

  // CAPA: título à esquerda, aquarela(s) pequena(s) à direita, tabela de dados abaixo.
  const esquerda: Paragraph[] = [
    ...r.capa.cidades.map(
      (c) =>
        new Paragraph({
          spacing: { after: 0 },
          children: [new TextRun({ text: c.toUpperCase(), bold: true, size: 68, color: VERDE, font: "Georgia" })],
        }),
    ),
    new Paragraph({
      spacing: { before: 160, after: 40 },
      children: [new TextRun({ text: r.capa.paises, bold: true, size: 26, color: TERRA, font: "Georgia" })],
    }),
    new Paragraph({
      spacing: { after: 0 },
      children: [new TextRun({ text: r.capa.datas, size: 22, color: INK })],
    }),
    new Paragraph({
      spacing: { before: 200 },
      children: [new TextRun({ text: "Roteiro Por Aqui Pelo Mundo", italics: true, size: 20, color: VERDE })],
    }),
  ];
  const larguraImg = aquarelas.length <= 1 ? 100 : 66; // px
  const direita = new Paragraph({
    alignment: AlignmentType.RIGHT,
    children: aquarelas.map(
      (a, i) =>
        new ImageRun({
          type: "png",
          data: a.data,
          transformation: { width: larguraImg, height: Math.round((larguraImg * a.altura) / a.largura) },
          altText: { title: "Aquarela", description: "Ilustração em aquarela do país", name: `aquarela${i}` },
        }),
    ),
  });
  filhos.push(
    new Table({
      width: { size: cm(PX_CM), type: WidthType.DXA },
      columnWidths: [cm(11.5), cm(5.5)],
      layout: TableLayoutType.FIXED,
      borders: {
        top: SEM_BORDA, bottom: SEM_BORDA, left: SEM_BORDA, right: SEM_BORDA,
        insideHorizontal: SEM_BORDA, insideVertical: SEM_BORDA,
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({ width: { size: cm(11.5), type: WidthType.DXA }, children: esquerda }),
            new TableCell({ width: { size: cm(5.5), type: WidthType.DXA }, children: [direita] }),
          ],
        }),
      ],
    }),
  );
  ultimoFoiTabela = true;
  filhos.push(
    ...separador(),
    new Table({
      width: { size: cm(PX_CM), type: WidthType.DXA },
      columnWidths: [cm(3.6), cm(13.4)],
      layout: TableLayoutType.FIXED,
      borders: { top: BORDA, bottom: BORDA, left: BORDA, right: BORDA, insideHorizontal: BORDA, insideVertical: BORDA },
      rows: r.capa.dados.map(
        (d) =>
          new TableRow({
            cantSplit: true,
            children: [
              celula(d.rotulo, 3.6, { fundo: VERDE, cor: "FFFFFF", negrito: true }),
              celula(d.valor, 13.4),
            ],
          }),
      ),
    }),
  );
  gap = 8;

  // Capítulos: monta primeiro (para o sumário saber os âncoras), insere o sumário depois.
  const corpo: Child[] = [];
  corpo.push(h("1. Visão geral", 1, { id: "visao", quebra: true }));
  corpo.push(p("~~**Dia a dia**~~", { size: 11, keep: true }));
  corpo.push(
    ...tabela(
      ["Dia", "Data", "Cidade", "Foco"],
      r.visaoGeral.dias.map((d) => [d.dia, d.data, d.cidade, d.foco]),
      [1.2, 2.4, 3.6, 9.8],
    ),
  );
  if (r.visaoGeral.nota) corpo.push(p(r.visaoGeral.nota, { size: 9.5 }));

  corpo.push(h("Voos e deslocamentos", 2, { id: "voos" }));
  corpo.push(...tabela(["Trecho", "Duração ≈", "Observação"], r.voos.trechos.map((t) => [t.trecho, t.duracao, t.observacao]), [4.6, 2.6, 9.8]));
  if (r.voos.nota) corpo.push(p(r.voos.nota));
  if (r.voos.fuso) corpo.push(...caixa("Fuso horário", [r.voos.fuso]));
  if (r.voos.aeroportoCentro.length) {
    corpo.push(p("~~**Do aeroporto ao centro**~~", { size: 11, keep: true, before: 6 }));
    corpo.push(...tabela(["Cidade", "Opções"], r.voos.aeroportoCentro.map((a) => [a.cidade, a.opcoes]), [3, 14]));
  }

  corpo.push(h("2. Hospedagem: bairros recomendados", 1, { id: "hospedagem" }));
  if (r.hospedagem.intro) corpo.push(p(r.hospedagem.intro));
  corpo.push(...tabela(["Cidade", "Bairro recomendado", "Por quê"], r.hospedagem.linhas.map((l) => [l.cidade, l.bairro, l.porque]), [2.6, 5, 9.4]));
  if (r.hospedagem.nota) corpo.push(p(r.hospedagem.nota));

  const ob = r.observacoes;
  corpo.push(h("3. Observações gerais", 1, { id: "obs", quebra: true }));
  corpo.push(h("Documentos e autorizações", 2));
  for (const t of ob.documentos) corpo.push(b(t));
  corpo.push(h("Dicas para toda a viagem", 2));
  corpo.push(...caixa("Dicas Por Aqui Pelo Mundo", ob.dicasGerais));
  if (ob.ingressos.length) {
    corpo.push(h("🎟️ Ingressos com reserva antecipada", 2));
    corpo.push(...tabela(["Atração", "Valor conhecido", "Observação"], ob.ingressos.map((i) => [i.atracao, i.valor, i.observacao]), [4.8, 4.4, 7.8]));
  }
  corpo.push(h(ob.orcamento.titulo || "Orçamento", 2));
  corpo.push(...tabela(["Item", "Valor", "Observação"], ob.orcamento.linhas.map((l) => [l.item, l.valor, l.observacao]), [4.6, 3.6, 8.8]));
  if (ob.orcamento.nota) corpo.push(p(ob.orcamento.nota, { size: 9.5 }));

  r.cidades.forEach((c, i) => {
    const id = `cidade${i}`;
    corpo.push(h(`${4 + i}. ${c.nome}, ${c.pais}`, 1, { id, quebra: true }));
    TOC[TOC.length - 1].texto += intervaloDias(c);
    corpo.push(p(`**${c.cabecalho}**`, { size: 11, after: 1 }));
    corpo.push(p(`//${c.dadosChave}//`, { size: 10, after: 6 }));
    corpo.push(h(`Sobre ${c.nome}`, 2));
    corpo.push(p(c.apresentacao));
    if (c.dicas.length) corpo.push(...caixa(`Dicas Por Aqui Pelo Mundo: ${c.nome}`, c.dicas));
    if (c.transporte) corpo.push(p(c.transporte, { before: 4 }));
    c.dias.forEach((d, j) => corpo.push(...diaParagrafos(d, `${id}d${j}`)));
    const oc = c.ondeComer;
    if (oc.linhas.length || oc.intro) {
      corpo.push(h(`👨‍🍳 Onde comer em ${c.nome}`, 2));
      if (oc.intro) corpo.push(p(oc.intro));
      if (oc.linhas.length) corpo.push(...tabela(["Local", "Observação"], oc.linhas.map((l) => [l.local, l.observacao]), [5.2, 11.8]));
      if (oc.nota) corpo.push(p(oc.nota, { size: 9.5 }));
    }
  });

  corpo.push(h(`${4 + r.cidades.length}. Pontos a verificar antes da viagem`, 1, { id: "verificar" }));
  for (const t of r.verificar) corpo.push(b(t));
  if (r.fontes.length) {
    corpo.push(h("Fontes oficiais consultadas", 2));
    for (const t of r.fontes) corpo.push(b(t));
  }

  // Sumário estático: lista de links internos (nunca em branco, nem fora do Word).
  filhos.push(h("Sumário", 1, { quebra: true, toc: false }));
  for (const c of TOC) {
    filhos.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new InternalHyperlink({
            anchor: c.id,
            children: [new TextRun({ text: c.texto, color: LINK, underline: {}, size: 22 })],
          }),
        ],
      }),
    );
  }
  ultimoFoiTabela = false;
  filhos.push(p("**Legenda de leitura**", { size: 11, color: VERDE, before: 8, keep: true }));
  filhos.push(b("~~**DICA:**~~ sugestão prática do dia; ~~**IMPORTANTE:**~~ regra que não pode ser perdida."));
  filhos.push(b("≈ valor ou tempo aproximado. **confirmar** indica dado a conferir antes da viagem. **a cotar** indica valor ainda sem cotação."));
  filhos.push(b("**Opcional (fora do roteiro principal)** marca sugestões sem link, que não fazem parte da seleção principal."));
  filhos.push(p("**Legenda de símbolos**", { size: 11, color: VERDE, before: 8, keep: true }));
  filhos.push(
    ...tabela(
      ["Símbolo", "Uso", "Símbolo", "Uso"],
      [
        ["👨‍🍳", "Restaurantes", "☔", "Plano B: chuva"],
        ["☕", "Cafés", "☀️", "Plano B: calor"],
        ["⛰️", "Colinas, mirantes naturais", "❄", "Plano B: frio ou vento"],
        ["🛍️", "Compras (outlets, lojas, supermercados)", "✖", "Plano B: fechado ou lotado"],
        ["🎟️", "Ingressos e reservas", "!", "Plano B: imprevisto"],
      ],
      [2, 6.5, 2, 6.5],
    ),
  );
  filhos.push(...corpo);

  const nomeRodape = r.capa.cidades.join(", ");
  const doc = new Document({
    creator: "Por Aqui Pelo Mundo",
    title: `Roteiro ${nomeRodape}`,
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 21, color: INK }, paragraph: { spacing: { after: 80 } } },
        heading1: { run: { font: "Georgia", size: 40, bold: true, color: VERDE }, paragraph: { spacing: { before: 280, after: 100 } } },
        heading2: { run: { font: "Georgia", size: 30, bold: true, color: VERDE }, paragraph: { spacing: { before: 280, after: 100 } } },
        heading3: { run: { font: "Georgia", size: 25, bold: true, color: VERDE }, paragraph: { spacing: { before: 240, after: 100 } } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: cm(21), height: cm(29.7) },
            margin: { top: cm(2), bottom: cm(2), left: cm(2), right: cm(2) },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `Por Aqui Pelo Mundo · Roteiro ${nomeRodape} · página `, size: 16, color: "888888" }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 20 }),
                ],
              }),
            ],
          }),
        },
        children: filhos,
      },
    ],
  });
  return Packer.toBuffer(doc);
}
