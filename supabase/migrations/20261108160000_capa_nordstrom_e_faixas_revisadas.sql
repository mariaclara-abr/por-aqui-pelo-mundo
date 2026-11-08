-- Capa nova da Nordstrom (fachadas de lojas da rede na Flórida) e revisão das faixas de preço:
-- 4 ($$$$) fica reservado a lojas de luxo, e nenhuma loja desta lista é.
update attraction_photos set "order" = "order" + 2
where attraction_id = (select a.id from attractions a join cities c on c.id = a.city_id where c.slug = 'orlando' and a.slug = 'nordstrom');

insert into attraction_photos (attraction_id, url, "order", caption)
select a.id, v.url, v.ord, v.caption
from attractions a join cities c on c.id = a.city_id and c.slug = 'orlando'
cross join (values
('https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Nordstrom_Dadeland_Mall_Miami_(16047853707).jpg/1280px-Nordstrom_Dadeland_Mall_Miami_(16047853707).jpg', 0, 'Fachada de uma loja Nordstrom na Flórida (Dadeland Mall, Miami). Imagem ilustrativa. Foto: Phillip Pessar / Wikimedia Commons, CC BY 2.0.'),
('https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Nordstrom_Aventura_Mall_(49269853202).jpg/1280px-Nordstrom_Aventura_Mall_(49269853202).jpg', 1, 'Entrada de uma loja Nordstrom na Flórida (Aventura Mall). Imagem ilustrativa. Foto: Phillip Pessar / Wikimedia Commons, CC BY 2.0.')
) as v(url, ord, caption)
where a.slug = 'nordstrom'
  and not exists (select 1 from attraction_photos p where p.attraction_id = a.id and p.url = v.url);

update attractions a set price_range = v.p
from cities c, (values
('le-creuset',3),('whole-foods-market',2),('dillards',2),('the-container-store',2)
) as v(slug,p)
where a.city_id = c.id and c.slug = 'orlando' and a.slug = v.slug;
