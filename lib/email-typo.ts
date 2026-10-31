const COMMON_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "yahoo.com.br",
  "icloud.com",
  "uol.com.br",
  "bol.com.br",
  "terra.com.br",
  "live.com",
  "msn.com",
  "globo.com",
  "me.com",
  "protonmail.com",
];

function distance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

/** Mensagem de erro se o e-mail parece ter erro de digitação no domínio; null se estiver ok. */
export function emailTypoMessage(email: string): string | null {
  const [user, domain = ""] = email.trim().toLowerCase().split("@");
  if (!domain.includes(".") || domain.endsWith(".")) {
    return "Esse e-mail parece incompleto. Confira se digitou tudo, por exemplo nome@gmail.com.";
  }
  if (COMMON_DOMAINS.includes(domain)) return null;
  const match = COMMON_DOMAINS.find((d) => distance(domain, d) <= 2);
  return match
    ? `Confira o e-mail: "${domain}" parece um erro de digitação. Você quis dizer ${user}@${match}?`
    : null;
}
