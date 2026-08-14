-- Perfil público: dá pra ver quem fez uma pergunta clicando no nome. Nesse
-- perfil, a pessoa mostra nome completo, username, data de entrada, roteiros
-- (se optar por deixá-los públicos) e países visitados (se cadastrar algum).

alter table profiles
  add column itineraries_public boolean not null default true;

grant update (username, display_name, avatar_url, bio, preferences, itineraries_public)
  on profiles to authenticated;

-- Recria a view incluindo created_at (pra "está no site desde...") e a
-- própria preferência de privacidade (pra a página pública saber se deve
-- mostrar "roteiros privados" em vez de simplesmente uma lista vazia).
create or replace view public.public_profiles as
  select id, username, display_name, avatar_url, role, created_at, itineraries_public
  from public.profiles;

-- Um roteiro fica visível pra qualquer visitante quando o dono optou por
-- deixar seus roteiros públicos — além das policies já existentes (dono vê
-- os próprios, e roteiros com link de compartilhamento ativo).
create policy "Anyone can view itineraries of a public profile" on itineraries
  for select using (
    exists (
      select 1 from profiles
      where profiles.id = itineraries.user_id
      and profiles.itineraries_public = true
    )
  );

create policy "Anyone can view items of a public profile's itineraries" on itinerary_items
  for select using (
    exists (
      select 1 from itineraries
      join profiles on profiles.id = itineraries.user_id
      where itineraries.id = itinerary_items.itinerary_id
      and profiles.itineraries_public = true
    )
  );

-- Países visitados: lista opcional que a própria pessoa monta; ela só
-- aparece no perfil se tiver pelo menos um país adicionado.
create table visited_countries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  country_id uuid not null references countries(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, country_id)
);

create index visited_countries_user_id_idx on visited_countries (user_id);

alter table visited_countries enable row level security;

create policy "Visited countries are publicly viewable"
  on visited_countries for select
  using (true);

create policy "Users can add their own visited countries"
  on visited_countries for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can remove their own visited countries"
  on visited_countries for delete
  to authenticated
  using (user_id = auth.uid());
