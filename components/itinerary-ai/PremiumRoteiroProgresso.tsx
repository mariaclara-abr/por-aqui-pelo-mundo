"use client";

import { useEffect, useState } from "react";
import CenaGeracaoRoteiro from "@/components/itinerary-ai/CenaGeracaoRoteiro";
import type { DestinoCena } from "@/lib/premium-roteiro/destino";

type Etapa = "preparando" | "pesquisando" | "compondo" | "finalizando" | "concluido";

interface Status {
  status: "gerando" | "pronto" | "perguntas" | "erro";
  etapa: Etapa;
  etapaHaMs: number;
  perguntas: string[] | null;
  erro: string | null;
  ajustesRestantes: number;
  destino: DestinoCena | null;
}

const INTERVALO_MS = 4000;

// Fases reais da geração. O progresso dentro de cada fase é uma estimativa suave:
// sobe rápido no começo e desacelera, sem nunca chegar ao fim da fase antes dela
// terminar de fato (a duração real varia com o tamanho da viagem).
const FASES: { etapa: Etapa; de: number; ate: number; esperadoSeg: number; texto: string }[] = [
  {
    etapa: "preparando",
    de: 0,
    ate: 6,
    esperadoSeg: 8,
    texto: "Reunindo a curadoria e as dicas do seu destino",
  },
  {
    etapa: "pesquisando",
    de: 6,
    ate: 50,
    esperadoSeg: 150,
    texto: "Pesquisando informações oficiais atualizadas: ingressos, entrada no país e deslocamentos",
  },
  {
    etapa: "compondo",
    de: 50,
    ate: 94,
    esperadoSeg: 150,
    texto: "Montando cada dia do roteiro, com Plano B e dicas",
  },
  { etapa: "finalizando", de: 94, ate: 99, esperadoSeg: 6, texto: "Conferindo links e formatação" },
];

function progresso(etapa: Etapa, decorridoMs: number) {
  const i = FASES.findIndex((f) => f.etapa === etapa);
  if (i < 0) return { percentual: 100, fase: FASES[FASES.length - 1], numero: FASES.length };
  const f = FASES[i];
  const t = decorridoMs / 1000;
  const percentual = f.de + (f.ate - f.de) * (1 - Math.exp(-t / (f.esperadoSeg / 1.5)));
  return { percentual, fase: f, numero: i + 1 };
}

// Anel de progresso (SVG) com o percentual no centro.
function Anel({ percentual, texto }: { percentual: number; texto: string }) {
  const raio = 44;
  const circunferencia = 2 * Math.PI * raio;
  return (
    <div
      role="progressbar"
      aria-label="Progresso da geração do roteiro"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percentual)}
      aria-valuetext={texto}
      className="relative h-28 w-28 shrink-0"
    >
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={raio} fill="none" strokeWidth="7" className="stroke-oliva/15" />
        <circle
          cx="50"
          cy="50"
          r={raio}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={circunferencia * (1 - percentual / 100)}
          className="stroke-[#A64F2E] transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-serif text-2xl text-tinta">
        {Math.round(percentual)}%
      </span>
    </div>
  );
}

