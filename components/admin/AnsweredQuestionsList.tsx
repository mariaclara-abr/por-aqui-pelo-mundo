"use client";

import { useState } from "react";
import Link from "next/link";
import { inputClass } from "@/components/admin/FormField";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  editAnswer,
  getAllAnsweredQuestions,
  hideQuestion,
} from "@/lib/questions";

type AnsweredQuestion = Awaited<ReturnType<typeof getAllAnsweredQuestions>>[number];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function AnsweredQuestionCard({
  question,
  onChanged,
}: {
  question: AnsweredQuestion;
  onChanged: () => void;
}) {
  const answer = question.answer;
  const [draft, setDraft] = useState(answer?.answer ?? "");
  const [saving, setSaving] = useState(false);
  const [confirmingHide, setConfirmingHide] = useState(false);
  const [hiding, setHiding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const attraction = question.attraction;
  const attractionHref =
    attraction && attraction.cities?.countries
      ? `/${attraction.cities.countries.slug}/${attraction.cities.slug}/${attraction.slug}`
      : null;

  const isDirty = draft.trim() !== (answer?.answer ?? "").trim();

  async function handleSave() {
    const trimmed = draft.trim();
    if (!trimmed || !answer) return;

    setSaving(true);
    setError(null);
    try {
      await editAnswer(answer.id, trimmed);
      onChanged();
    } catch {
      setError("Não foi possível salvar a resposta. Tente novamente.");
      setSaving(false);
    }
  }

  async function handleHide() {
    setHiding(true);
    setError(null);
    try {
      await hideQuestion(question.id);
      onChanged();
    } catch {
      setError("Não foi possível ocultar a pergunta. Tente novamente.");
      setHiding(false);
      setConfirmingHide(false);
    }
  }

  return (
    <div className="rounded-xl border border-oliva/15 bg-branco p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-tinta">
          {attraction?.name ?? "Atração removida"}
          {attraction?.cities && (
            <span className="font-normal text-oliva">
              {" "}
              · {attraction.cities.name}
            </span>
          )}
        </p>
        {attractionHref && (
          <Link
            href={attractionHref}
            target="_blank"
            className="text-xs text-terracota hover:underline"
          >
            Ver página da atração
          </Link>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-sm text-tinta">
          <span className="font-medium">{question.asker.displayName}</span>{" "}
          perguntou:
        </p>
        <p className="text-xs text-oliva">{formatDate(question.createdAt)}</p>
      </div>
      <p className="mt-1 leading-relaxed text-tinta">{question.question}</p>

      <div className="mt-3">
        {answer && (
          <p className="mb-1 text-xs text-oliva">
            Resposta de{" "}
            <span className="font-medium">{answer.author.displayName}</span> ·{" "}
            {formatDate(answer.updatedAt)}
          </p>
        )}
        <textarea
          rows={2}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className={inputClass}
          disabled={saving}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !draft.trim() || !isDirty}
            className="rounded-full bg-terracota px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
          <button
            type="button"
            onClick={() => setConfirmingHide(true)}
            disabled={saving}
            className="rounded-full border border-oliva/30 px-4 py-1.5 text-xs text-oliva transition-colors hover:bg-areia disabled:opacity-60"
          >
            Ocultar pergunta
          </button>
        </div>
      </div>

      {error && <p className="mt-2 text-xs text-terracota">{error}</p>}

      {confirmingHide && (
        <ConfirmDialog
          message="Tem certeza que quer ocultar esta pergunta? Ela deixará de aparecer para todos."
          confirmLabel="Sim, ocultar"
          pendingLabel="Ocultando..."
          pending={hiding}
          onConfirm={handleHide}
          onCancel={() => setConfirmingHide(false)}
        />
      )}
    </div>
  );
}

export default function AnsweredQuestionsList({
  initialQuestions,
}: {
  initialQuestions: AnsweredQuestion[];
}) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const data = await getAllAnsweredQuestions();
      setQuestions(data);
    } catch (error) {
      console.error("Não foi possível atualizar as perguntas respondidas:", error);
    } finally {
      setLoading(false);
    }
  }

  if (questions.length === 0) {
    return <p className="text-oliva">Nenhuma pergunta respondida ainda.</p>;
  }

  return (
    <div className={`flex flex-col gap-3 ${loading ? "opacity-60" : ""}`}>
      {questions.map((question) => (
        <AnsweredQuestionCard
          key={question.id}
          question={question}
          onChanged={refresh}
        />
      ))}
    </div>
  );
}
