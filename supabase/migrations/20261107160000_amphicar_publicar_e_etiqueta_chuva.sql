-- Passeio de carro anfíbio (Amphicar) da The BOATHOUSE, no Disney Springs. Dados do site oficial da
-- The BOATHOUSE e do Disney World. Também: publica todas as atrações novas de compras, mercados e
-- Cirque du Soleil (antes rascunho) e renomeia a etiqueta "Melhor em dias de chuva".
insert into attractions (city_id, name, slug, categories, description, important_tips, average_visit_time, best_time_of_day, best_season, recommended_audience, weather_sensitive, has_air_conditioning, status)
select c.id, $$Passeio de carro anfíbio (The BOATHOUSE Amphicar Tours)$$, 'amphicar-tours-the-boathouse', array['passeio']::attraction_category[],
$$Em **Disney Springs**, em Orlando, a **The BOATHOUSE** oferece um passeio diferente de tudo o que existe nos parques: um tour guiado em um **Amphicar**, carro anfíbio vintage que anda normalmente em terra e depois entra na água, navegando como se fosse um barco.

O passeio dura cerca de **20 minutos** e é conduzido por um capitão, que apresenta os cenários do Disney Springs vistos do **Lake Buena Vista**. Segundo o site oficial, os Amphicars foram comprados de coleções particulares do mundo todo: menos de 4 mil unidades foram produzidas nos anos 1960, e restam menos de 400.

O valor é **por carro, e não por pessoa**, e cada veículo leva de 3 a 4 passageiros, o que torna o passeio ideal para famílias e grupos pequenos. Para quem busca uma experiência diferente, com ótimas fotos, é uma forma de variar o roteiro dentro do Disney Springs.

Uma boa sugestão é fazer o passeio **no fim da tarde**, quando a luz fica mais bonita para fotos, e combiná-lo com uma refeição no restaurante The BOATHOUSE, ao lado da doca.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://theboathouseorlando.com/amphicar-tours/$$,
$$✓ O valor é US$ 125 por carro, e não por pessoa. Cada carro leva de 3 a 4 passageiros.
✓ O passeio dura cerca de 20 minutos e funciona diariamente das 10h às 22h, se o tempo permitir.
✓ Segundo a Disney, as reservas só podem ser feitas pessoalmente, na doca ou dentro da loja The BOATHOUSE BOATIQUE. Chegue cedo para garantir seu horário, principalmente em fins de semana e feriados.
✓ O passeio depende do tempo e pode ser suspenso em caso de chuva. Tenha um plano alternativo no Disney Springs.
✓ Leve chapéu e protetor solar nos horários de sol forte, pois o passeio é ao ar livre.
✓ Combine o passeio com uma refeição no restaurante The BOATHOUSE, ao lado da doca.
✓ O endereço é 1620 Buena Vista Dr, Orlando, FL 32830. O estacionamento do Disney Springs é gratuito.$$,
'Cerca de 20 minutos', 'Fim da tarde', 'O ano todo', 'Famílias, casais, crianças e grupos de amigos', true, false, 'draft'
from cities c where c.slug = 'orlando'
  and not exists (select 1 from attractions a where a.city_id = c.id and a.slug = 'amphicar-tours-the-boathouse');

insert into attraction_photos (attraction_id, url, "order", caption)
select a.id, v.url, v.ord, v.caption
from attractions a join cities c on c.id = a.city_id and c.slug = 'orlando'
cross join (values
($$https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Amphicar_Launch%2C_Disney_Springs.jpg/1280px-Amphicar_Launch%2C_Disney_Springs.jpg$$, 0, $$Amphicar no lançamento do passeio, no Disney Springs. Foto: Michael Rivera / Wikimedia Commons, CC BY-SA 4.0.$$),
($$https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/The_Boathouse%27s_Amphicar_Launch_%2824251049474%29.jpg/1280px-The_Boathouse%27s_Amphicar_Launch_%2824251049474%29.jpg$$, 1, $$Doca do passeio de Amphicar da The BOATHOUSE, no Disney Springs. Foto: Forsaken Fotos / Wikimedia Commons, CC BY 2.0.$$),
($$https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Amphicar_LakeMinocqua.jpg/1280px-Amphicar_LakeMinocqua.jpg$$, 2, $$Imagem ilustrativa de um Amphicar na água. Foto: ZorroMothim / Wikimedia Commons, CC BY 4.0.$$),
($$https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Moscow_car_show_2026-07-31_Amphicar_770_02.jpg/1280px-Moscow_car_show_2026-07-31_Amphicar_770_02.jpg$$, 3, $$Imagem ilustrativa de um Amphicar 770. Foto: Retired electrician / Wikimedia Commons, CC0.$$)
) as v(url, ord, caption)
where a.slug = 'amphicar-tours-the-boathouse'
  and not exists (select 1 from attraction_photos p where p.attraction_id = a.id and p.url = v.url);

update tags set name = 'Opção para dias de chuva' where slug = 'melhor_dias_chuva';

update attractions a set status = 'published'
from cities c
where a.city_id = c.id and c.slug = 'orlando' and a.status = 'draft'
  and a.slug in ('walmart','target','publix','aldi','whole-foods-market','trader-joes','sprouts-farmers-market','seabra-foods','superbras','rokkas-market','walgreens','cvs-pharmacy','ross-dress-for-less','marshalls','tj-maxx','burlington','dds-discounts','five-below','dollar-tree','dollar-general','macys','dillards','nordstrom','homegoods','williams-sonoma','the-container-store','le-creuset','best-buy','cirque-du-soleil-drawn-to-life','amphicar-tours-the-boathouse');
