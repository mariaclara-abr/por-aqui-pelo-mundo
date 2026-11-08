-- Mais fotos do Chef Mickey's (Wikimedia Commons). Não há foto livre do salão do restaurante, então entram
-- imagens do átrio e do hotel Contemporary Resort, com legenda honesta. A melhor passa a ser a capa.
update attraction_photos set "order" = "order" + 4
where attraction_id = (select a.id from attractions a join cities c on c.id = a.city_id where c.slug = 'orlando' and a.slug = 'chef-mickeys');

insert into attraction_photos (attraction_id, url, "order", caption)
select a.id, v.url, v.ord, v.caption
from attractions a join cities c on c.id = a.city_id and c.slug = 'orlando'
cross join (values
($$https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/South-councourse.jpg/1280px-South-councourse.jpg$$, 0, $$Átrio central do Disney's Contemporary Resort, o hotel onde fica o Chef Mickey's, com o monorail cruzando o salão. Foto: Csaribay / Wikimedia Commons, CC BY-SA 3.0.$$),
($$https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Contemporary_A_Frame.jpg/1280px-Contemporary_A_Frame.jpg$$, 1, $$Vista de cima do grande átrio do Contemporary Resort. Foto: Spmartin15 / Wikimedia Commons, CC BY-SA 4.0.$$),
($$https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Disneys-contemporary-resort-mosaic-closeup.jpg/1280px-Disneys-contemporary-resort-mosaic-closeup.jpg$$, 2, $$Detalhe do mosaico do átrio do Contemporary Resort. Foto: Deror avi / Wikimedia Commons, CC BY-SA 3.0.$$),
($$https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Disney%27s_Contemporary_Resort_Arriving_Monorail_Teal.jpg/1280px-Disney%27s_Contemporary_Resort_Arriving_Monorail_Teal.jpg$$, 3, $$Fachada do Disney's Contemporary Resort com o monorail chegando. Foto: Quarax / Wikimedia Commons, CC BY-SA 4.0.$$)
) as v(url, ord, caption)
where a.slug = 'chef-mickeys'
  and not exists (select 1 from attraction_photos p where p.attraction_id = a.id and p.url = v.url);
