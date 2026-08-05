-- Monetização: assinaturas Premium e compras avulsas do "Roteiro Inteligente".
-- Só o webhook do Stripe (via service role, que ignora RLS) escreve aqui —
-- usuários comuns só podem ler as próprias linhas.

create type plan_type as enum ('roteiro_unico_1pais', 'premium_mensal', 'premium_anual');

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_type plan_type not null,
  -- Só usada em 'roteiro_unico_1pais': a compra vale para UM roteiro
  -- específico, não é um crédito reutilizável em qualquer roteiro futuro.
  itinerary_id uuid references itineraries(id) on delete set null,
  purchase_date timestamptz not null default now(),
  -- Null para 'roteiro_unico_1pais' (não expira por tempo, só é válida pra
  -- aquele roteiro). Preenchida com o current_period_end do Stripe para os
  -- planos Premium.
  expiration_date timestamptz,
  is_active boolean not null default true,
  stripe_customer_id text,
  -- Null para compras avulsas; presente nos planos recorrentes, usado para
  -- casar eventos de renovação/cancelamento do Stripe com esta linha.
  stripe_subscription_id text,
  stripe_checkout_session_id text,
  created_at timestamptz not null default now()
);

create index subscriptions_user_id_idx on subscriptions(user_id);
create index subscriptions_stripe_subscription_id_idx on subscriptions(stripe_subscription_id);

alter table subscriptions enable row level security;

create policy "Users can view their own subscriptions" on subscriptions
  for select using (auth.uid() = user_id);
