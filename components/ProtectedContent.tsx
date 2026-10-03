"use client";

import { useState, type ReactNode } from "react";
import CopyProtectionGuard from "@/components/CopyProtectionGuard";
import PremiumDialog from "@/components/PremiumDialog";

// Texto da curadoria protegido contra cópia, igual à página Meu Roteiro: ao
// tentar copiar, abre o pop-up de Premium.
export default function ProtectedContent({ children }: { children: ReactNode }) {
  const [premiumOpen, setPremiumOpen] = useState(false);

  return (
    <>
      <CopyProtectionGuard onBlocked={() => setPremiumOpen(true)}>
        {children}
      </CopyProtectionGuard>
      {premiumOpen && (
        <PremiumDialog
          itineraryId={null}
          countryCount={0}
          onClose={() => setPremiumOpen(false)}
        />
      )}
    </>
  );
}
