import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { safePath } from "@/lib/safe-path";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const cookieStore = await cookies();
  const recovery = cookieStore.has("pm_recovery");
  const next = recovery ? "/esqueci-senha?nova=1" : safePath(searchParams.get("next"), "/");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const response = NextResponse.redirect(`${origin}${next}`);
      if (recovery) response.cookies.delete("pm_recovery");
      return response;
    }
  }

  return NextResponse.redirect(`${origin}/entrar?error=auth`);
}
