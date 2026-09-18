"use client";

import { useEffect, type ReactNode } from "react";

// Bloqueia cópia de texto e tentativas comuns de captura (clique direito,
// atalho de impressão/print screen) dentro da área envolvida, chamando
// onBlocked para mostrar o aviso de Premium. Não existe forma de impedir de
// verdade uma captura de tela do sistema operacional: isso é um desestímulo,
// não uma barreira técnica.
export default function CopyProtectionGuard({
  children,
  onBlocked,
}: {
  children: ReactNode;
  onBlocked: () => void;
}) {
  useEffect(() => {
    function handleCopy(event: ClipboardEvent) {
      event.preventDefault();
      onBlocked();
    }
    function handleContextMenu(event: MouseEvent) {
      event.preventDefault();
      onBlocked();
    }
    function handleKeyDown(event: KeyboardEvent) {
      const isPrint = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "p";
      const isPrintScreen = event.key === "PrintScreen";
      if (isPrint || isPrintScreen) {
        if (isPrint) event.preventDefault();
        onBlocked();
      }
    }

    document.addEventListener("copy", handleCopy);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onBlocked]);

  return (
    <div className="select-none [-webkit-user-select:none]">{children}</div>
  );
}
