-- Privacidade por roteiro (substitui o toggle único em profiles.itineraries_public
-- de 20260813170000): cada roteiro nasce privado e só fica público se a pessoa
-- destrancar o cadeado manualmente naquele roteiro específico.

alter table itineraries
  add column is_public boolean not null default false;

drop policy "Anyone can view itineraries of a public profile" on itineraries;
drop policy "Anyone can view items of a public profile's itineraries" on itinerary_items;

create policy "Anyone can view public itineraries" on itineraries
  for select using (is_public = true);

create policy "Anyone can view items of public itineraries" on itinerary_items
  for select using (
    exists (
      select 1 from itineraries
      where itineraries.id = itinerary_items.itinerary_id
      and itineraries.is_public = true
    )
  );

-- CREATE OR REPLACE VIEW não permite remover coluna (só apêndice no final),
-- então recria do zero — o que também exige regravar o grant de select.
drop view public.public_profiles;

create view public.public_profiles as
  select id, username, display_name, avatar_url, role, created_at
  from public.profiles;

grant select on public.public_profiles to anon, authenticated;

alter table profiles drop column itineraries_public;
