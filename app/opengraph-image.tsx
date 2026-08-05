import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "Por Aqui Pelo Mundo — roteiros de viagem com curadoria de quem esteve lá";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const frauncesSemibold = await readFile(
  join(process.cwd(), "assets/fonts/fraunces-semibold.ttf"),
);
const interRegular = await readFile(
  join(process.cwd(), "assets/fonts/inter-regular.ttf"),
);

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
        <div
          style={{
            fontFamily: "Fraunces",
            fontSize: 86,
            color: "#C1653A",
            letterSpacing: -1,
            display: "flex",
          }}
        >
          Por Aqui Pelo Mundo
        </div>
        <div
          style={{
            width: 90,
            height: 3,
            background: "#C1653A",
            marginTop: 32,
            marginBottom: 32,
            display: "flex",
          }}
        />
        <div
          style={{
            fontFamily: "Inter",
            fontSize: 32,
            color: "#2B2620",
            textAlign: "center",
            maxWidth: 860,
            display: "flex",
          }}
        >
          Roteiros de viagem com curadoria de quem esteve lá
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: frauncesSemibold, style: "normal", weight: 600 },
        { name: "Inter", data: interRegular, style: "normal", weight: 400 },
      ],
    },
  );
}
