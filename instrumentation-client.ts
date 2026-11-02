// Avisa o site quando uma navegação entre páginas começa (Link, router.push,
// voltar e avançar); quem escuta é components/NavegacaoCarregando.tsx.
// O Next chama este gancho dentro de um startTransition: sem o queueMicrotask, o
// setState de quem escuta entra na mesma transição e só aparece junto com a
// página nova, tarde demais para mostrar o carregamento.
export function onRouterTransitionStart(url: string) {
  queueMicrotask(() =>
    window.dispatchEvent(new CustomEvent("navegacao-iniciada", { detail: url })),
  );
}
