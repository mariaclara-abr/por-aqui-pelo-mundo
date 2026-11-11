import { Client } from "pg";
const sql = process.argv[2];
async function run(ssl) {
  const client = new Client({ connectionString: process.env.SUPABASE_DB_URL, ssl });
  await client.connect();
  try {
    const res = await client.query(sql);
    console.log(JSON.stringify(res.rows, null, 2));
  } finally {
    await client.end();
  }
}
try { await run({ rejectUnauthorized: false }); }
catch (e) { if (e.code !== "ECONNRESET") throw e; await run(false); }
