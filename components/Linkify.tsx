const URL_PATTERN = /(https?:\/\/[^\s<>"]+|www\.[^\s<>"]+)/gi;

function toHref(match: string) {
  return match.startsWith("www.") ? `https://${match}` : match;
}

// Quebra o texto em partes, transformando URLs em links clicáveis, mas
// preservando o restante como texto puro (o texto vem da curadoria, nunca
// deve ser interpretado como HTML).
export function linkify(text: string, linkClassName = "text-terracota underline-offset-2 hover:underline") {
  const parts = text.split(URL_PATTERN);

  return parts.map((part, index) => {
    if (part.match(URL_PATTERN)) {
      return (
        <a
          key={index}
          href={toHref(part)}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}
