// Gera miniaturas (lado maior 800px, JPEG q82) em media/thumbs/<mesmo caminho>. Idempotente: pula as que ja existem.
// Uso: node --env-file=.env.local scripts/make-thumbs.mjs [--apply]
// Depois de rodar com --apply, defina NEXT_PUBLIC_USE_THUMBS=1 na Vercel e faca novo deploy.
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const apply = process.argv.includes("--apply");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function list(prefix) {
  const out = [];
  for (let offset = 0; ; offset += 100) {
    const { data, error } = await supabase.storage.from("media").list(prefix, { limit: 100, offset });
    if (error) throw error;
    out.push(...data.map((f) => ({ ...f, path: prefix ? `${prefix}/${f.name}` : f.name })));
    if (data.length < 100) return out;
  }
}

// ponytail: so 1 nivel de pasta, igual ao shrink-photos; aprofundar se surgirem subpastas.
const files = [];
for (const r of await list("")) {
  if (r.name === "thumbs") continue;
  if (r.id) files.push(r);
  else files.push(...(await list(r.path)));
}
const existing = new Set();
for (const r of await list("thumbs")) {
  if (r.id) existing.add(r.path.slice(7));
  else for (const f of await list(r.path)) existing.add(f.path.slice(7));
}

let done = 0, skipped = 0, bytes = 0;
for (const f of files) {
  if (!/\.(jpe?g|png|webp)$/i.test(f.path) || existing.has(f.path)) { skipped++; continue; }
  if (!apply) { done++; continue; }
  const { data: blob, error } = await supabase.storage.from("media").download(f.path);
  if (error) { console.error("download falhou:", f.path, error.message); continue; }
  const out = await sharp(Buffer.from(await blob.arrayBuffer()))
    .rotate()
    .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toBuffer();
  const { error: upErr } = await supabase.storage
    .from("media")
    .upload(`thumbs/${f.path}`, out, { upsert: true, contentType: "image/jpeg", cacheControl: "31536000" });
  if (upErr) { console.error("upload falhou:", f.path, upErr.message); continue; }
  done++; bytes += out.length;
}
console.log(`${apply ? "APLICADO" : "SIMULACAO"}: ${done} miniaturas (${(bytes / 1048576).toFixed(0)} MB), ${skipped} ignoradas`);
