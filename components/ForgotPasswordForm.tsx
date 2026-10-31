"use client";

import { emailTypoMessage } from "@/lib/email-typo";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import PasswordInput from "@/components/PasswordInput";

export default function ForgotPasswordForm({ newPassword = false }: { newPassword?: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "sent" | "password">(newPassword ? "password" : "email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSendCode(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const typo = emailTypoMessage(email);
    if (typo) {
      setError(typo);
      return;
    }

    setLoading(true);

    // O callback lê este cookie para saber que o link é de redefinição (o endereço fica sem query, que o Supabase pode recusar).
    document.cookie = "pm_recovery=1; path=/; max-age=3600; SameSite=Lax";

    const supabase = createClient();
    const { error: sendError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    setLoading(false);

    if (sendError) {
      setError("Não foi possível enviar o link. Tente novamente.");
      return;
    }

    setStep("sent");
  }

  async function handleResetPassword(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });
    setLoading(false);

    if (updateError) {
      setError("Não foi possível redefinir a senha. O link pode ter expirado: peça um novo.");
      return;
    }

    router.push("/perfil");
    router.refresh();
  }

  if (step === "email") {
    return (
      <form onSubmit={handleSendCode} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="text-xs font-medium text-tinta">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Seu e-mail"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 h-12 w-full rounded-lg border border-oliva/30 bg-white/55 px-4 text-sm text-tinta placeholder:text-oliva/75 transition-colors hover:border-oliva/50 focus:border-oliva focus:bg-white/80 focus:outline-2 focus:outline-offset-2 focus:outline-oliva/40"
          />
        </div>

        {error && <p role="alert" className="rounded-lg border border-terracota/30 bg-terracota/10 px-3 py-2 text-left text-sm text-tinta">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="group mt-1 flex h-12 items-center justify-center gap-3 rounded-lg bg-oliva px-6 text-sm font-medium text-white transition-colors hover:bg-tinta disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Enviar link"}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1">
          <path d="M4 12h16m-6-6 6 6-6 6" />
        </svg>
        </button>
      </form>
    );
  }

  if (step === "sent") {
    return (
      <p className="text-sm text-tinta">
        Enviamos um link de redefinição para {email}. Abra o e-mail e clique no
        link para escolher a nova senha.
      </p>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
      <div>
        <label htmlFor="newPassword" className="mb-2 block text-xs font-medium text-tinta">
          Nova senha
        </label>
        <PasswordInput
          id="newPassword"
          autoComplete="new-password"
          placeholder="Crie uma senha"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 w-full rounded-lg border border-oliva/30 bg-white/55 px-4 pr-12 text-sm text-tinta placeholder:text-oliva/75 transition-colors hover:border-oliva/50 focus:border-oliva focus:bg-white/80 focus:outline-2 focus:outline-offset-2 focus:outline-oliva/40"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-2 block text-xs font-medium text-tinta">
          Confirmar nova senha
        </label>
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          placeholder="Repita a senha"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="h-12 w-full rounded-lg border border-oliva/30 bg-white/55 px-4 pr-12 text-sm text-tinta placeholder:text-oliva/75 transition-colors hover:border-oliva/50 focus:border-oliva focus:bg-white/80 focus:outline-2 focus:outline-offset-2 focus:outline-oliva/40"
        />
      </div>

      {error && <p role="alert" className="rounded-lg border border-terracota/30 bg-terracota/10 px-3 py-2 text-left text-sm text-tinta">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="group mt-1 flex h-12 items-center justify-center gap-3 rounded-lg bg-oliva px-6 text-sm font-medium text-white transition-colors hover:bg-tinta disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? "Redefinindo..." : "Redefinir senha"}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1">
          <path d="M4 12h16m-6-6 6 6-6 6" />
        </svg>
      </button>
    </form>
  );
}
