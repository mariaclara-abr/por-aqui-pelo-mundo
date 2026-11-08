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
        className="btn btn-terracota"
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
