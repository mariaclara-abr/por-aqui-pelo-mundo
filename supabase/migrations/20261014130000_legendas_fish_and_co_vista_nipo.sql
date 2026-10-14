-- Legendas com o nome dos pratos nas fotos de Fish and Co. e Vista Nipô
-- (Florianópolis). Nomes do Fish and Co. conferidos no cardápio oficial
-- (fishandco.com.br/menu). Do Vista Nipô não há cardápio público, então só
-- entram nomes genéricos ou citados em avaliações da própria casa. Fotos
-- sem prato (salão) e as de prato não identificado seguem sem legenda.
update attraction_photos
set caption = caption_data.caption
from (
  select attractions.id as attraction_id, photo.photo_order, photo.caption
  from attractions
  cross join (
    values
      ('fish-and-co', 0, 'Bulgogi Flat Iron, corte premium marinado em molho coreano, finalizado na brasa'),
      ('fish-and-co', 2, 'Ussuzukuri de salmão trufado, lâminas de salmão com molho cítrico e azeite trufado'),
      ('fish-and-co', 3, 'Salada Fish, mix de folhas com pecorino e crispy de tempurá'),
      ('fish-and-co', 4, 'Salmão miso, marinado no miso e grelhado no carvão'),
      ('fish-and-co', 5, 'Waffle de Bruxelas doce de leite, com gelato e amêndoas, e Gojira Daeki, sobremesa de matcha'),

      ('vista-nipo', 0, 'Combinado com sashimis, nigiris, makis e uramakis'),
      ('vista-nipo', 1, 'Sashimi de salmão, parte dele maçaricado'),
      ('vista-nipo', 4, 'Hot roll'),
      ('vista-nipo', 5, 'Hot roll'),
      ('vista-nipo', 6, 'Uramaki com cebolinha crocante e gyoza'),
      ('vista-nipo', 7, 'Salmão maçaricado servido sobre bloco de sal rosa')
  ) as photo(attraction_slug, photo_order, caption)
  where attractions.slug = photo.attraction_slug
) as caption_data
where attraction_photos.attraction_id = caption_data.attraction_id
  and attraction_photos."order" = caption_data.photo_order;
