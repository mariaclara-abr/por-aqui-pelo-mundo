// Reduz fotos grandes do bucket "media" (lado maior 1600px, JPEG q82), no mesmo caminho.
// Uso: node --env-file=.env.local scripts/shrink-photos.mjs [--apply]
// Sem --apply apenas simula; com --apply salva o original em ~/Desktop/backup-fotos-supabase antes de sobrescrever. Originais maiores que 600 KB; PNG vira JPEG no mesmo caminho (URL nao muda); outros formatos sao ignorados.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const apply = process.argv.includes("--apply");
const MIN_BYTES = 600_000;
const BACKUP_DIR = join(process.env.HOME, "Desktop", "backup-fotos-supabase");
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// ponytail: lista so 1 nivel de pasta (attractions/ etc.), suficiente para o layout atual
async function list(prefix) {
  const out = [];
  for (let offset = 0; ; offset += 100) {
    const { data, error } = await supabase.storage.from("media").list(prefix, { limit: 100, offset });
    if (error) throw error;
    out.push(...data.map((f) => ({ ...f, path: prefix ? `${prefix}/${f.name}` : f.name })));
    if (data.length < 100) return out;
  }
}

const roots = await list("");
const files = [];
for (const r of roots) {
  if (r.id) files.push(r);
  else files.push(...(await list(r.path)));
}

let before = 0, after = 0, done = 0, skipped = 0;
for (const f of files) {
  const size = f.metadata?.size ?? 0;
  if (size < MIN_BYTES || !/\.(jpe?g|png)$/i.test(f.path)) { skipped++; continue; }
  const { data: blob, error } = await supabase.storage.from("media").download(f.path);
  if (error) { console.error("download falhou:", f.path, error.message); continue; }
  const original = Buffer.from(await blob.arrayBuffer());
  const out = await sharp(original)
    .rotate()
    .flatten({ background: "#ffffff" })
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  if (out.length >= size) { skipped++; continue; }
  before += size; after += out.length; done++;
  if (apply) {
    const backupPath = join(BACKUP_DIR, f.path);
    mkdirSync(dirname(backupPath), { recursive: true });
    writeFileSync(backupPath, original);
    const { error: upErr } = await supabase.storage
      .from("media")
      .upload(f.path, out, { upsert: true, contentType: "image/jpeg", cacheControl: "31536000" });
    if (upErr) { console.error("upload falhou:", f.path, upErr.message); before -= size; after -= out.length; done--; }
  }
}
const mb = (n) => (n / 1048576).toFixed(0);
console.log(`${apply ? "APLICADO" : "SIMULACAO"}: ${done} fotos, ${mb(before)} MB -> ${mb(after)} MB, ${skipped} ignoradas`);
