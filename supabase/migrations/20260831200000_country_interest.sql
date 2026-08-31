-- Sinal de interesse em países "em breve" (status = 'draft'): visitante
-- clica em "Tenho interesse" no card cinza da home. Mesmo padrão de
-- affiliate_clicks (20260804210000): insert liberado para logado ou não,
-- select restrito à autora, que assim sabe quantas pessoas se interessaram
-- por cada destino antes de publicá-lo.
--
-- Dedupe por país: usuário logado não pode repetir (country_id, user_id);
-- visitante anônimo é identificado por um id gerado no client e guardado em
-- localStorage (country_id, visitor_id). Os dois índices são parciais porque
-- só uma das colunas é preenchida por registro.

create table country_interest (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references countries(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  visitor_id text,
  created_at timestamptz not null default now()
);

create index country_interest_country_id_idx on country_interest(country_id);

create unique index country_interest_user_unique
  on country_interest(country_id, user_id) where user_id is not null;

create unique index country_interest_visitor_unique
  on country_interest(country_id, visitor_id) where user_id is null and visitor_id is not null;

alter table country_interest enable row level security;

create policy "Anyone can register interest in a country" on country_interest
  for insert with check (user_id is null or user_id = auth.uid());

create policy "Authors can view country interest" on country_interest
  for select using (public.is_author());
