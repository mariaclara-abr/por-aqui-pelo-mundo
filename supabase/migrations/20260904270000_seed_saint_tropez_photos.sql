-- Fotos de atrações de Saint-Tropez: imagens de domínio livre (Wikimedia
-- Commons, licença CC BY-SA), com a legenda guardando o crédito exigido
-- pela licença. Só as atrações abaixo tinham fotos genuinamente do lugar
-- disponíveis em bancos de imagem livres; estacionamentos e os restaurantes
-- pequenos (La Petite Plage, Le Bagatelle) não têm fotos livres específicas
-- e ficaram de fora.
insert into attraction_photos (attraction_id, url, "order", caption)
select attractions.id, photo.url, photo.photo_order, photo.caption
from attractions
join cities on cities.id = attractions.city_id
cross join (
  values
    (
      'porto-de-saint-tropez',
      'https://upload.wikimedia.org/wikipedia/commons/1/1c/Port_de_Saint-Tropez_003.jpg',
      0, 'Foto: Arnaud 25 / Wikimedia Commons, CC BY-SA 4.0'
    ),
    (
      'porto-de-saint-tropez',
      'https://upload.wikimedia.org/wikipedia/commons/8/85/Port_de_Saint-Tropez_004.jpg',
      1, 'Foto: Arnaud 25 / Wikimedia Commons, CC BY-SA 4.0'
    ),
    (
      'porto-de-saint-tropez',
      'https://upload.wikimedia.org/wikipedia/commons/6/61/Luxury_yachts_in_Saint-Tropez%2C_2006.jpg',
      2, 'Foto: Ed g2s / Wikimedia Commons, CC BY-SA 3.0'
    ),
    (
      'senequier-saint-tropez',
      'https://upload.wikimedia.org/wikipedia/commons/a/a6/Port_%28Saint-Tropez%29_%2804%29.jpg',
      0, 'Foto: Gzen92 / Wikimedia Commons, CC BY-SA 4.0'
    ),
    (
      'senequier-saint-tropez',
      'https://upload.wikimedia.org/wikipedia/commons/4/49/Caf%C3%A9_S%C3%A9n%C3%A9quier_en_Novembre_2019.jpg',
      1, 'Foto: Mathieu Brossais / Wikimedia Commons, CC BY-SA 4.0'
    ),
    (
      'senequier-saint-tropez',
      'https://upload.wikimedia.org/wikipedia/commons/7/7f/Port_de_Saint-Tropez_008.jpg',
      2, 'Foto: Arnaud 25 / Wikimedia Commons, CC BY-SA 4.0'
    ),
    (
      'a-citadelle-saint-tropez',
      'https://upload.wikimedia.org/wikipedia/commons/d/d6/Citadelle_%28Saint-Tropez%29_%281%29.jpg',
      0, 'Foto: Gzen92 / Wikimedia Commons, CC BY-SA 4.0'
    ),
    (
      'a-citadelle-saint-tropez',
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Citadelle_de_Saint-Tropez_%28vue_a%C3%A9rienne%29.jpg',
      1, 'Foto: Starus / Wikimedia Commons, CC BY-SA 3.0'
    ),
    (
      'a-citadelle-saint-tropez',
      'https://upload.wikimedia.org/wikipedia/commons/c/c0/Saint-Tropez_-_Donjon_de_la_Citadelle.jpg',
      2, 'Foto: Starus / Wikimedia Commons, CC BY-SA 3.0'
    ),
    (
      'a-citadelle-saint-tropez',
      'https://upload.wikimedia.org/wikipedia/commons/5/55/Saint-Tropez_-_Canons_de_la_Citadelle.jpg',
      3, 'Foto: Starus / Wikimedia Commons, CC BY-SA 3.0'
    ),
    (
      'place-des-lices-saint-tropez',
      'https://upload.wikimedia.org/wikipedia/commons/a/a9/Place_des_Lices_-_Saint-Tropez_1.jpg',
      0, 'Foto: Arnaud 25 / Wikimedia Commons, CC BY-SA 4.0'
    ),
    (
      'place-des-lices-saint-tropez',
      'https://upload.wikimedia.org/wikipedia/commons/9/9c/Place_des_Lices_-_Saint-Tropez_2.jpg',
      1, 'Foto: Arnaud 25 / Wikimedia Commons, CC BY-SA 4.0'
    ),
    (
      'place-des-lices-saint-tropez',
      'https://upload.wikimedia.org/wikipedia/commons/1/14/StTropezBoule.jpg',
      2, 'Foto: Niels Elgaard Larsen / Wikimedia Commons, CC BY-SA 3.0'
    ),
    (
      'place-des-lices-saint-tropez',
      'https://upload.wikimedia.org/wikipedia/commons/d/de/Olives_proven%C3%A7ales_du_march%C3%A9_proven%C3%A7al_de_Saint-Tropez.jpg',
      3, 'Foto: Arnaud 25 / Wikimedia Commons, CC BY-SA 4.0'
    ),
    (
      'plage-de-pampelonne',
      'https://upload.wikimedia.org/wikipedia/commons/a/a7/Plage_de_Pampelonne_-_Vue_generale.jpg',
      0, 'Foto: Guido Radig / Wikimedia Commons, CC BY-SA 4.0'
    ),
    (
      'plage-de-pampelonne',
      'https://upload.wikimedia.org/wikipedia/commons/a/a3/La_Plage_de_Pampelonne.jpg',
      1, 'Foto: Jean-Pierre Bazard / Wikimedia Commons, CC BY-SA 3.0'
    ),
    (
      'plage-de-pampelonne',
      'https://upload.wikimedia.org/wikipedia/commons/b/b0/Plage_de_Pampelonne_1.jpg',
      2, 'Foto: Arnaud 25 / Wikimedia Commons, CC BY-SA 4.0'
    ),
    (
      'plage-de-pampelonne',
      'https://upload.wikimedia.org/wikipedia/commons/d/d9/Plage_de_Pampelonne_4.jpg',
      3, 'Foto: Arnaud 25 / Wikimedia Commons, CC BY-SA 4.0'
    )
) as photo(attraction_slug, url, photo_order, caption)
where attractions.slug = photo.attraction_slug
  and cities.slug = 'saint-tropez'
  and not exists (
    select 1 from attraction_photos existing
    where existing.attraction_id = attractions.id
      and existing.url = photo.url
  );
