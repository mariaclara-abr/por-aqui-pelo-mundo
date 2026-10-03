const TIMEZONE = "America/Sao_Paulo";

export function formatPtDate(date: Date) {
  return date.toLocaleDateString("pt-BR", { timeZone: TIMEZONE });
}

// Ex.: "01 OUT 2026", para o carimbo.
export function formatStampDate(date: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("pt-BR", {
      timeZone: TIMEZONE,
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );
  return `${parts.day} ${parts.month.replace(".", "").toUpperCase()} ${parts.year}`;
}
