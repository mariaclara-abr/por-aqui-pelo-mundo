-- Roteiro Premium: documento completo gerado pela IA a partir do script da
-- curadoria. A geração roda em segundo plano (pode levar minutos), então cada
-- roteiro vira uma linha com status, para a tela acompanhar. Só o servidor
-- (service role) escreve; o usuário apenas lê os próprios roteiros.

create table premium_roteiros (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  itinerary_id uuid references itineraries(id) on delete set null,
  tipo text not null default 'internacional',
  status text not null default 'gerando'
    check (status in ('gerando', 'pronto', 'perguntas', 'erro')),
  -- Respostas do questionário (o que foi enviado à IA).
  entrada jsonb not null,
  -- Regra Zero: perguntas que a IA fez em vez de gerar o roteiro.
  perguntas jsonb,
  -- Documento estruturado (seções), de onde o Word é montado.
  conteudo jsonb,
  erro text,
  -- Tokens e buscas gastos (acompanhar o custo real por roteiro e por ajuste).
  uso jsonb not null default '{}'::jsonb,
  -- Política de ajustes (docs/politica-ajustes-premium.md).
  ajustes_incluidos integer not null default 3,
  ajustes_usados integer not null default 0,
  ajustes_extras integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index premium_roteiros_user_id_idx on premium_roteiros(user_id, created_at desc);

alter table premium_roteiros enable row level security;

create policy "Users can view their own premium roteiros" on premium_roteiros
  for select using (auth.uid() = user_id);
