// Gera lib/prompts/roteiro-internacional-completo.ts a partir do script oficial
// (docs/script-roteiro-internacional-oficial.md), que é a fonte única. Rodar
// sempre que o script mudar: npm run prompt:premium
import { readFileSync, writeFileSync } from "node:fs";

const md = readFileSync("docs/script-roteiro-internacional-oficial.md", "utf8").trim();
const ts = `// GERADO por scripts/gerar-prompt-premium.mjs a partir de
// docs/script-roteiro-internacional-oficial.md. Não editar aqui: edite o script
// em docs/ e rode \`npm run prompt:premium\`.

export const SCRIPT_INTERNACIONAL_COMPLETO = ${JSON.stringify(md)};
`;
writeFileSync("lib/prompts/roteiro-internacional-completo.ts", ts);
console.log("OK:", md.length, "caracteres");
