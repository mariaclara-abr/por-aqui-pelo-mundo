type WelcomeWord = {
  text: string;
  font: "font-serif" | "font-sans";
  style?: string;
  size: string;
};

const WELCOME_WORDS: WelcomeWord[] = [
  { text: "Boa viagem", font: "font-serif", style: "italic", size: "text-2xl" },
  { text: "Bon voyage", font: "font-sans", style: "font-light", size: "text-lg" },
  { text: "Trevlig resa", font: "font-sans", style: "uppercase tracking-wide", size: "text-base" },
  { text: "良い旅を", font: "font-serif", size: "text-xl" },
  { text: "Have a good trip", font: "font-sans", style: "font-bold uppercase tracking-wide", size: "text-base" },
  { text: "Buon viaggio", font: "font-sans", style: "uppercase tracking-widest", size: "text-base" },
  { text: "Buen viaje", font: "font-serif", size: "text-xl" },
  { text: "رحلة سعيدة", font: "font-sans", size: "text-lg" },
];

function WelcomeItem({ word }: { word: WelcomeWord }) {
  return (
    <span
      className={`${word.font} ${word.style ?? ""} text-areia ${word.size} whitespace-nowrap`}
    >
      {word.text}
    </span>
  );
}

export default function WelcomeMarquee() {
  const track = [...WELCOME_WORDS, ...WELCOME_WORDS];

  return (
    <section className="overflow-hidden bg-oliva py-4 sm:py-5">
      <span className="sr-only">Boa viagem</span>
      <div
        aria-hidden="true"
        className="marquee-track flex w-max items-center gap-8 hover:[animation-play-state:paused] sm:gap-10"
      >
        {track.map((word, index) => (
          <span key={index} className="flex items-center gap-8 sm:gap-10">
            <WelcomeItem word={word} />
            <span className="text-sm text-areia/60">•</span>
          </span>
        ))}
      </div>
    </section>
  );
}
