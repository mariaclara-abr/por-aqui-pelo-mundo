-- Completa as fotos de "A Citadelle" (Saint-Tropez): a migration anterior
-- (20260904270000) usou o slug errado ('a-citadelle-saint-tropez') e não
-- encontrou a atração, cujo slug real é 'a-citadelle'. A atração já tinha
-- uma foto cadastrada (mesmo fotógrafo do Wikimedia, na ordem 0), então
-- aqui só completamos com as outras 3 fotos livres de direitos escolhidas.
insert into attraction_photos (attraction_id, url, "order", caption)
select attractions.id, photo.url, photo.photo_order, photo.caption
from attractions
join cities on cities.id = attractions.city_id
cross join (
  values
    (
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Citadelle_de_Saint-Tropez_%28vue_a%C3%A9rienne%29.jpg',
      1, 'Foto: Starus / Wikimedia Commons, CC BY-SA 3.0'
    ),
    (
      'https://upload.wikimedia.org/wikipedia/commons/c/c0/Saint-Tropez_-_Donjon_de_la_Citadelle.jpg',
      2, 'Foto: Starus / Wikimedia Commons, CC BY-SA 3.0'
    ),
    (
      'https://upload.wikimedia.org/wikipedia/commons/5/55/Saint-Tropez_-_Canons_de_la_Citadelle.jpg',
      3, 'Foto: Starus / Wikimedia Commons, CC BY-SA 3.0'
    )
) as photo(url, photo_order, caption)
where attractions.slug = 'a-citadelle'
  and cities.slug = 'saint-tropez'
  and not exists (
    select 1 from attraction_photos existing
    where existing.attraction_id = attractions.id
      and existing.url = photo.url
  );
