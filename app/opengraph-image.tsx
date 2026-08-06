import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "Por Aqui Pelo Mundo: roteiros de viagem com curadoria de quem esteve lá";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const planeBadge = await readFile(
  join(process.cwd(), "assets/icons/plane-badge.svg"),
);
const planeBadgeDataUri = `data:image/svg+xml;base64,${planeBadge.toString("base64")}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F0E6D2",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={planeBadgeDataUri}
          width={340}
          height={340}
          style={{ display: "flex" }}
        />
      </div>
    ),
    size,
  );
}
