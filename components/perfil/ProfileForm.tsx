"use client";

import { useRef, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase-browser";
import { inputClass } from "@/components/admin/FormField";
import AvatarUploader from "@/components/AvatarUploader";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    profile.avatar_url,
  );

  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const initial = (displayName || username || "?").charAt(0).toUpperCase();

  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  function handleUsernameChange(value: string) {
    setUsername(value);
    setSaved(false);

    if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);

    const trimmed = value.trim();
    if (!trimmed || trimmed === profile.username) {
      setUsernameStatus("idle");
      return;
    }

    setUsernameStatus("checking");
    checkTimeoutRef.current = setTimeout(async () => {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc(
        "is_username_available",
        { check_username: trimmed },
      );
      if (rpcError) {
        setUsernameStatus("idle");
        return;
      }
      setUsernameStatus(data ? "available" : "taken");
    }, 500);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    if (usernameStatus === "taken") {
      setError("Esse nome de usuário já está em uso.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        display_name: displayName || null,
        username: username.trim(),
        bio: bio || null,
        avatar_url: avatarUrl,
      })
      .eq("id", profile.id);

    setSaving(false);

    if (updateError) {
      setError(
        updateError.code === "23505"
          ? "Esse nome de usuário já está em uso."
          : "Não foi possível salvar. Tente novamente.",
      );
      return;
    }

    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <AvatarUploader
        userId={profile.id}
        value={avatarUrl}
        initial={initial}
        onChange={(url) => {
          setAvatarUrl(url);
          setSaved(false);
        }}
      />

      <div>
        <label htmlFor="displayName" className="text-sm font-medium text-tinta">
          Nome de exibição <span className="text-terracota">*</span>
        </label>
        <input
          id="displayName"
          className={`${inputClass} mt-1`}
          value={displayName}
          onChange={(event) => {
            setDisplayName(event.target.value);
            setSaved(false);
          }}
          required
        />
      </div>

      <div>
        <label htmlFor="username" className="text-sm font-medium text-tinta">
          Nome de usuário <span className="text-terracota">*</span>
        </label>
        <input
          id="username"
          className={`${inputClass} mt-1`}
          value={username}
          onChange={(event) => handleUsernameChange(event.target.value)}
          required
        />
        {usernameStatus === "checking" && (
          <p className="mt-1 text-xs text-oliva">Verificando disponibilidade...</p>
        )}
        {usernameStatus === "available" && (
          <p className="mt-1 text-xs text-oliva">✓ Disponível</p>
        )}
        {usernameStatus === "taken" && (
          <p className="mt-1 text-xs text-terracota">
            Esse nome de usuário já está em uso.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="bio" className="text-sm font-medium text-tinta">
          Bio
        </label>
        <textarea
          id="bio"
          rows={3}
          className={`${inputClass} mt-1`}
          value={bio}
          onChange={(event) => {
            setBio(event.target.value);
            setSaved(false);
          }}
          placeholder="Opcional — conte um pouco sobre você."
        />
      </div>

      {error && <p className="text-sm text-terracota">{error}</p>}
      {saved && !error && (
        <p className="text-sm text-oliva">Perfil atualizado.</p>
      )}

      <div>
        <button
          type="submit"
          disabled={saving || usernameStatus === "checking"}
          className="rounded-full bg-terracota px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </form>
  );
}
