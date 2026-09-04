-- Nova camada na hierarquia, entre país e cidade: estados. Só faz sentido
-- para países grandes o bastante para precisar desse agrupamento (o
-- primeiro caso de uso é o Brasil); por isso cities.state_id é opcional
-- (null para todo o conteúdo já cadastrado nos outros países, que continua
-- funcionando exatamente como antes, listado direto na página do país).
-- Mesmo formato e políticas de cities.

create table states (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references countries(id) on delete cascade,
  name text not null,
  slug text not null unique,
  cover_image_url text,
  description text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  created_at timestamptz not null default now()
);

create index states_country_id_idx on states(country_id);

alter table cities
  add column state_id uuid references states(id) on delete cascade;

create index cities_state_id_idx on cities(state_id);

alter table states enable row level security;

create policy "Public read access" on states for select using (true);

create policy "Authors can insert states" on states for insert with check (public.is_author());
create policy "Authors can update states" on states for update using (public.is_author()) with check (public.is_author());
create policy "Authors can delete states" on states for delete using (public.is_author());
