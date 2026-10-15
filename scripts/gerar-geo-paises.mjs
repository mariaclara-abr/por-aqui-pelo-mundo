// Gera public/geo/paises-110m.json, o mapa-múndi do globo da tela de geração do
// roteiro Premium. Fonte: Natural Earth 110m (domínio público), a mesma da
// referência do globo. Fica no projeto para a tela não depender do GitHub a cada
// visita. Mantém só o código ADM0_A3 e as coordenadas com 2 casas (≈ 1 km).
// Rodar: node scripts/gerar-geo-paises.mjs
import { writeFileSync } from "node:fs";

const FONTE =
  "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/cultural/ne_110m_admin_0_countries.json";
const bruto = await (await fetch(FONTE)).json();

const arredonda = (c) =>
  typeof c[0] === "number" ? [Math.round(c[0] * 100) / 100, Math.round(c[1] * 100) / 100] : c.map(arredonda);

const features = bruto.features
  // Antártida nunca aparece de frente no globo (que mostra o hemisfério norte) e pesa.
  .filter((f) => f.properties.ADM0_A3 !== "ATA")
  .map((f) => ({
    type: "Feature",
    id: f.properties.ADM0_A3,
    properties: {},
    geometry: { type: f.geometry.type, coordinates: arredonda(f.geometry.coordinates) },
  }));

writeFileSync("public/geo/paises-110m.json", JSON.stringify({ type: "FeatureCollection", features }));
console.log("OK:", features.length, "países");
