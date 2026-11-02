"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import CarregandoGlobo from "@/components/CarregandoGlobo";

// Mostra o globo enquanto uma troca de página espera o servidor, com a página
// antiga ainda atrás do véu. Quem avisa que a navegação começou é o
// instrumentation-client.ts; ela termina quando o caminho da URL muda.
// ponytail: só conta troca de caminho, então uma navegação que muda apenas a
// query ou o hash não mostra o globo (e também não fica presa nele).
export default function NavegacaoCarregando() {
  const caminho = usePathname();
  const [caminhoVisto, setCaminhoVisto] = useState(caminho);
  const [navegando, setNavegando] = useState(false);

  if (caminho !== caminhoVisto) {
    setCaminhoVisto(caminho);
    setNavegando(false);
  }

  useEffect(() => {
    const aoIniciar = (e: Event) => {
      const destino = new URL((e as CustomEvent<string>).detail, location.href);
      // Ir para o caminho em que já está (hash, query, ou um clique que desiste da
      // ida anterior) apaga o véu: o roteador cancelou a navegação pendente.
      setNavegando(destino.pathname !== location.pathname);
    };
    window.addEventListener("navegacao-iniciada", aoIniciar);
    return () => window.removeEventListener("navegacao-iniciada", aoIniciar);
  }, []);

  // Rede de segurança: uma navegação que termina sem trocar o caminho (um redirect
  // de volta para a mesma página, por exemplo) não pode deixar a tela embaçada
  // para sempre.
  useEffect(() => {
    if (!navegando) return;
    const id = window.setTimeout(() => setNavegando(false), 20000);
    return () => window.clearTimeout(id);
  }, [navegando]);

  if (!navegando) return null;
  // O véu deixa o clique passar: dá para mudar de ideia e abrir outro link.
  return (
    <div className="pointer-events-none">
      <CarregandoGlobo />
    </div>
  );
}
