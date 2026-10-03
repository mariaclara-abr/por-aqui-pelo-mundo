-- Marca como "em breve" (status draft) toda cidade publicada cujas atrações
-- não têm nenhuma foto (inclui cidades sem atrações).
update cities
  set status = 'draft'
  where status = 'published'
    and not exists (
      select 1
      from attractions
      join attraction_photos on attraction_photos.attraction_id = attractions.id
      where attractions.city_id = cities.id
    );
