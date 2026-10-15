// Gera os mapas que o shader de components/CachoeiraAnimada.tsx usa para saber onde e como a aquarela se mexe.
// Uso: node scripts/gerar-mascara-cachoeira.mjs (refazer se a pintura roteiro-cachoeira-aquarela.webp mudar)
//   public/roteiro-cachoeira-mascara.png: R = queda d'agua (so o miolo), G = lago, B = espuma na base da queda.
//   public/roteiro-cachoeira-fluxo.png (1/4 da resolucao): R = distancia ate a borda de onde a agua cai (px / 2),
//                                         G = comprimento total do fio d'agua (px / 2), B = quanto a copa balanca com o vento.
// A cor decide o que e agua (branco neutro = queda, azul-esverdeado = lago); os poligonos so tiram falsos positivos.
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const dir = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url));
const SRC = dir("roteiro-cachoeira-aquarela.webp");
const W = 1536;
const H = 1024;

// Poligonos em pixels da pintura (1536x1024).
const QUEDA = "470,640 470,590 560,560 690,505 770,470 870,425 1000,410 1090,385 1170,350 1330,335 1430,345 1430,738 1100,742 800,718 470,712";
const ESPUMA = "470,640 820,665 1000,672 1330,690 1345,745 1100,748 800,728 470,712";
const LAGO = "250,706 820,716 1100,742 1300,742 1330,752 1536,752 1536,1024 250,1024";
const COPAS = "360,0 1536,0 1536,340 1330,350 1170,372 1000,420 870,445 690,525 560,575 470,605 360,650";
// Troncos grossos ficam parados; galhos finos e folhas balancam juntos.
const TRONCOS = [
  "1285,30 1305,75 1345,125 1385,165 1430,205 1470,238 1505,268",
  "1442,0 1452,60 1458,110 1475,160 1493,210 1512,255 1536,300",
];
// Linha onde as copas encontram a rocha: acima dela quanto mais alto, mais balanca.
const CUME = [[360, 640], [470, 600], [560, 570], [690, 520], [770, 480], [870, 440], [1000, 415], [1090, 390], [1170, 365], [1330, 345], [1430, 345], [1536, 335]];

const ss = (lo, hi, x) => {
  const t = Math.min(1, Math.max(0, (x - lo) / (hi - lo)));
  return t * t * (3 - 2 * t);
};

function cume(x) {
  for (let i = 1; i < CUME.length; i++) {
    if (x <= CUME[i][0]) {
      const [x0, y0] = CUME[i - 1];
      const [x1, y1] = CUME[i];
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
  }
  return CUME[CUME.length - 1][1];
}

// Float32Array 0..1 -> desfoque gaussiano -> Float32Array 0..1.
async function blur(arr, sigma) {
  const bytes = Uint8Array.from(arr, (v) => Math.round(v * 255));
  const out = await sharp(bytes, { raw: { width: W, height: H, channels: 1 } })
    .blur(sigma)
    .toColourspace("b-w") // sem isso o raw volta com 3 canais
    .raw()
    .toBuffer();
  return Float32Array.from(out, (v) => v / 255);
}

async function desenho(svgBody, feather) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#000"/>${svgBody}</svg>`;
  const out = await sharp(Buffer.from(svg)).greyscale().blur(feather).raw().toBuffer();
  return Float32Array.from(out, (v) => v / 255);
}
const poligono = (points, feather) => desenho(`<polygon points="${points}" fill="#fff"/>`, feather);
const tracos = (lines, largura, feather) =>
  desenho(lines.map((p) => `<polyline points="${p}" fill="none" stroke="#fff" stroke-width="${largura}" stroke-linecap="round" stroke-linejoin="round"/>`).join(""), feather);

const { data } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const branco = new Float32Array(W * H);
const agua = new Float32Array(W * H);
const folha = new Float32Array(W * H);
const PAPEL = [0.96, 0.91, 0.8];
for (let i = 0; i < W * H; i++) {
  const r = data[i * 3] / 255;
  const g = data[i * 3 + 1] / 255;
  const b = data[i * 3 + 2] / 255;
  // Claro e neutro: nao e o creme do papel (r > b) nem o verde amarelado da folhagem (g > b).
  branco[i] = ss(0.6, 0.78, Math.min(r, g, b)) * (1 - ss(0.05, 0.11, r - b)) * (1 - ss(0.05, 0.12, g - b));
  // Azul-esverdeado; oliva (ilhota, pedras, folhas) e papel ficam de fora.
  agua[i] = ss(-0.14, -0.02, b - r);
  // Qualquer coisa que nao seja o creme do papel (folha, galho, sombra).
  folha[i] = ss(0.08, 0.2, Math.hypot(r - PAPEL[0], g - PAPEL[1], b - PAPEL[2]));
}

