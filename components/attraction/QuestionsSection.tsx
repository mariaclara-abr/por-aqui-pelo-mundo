"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { inputClass } from "@/components/admin/FormField";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  askQuestion,
  getAttractionQuestions,
  hideQuestion,
  submitAnswer,
  editAnswer,
  type AttractionQuestion,
  type QuestionProfile,
} from "@/lib/questions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ProfileLink({
  profile,
  className,
  children,
}: {
  profile: QuestionProfile;
  className?: string;
  children: React.ReactNode;
}) {
  if (!profile.username) return <span className={className}>{children}</span>;
  return (
    <Link href={`/perfil/${profile.username}`} className={className}>
      {children}
    </Link>
  );
}

function Avatar({ profile, size = 9 }: { profile: QuestionProfile; size?: 8 | 9 }) {
  const dimension = size === 8 ? "h-8 w-8" : "h-9 w-9";
  return (
    <div
      className={`${dimension} shrink-0 overflow-hidden rounded-full bg-oliva text-xs font-medium text-white`}
    >
      {profile.avatarUrl ? (
        <img
          src={profile.avatarUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          {profile.displayName.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

function QuestionCard({
  question,
  isAuthor,
  authorProfileId,
  onChanged,
}: {
  question: AttractionQuestion;
  isAuthor: boolean;
  authorProfileId: string | undefined;
  onChanged: () => void;
}) {
  const [answerDraft, setAnswerDraft] = useState(question.answer?.answer ?? "");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmingHide, setConfirmingHide] = useState(false);
  const [hiding, setHiding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canEditAnswer =
    isAuthor && question.answer && question.answer.author.id === authorProfileId;
  const wasEdited =
    question.answer && question.answer.updatedAt !== question.answer.createdAt;

  async function handleSubmitAnswer() {
    const trimmed = answerDraft.trim();
    if (!trimmed) return;

    setSaving(true);
    setError(null);
    try {
      if (question.answer) {
        await editAnswer(question.answer.id, trimmed);
      } else {
        await submitAnswer(question.id, authorProfileId!, trimmed);
      }
      setEditing(false);
      onChanged();
    } catch {
      setError("Não foi possível salvar a resposta. Tente novamente.");
    } finally {
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
    <div className="rounded-xl bg-branco/90 p-4">
      <div className="flex items-start gap-3">
        <ProfileLink profile={question.asker}>
          <Avatar profile={question.asker} />
        </ProfileLink>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <ProfileLink
              profile={question.asker}
              className="text-sm font-medium text-tinta hover:text-terracota hover:underline"
            >
              {question.asker.displayName}
            </ProfileLink>
            <p className="text-xs text-oliva">{formatDate(question.createdAt)}</p>
          </div>
          <p className="mt-1 leading-relaxed text-tinta">{question.question}</p>
        </div>
      </div>

      {question.answer && !editing && (
        <div className="mt-3 ml-4 rounded-lg border-l-4 border-terracota bg-terracota/5 p-3 sm:ml-12">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ProfileLink profile={question.answer.author}>
                <Avatar profile={question.answer.author} size={8} />
              </ProfileLink>
              <div>
                <ProfileLink
                  profile={question.answer.author}
                  className="rounded-full bg-oliva px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-white hover:bg-oliva/90"
                >
                  Resposta da autora
                </ProfileLink>
                <p className="mt-0.5 text-xs text-oliva">
                  {formatDate(question.answer.createdAt)}
                  {wasEdited ? " · editada" : ""}
                </p>
              </div>
            </div>
            {canEditAnswer && (
              <button
                type="button"
                onClick={() => {
                  setAnswerDraft(question.answer!.answer);
                  setEditing(true);
                }}
                className="text-xs text-terracota hover:underline"
              >
                Editar resposta
              </button>
            )}
          </div>
          <p className="mt-2 leading-relaxed text-tinta">{question.answer.answer}</p>
        </div>
      )}

      {isAuthor && (!question.answer || editing) && (
        <div className="mt-3 ml-4 sm:ml-12">
          <textarea
            rows={2}
            value={answerDraft}
            onChange={(event) => setAnswerDraft(event.target.value)}
            placeholder="Escreva a resposta..."
            className={inputClass}
            disabled={saving}
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={handleSubmitAnswer}
              disabled={saving || !answerDraft.trim()}
              className="rounded-full bg-oliva px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-oliva/90 disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Responder"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setAnswerDraft(question.answer?.answer ?? "");
                }}
                disabled={saving}
                className="rounded-full border border-oliva/30 px-4 py-1.5 text-xs text-oliva transition-colors hover:bg-areia disabled:opacity-60"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      )}

      {!question.answer && !isAuthor && (
        <p className="mt-2 ml-4 text-xs text-oliva sm:ml-12">
          Aguardando resposta da autora.
        </p>
      )}

      {error && <p className="mt-2 text-xs text-terracota">{error}</p>}

      {isAuthor && (
        <div className="mt-2 text-right">
          <button
            type="button"
            onClick={() => setConfirmingHide(true)}
            className="text-xs text-oliva/70 hover:text-terracota hover:underline"
          >
            Ocultar pergunta
          </button>
        </div>
      )}

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

export default function QuestionsSection({
  attractionId,
  initialQuestions,
}: {
  attractionId: string;
  initialQuestions: AttractionQuestion[];
}) {
  const { user, profile, isAuthor, loading: authLoading } = useAuth();
  const [questions, setQuestions] = useState(initialQuestions);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      const data = await getAttractionQuestions(attractionId);
      setQuestions(data);
    } catch (err) {
      console.error("Não foi possível atualizar as perguntas:", err);
    }
  }

  async function handleAsk(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = newQuestion.trim();
    if (!trimmed || !user) return;

    setSubmitting(true);
    setError(null);
    try {
      await askQuestion(attractionId, user.id, trimmed);
      setNewQuestion("");
      await refresh();
    } catch {
      setError("Não foi possível enviar sua pergunta. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {!authLoading && user ? (
        <form
          onSubmit={handleAsk}
          className="rounded-xl bg-branco/90 p-4"
        >
          <label htmlFor="new-question" className="text-sm font-medium text-tinta">
            Faça uma pergunta
          </label>
          <textarea
            id="new-question"
            rows={2}
            value={newQuestion}
            onChange={(event) => setNewQuestion(event.target.value)}
            placeholder="Pergunte algo sobre este lugar..."
            className={`${inputClass} mt-1`}
            disabled={submitting}
          />
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-oliva sm:pr-6">
              Perguntas e respostas ficam públicas para outros viajantes. Quem
              responde é a autora pessoalmente.
            </p>
            <button
              type="submit"
              disabled={submitting || !newQuestion.trim()}
              className="shrink-0 rounded-full bg-oliva px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-oliva/90 disabled:opacity-60"
            >
              {submitting ? "Enviando..." : "Perguntar"}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-terracota">{error}</p>}
        </form>
      ) : (
        !authLoading && (
          <div className="rounded-xl bg-branco/90 p-4 text-sm text-oliva">
            <Link href="/entrar" className="font-medium text-terracota hover:underline">
              Entre
            </Link>{" "}
            para fazer uma pergunta sobre este lugar.
          </div>
        )
      )}

      {questions.length === 0 ? (
        <p className="text-sm text-oliva">
          Ainda não há perguntas sobre este lugar. Seja a primeira pessoa a
          perguntar!
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              isAuthor={isAuthor}
              authorProfileId={profile?.id}
              onChanged={refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}
