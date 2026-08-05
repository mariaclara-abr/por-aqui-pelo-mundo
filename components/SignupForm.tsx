"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import PasswordInput from "@/components/PasswordInput";

export default function SignupForm() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });

    setLoading(false);

    if (error) {
      setError(
        error.message === "User already registered"
          ? "Esse e-mail já tem uma conta."
          : "Não foi possível criar a conta. Tente novamente.",
      );
      return;
    }

    if (data.session) {
      router.push("/");
      router.refresh();
      return;
    }

    setMessage("Conta criada! Verifique seu e-mail para confirmar o cadastro.");
  }

  async function handleGoogleSignup() {
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
          <label htmlFor="displayName" className="text-sm text-tinta">
            Nome
          </label>
          <input
            id="displayName"
            type="text"
            required
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="mt-1 w-full rounded-lg border border-oliva/30 bg-branco px-3 py-2 text-sm text-tinta focus:border-terracota focus:outline-none"
          />
        </div>
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
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border border-oliva/30 bg-branco px-3 py-2 pr-10 text-sm text-tinta focus:border-terracota focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="text-sm text-tinta">
            Confirmar senha
          </label>
          <PasswordInput
            id="confirmPassword"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border border-oliva/30 bg-branco px-3 py-2 pr-10 text-sm text-tinta focus:border-terracota focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-terracota">{error}</p>}
        {message && <p className="text-sm text-oliva">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-terracota px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
        >
          {loading ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-oliva">
        <div className="h-px flex-1 bg-oliva/20" />
        ou
        <div className="h-px flex-1 bg-oliva/20" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignup}
        className="rounded-full border border-oliva/30 px-6 py-2.5 text-sm text-tinta transition-colors hover:border-terracota"
      >
        Continuar com Google
      </button>
    </div>
  );
}
