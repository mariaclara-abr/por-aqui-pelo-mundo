import { slugify } from "@/lib/slugify";
import { categoryLabels } from "@/types/database";

export interface ExportAttractionItem {
  name: string;
  categories: string[];
  cityName: string;
  curationRating: number | null;
  description: string | null;
  coverPhotoUrl: string | null;
  suggestedStartTime: string | null;
  suggestedDurationMinutes: number | null;
  isSuggestion: boolean;
  tips?: string | null;
  number?: number;
}

export interface ExportDay {
  dayNumber: number;
  date: string | null;
  items: ExportAttractionItem[];
}

export interface ExportItinerary {
  title: string;
  days: ExportDay[];
  // Pontos na ordem do roteiro; vira uma página com o mapa numerado.
  // Um mapa por cidade, com a numeração global do roteiro.
  mapPoints?: (GoogleMapsPoint & { name: string; number: number; cityName: string })[];
}

// Resumo de texto de curadoria: tira marcações (**, ✓), junta linhas e corta
// no fim de uma frase perto do limite.
export function summarizeText(text: string | null | undefined, max: number) {
  const clean = (text ?? "")
    .replace(/\*\*/g, "")
    .replace(/[✓•]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  return end > max * 0.5 ? cut.slice(0, end + 1) : `${cut.replace(/\s+\S*$/, "")}...`;
}

// Monta o mapa como imagem juntando os tiles do OpenStreetMap num canvas e
// desenhando o caminho tracejado e os marcadores numerados na ordem do roteiro.
async function renderMapImage(points: { lat: number; lng: number; number: number }[]): Promise<string> {
  const W = 1400;
  const H = 900;
  const PAD = 110;
  const TILE = 256;
  const toPx = (lat: number, lng: number, z: number) => {
    const n = 2 ** z * TILE;
    const rad = (lat * Math.PI) / 180;
    return {
      x: ((lng + 180) / 360) * n,
      y: ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n,
    };
  };

  let z = 17;
  for (; z > 1; z--) {
    const px = points.map((pt) => toPx(pt.lat, pt.lng, z));
    const xs = px.map((q) => q.x);
    const ys = px.map((q) => q.y);
    if (
      Math.max(...xs) - Math.min(...xs) <= W - PAD * 2 &&
      Math.max(...ys) - Math.min(...ys) <= H - PAD * 2
    )
      break;
  }
  const px = points.map((pt) => toPx(pt.lat, pt.lng, z));
  const cx = (Math.min(...px.map((q) => q.x)) + Math.max(...px.map((q) => q.x))) / 2;
  const cy = (Math.min(...px.map((q) => q.y)) + Math.max(...px.map((q) => q.y))) / 2;
  const left = cx - W / 2;
  const top = cy - H / 2;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#F0E6D2";
  ctx.fillRect(0, 0, W, H);

  const maxTile = 2 ** z;
  const tiles: Promise<void>[] = [];
  for (let tx = Math.floor(left / TILE); tx <= Math.floor((left + W) / TILE); tx++) {
    for (let ty = Math.floor(top / TILE); ty <= Math.floor((top + H) / TILE); ty++) {
      if (ty < 0 || ty >= maxTile) continue;
      tiles.push(
        new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            ctx.drawImage(img, tx * TILE - left, ty * TILE - top, TILE, TILE);
            resolve();
          };
          // Tile que falha fica na cor de fundo, não derruba o PDF.
          img.onerror = () => resolve();
          setTimeout(resolve, 8000);
          img.src = `https://tile.openstreetmap.org/${z}/${((tx % maxTile) + maxTile) % maxTile}/${ty}.png`;
        }),
      );
    }
  }
  await Promise.all(tiles);

  const pos = px.map((q) => ({ x: q.x - left, y: q.y - top }));
  if (pos.length > 1) {
    ctx.strokeStyle = "#C1653A";
    ctx.lineWidth = 5;
    ctx.setLineDash([16, 12]);
    ctx.beginPath();
    pos.forEach((q, i) => (i === 0 ? ctx.moveTo(q.x, q.y) : ctx.lineTo(q.x, q.y)));
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 24px sans-serif";
  pos.forEach((q, i) => {
    ctx.fillStyle = "#C1653A";
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(q.x, q.y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(String(points[i].number), q.x, q.y + 1);
  });
  ctx.font = "16px sans-serif";
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillRect(W - 230, H - 28, 230, 28);
  ctx.fillStyle = "#2B2620";
  ctx.fillText("© OpenStreetMap", W - 8, H - 13);

  return canvas.toDataURL("image/png");
}

function buildMapPage(
  dataUrl: string,
  title: string,
  entries: { number: number; name: string }[],
) {
  const page = el("div", "bg-branco p-16 font-sans");
  page.style.width = `${PAGE_WIDTH_PX}px`;
  page.appendChild(el("h2", "border-b-2 border-terracota pb-4 font-serif text-3xl text-tinta", title));
  page.appendChild(
    el("p", "mt-4 text-sm text-oliva", "Os números mostram a ordem das atrações no roteiro."),
  );
  const img = document.createElement("img");
  img.src = dataUrl;
  img.className = "mt-6 w-full rounded-xl";
  page.appendChild(img);
  const list = el("ol", "mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-tinta");
  entries.forEach((e) => list.appendChild(el("li", undefined, `${e.number}. ${e.name}`)));
  page.appendChild(list);
  page.appendChild(buildFooter());
  return page;
}

// Dimensões de uma página A4 a 96dpi, usar essa largura fixa no container
// deixa a conversão pixel→mm previsível independente do `scale` do
// html2canvas (ver exportItineraryToPDF).
const PAGE_WIDTH_PX = 794;
const PAGE_HEIGHT_PX = 1123;

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function buildFooter() {
  return el(
    "p",
    "mt-8 border-t border-oliva/15 pt-4 text-center text-xs text-oliva",
    "Planejado em Por Aqui Pelo Mundo",
  );
}

function buildCoverPage(itinerary: ExportItinerary) {
  const totalItems = itinerary.days.reduce((sum, day) => sum + day.items.length, 0);

  const page = el(
    "div",
    "flex flex-col justify-between bg-branco p-16 font-sans",
  );
  page.style.width = `${PAGE_WIDTH_PX}px`;
  page.style.height = `${PAGE_HEIGHT_PX}px`;

  const top = el("div");
  top.appendChild(el("div", "h-1.5 w-24 rounded-full bg-terracota"));
  top.appendChild(el("h1", "mt-10 font-serif text-5xl leading-tight text-tinta", itinerary.title));
  top.appendChild(el("p", "mt-4 text-lg text-oliva", "Roteiro de viagem"));
  top.appendChild(
    el(
      "p",
      "mt-8 text-sm uppercase tracking-wide text-oliva",
      `${itinerary.days.length} ${itinerary.days.length === 1 ? "dia" : "dias"} · ${totalItems} ${
        totalItems === 1 ? "atração" : "atrações"
      }`,
    ),
  );
  page.appendChild(top);
  page.appendChild(buildFooter());

  return page;
}

function buildItemCard(item: ExportAttractionItem) {
  const card = el("div", "flex gap-4 border-b border-oliva/15 pb-6");

  const photoWrap = el(
    "div",
    "h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-areia",
  );
  if (item.coverPhotoUrl) {
    const img = document.createElement("img");
    img.src = item.coverPhotoUrl;
    img.crossOrigin = "anonymous";
    img.className = "h-full w-full object-cover";
    photoWrap.appendChild(img);
  }
  card.appendChild(photoWrap);

  const info = el("div", "min-w-0 flex-1");

  const nameRow = el("div", "flex flex-wrap items-baseline justify-between gap-2");
  nameRow.appendChild(
    el("h3", "font-serif text-xl text-tinta", item.number ? `${item.number}. ${item.name}` : item.name),
  );
  const timeParts = [
    item.suggestedStartTime,
    item.suggestedDurationMinutes ? `≈ ${item.suggestedDurationMinutes} min` : null,
  ].filter((part): part is string => !!part);
  if (timeParts.length > 0) {
    nameRow.appendChild(
      el("span", "text-sm font-medium text-terracota", timeParts.join(" · ")),
    );
  }
  info.appendChild(nameRow);

  const metaParts = [categoryLabels(item.categories), item.cityName];
  info.appendChild(
    el(
      "p",
      "text-xs uppercase tracking-wide text-oliva",
      metaParts.join(" · "),
    ),
  );

  if (item.isSuggestion) {
    info.appendChild(
      el(
        "span",
        "mt-1 inline-block rounded-full border border-oliva/30 px-2 py-0.5 text-[10px] text-oliva",
        "Sugestão da IA",
      ),
    );
  }

  if (item.description) {
    info.appendChild(
      el("p", "mt-2 text-sm leading-relaxed text-tinta/90", item.description),
    );
  }

  if (item.tips) {
    const tip = el("p", "mt-2 text-sm leading-relaxed text-oliva");
    tip.appendChild(el("strong", "font-medium", "Dica: "));
    tip.appendChild(document.createTextNode(item.tips));
    info.appendChild(tip);
  }

  card.appendChild(info);
  return card;
}

function buildDayPage(day: ExportDay) {
  const page = el("div", "bg-branco p-16 font-sans");
  page.style.width = `${PAGE_WIDTH_PX}px`;

  const header = el("div", "flex items-baseline justify-between border-b-2 border-terracota pb-4");
  header.appendChild(el("h2", "font-serif text-3xl text-tinta", `Dia ${day.dayNumber}`));
  if (day.date) {
    header.appendChild(
      el("p", "text-sm capitalize uppercase tracking-wide text-oliva", formatDate(day.date)),
    );
  }
  page.appendChild(header);

  const list = el("div", "mt-8 flex flex-col gap-6");
  for (const item of day.items) {
    list.appendChild(buildItemCard(item));
  }
  page.appendChild(list);
  page.appendChild(buildFooter());

  return page;
}

function waitForImages(container: HTMLElement, timeoutMs = 8000): Promise<void> {
  const images = Array.from(container.querySelectorAll("img"));

  return Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        const done = () => resolve();
        img.addEventListener("load", done, { once: true });
        // Uma foto que falha (rede/CORS) nunca deve travar o PDF inteiro,
        // ela só fica em branco.
        img.addEventListener("error", done, { once: true });
        setTimeout(done, timeoutMs);
      });
    }),
  ).then(() => undefined);
}

