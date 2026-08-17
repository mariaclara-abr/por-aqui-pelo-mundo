type WelcomeWord = {
  text: string;
  font: "font-serif" | "font-sans";
  style?: string;
  color: "text-terracota" | "text-oliva" | "text-tinta";
  size: string;
};

const WELCOME_WORDS: WelcomeWord[] = [
  { text: "Bem-vindo", font: "font-serif", style: "italic", color: "text-terracota", size: "text-2xl" },
  { text: "欢迎", font: "font-sans", style: "font-bold", color: "text-oliva", size: "text-2xl" },
  { text: "Bienvenue", font: "font-sans", style: "font-light", color: "text-terracota", size: "text-lg" },
  { text: "Välkommen", font: "font-sans", style: "uppercase tracking-wide", color: "text-tinta", size: "text-base" },
  { text: "ようこそ", font: "font-serif", color: "text-terracota", size: "text-xl" },
  { text: "Welcome", font: "font-sans", style: "font-bold uppercase tracking-wide", color: "text-oliva", size: "text-base" },
  { text: "Benvenuto", font: "font-sans", style: "uppercase tracking-widest", color: "text-tinta", size: "text-base" },
  { text: "Bienvenido", font: "font-serif", color: "text-tinta", size: "text-xl" },
  { text: "مرحباً", font: "font-sans", color: "text-terracota", size: "text-lg" },
  { text: "Willkommen", font: "font-serif", style: "italic font-semibold", color: "text-oliva", size: "text-2xl" },
];

function WelcomeItem({ word }: { word: WelcomeWord }) {
  return (
    <span
      className={`${word.font} ${word.style ?? ""} ${word.color} ${word.size} whitespace-nowrap`}
    >
      {word.text}
    </span>
  );
}

export default function WelcomeMarquee() {
  const track = [...WELCOME_WORDS, ...WELCOME_WORDS];

  return (
    <section className="overflow-hidden bg-areia py-4 sm:py-5">
      <span className="sr-only">Bem-vindo</span>
      <div
        aria-hidden="true"
        className="marquee-track flex w-max items-center gap-8 hover:[animation-play-state:paused] sm:gap-10"
      >
        {track.map((word, index) => (
          <span key={index} className="flex items-center gap-8 sm:gap-10">
            <WelcomeItem word={word} />
            <span className="text-sm text-terracota/50">•</span>
          </span>
        ))}
      </div>
    </section>
  );
}
