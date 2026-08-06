// Executa um arquivo .sql contra o banco Supabase do projeto (SUPABASE_DB_URL,
// em .env.local). Uso: node --env-file=.env.local scripts/run-sql.mjs <arquivo.sql>
import { Client } from "pg";
import { readFileSync } from "fs";

const filePath = process.argv[2];
if (!filePath) {
  console.error("Uso: node scripts/run-sql.mjs <caminho-do-arquivo.sql>");
  process.exit(1);
}

const sql = readFileSync(filePath, "utf8");
const client = new Client({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
try {
  await client.query(sql);
  console.log(`OK: ${filePath} aplicado com sucesso.`);
} finally {
  await client.end();
}
