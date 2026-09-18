"use client";

import { useState, type ReactNode } from "react";
import CopyProtectionGuard from "@/components/CopyProtectionGuard";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function SharedItineraryProtectedList({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const [blocked, setBlocked] = useState(false);

  return (
    <>
      <CopyProtectionGuard onBlocked={() => setBlocked(true)}>
        <div className={className}>{children}</div>
      </CopyProtectionGuard>
      {blocked && (
        <ConfirmDialog
          message="Este roteiro é protegido contra cópia. Assine o Premium para baixar e levar com você offline."
          confirmLabel="Ver planos Premium"
          cancelLabel="Fechar"
          onConfirm={() => {
            window.location.href = "/";
          }}
          onCancel={() => setBlocked(false)}
        />
      )}
    </>
  );
}
