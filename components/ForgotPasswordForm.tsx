"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import PasswordInput from "@/components/PasswordInput";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSendCode(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: sendError } = await supabase.auth.resetPasswordForEmail(
      email,
    );
    setLoading(false);

    if (sendError) {
      setError("Não foi possível enviar o código. Tente novamente.");
      return;
    }

    setStep("code");
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

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "recovery",
    });

    if (verifyError) {
      setLoading(false);
      setError("Código inválido ou expirado.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });
    setLoading(false);

    if (updateError) {
      setError("Não foi possível redefinir a senha. Tente novamente.");
      return;
    }

    router.push("/perfil");
    router.refresh();
  }

  if (step === "email") {
    return (
      <form onSubmit={handleSendCode} className="flex flex-col gap-4">
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

        {error && <p className="text-sm text-terracota">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-terracota px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Enviar código"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
      <p className="text-sm text-oliva">
        Enviamos um código de verificação para {email}.
      </p>

      <div>
        <label htmlFor="code" className="text-sm text-tinta">
          Código de verificação
        </label>
        <input
          id="code"
          inputMode="numeric"
          required
          value={code}
          onChange={(event) => setCode(event.target.value)}
          className="mt-1 w-full rounded-lg border border-oliva/30 bg-branco px-3 py-2 text-sm text-tinta focus:border-terracota focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="newPassword" className="text-sm text-tinta">
          Nova senha
        </label>
        <PasswordInput
          id="newPassword"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-lg border border-oliva/30 bg-branco px-3 py-2 pr-10 text-sm text-tinta focus:border-terracota focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="text-sm text-tinta">
          Confirmar nova senha
        </label>
        <PasswordInput
          id="confirmPassword"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="mt-1 w-full rounded-lg border border-oliva/30 bg-branco px-3 py-2 pr-10 text-sm text-tinta focus:border-terracota focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-terracota">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-terracota px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
      >
        {loading ? "Redefinindo..." : "Redefinir senha"}
      </button>
    </form>
  );
}
