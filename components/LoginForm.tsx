"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase-browser";
import PasswordInput from "@/components/PasswordInput";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setLoading(false);
      setError(data?.error ?? "Não foi possível entrar. Tente novamente.");
      return;
    }

    // Recarrega a página inteira: a sessão foi criada pelo servidor via
    // cookies, e um reload garante que o AuthProvider a releia do zero.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/");
  }

  async function handleGoogleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="text-sm text-tinta">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-lg border border-oliva/30 bg-branco px-3 py-2 text-sm text-tinta focus:border-terracota focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm text-tinta">
            Senha
          </label>
          <PasswordInput
            id="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border border-oliva/30 bg-branco px-3 py-2 pr-10 text-sm text-tinta focus:border-terracota focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-terracota">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-terracota px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-oliva">
        <div className="h-px flex-1 bg-oliva/20" />
        ou
        <div className="h-px flex-1 bg-oliva/20" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="rounded-full border border-oliva/30 px-6 py-2.5 text-sm text-tinta transition-colors hover:border-terracota"
      >
        Entrar com Google
      </button>
    </div>
  );
}
