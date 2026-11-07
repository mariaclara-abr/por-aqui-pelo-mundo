// Troca URLs soltas de sites oficiais por links com texto, [texto](url).
// Uso: node --env-file=.env.local scripts/linkify-official-sites.mjs [--only "EPCOT"] [--apply]
// Sem --apply só mostra antes/depois. Com --apply guarda backup em ~/Desktop/backup-textos-links.json.
import pg from "pg";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { homedir } from "os";

const apply = process.argv.includes("--apply");
const only = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;

const BRANDS = [
  [/(^|\.)disney\.go\.com$/, "site oficial da Disney"],
  [/(^|\.)(universalorlando|universalstudioshollywood)\.com$/, "site oficial da Universal"],
  [/(^|\.)seaworld\.com$/, "site oficial do SeaWorld"],
  [/(^|\.)kennedyspacecenter\.com$/, "site oficial do Kennedy Space Center"],
];
// "site oficial", "site da Disney", "site oficial da Universal"... logo antes de ": URL"
const LEAD = /(site oficial(?: d[aoe] (?:Disney|Universal|SeaWorld|Kennedy Space Center))?|site d[aoe] (?:Disney|Universal|SeaWorld))$/i;

export function convert(text) {
  return text.replace(/(https?:\/\/[^\s<>"\])]+)/g, (url, _g, offset, whole) => {
    if (whole[offset - 1] === "(") return url; // já é [texto](url)
    const clean = url.replace(/[.,;:!?]+$/, "");
    const tail = url.slice(clean.length);
    let host;
    try { host = new URL(clean).hostname.replace(/^www\./, ""); } catch { return url; }
    const brand = BRANDS.find(([re]) => re.test(host));
    if (!brand) return url;
    const label = brand[1];
    const before = whole.slice(0, offset);
    const lead = before.match(/^([\s\S]*?)(site oficial(?: d[aoe] \S+(?: Space Center)?)?|site d[aoe] \S+)(:\s*)$/i);
    if (lead && LEAD.test(lead[2])) {
      // devolve o prefixo sem o trecho: o replace não reescreve o que veio antes, então marca para pós-processar
      return `\u0000${lead[2]}\u0000(${clean})${tail}`;
    }
    return `[${label}](${clean})${tail}`;
  }).replace(/(site oficial(?: d[aoe] \S+(?: Space Center)?)?|site d[aoe] \S+):\s*\u0000[^\u0000]*\u0000\((https?:[^)]+)\)/gi, (_m, phrase, url) => `[${phrase}](${url})`);
}

const TARGETS = [["attractions", "description"], ["attractions", "important_tips"], ["cities", "description"]];
const c = new pg.Client({ connectionString: process.env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } });
await c.connect();
const backupPath = `${homedir()}/Desktop/backup-textos-links.json`;
const backup = existsSync(backupPath) ? JSON.parse(readFileSync(backupPath, "utf8")) : [];
let changed = 0;
for (const [table, col] of TARGETS) {
  const r = await c.query(`select id, name, "${col}" v from ${table} where "${col}" ~* 'https?://'${only && table === "attractions" ? ` and name = $1` : ""}`, only && table === "attractions" ? [only] : []);
  if (only && table !== "attractions") continue;
  for (const row of r.rows) {
    const next = convert(row.v);
    if (next === row.v) continue;
    changed++;
    console.log(`\n### ${table}.${col} | ${row.name}`);
    const a = row.v.split("\n"), b = next.split("\n");
    a.forEach((line, i) => { if (line !== b[i]) console.log(`- ${line}\n+ ${b[i]}`); });
    if (apply) {
      backup.push({ table, col, id: row.id, original: row.v });
      await c.query(`update ${table} set "${col}" = $1 where id = $2`, [next, row.id]);
    }
  }
}
if (apply) writeFileSync(backupPath, JSON.stringify(backup, null, 1));
console.log(`\n${changed} textos ${apply ? "atualizados" : "seriam atualizados (simulação)"}.`);
await c.end();
