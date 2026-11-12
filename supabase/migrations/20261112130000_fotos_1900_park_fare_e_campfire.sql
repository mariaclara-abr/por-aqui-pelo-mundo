-- Reaplica as fotos do 1900 Park Fare (Grand Floridian) e cadastra fotos do Fort Wilderness, onde acontece o Chip 'n' Dale's Campfire Sing-A-Long. Todas do Wikimedia Commons.

insert into attraction_photos (attraction_id, url, "order", caption)
select a.id, v.url, v.ord, v.caption
from attractions a join cities c on c.id = a.city_id and c.slug = 'orlando'
cross join (values
($$https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/A_Grand_Lobby_(29739608943).jpg/1280px-A_Grand_Lobby_(29739608943).jpg$$, 0, $$Saguão do Disney's Grand Floridian Resort & Spa, hotel onde fica o restaurante 1900 Park Fare. Foto: Chad Sparkes / Wikimedia Commons, CC BY 2.0.$$),
($$https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Interior_of_Disney%27s_Grand_Floridian_Resort_%26_Spa.jpg/1280px-Interior_of_Disney%27s_Grand_Floridian_Resort_%26_Spa.jpg$$, 1, $$Interior do Disney's Grand Floridian Resort & Spa, com o saguão de vários andares. Foto: LlamasTasteFunny / Wikimedia Commons, domínio público.$$),
($$https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Grand_Floridian_Lobby.jpg/1280px-Grand_Floridian_Lobby.jpg$$, 2, $$Saguão do Grand Floridian visto de cima, com o piano e as áreas de convivência. Foto: Chrisg21090 / Wikimedia Commons, domínio público.$$),
($$https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Disney%27s_Grand_Floridian_Resort_%26_Spa_from_Seven_Seas_Lagoon_1.jpg/1280px-Disney%27s_Grand_Floridian_Resort_%26_Spa_from_Seven_Seas_Lagoon_1.jpg$$, 3, $$Disney's Grand Floridian Resort & Spa visto do Seven Seas Lagoon. Foto: Quarax / Wikimedia Commons, CC BY-SA 4.0.$$)
) as v(url, ord, caption)
where a.slug = '1900-park-fare'
  and not exists (select 1 from attraction_photos p where p.attraction_id = a.id and p.url = v.url);

insert into attraction_photos (attraction_id, url, "order", caption)
select a.id, v.url, v.ord, v.caption
from attractions a join cities c on c.id = a.city_id and c.slug = 'orlando'
cross join (values
($$https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Fort_Wilderness_cabin.jpg/1280px-Fort_Wilderness_cabin.jpg$$, 0, $$Cabana de madeira entre os pinheiros do Disney's Fort Wilderness Resort & Campground, onde acontece o Campfire Sing-A-Long. Foto: Benjamin D. Esham / Wikimedia Commons, CC BY-SA 4.0.$$),
($$https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Disney%27s_Fort_Wilderness_Campground_Lake_-_panoramio_%281%29.jpg/1280px-Disney%27s_Fort_Wilderness_Campground_Lake_-_panoramio_%281%29.jpg$$, 1, $$Praia de areia à beira do lago do Fort Wilderness, com cipreste e musgo espanhol. Foto: Steven Pignataro / Wikimedia Commons, CC BY-SA 3.0.$$),
($$https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Disney%27s_Fort_Wilderness_Campground_Lake_-_panoramio_%282%29.jpg/1280px-Disney%27s_Fort_Wilderness_Campground_Lake_-_panoramio_%282%29.jpg$$, 2, $$Barco ancorado no lago do Disney's Fort Wilderness Campground. Foto: Steven Pignataro / Wikimedia Commons, CC BY-SA 3.0.$$)
) as v(url, ord, caption)
where a.slug = 'chip-n-dales-campfire-sing-a-long'
  and not exists (select 1 from attraction_photos p where p.attraction_id = a.id and p.url = v.url);
