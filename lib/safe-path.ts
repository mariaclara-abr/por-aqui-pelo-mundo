// Só aceita caminhos relativos internos como destino, evita open redirect.
// Arquivo separado de lib/checkout.ts para poder ser importado no client sem
// puxar o SDK do Stripe.
export function safePath(path: string | null | undefined, fallback: string): string {
  return path && path.startsWith("/") && !path.startsWith("//") ? path : fallback;
}
