// Grava faixas de preço (1 a 4) verificadas em fontes. Uso: node --env-file=.env.local scripts/set-price-ranges.mjs <arquivo.json> [--apply]
// JSON: [["Nome exato", "Cidade", faixa], ...]. Guarda o valor anterior em ~/Desktop/backup-faixas-preco.json.
import pg from "pg";
import { readFileSync, existsSync, writeFileSync } from "fs";
import { homedir } from "os";
const apply = process.argv.includes("--apply");
const rows = JSON.parse(readFileSync(process.argv[2], "utf8"));
const c = new pg.Client({ connectionString: process.env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } });
await c.connect();
const bp = `${homedir()}/Desktop/backup-faixas-preco.json`;
const backup = existsSync(bp) ? JSON.parse(readFileSync(bp, "utf8")) : [];
for (const [name, city, pr] of rows) {
  const r = await c.query(`select a.id, a.price_range from attractions a join cities ci on ci.id=a.city_id where a.name=$1 and ci.name=$2 and 'restaurante'=any(a.categories)`, [name, city]);
  if (r.rows.length !== 1) { console.log(`PULOU (${r.rows.length} achados): ${name}`); continue; }
  const { id, price_range: old } = r.rows[0];
  console.log(`${name}: ${old ?? "vazio"} -> ${pr}${old === pr ? " (igual)" : ""}`);
  if (apply && old !== pr) {
    backup.push({ id, name, old });
    await c.query(`update attractions set price_range=$1 where id=$2`, [pr, id]);
  }
}
if (apply) writeFileSync(bp, JSON.stringify(backup, null, 1));
await c.end();
