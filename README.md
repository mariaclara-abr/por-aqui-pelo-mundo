# Por Aqui Pelo Mundo

Plataforma de planejamento de viagens baseada em curadoria humana — não em avaliações de multidão como TripAdvisor, nem em roteiros genéricos gerados por IA. Todo o conteúdo (atrações, dicas, avaliações) vem da experiência real de quem visitou cada lugar.

Hierarquia de conteúdo: **País > Cidade > Atração**. Cada atração tem categoria, etiquetas e uma nota de curadoria própria de 1 a 5 estrelas.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) (banco de dados, storage de fotos e autenticação)
- [Stripe](https://stripe.com) (assinaturas e checkout)
- [Anthropic (Claude)](https://www.anthropic.com) (organização de roteiros com IA)

## Rodando localmente

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie o arquivo de exemplo de variáveis de ambiente e preencha com suas credenciais:

   ```bash
   cp .env.local.example .env.local
   ```

3. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Abra [http://localhost:3000](http://localhost:3000).

As migrations do banco de dados ficam em `supabase/migrations` — rode-as no SQL Editor do seu projeto Supabase (em ordem, pelo nome do arquivo) antes de usar a aplicação.

## Variáveis de ambiente

Todas estão listadas em `.env.local.example`. Resumo do que cada uma faz:

| Variável | Onde usar | Descrição |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + local | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel + local | Chave pública (anon) do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel + local | Chave de serviço do Supabase (secreta — só usada no servidor, nunca no client) |
| `ANTHROPIC_API_KEY` | Vercel + local | Chave da API da Anthropic, usada pela IA que organiza roteiros (só no servidor) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Vercel + local | Chave pública do Stripe |
| `STRIPE_SECRET_KEY` | Vercel + local | Chave secreta do Stripe (só no servidor) |
| `STRIPE_WEBHOOK_SECRET` | Vercel + local | Segredo do webhook do Stripe, gerado ao configurar o endpoint |
| `NEXT_PUBLIC_BOOKING_AFFILIATE_ID` | Vercel + local | ID de afiliado do Booking.com (opcional — deixe em branco se não tiver conta) |
| `NEXT_PUBLIC_GETYOURGUIDE_PARTNER_ID` | Vercel + local | ID de parceiro do GetYourGuide (opcional — deixe em branco se não tiver conta) |

Variáveis com o prefixo `NEXT_PUBLIC_` são enviadas ao navegador — nunca coloque esse prefixo em uma chave secreta.

## Deploy

O deploy é feito manualmente pelo painel da [Vercel](https://vercel.com). Configure todas as variáveis acima em Project Settings → Environment Variables antes do primeiro deploy.
