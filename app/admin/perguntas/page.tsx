import { getAllPendingQuestions } from "@/lib/questions";
import PendingQuestionsList from "@/components/admin/PendingQuestionsList";

export default async function AdminPerguntasPage() {
  const questions = await getAllPendingQuestions();

  return (
    <div>
      <h1 className="font-serif text-2xl text-tinta">Perguntas pendentes</h1>
      <p className="mt-1 text-sm text-oliva">
        Perguntas feitas pelos viajantes em qualquer atração, aguardando
        resposta — tudo num só lugar.
      </p>

      <div className="mt-6">
        <PendingQuestionsList initialQuestions={questions} />
      </div>
    </div>
  );
}
