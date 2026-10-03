import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Imagem de compartilhamento de um lugar (país/cidade): foto de capa em tela
 * cheia e uma faixa sólida com o nome embaixo. Sem foto, fundo areia.
 * ponytail: fonte padrão do ImageResponse; para Fraunces, carregar o .ttf e passar em `fonts`.
 */
export function placeImage({
  name,
  subtitle,
  photoUrl,
}: {
  name: string;
  subtitle?: string;
  photoUrl: string | null;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#F0E6D2",
        }}
      >
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={name}
            width={OG_SIZE.width}
            height={OG_SIZE.height}
            style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }}
          />
        )}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            padding: "36px 56px",
            background: "rgba(43, 38, 32, 0.82)",
            color: "#F0E6D2",
          }}
        >
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#C1653A", textTransform: "uppercase" }}>
            Por Aqui Pelo Mundo
          </div>
          <div style={{ fontSize: 72, lineHeight: 1.1, marginTop: 8 }}>{name}</div>
          {subtitle && <div style={{ fontSize: 30, marginTop: 6, opacity: 0.85 }}>{subtitle}</div>}
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
