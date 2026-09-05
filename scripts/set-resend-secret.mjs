// Salva (ou atualiza) a chave da API do Resend no Vault do Supabase, usada
// pelas funções SQL de 20260904300000_email_question_answered.sql para
// enviar email quando uma pergunta é respondida. A chave nunca é escrita em
// nenhum arquivo: é lida de RESEND_API_KEY (.env.local) e enviada só como
// parâmetro de query.
// Uso: node --env-file=.env.local scripts/set-resend-secret.mjs
import { Client } from "pg";

const resendKey = process.env.RESEND_API_KEY;
if (!resendKey) {
  console.error("RESEND_API_KEY não definida em .env.local");
  process.exit(1);
}

async function run(ssl) {
  const client = new Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl,
  });
  await client.connect();
  try {
    const existing = await client.query(
      "select id from vault.secrets where name = 'resend_api_key'"
    );
    if (existing.rows.length > 0) {
      await client.query("select vault.update_secret($1, $2)", [
        existing.rows[0].id,
        resendKey,
      ]);
    } else {
      await client.query("select vault.create_secret($1, 'resend_api_key')", [
        resendKey,
      ]);
    }
  } finally {
    await client.end();
  }
}

try {
  await run({ rejectUnauthorized: false });
} catch (error) {
  if (error.code !== "ECONNRESET") throw error;
  await run(false);
}

console.log("OK: resend_api_key salva no Vault do Supabase.");
