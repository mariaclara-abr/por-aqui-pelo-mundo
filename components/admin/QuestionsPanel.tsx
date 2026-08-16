"use client";

import { useState } from "react";
import PillButton from "@/components/PillButton";
import PendingQuestionsList from "@/components/admin/PendingQuestionsList";
import AnsweredQuestionsList from "@/components/admin/AnsweredQuestionsList";
import type { getAllAnsweredQuestions, getAllPendingQuestions } from "@/lib/questions";

type Tab = "pendentes" | "respondidas";

export default function QuestionsPanel({
  initialPending,
  initialAnswered,
}: {
  initialPending: Awaited<ReturnType<typeof getAllPendingQuestions>>;
  initialAnswered: Awaited<ReturnType<typeof getAllAnsweredQuestions>>;
}) {
  const [tab, setTab] = useState<Tab>("pendentes");

  return (
    <div>
      <div className="flex gap-2">
        <PillButton active={tab === "pendentes"} onClick={() => setTab("pendentes")}>
          Perguntas pendentes
        </PillButton>
        <PillButton
          active={tab === "respondidas"}
          onClick={() => setTab("respondidas")}
        >
          Perguntas respondidas
        </PillButton>
      </div>

      <div className="mt-4">
        {tab === "pendentes" ? (
          <PendingQuestionsList initialQuestions={initialPending} />
        ) : (
          <AnsweredQuestionsList initialQuestions={initialAnswered} />
        )}
      </div>
    </div>
  );
}
