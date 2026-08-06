import { createClient } from "@/lib/supabase-server";
import { AFFILIATE_PROGRAMS } from "@/lib/affiliates";

// MVP: agrega em JS a partir das linhas mais recentes, sem view/RPC dedicada
// no banco — suficiente pro volume esperado nesta fase.
const MAX_ROWS = 1000;

export default async function AfiliadosPage() {
  const supabase = await createClient();

  const { data: clicks, error } = await supabase
    .from("affiliate_clicks")
    .select("affiliate_program, attraction_id, created_at")
    .order("created_at", { ascending: false })
    .limit(MAX_ROWS);

  if (error) throw error;

  const rows = clicks ?? [];
  const countsByProgram = new Map<string, number>();
  const countsByAttraction = new Map<string, number>();

  for (const row of rows) {
    countsByProgram.set(
      row.affiliate_program,
      (countsByProgram.get(row.affiliate_program) ?? 0) + 1,
    );
    if (row.attraction_id) {
      countsByAttraction.set(
        row.attraction_id,
        (countsByAttraction.get(row.attraction_id) ?? 0) + 1,
      );
    }
  }

  const attractionIds = [...countsByAttraction.keys()];
  const { data: attractions } =
    attractionIds.length > 0
      ? await supabase.from("attractions").select("id, name").in("id", attractionIds)
      : { data: [] as { id: string; name: string }[] };

  const nameById = new Map((attractions ?? []).map((a) => [a.id, a.name]));
  const programLabel = (id: string) =>
    AFFILIATE_PROGRAMS.find((program) => program.id === id)?.label ?? id;

  const byProgram = [...countsByProgram.entries()]
    .map(([id, count]) => ({ id, label: programLabel(id), count }))
    .sort((a, b) => b.count - a.count);

  const byAttraction = [...countsByAttraction.entries()]
    .map(([id, count]) => ({
      id,
      name: nameById.get(id) ?? "Atração removida",
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return (
    <div>
      <h1 className="font-serif text-2xl text-tinta">Afiliados</h1>
      <p className="mt-1 text-sm text-oliva">
        Baseado nos últimos {rows.length} cliques registrados (máximo {MAX_ROWS}
        ).
      </p>

      <section className="mt-8">
        <h2 className="font-serif text-lg text-tinta">Cliques por programa</h2>
        {byProgram.length === 0 ? (
          <p className="mt-2 text-sm text-oliva">Nenhum clique registrado ainda.</p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {byProgram.map((program) => (
              <div
                key={program.id}
                className="rounded-xl border border-oliva/15 bg-branco p-5"
              >
                <p className="text-sm text-oliva">{program.label}</p>
                <p className="mt-1 font-serif text-3xl text-tinta">
                  {program.count}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-lg text-tinta">
          Atrações que mais geram cliques
        </h2>
        {byAttraction.length === 0 ? (
          <p className="mt-2 text-sm text-oliva">
            Nenhum clique associado a uma atração ainda.
          </p>
        ) : (
          <div className="mt-3 overflow-hidden rounded-xl border border-oliva/15 bg-branco">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-oliva/15 text-xs uppercase tracking-wide text-oliva">
                  <th className="px-4 py-3">Atração</th>
                  <th className="px-4 py-3 text-right">Cliques</th>
                </tr>
              </thead>
              <tbody>
                {byAttraction.map((attraction) => (
                  <tr
                    key={attraction.id}
                    className="border-b border-oliva/10 last:border-0"
                  >
                    <td className="px-4 py-3 text-tinta">{attraction.name}</td>
                    <td className="px-4 py-3 text-right text-tinta">
                      {attraction.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="mt-8 text-xs text-oliva/70">
        Comissões reais ainda não são exibidas aqui: depende de integrar a
        API de cada programa de afiliado no futuro.
      </p>
    </div>
  );
}