const [roiQueda, roiEspuma, roiLago, roiCopas, troncos, brancoSuave, brancoFino, copaSuave] = await Promise.all([
  poligono(QUEDA, 5),
  poligono(ESPUMA, 6),
  poligono(LAGO, 7),
  poligono(COPAS, 18),
  tracos(TRONCOS, 32, 5),
  blur(branco, 5),
  blur(branco, 1.5),
  blur(folha, 22),
]);

const espuma = Float32Array.from(brancoFino, (v, i) => ss(0.3, 0.75, v) * roiEspuma[i]);
// Cortina: desfocar antes do limiar fecha os vaos escuros entre os fios brancos da queda.
const cortina = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) cortina[i] = ss(0.12, 0.38, brancoSuave[i]) * roiQueda[i] > 0.5 ? 1 : 0;
// Miolo da queda: encolhe ~9 px para a animacao nao chegar na borda, onde a pintura encontra a rocha.
const miolo = await blur(Float32Array.from(cortina), 9);

// Para cada cortina: distancia ate a borda de onde a agua cai e comprimento total do fio d'agua.
// Distancia euclidiana ate a borda de cima (so trechos voltados para cima, nao as laterais), por cortina.
function edt(feature) {
  const INF = 1e20;
  const g = new Float64Array(W * H);
  for (let i = 0; i < W * H; i++) g[i] = feature[i] ? 0 : INF;
  const n = Math.max(W, H);
  const v = new Int32Array(n);
  const z = new Float64Array(n + 1);
  const f = new Float64Array(n);
  const d = new Float64Array(n);
  const passada = (len, get, set) => {
    for (let q = 0; q < len; q++) f[q] = get(q);
    let k = 0;
    v[0] = 0;
    z[0] = -INF;
    z[1] = INF;
    for (let q = 1; q < len; q++) {
      let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      while (s <= z[k]) {
        k--;
        s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      }
      k++;
      v[k] = q;
      z[k] = s;
      z[k + 1] = INF;
    }
    k = 0;
    for (let q = 0; q < len; q++) {
      while (z[k + 1] < q) k++;
      d[q] = (q - v[k]) ** 2 + f[v[k]];
    }
    for (let q = 0; q < len; q++) set(q, d[q]);
  };
  for (let x = 0; x < W; x++) passada(H, (y) => g[y * W + x], (y, val) => (g[y * W + x] = val));
  for (let y = 0; y < H; y++) passada(W, (x) => g[y * W + x], (x, val) => (g[y * W + x] = val));
  return Float32Array.from(g, (val) => Math.sqrt(Math.min(val, 1e7)));
}

