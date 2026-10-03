-- Marca como "em breve" (status draft) toda cidade sem atrações publicadas e,
-- em seguida, todo país sem cidades publicadas. A ordem importa: o país depende
-- do status das cidades já atualizado.
update cities
  set status = 'draft'
  where status = 'published'
    and not exists (
      select 1 from attractions
      where attractions.city_id = cities.id and attractions.status = 'published'
    );

update countries
  set status = 'draft'
  where status = 'published'
    and not exists (
      select 1 from cities
      where cities.country_id = countries.id and cities.status = 'published'
    );
