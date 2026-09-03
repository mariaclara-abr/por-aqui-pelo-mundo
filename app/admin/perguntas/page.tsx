import { getAllAnsweredQuestions, getAllPendingQuestions } from "@/lib/questions";
import QuestionsPanel from "@/components/admin/QuestionsPanel";

export default async function AdminPerguntasPage() {
  const [pendingQuestions, answeredQuestions] = await Promise.all([
    getAllPendingQuestions(),
    getAllAnsweredQuestions(),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl text-tinta">Perguntas</h1>
      <p className="mt-1 text-sm text-oliva">
        Perguntas feitas pelos viajantes em qualquer país, cidade ou atração,
        tudo num só lugar.
      </p>

      <div className="mt-6">
        <QuestionsPanel
          initialPending={pendingQuestions}
          initialAnswered={answeredQuestions}
        />
      </div>
    </div>
  );
}
