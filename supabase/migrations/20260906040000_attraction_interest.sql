-- Sinal de interesse em atrações "em breve" (status = 'draft'). Mesmo padrão
-- de country_interest (20260831200000): insert liberado para logado ou não,
-- select restrito à autora.

create table attraction_interest (
  id uuid primary key default gen_random_uuid(),
  attraction_id uuid not null references attractions(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  visitor_id text,
  created_at timestamptz not null default now()
);

create index attraction_interest_attraction_id_idx on attraction_interest(attraction_id);

create unique index attraction_interest_user_unique
  on attraction_interest(attraction_id, user_id) where user_id is not null;

create unique index attraction_interest_visitor_unique
  on attraction_interest(attraction_id, visitor_id) where user_id is null and visitor_id is not null;

alter table attraction_interest enable row level security;

create policy "Anyone can register interest in an attraction" on attraction_interest
  for insert with check (user_id is null or user_id = auth.uid());

create policy "Authors can view attraction interest" on attraction_interest
  for select using (public.is_author());
