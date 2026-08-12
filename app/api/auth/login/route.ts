import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

const WINDOW_MINUTES = 15;
const MAX_ATTEMPTS_PER_EMAIL = 5;
const MAX_ATTEMPTS_PER_IP = 20;
const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 128;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface RequestBody {
  email?: string;
  password?: string;
}

function validateCredentials(
  body: RequestBody | null,
): { email: string; password: string } | { error: string } {
  const email = body?.email;
  const password = body?.password;

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "E-mail e senha são obrigatórios." };
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail || !password) {
    return { error: "E-mail e senha são obrigatórios." };
  }

  if (trimmedEmail.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(trimmedEmail)) {
    return { error: "E-mail inválido." };
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return { error: "Senha inválida." };
  }

  return { email: trimmedEmail, password };
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

async function countRecentFailures(
  admin: ReturnType<typeof createAdminClient>,
  column: "identifier" | "ip",
  value: string,
) {
  const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();
  const { count } = await admin
    .from("login_attempts")
    .select("id", { count: "exact", head: true })
    .eq(column, value)
    .eq("success", false)
    .gte("created_at", since);
  return count ?? 0;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RequestBody | null;
  const validation = validateCredentials(body);

  if ("error" in validation) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { email, password } = validation;
  const ip = getClientIp(request);
  const admin = createAdminClient();

  const [emailFailures, ipFailures] = await Promise.all([
    countRecentFailures(admin, "identifier", email),
    countRecentFailures(admin, "ip", ip),
  ]);

  if (emailFailures >= MAX_ATTEMPTS_PER_EMAIL || ipFailures >= MAX_ATTEMPTS_PER_IP) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente em alguns minutos." },
      { status: 429 },
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  await admin
    .from("login_attempts")
    .insert({ identifier: email, ip, success: !error });

  if (error) {
    return NextResponse.json(
      { error: "E-mail ou senha incorretos." },
      { status: 401 },
    );
  }

  return NextResponse.json({ ok: true });
}
