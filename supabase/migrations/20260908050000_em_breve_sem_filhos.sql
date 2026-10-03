-- Marca como "em breve" (status draft) todo país sem cidades cadastradas e
-- toda cidade sem atrações cadastradas.
update countries
  set status = 'draft'
  where status = 'published'
    and not exists (select 1 from cities where cities.country_id = countries.id);

update cities
  set status = 'draft'
  where status = 'published'
    and not exists (select 1 from attractions where attractions.city_id = cities.id);
