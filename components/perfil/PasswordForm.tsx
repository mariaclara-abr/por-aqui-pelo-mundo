"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase-browser";
import { inputClass } from "@/components/admin/FormField";
import PasswordInput from "@/components/PasswordInput";

export default function PasswordForm() {
  const { user } = useAuth();
  const [step, setStep] = useState<"form" | "code">("form");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleRequestCode(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (!user?.email) {
      setError("Não foi possível identificar seu e-mail.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error: sendError } = await supabase.auth.resetPasswordForEmail(
      user.email,
    );
    setSaving(false);

    if (sendError) {
      setError("Não foi possível enviar o código. Tente novamente.");
      return;
    }

    setStep("code");
  }

  async function handleConfirm(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!user?.email) {
      setError("Não foi possível identificar seu e-mail.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: user.email,
      token: code,
      type: "recovery",
    });

    if (verifyError) {
      setSaving(false);
      setError("Código inválido ou expirado.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });
    setSaving(false);

    if (updateError) {
      setError("Não foi possível atualizar a senha. Tente novamente.");
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setCode("");
    setStep("form");
    setSaved(true);
  }

  if (step === "code") {
    return (
      <form onSubmit={handleConfirm} className="flex flex-col gap-5">
        <p className="text-sm text-oliva">
          Enviamos um código de confirmação para {user?.email}.
        </p>

        <div>
          <label htmlFor="confirmCode" className="text-sm font-medium text-tinta">
            Código de confirmação
          </label>
          <input
            id="confirmCode"
            inputMode="numeric"
            className={`${inputClass} mt-1`}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-terracota">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-terracota px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
          >
            {saving ? "Confirmando..." : "Confirmar"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("form");
              setError(null);
            }}
            className="rounded-full border border-oliva/30 px-6 py-2.5 text-sm text-tinta transition-colors hover:border-terracota"
          >
            Voltar
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleRequestCode} className="flex flex-col gap-5">
      <div>
        <label htmlFor="newPassword" className="text-sm font-medium text-tinta">
          Nova senha
        </label>
        <PasswordInput
          id="newPassword"
          className={`${inputClass} mt-1 pr-10`}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setSaved(false);
          }}
          minLength={6}
          required
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-tinta"
        >
          Confirmar nova senha
        </label>
        <PasswordInput
          id="confirmPassword"
          className={`${inputClass} mt-1 pr-10`}
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setSaved(false);
          }}
          minLength={6}
          required
        />
      </div>

      {error && <p className="text-sm text-terracota">{error}</p>}
      {saved && !error && (
        <p className="text-sm text-oliva">Senha atualizada.</p>
      )}

      <div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-terracota px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
        >
          {saving ? "Enviando código..." : "Alterar senha"}
        </button>
      </div>
    </form>
  );
}