// Acompanha a geração do roteiro Premium (que roda em segundo plano, por alguns
// minutos) e entrega o Word quando fica pronto.
export default function PremiumRoteiroProgresso({ id, onFechar }: { id: string; onFechar: () => void }) {
  const [info, setInfo] = useState<Status | null>(null);
  const [falhaRede, setFalhaRede] = useState(false);
  // Quando a última consulta chegou, para continuar contando o tempo da fase entre consultas.
  const [recebidoEm, setRecebidoEm] = useState(0);
  // O progresso nunca anda para trás, mesmo se uma fase terminar antes do previsto.
  const [percentual, setPercentual] = useState(0);
  // Destino da cena (globo e avião): guarda o primeiro que chegar, para não reiniciar a animação.
  const [destino, setDestino] = useState<DestinoCena | null>(null);

  useEffect(() => {
    let ativo = true;
    let timer: ReturnType<typeof setTimeout>;
    async function consultar() {
      try {
        const resposta = await fetch(`/api/premium-roteiro/${id}`);
        const dados = (await resposta.json()) as Status & { error?: string };
        if (!ativo) return;
        if (!resposta.ok) throw new Error(dados.error);
        setInfo(dados);
        setDestino((atual) => atual ?? dados.destino ?? null);
        setRecebidoEm(Date.now());
        setFalhaRede(false);
        if (dados.status !== "gerando") return;
      } catch {
        if (ativo) setFalhaRede(true);
      }
      if (ativo) timer = setTimeout(consultar, INTERVALO_MS);
    }
    consultar();
    return () => {
      ativo = false;
      clearTimeout(timer);
    };
  }, [id]);

  // Atualiza o anel a cada meio segundo enquanto gera.
  useEffect(() => {
    if (!info || info.status !== "gerando") return;
    const atualizar = () => {
      const { percentual: p } = progresso(info.etapa, info.etapaHaMs + (Date.now() - recebidoEm));
      setPercentual((anterior) => Math.max(anterior, p));
    };
    atualizar();
    const timer = setInterval(atualizar, 500);
    return () => clearInterval(timer);
  }, [info, recebidoEm]);

  const fase = FASES.find((f) => f.etapa === info?.etapa) ?? FASES[0];
  const numeroFase = FASES.indexOf(fase) + 1;

  const botao =
    "inline-flex min-h-11 items-center justify-center rounded-lg px-8 py-2.5 text-sm font-semibold transition-colors motion-safe:active:translate-y-px";

  const comCena = !info || info.status === "gerando" || info.status === "pronto";

  return (
    <div className="mt-8">
      <CenaGeracaoRoteiro
        ativa={comCena}
        progresso={info?.status === "pronto" ? 1 : percentual / 100}
        concluido={info?.status === "pronto"}
        destino={destino}
      >
        <section aria-live="polite" className="rounded-xl border border-oliva/20 bg-branco p-6 sm:p-8">
          {(!info || info.status === "gerando") && (
            <div
              role="status"
              className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left"
            >
              <Anel percentual={percentual} texto={fase.texto} />
              <div>
                <h2 className="font-serif text-2xl text-tinta">Montando o seu roteiro</h2>
                <p className="mt-1 text-sm font-medium text-terracota">
                  Etapa {numeroFase} de {FASES.length}: {fase.texto}
                </p>
                <p className="mt-3 text-sm text-oliva">
                  Isso costuma levar de 3 a 6 minutos, porque cada informação é conferida em fontes oficiais.
                  Pode manter esta página aberta.
                </p>
                {falhaRede && (
                  <p className="mt-2 text-xs text-oliva">Sem conexão no momento, tentando de novo...</p>
                )}
              </div>
            </div>
          )}

          {info?.status === "pronto" && (
            <div>
              <h2 className="font-serif text-2xl text-tinta">Seu roteiro está pronto</h2>
              <p className="mt-2 text-sm text-oliva">
                Documento completo em Word, com capa, voos, hospedagem, dicas, orçamento e o dia a dia com
                Plano B.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <a
                  href={`/api/premium-roteiro/${id}/docx`}
                  download
                  className={`${botao} bg-[#A64F2E] text-white hover:bg-[#8F4226]`}
                >
                  Baixar o roteiro (Word)
                </a>
                <span className="text-xs text-oliva">
                  {info.ajustesRestantes}{" "}
                  {info.ajustesRestantes === 1 ? "ajuste restante" : "ajustes restantes"}
                </span>
              </div>
            </div>
          )}

          {info?.status === "perguntas" && (
            <div>
              <h2 className="font-serif text-2xl text-tinta">Precisamos de mais algumas informações</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-tinta">
                {(info.perguntas ?? []).map((pergunta) => (
                  <li key={pergunta}>{pergunta}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-oliva">
                Complete essas informações no questionário acima e gere o roteiro de novo.
              </p>
              <button
                type="button"
                onClick={onFechar}
                className={`${botao} mt-5 bg-oliva text-white hover:bg-[#45553E]`}
              >
                Voltar ao questionário
              </button>
            </div>
          )}

          {info?.status === "erro" && (
            <div role="alert">
              <h2 className="font-serif text-2xl text-tinta">Não conseguimos gerar o roteiro</h2>
              <p className="mt-2 text-sm text-oliva">
                {info.erro ?? "Tente novamente em alguns instantes."} Seu crédito não foi perdido.
              </p>
              <button
                type="button"
                onClick={onFechar}
                className={`${botao} mt-5 bg-oliva text-white hover:bg-[#45553E]`}
              >
                Tentar de novo
              </button>
            </div>
          )}
        </section>
      </CenaGeracaoRoteiro>
    </div>
  );
}