export interface GoogleMapsPoint {
  lat: number;
  lng: number;
}

// Monta a URL de rotas do Google Maps ligando os pontos do roteiro na ordem
// em que aparecem. Atrações sem coordenadas cadastradas devem ser filtradas
// pelo chamador antes de passar os pontos aqui.
export function exportToGoogleMaps(points: GoogleMapsPoint[]): string {
  const path = points.map((point) => `${point.lat},${point.lng}`).join("/");
  return `https://www.google.com/maps/dir/${path}`;
}

// Gera o PDF a partir do resultado de "Organizar com IA" (título + dias com
// horários), renderizando cada página como um elemento HTML off-screen com as
// mesmas classes Tailwind do site, herda as fontes (Fraunces/Inter) e cores
// da identidade visual automaticamente, e rasterizando com html2canvas.
export async function exportItineraryToPDF(itinerary: ExportItinerary): Promise<void> {
  const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas-pro"),
  ]);

  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidthMm = pdf.internal.pageSize.getWidth();
  const pageHeightMm = pdf.internal.pageSize.getHeight();

  const stage = document.createElement("div");
  stage.style.position = "fixed";
  stage.style.top = "0";
  stage.style.left = "-10000px";
  stage.style.zIndex = "-1";
  document.body.appendChild(stage);

  try {
    const mapPoints = itinerary.mapPoints ?? [];
    // O mapa é um extra: se os tiles não carregarem, o PDF sai sem ele.
    const mapSections: HTMLElement[] = [];
    const byCity = new Map<string, typeof mapPoints>();
    for (const pt of mapPoints) {
      byCity.set(pt.cityName, [...(byCity.get(pt.cityName) ?? []), pt]);
    }
    for (const [cityName, pts] of byCity) {
      try {
        mapSections.push(
          buildMapPage(
            await renderMapImage(pts),
            byCity.size > 1 ? `Mapa: ${cityName}` : "Mapa do roteiro",
            pts,
          ),
        );
      } catch (error) {
        console.error("Não foi possível montar o mapa do PDF:", error);
      }
    }

    const sections = [
      buildCoverPage(itinerary),
      ...mapSections,
      ...itinerary.days.map((day) => buildDayPage(day)),
    ];

    let isVeryFirstSlice = true;

    for (const section of sections) {
      stage.innerHTML = "";
      stage.appendChild(section);
      await waitForImages(section);

      const canvas = await html2canvas(section, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#FFFFFF",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidthMm = pageWidthMm;
      const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

      let heightLeftMm = imgHeightMm;
      let positionMm = 0;

      while (heightLeftMm > 0.5) {
        if (!isVeryFirstSlice) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, positionMm, imgWidthMm, imgHeightMm);

        isVeryFirstSlice = false;
        heightLeftMm -= pageHeightMm;
        positionMm -= pageHeightMm;
      }
    }

    pdf.save(`${slugify(itinerary.title) || "roteiro"}.pdf`);
  } finally {
    document.body.removeChild(stage);
  }
}

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function icsDate(dateISO: string, time?: string | null) {
  const [y, m, d] = dateISO.split("-");
  if (!time) return `${y}${m}${d}`;
  const [hh, mm] = time.split(":");
  return `${y}${m}${d}T${pad2(Number(hh))}${pad2(Number(mm))}00`;
}

