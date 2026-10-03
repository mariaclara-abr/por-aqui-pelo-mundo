export default function UpdatedAt({ date, className = "" }: { date: string; className?: string }) {
  return (
    <p className={`text-xs text-oliva ${className}`}>
      Atualizado em{" "}
      <time dateTime={date}>
        {new Date(date).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}
      </time>
    </p>
  );
}
