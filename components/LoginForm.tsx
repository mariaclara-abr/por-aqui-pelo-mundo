"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import PasswordInput from "@/components/PasswordInput";
import { safePath } from "@/lib/safe-path";

// Para onde ir depois do login (ex.: continuar uma compra), vem em ?next=.
function nextPath() {
  return safePath(new URLSearchParams(window.location.search).get("next"), "/");
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(data?.error ?? "Não foi possível entrar. Tente novamente.");
        return;
      }

      // Recarrega a página inteira: a sessão foi criada pelo servidor via
      // cookies, e um reload garante que o AuthProvider a releia do zero.
      window.location.assign(nextPath());
    } catch {
      setError("Não foi possível conectar. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath())}` },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-busy={loading}>
        <div>
          <label htmlFor="email" className="text-xs font-medium text-tinta">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Seu e-mail"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 h-12 w-full rounded-lg border border-oliva/30 bg-white/55 px-4 text-sm text-tinta placeholder:text-oliva/75 transition-colors hover:border-oliva/50 focus:border-oliva focus:bg-white/80 focus:outline-2 focus:outline-offset-2 focus:outline-oliva/40"
          />
        </div>
        <div>
          <div className="mb-2 flex min-h-6 items-center justify-between gap-3">
            <label htmlFor="password" className="text-xs font-medium text-tinta">
              Senha
            </label>
            <Link href="/esqueci-senha" className="text-xs text-oliva underline-offset-4 hover:underline">
              Esqueci minha senha
            </Link>
          </div>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="Sua senha"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 w-full rounded-lg border border-oliva/30 bg-white/55 px-4 pr-12 text-sm text-tinta placeholder:text-oliva/75 transition-colors hover:border-oliva/50 focus:border-oliva focus:bg-white/80 focus:outline-2 focus:outline-offset-2 focus:outline-oliva/40"
          />
        </div>

        {error && <p role="alert" className="rounded-lg border border-terracota/30 bg-terracota/10 px-3 py-2 text-left text-sm text-tinta">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="group mt-1 flex h-12 items-center justify-center gap-3 rounded-lg bg-oliva px-6 text-sm font-medium text-white transition-colors hover:bg-tinta disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1">
            <path d="M4 12h16m-6-6 6 6-6 6" />
          </svg>
        </button>
      </form>

      <div className="flex items-center gap-4 text-[11px] text-oliva">
        <div className="h-px flex-1 bg-oliva/20" />
        ou continue com
        <div className="h-px flex-1 bg-oliva/20" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex h-12 items-center justify-center gap-3 rounded-lg border border-oliva/30 bg-white/35 px-6 text-sm text-tinta transition-colors hover:border-oliva/60 hover:bg-white/70 disabled:opacity-60"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
          <path d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.01v2.51h3.24c1.89-1.74 2.98-4.3 2.98-7.35Z" />
          <path d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22ZM6.41 13.91A6 6 0 0 1 6.1 12c0-.66.11-1.3.31-1.91V7.5H3.07A10 10 0 0 0 2 12c0 1.61.38 3.14 1.07 4.5l3.34-2.59ZM12 5.97c1.47 0 2.79.51 3.83 1.51l2.87-2.88A9.61 9.61 0 0 0 12 2a10 10 0 0 0-8.93 5.5l3.34 2.59C7.2 7.73 9.4 5.97 12 5.97Z" />
        </svg>
        Entrar com Google
      </button>
    </div>
  );
}
