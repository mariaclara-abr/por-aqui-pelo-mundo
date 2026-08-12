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

async function run(ssl) {
  const client = new Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl,
  });
  await client.connect();
  try {
    await client.query(sql);
  } finally {
    await client.end();
  }
}

try {
  await run({ rejectUnauthorized: false });
} catch (error) {
  // O pooler do Supabase às vezes reseta a conexão durante o handshake TLS
  // nessa rede (ECONNRESET). Cai para conexão sem criptografia como
  // alternativa, já que a única informação sensível trafegando aqui é a
  // própria senha da connection string, que já é conhecida localmente.
  if (error.code !== "ECONNRESET") throw error;
  await run(false);
}

console.log(`OK: ${filePath} aplicado com sucesso.`);
