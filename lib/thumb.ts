// Miniatura (800px) de uma foto do bucket "media", guardada em "thumbs/<mesmo caminho>".
// Só vale depois de rodar scripts/make-thumbs.mjs; ligue com NEXT_PUBLIC_USE_THUMBS=1.
const MEDIA = "/storage/v1/object/public/media/";

export function thumbUrl<T extends string | null | undefined>(url: T): T {
  if (process.env.NEXT_PUBLIC_USE_THUMBS !== "1" || !url) return url;
  const i = url.indexOf(MEDIA);
  if (i < 0 || url.startsWith(MEDIA + "thumbs/", i)) return url;
  return (url.slice(0, i + MEDIA.length) + "thumbs/" + url.slice(i + MEDIA.length)) as T;
}
