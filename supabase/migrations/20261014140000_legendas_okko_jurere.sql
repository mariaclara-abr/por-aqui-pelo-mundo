-- Legendas com o nome dos pratos nas fotos do Okko Jurerê (Florianópolis).
-- Nomes conferidos no cardápio oficial (okko.notato.menu). Fotos sem prato
-- (neon, bar, guarda-chuvas) seguem sem legenda. O ussuzukuri da foto 4
-- não tem variação identificável, então a legenda não cita o molho.
update attraction_photos
set caption = caption_data.caption
from (
  select attractions.id as attraction_id, photo.photo_order, photo.caption
  from attractions
  cross join (
    values
      ('okko-jurere', 1, 'Uramaki Filadélfia, com salmão e cream cheese'),
      ('okko-jurere', 2, 'Hot Filadelfia, com salmão e cream cheese'),
      ('okko-jurere', 3, 'Ussuzukuri, lâminas finas de peixe cru dispostas em flor')
  ) as photo(attraction_slug, photo_order, caption)
  where attractions.slug = photo.attraction_slug
) as caption_data
where attraction_photos.attraction_id = caption_data.attraction_id
  and attraction_photos."order" = caption_data.photo_order;
