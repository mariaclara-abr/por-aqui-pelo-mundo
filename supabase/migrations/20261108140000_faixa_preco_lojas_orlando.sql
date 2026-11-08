-- Faixa de preço das lojas e mercados novos de Orlando, pelo posicionamento de preço médio de cada rede:
-- 1 = desconto, 2 = preço médio, 3 = acima da média, 4 = premium. Cirque e Amphicar (experiências) ficam sem faixa.
update attractions a set price_range = v.p
from cities c, (values
('dollar-tree',1),('dollar-general',1),('five-below',1),('dds-discounts',1),('ross-dress-for-less',1),('marshalls',1),('tj-maxx',1),('burlington',1),('aldi',1),('walmart',1),
('target',2),('publix',2),('trader-joes',2),('sprouts-farmers-market',2),('seabra-foods',2),('superbras',2),('rokkas-market',2),('walgreens',2),('cvs-pharmacy',2),('homegoods',2),('best-buy',2),('macys',2),
('whole-foods-market',3),('dillards',3),('nordstrom',3),('williams-sonoma',3),('the-container-store',3),
('le-creuset',4)
) as v(slug,p)
where a.city_id = c.id and c.slug = 'orlando' and a.slug = v.slug;
