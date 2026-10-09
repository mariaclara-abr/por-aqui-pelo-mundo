-- Restaurantes citados no roteiro de planejamento da Disney que ficam fora
-- dos parques. Entram em Orlando, sem atração pai, como "em breve" (draft),
-- só com o que está no roteiro. Nota de curadoria em branco de propósito.
insert into attractions (
  city_id, name, slug, categories, description, important_tips, status
)
select cities.id, item.name, item.slug, array['restaurante']::attraction_category[],
  item.description, item.important_tips, 'draft'
from cities
cross join (
  values
    ('Chili''s', 'chilis-orlando',
      'Restaurante estilo Outback, mas mais barato, com uma pegada um pouco mexicana.',
      'Na época do roteiro havia a promoção 3 for Me: entrada, prato principal e bebida. Vale conferir se continua valendo.'),
    ('Carrabba''s Italian Grill', 'carrabbas-orlando',
      'Restaurante italiano, do mesmo dono do Outback.',
      null),
    ('Chipotle', 'chipotle-orlando',
      'Fast-food americano, parecido com o Spoleto: tem arroz, frango e carne, uma comida parecida com a brasileira, e não é cara.',
      null),
    ('Chef Mickey''s', 'chef-mickeys',
      'Restaurante do Contemporary Resort, no Walt Disney World.',
      null),
    ('1900 Park Fare', '1900-park-fare',
      'Restaurante do Grand Floridian Resort and Spa, no Walt Disney World.',
      null)
) as item(name, slug, description, important_tips)
where cities.slug = 'orlando'
  and not exists (select 1 from attractions x where x.slug = item.slug);
