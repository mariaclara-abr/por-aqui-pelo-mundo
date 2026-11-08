-- Nova capa da Nordstrom: interior e fachada mais bonitos (Wikimedia Commons). As fotos anteriores seguem depois.
update attraction_photos set "order" = "order" + 2
where attraction_id = (select a.id from attractions a join cities c on c.id = a.city_id where c.slug = 'orlando' and a.slug = 'nordstrom');

insert into attraction_photos (attraction_id, url, "order", caption)
select a.id, v.url, v.ord, v.caption
from attractions a join cities c on c.id = a.city_id and c.slug = 'orlando'
cross join (values
('https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Nordstrom_Pacific_Centre_Level_1_2018.jpg/1280px-Nordstrom_Pacific_Centre_Level_1_2018.jpg', 0, 'Interior de uma loja Nordstrom, com a seção de bolsas e acessórios (unidade de Vancouver, no Canadá). Imagem ilustrativa. Foto: Wpcpey / Wikimedia Commons, CC BY-SA 4.0.'),
('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Nordstrom_Pacific_Centre_201807.jpg/1280px-Nordstrom_Pacific_Centre_201807.jpg', 1, 'Fachada de vidro de uma loja Nordstrom (unidade de Vancouver, no Canadá). Imagem ilustrativa. Foto: Wpcpey / Wikimedia Commons, CC BY-SA 4.0.')
) as v(url, ord, caption)
where a.slug = 'nordstrom'
  and not exists (select 1 from attraction_photos p where p.attraction_id = a.id and p.url = v.url);
