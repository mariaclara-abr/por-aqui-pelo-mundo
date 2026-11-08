-- Mais fotos do 1900 Park Fare (Wikimedia Commons): saguão e vista do Grand Floridian, hotel do restaurante.
-- A foto atual continua como capa. Não há foto de comida apetitosa com licença livre.
update attraction_photos set "order" = "order" + 4
where attraction_id = (select a.id from attractions a join cities c on c.id = a.city_id where c.slug = 'orlando' and a.slug = '1900-park-fare') and "order" >= 1;

insert into attraction_photos (attraction_id, url, "order", caption)
select a.id, v.url, v.ord, v.caption
from attractions a join cities c on c.id = a.city_id and c.slug = 'orlando'
cross join (values
($$https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/A_Grand_Lobby_(29739608943).jpg/1280px-A_Grand_Lobby_(29739608943).jpg$$, 1, $$Saguão do Disney's Grand Floridian Resort & Spa, hotel onde fica o restaurante 1900 Park Fare. Foto: Chad Sparkes / Wikimedia Commons, CC BY 2.0.$$),
($$https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Interior_of_Disney%27s_Grand_Floridian_Resort_%26_Spa.jpg/1280px-Interior_of_Disney%27s_Grand_Floridian_Resort_%26_Spa.jpg$$, 2, $$Interior do Disney's Grand Floridian Resort & Spa, com o saguão de vários andares. Foto: LlamasTasteFunny / Wikimedia Commons, domínio público.$$),
($$https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Grand_Floridian_Lobby.jpg/1280px-Grand_Floridian_Lobby.jpg$$, 3, $$Saguão do Grand Floridian visto de cima, com o piano e as áreas de convivência. Foto: Chrisg21090 / Wikimedia Commons, domínio público.$$),
($$https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Disney%27s_Grand_Floridian_Resort_%26_Spa_from_Seven_Seas_Lagoon_1.jpg/1280px-Disney%27s_Grand_Floridian_Resort_%26_Spa_from_Seven_Seas_Lagoon_1.jpg$$, 4, $$Disney's Grand Floridian Resort & Spa visto do Seven Seas Lagoon. Foto: Quarax / Wikimedia Commons, CC BY-SA 4.0.$$)
) as v(url, ord, caption)
where a.slug = '1900-park-fare'
  and not exists (select 1 from attraction_photos p where p.attraction_id = a.id and p.url = v.url);