// Cortina fechada (sem furos pequenos) e a direcao para onde cada borda aponta.
// A faixa de espuma une as cortinas na base; sem ela cada cortina e uma peca separada e a espuma vira a borda de baixo.
const semEspuma = Float32Array.from(cortina, (v, i) => (espuma[i] < 0.35 ? v : 0));
const fechada = Uint8Array.from(await blur(semEspuma, 6), (v) => (v > 0.4 ? 1 : 0));
const suave = await blur(Float32Array.from(fechada), 12); // bem suave: so a orientacao geral da borda conta, nao os dentes
const rotulo = new Int32Array(W * H);
const areas = [0];
{
  const fila = new Int32Array(W * H);
  for (let s = 0; s < W * H; s++) {
    if (!fechada[s] || rotulo[s]) continue;
    const id = areas.length;
    let ini = 0;
    let fim = 0;
    fila[fim++] = s;
    rotulo[s] = id;
    while (ini < fim) {
      const i = fila[ini++];
      const x = i % W;
      for (const j of [x < W - 1 ? i + 1 : -1, x > 0 ? i - 1 : -1, i + W, i - W]) {
        if (j >= 0 && j < W * H && fechada[j] && !rotulo[j]) {
          rotulo[j] = id;
          fila[fim++] = j;
        }
      }
    }
    areas.push(fim);
  }
}
const acima = new Float32Array(W * H);
const total = new Float32Array(W * H);
const distCortina = new Float32Array(W * H).fill(1e9); // distancia ate a cortina cujos valores o pixel usa
for (let id = 1; id < areas.length; id++) {
  if (areas[id] < 400) continue;
  const topo = new Uint8Array(W * H);
  const base = new Uint8Array(W * H);
  // So a metade de cima da cortina pode ter borda de queda e so a de baixo pode ter base: assim a "saia" que a cortina
  // abre perto da agua nao e confundida com outra borda, e o fio d'agua vai do alto ate a espuma.
  let minY = H;
  let maxY = 0;
  for (let i = 0; i < W * H; i++) {
    if (rotulo[i] !== id) continue;
    minY = Math.min(minY, (i / W) | 0);
    maxY = Math.max(maxY, (i / W) | 0);
  }
  const meio = (minY + maxY) / 2;
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      if (rotulo[i] !== id) continue;
      // Borda: algum vizinho de fora. A normal (gradiente da mascara suave) diz se ela olha para cima, para baixo ou para o lado.
      if (rotulo[i - 1] === id && rotulo[i + 1] === id && rotulo[i - W] === id && rotulo[i + W] === id) continue;
      const gx = suave[i + 1] - suave[i - 1];
      const gy = suave[i + W] - suave[i - W];
      const m = Math.hypot(gx, gy) || 1;
      if (gy / m > 0.7 && y <= meio) topo[i] = 1; // a mascara cresce para baixo: borda de cima
      if (gy / m < -0.7 && y >= meio) base[i] = 1; // a mascara cresce para cima: borda de baixo
    }
  }
  const dTopo = edt(topo);
  const dBase = edt(base);
  // Os valores continuam por uma boa faixa para fora da cortina (ate dentro da espuma): sem isso o shader leria um degrau na emenda.
  const dentro = edt(Uint8Array.from(rotulo, (r) => (r === id ? 1 : 0)));
  for (let i = 0; i < W * H; i++) {
    const vale = rotulo[i] === id || (rotulo[i] === 0 && dentro[i] <= 70 && dentro[i] < distCortina[i]);
    if (!vale) continue;
    distCortina[i] = rotulo[i] === id ? 0 : dentro[i];
    acima[i] = dTopo[i];
    total[i] = dTopo[i] + dBase[i];
  }
}

// Vento: so nas copas, mais forte quanto mais alto acima da rocha e mais perto de quem olha; troncos grossos parados.
const vento = new Float32Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = y * W + x;
    const altura = ss(0, 220, cume(x) - y);
    const frente = 0.45 + 0.55 * ss(550, 1150, x); // as arvores do fundo balancam menos
    // copaSuave e a folhagem bem desfocada: a copa inteira (com as lacunas entre folhas) se move junta, e o papel liso fica parado.
    vento[i] = roiCopas[i] * ss(0.12, 0.5, copaSuave[i]) * altura * frente * (1 - 0.9 * troncos[i]);
  }
}

const A = Buffer.alloc(W * H * 3);
const B = Buffer.alloc(W * H * 3);
for (let i = 0; i < W * H; i++) {
  A[i * 3] = Math.round(255 * ss(0.55, 0.95, miolo[i]));
  A[i * 3 + 1] = Math.round(255 * agua[i] * roiLago[i]);
  A[i * 3 + 2] = Math.round(255 * espuma[i]);
  B[i * 3] = Math.min(255, Math.round(acima[i] / 2));
  B[i * 3 + 1] = Math.min(255, Math.round(total[i] / 2));
  B[i * 3 + 2] = Math.round(255 * vento[i]);
}

// O shader amostra com filtro bilinear: a mascara fica em metade da resolucao e o fluxo (rampas suaves) em um quarto.
for (const [nome, buf, escala] of [["roteiro-cachoeira-mascara.png", A, 2], ["roteiro-cachoeira-fluxo.png", B, 4]]) {
  await sharp(buf, { raw: { width: W, height: H, channels: 3 } })
    .resize(W / escala, H / escala)
    .png({ compressionLevel: 9 })
    .toFile(dir(nome));
  console.log("ok", dir(nome));
}
