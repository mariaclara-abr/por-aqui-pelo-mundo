// alt vazio: o nome do país já aparece escrito ao lado da bandeira.
export default function CountryFlag({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="ml-2 inline-block h-[0.75em] w-auto rounded-[2px] align-baseline"
    />
  );
}
