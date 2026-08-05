import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Cliente com a service role key — ignora RLS. Usado só pelo webhook do
// Stripe (app/api/webhook/stripe/route.ts), que não roda com a sessão de
// nenhum usuário e por isso precisa escrever em `subscriptions` diretamente.
// Nunca importar este arquivo de um componente cliente.
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
