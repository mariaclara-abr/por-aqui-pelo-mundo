"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function SignOutButton() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleConfirm() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setSigningOut(false);
    setConfirming(false);
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-full border border-terracota px-6 py-2.5 text-sm font-medium text-terracota transition-colors hover:bg-terracota/10"
      >
        Sair da conta
      </button>

      {confirming && (
        <ConfirmDialog
          message="Tem certeza que quer sair da sua conta?"
          confirmLabel="Sim, sair"
          pendingLabel="Saindo..."
          pending={signingOut}
          onConfirm={handleConfirm}
          onCancel={() => setConfirming(false)}
        />
      )}
    </>
  );
}