function addMinutesToTime(time: string, minutes: number) {
  const [hh, mm] = time.split(":").map(Number);
  const total = ((hh * 60 + mm + minutes) % 1440 + 1440) % 1440;
  return `${pad2(Math.floor(total / 60))}:${pad2(total % 60)}`;
}

function nextDayISO(dateISO: string) {
  const date = new Date(`${dateISO}T00:00:00`);
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function icsTimestampNow() {
  return `${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

// Escapa texto conforme RFC 5545, vírgula, ponto e vírgula e barra invertida
// precisam de escape, e quebras de linha viram "\n" literal (uma quebra de
// linha de verdade encerraria a propriedade no meio).
function escapeICSText(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// Quebra linhas maiores que 75 octets, como pede o RFC 5545, alguns
// clientes de agenda mais estritos ignoram a linha inteira se ela vier maior.
function foldICSLine(line: string) {
  if (line.length <= 75) return line;
  let result = line.slice(0, 75);
  let rest = line.slice(75);
  while (rest.length > 0) {
    result += `\r\n ${rest.slice(0, 74)}`;
    rest = rest.slice(74);
  }
  return result;
}

function buildDayEvent(itinerary: ExportItinerary, day: ExportDay): string[] {
  if (!day.date) return [];

  const timedItems = day.items.filter(
    (item): item is ExportAttractionItem & { suggestedStartTime: string } =>
      !!item.suggestedStartTime,
  );

  const lines: string[] = ["BEGIN:VEVENT", `UID:${crypto.randomUUID()}@poraquipelomundo`, `DTSTAMP:${icsTimestampNow()}`];

  if (timedItems.length > 0) {
    const first = timedItems[0];
    const last = timedItems[timedItems.length - 1];
    const endTime = last.suggestedDurationMinutes
      ? addMinutesToTime(last.suggestedStartTime, last.suggestedDurationMinutes)
      : last.suggestedStartTime;

    lines.push(`DTSTART:${icsDate(day.date, first.suggestedStartTime)}`);
    lines.push(`DTEND:${icsDate(day.date, endTime)}`);
  } else {
    lines.push(`DTSTART;VALUE=DATE:${icsDate(day.date)}`);
    lines.push(`DTEND;VALUE=DATE:${icsDate(nextDayISO(day.date))}`);
  }

  lines.push(`SUMMARY:${escapeICSText(`Dia ${day.dayNumber} · ${itinerary.title}`)}`);

  const description = day.items
    .map((item) => {
      const time = item.suggestedStartTime ? `${item.suggestedStartTime} · ` : "";
      return `${time}${item.name} (${categoryLabels(item.categories)})`;
    })
    .join("\n");
  lines.push(`DESCRIPTION:${escapeICSText(description)}`);

  lines.push("END:VEVENT");
  return lines.map(foldICSLine);
}

function buildICS(itinerary: ExportItinerary) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Por Aqui Pelo Mundo//Roteiro//PT",
    "CALSCALE:GREGORIAN",
    ...itinerary.days.flatMap((day) => buildDayEvent(itinerary, day)),
    "END:VCALENDAR",
  ];
  return `${lines.join("\r\n")}\r\n`;
}

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Gera um .ics com um evento por dia (horário de início/fim a partir dos
// horários sugeridos pela IA; sem eles, vira evento de dia inteiro) e as
// atrações listadas na descrição. Premium: só faz sentido a partir do
// resultado de "Organizar com IA", que é quem tem dia e horário de verdade.
export function exportToGoogleCalendar(itinerary: ExportItinerary): void {
  const hasDatedDay = itinerary.days.some((day) => day.date);
  if (!hasDatedDay) {
    throw new Error(
      "Defina uma data de início antes de organizar o roteiro pra poder exportar pra agenda.",
    );
  }

  downloadFile(
    `${slugify(itinerary.title) || "roteiro"}.ics`,
    buildICS(itinerary),
    "text/calendar;charset=utf-8",
  );
}
