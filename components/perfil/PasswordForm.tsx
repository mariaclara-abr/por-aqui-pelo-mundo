"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase-browser";
import { inputClass } from "@/components/admin/FormField";

export default function PasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent) {
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

    setSaving(true);
    const supabase = createClient();
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
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="newPassword" className="text-sm font-medium text-tinta">
          Nova senha
        </label>
        <input
          id="newPassword"
          type="password"
          className={`${inputClass} mt-1`}
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
        <input
          id="confirmPassword"
          type="password"
          className={`${inputClass} mt-1`}
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
          {saving ? "Salvando..." : "Alterar senha"}
        </button>
      </div>
    </form>
  );
}
