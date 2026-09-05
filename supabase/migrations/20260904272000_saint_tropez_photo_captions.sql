-- Ajusta as legendas das fotos de Saint-Tropez: descrição breve do lugar
-- mais crédito discreto do fotógrafo, sem citar a fonte (Wikimedia Commons)
-- na legenda visível. Casa por atração (slug) + ordem da foto, já que a
-- URL de algumas fotos está sendo migrada do Wikimedia para o storage
-- próprio do site.
update attraction_photos
set caption = caption_data.caption
from (
  select attractions.id as attraction_id, photo.photo_order, photo.caption
  from attractions
  join cities on cities.id = attractions.city_id
  cross join (
    values
      ('porto-de-saint-tropez', 0, 'O porto de Saint-Tropez, com barcos clássicos e iates ancorados no coração da cidade. Foto: Arnaud 25.'),
      ('porto-de-saint-tropez', 1, 'Vista clássica do porto, com os prédios coloridos da cidade velha ao fundo. Foto: Arnaud 25.'),
      ('porto-de-saint-tropez', 2, 'Fim de tarde no porto, com os megaiates que fazem fama de Saint-Tropez. Foto: Ed g2s.'),

      ('senequier-saint-tropez', 0, 'A fachada vermelha vibrante do Sénéquier, point clássico à beira do porto. Foto: Gzen92.'),
      ('senequier-saint-tropez', 1, 'O terraço do Sénéquier visto do porto, entre os iates ancorados. Foto: Mathieu Brossais.'),
      ('senequier-saint-tropez', 2, 'Outro ângulo do toldo vermelho icônico do Sénéquier. Foto: Arnaud 25.'),

      ('a-citadelle', 0, 'O donjon da Citadelle, com as bandeiras da França e da União Europeia. Foto: Gzen92.'),
      ('a-citadelle', 1, 'Vista aérea da Citadelle, dominando a península onde fica Saint-Tropez. Foto: Starus.'),
      ('a-citadelle', 2, 'Detalhe da torre de pedra da Citadelle. Foto: Starus.'),
      ('a-citadelle', 3, 'Os canhões históricos da Citadelle, com vista para a baía de Saint-Tropez. Foto: Starus.'),

      ('place-des-lices-saint-tropez', 0, 'A Place des Lices, praça de terra batida cercada por plátanos centenários. Foto: Arnaud 25.'),
      ('place-des-lices-saint-tropez', 1, 'Os plátanos robustos que dão sombra à Place des Lices. Foto: Arnaud 25.'),
      ('place-des-lices-saint-tropez', 2, 'Uma partida de pétanca à sombra das árvores, tradição local na Place des Lices. Foto: Niels Elgaard Larsen.'),
      ('place-des-lices-saint-tropez', 3, 'Banca de azeitonas provençais na feira tradicional da Place des Lices. Foto: Arnaud 25.'),

      ('plage-de-pampelonne', 0, 'Vista aérea da Plage de Pampelonne, com suas águas azul-turquesa. Foto: Guido Radig.'),
      ('plage-de-pampelonne', 1, 'A extensão da Plage de Pampelonne, com barcos ancorados ao longe. Foto: Jean-Pierre Bazard.'),
      ('plage-de-pampelonne', 2, 'Entrada de um dos beach clubs luxuosos da Plage de Pampelonne. Foto: Arnaud 25.'),
      ('plage-de-pampelonne', 3, 'Dia de sol na Plage de Pampelonne, com veleiros e banhistas na água. Foto: Arnaud 25.')
  ) as photo(attraction_slug, photo_order, caption)
  where attractions.slug = photo.attraction_slug
    and cities.slug = 'saint-tropez'
) as caption_data
where attraction_photos.attraction_id = caption_data.attraction_id
  and attraction_photos."order" = caption_data.photo_order;
