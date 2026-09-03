-- "Parques" deixa de ser só uma pasta interna do admin e vira uma atração
-- pública de verdade: ao clicar nela, a pessoa vê os parques (que por sua
-- vez têm suas próprias sub-atrações: lojas, restaurantes etc. já
-- cadastrados em 20260902130000_seed_orlando_parks_food_shops.sql).

insert into attractions (city_id, name, slug, categories, description)
select
  cities.id,
  'Parques',
  'parques',
  array['ponto_turistico']::attraction_category[],
  'Reúne os parques temáticos de Orlando num só lugar. Clique em cada '
  || 'parque para conhecer suas atrações, lojas e opções gastronômicas '
  || 'selecionadas.'
from cities
where cities.slug = 'orlando'
on conflict (slug) do nothing;

update attractions
set parent_attraction_id = (select id from attractions where slug = 'parques')
where slug in (
  'magic-kingdom', 'epcot', 'hollywood-studios', 'animal-kingdom'
);
