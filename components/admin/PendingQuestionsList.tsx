"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { inputClass } from "@/components/admin/FormField";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  getAllPendingQuestions,
  hideAdminQuestion,
  submitAdminAnswer,
  type AdminQuestionSubjectType,
} from "@/lib/questions";

type PendingQuestion = Awaited<ReturnType<typeof getAllPendingQuestions>>[number];

const removedSubjectLabel: Record<AdminQuestionSubjectType, string> = {
  attraction: "Atração removida",
  city: "Cidade removida",
  country: "País removido",
};

const subjectLinkLabel: Record<AdminQuestionSubjectType, string> = {
  attraction: "Ver página da atração",
  city: "Ver página da cidade",
  country: "Ver página do país",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function PendingQuestionCard({
  question,
  authorId,
  onChanged,
}: {
  question: PendingQuestion;
  authorId: string | undefined;
  onChanged: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmingHide, setConfirmingHide] = useState(false);
  const [hiding, setHiding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subject = question.subject;

  async function handleAnswer() {
    const trimmed = draft.trim();
    if (!trimmed || !authorId) return;

    setSaving(true);
    setError(null);
    try {
      await submitAdminAnswer(question.subjectType, question.id, authorId, trimmed);
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
      await hideAdminQuestion(question.subjectType, question.id);
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
          {subject?.name ?? removedSubjectLabel[question.subjectType]}
          {subject?.breadcrumb && (
            <span className="font-normal text-oliva"> · {subject.breadcrumb}</span>
          )}
        </p>
        {subject && (
          <Link
            href={subject.href}
            target="_blank"
            className="text-xs text-terracota hover:underline"
          >
            {subjectLinkLabel[question.subjectType]}
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
        <textarea
          rows={2}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Escreva a resposta..."
          className={inputClass}
          disabled={saving}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleAnswer}
            disabled={saving || !draft.trim()}
            className="rounded-full bg-terracota px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Responder"}
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

export default function PendingQuestionsList({
  initialQuestions,
}: {
  initialQuestions: PendingQuestion[];
}) {
  const { profile } = useAuth();
  const [questions, setQuestions] = useState(initialQuestions);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const data = await getAllPendingQuestions();
      setQuestions(data);
    } catch (error) {
      console.error("Não foi possível atualizar as perguntas:", error);
    } finally {
      setLoading(false);
    }
  }

  if (questions.length === 0) {
    return (
      <p className="text-oliva">Nenhuma pergunta pendente no momento. Tudo em dia!</p>
    );
  }

  return (
    <div className={`flex flex-col gap-3 ${loading ? "opacity-60" : ""}`}>
      {questions.map((question) => (
        <PendingQuestionCard
          key={question.id}
          question={question}
          authorId={profile?.id}
          onChanged={refresh}
        />
      ))}
    </div>
  );
}
