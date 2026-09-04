-- Curadoria: Estados Unidos > Orlando, Universal Studios e Islands of
-- Adventure, a partir dos roteiros de planejamento da viagem de julho de
-- 2024. Segue o mesmo padrão já usado para os parques da Disney: só entra
-- a descrição geral de cada parque (sem detalhamento por brinquedo/área
-- interna) mais um punhado de restaurantes que são parada obrigatória.
-- Nota de curadoria em branco de propósito, para a autora avaliar depois
-- pelo painel /admin/atracoes.

insert into attractions (
  city_id, name, slug, categories, description, important_tips,
  average_visit_time, best_time_of_day, recommended_audience
)
select
  cities.id,
  attraction.name,
  attraction.slug,
  attraction.categories,
  attraction.description,
  attraction.important_tips,
  attraction.average_visit_time,
  attraction.best_time_of_day,
  attraction.recommended_audience
from cities
cross join (
  values
    (
      'Universal Studios', 'universal-studios-orlando',
      array['ponto_turistico', 'parque_tematico']::attraction_category[],
      'Parque com temática de cinema e TV, tem como destaque a área The '
      || 'Wizarding World of Harry Potter, Diagon Alley, com o Beco '
      || 'Diagonal e a montanha-russa Harry Potter and the Escape from '
      || 'Gringotts. Reúne também atrações como Revenge of the Mummy e '
      || 'Transformers The Ride-3D em New York, Hollywood Rip Ride Rockit '
      || 'em uma subida a 90 graus, o simulador Fast & Furious Supercharged '
      || 'em San Francisco, e a mais nova área do parque, Illumination''s '
      || 'Minion Land. O trem Hogwarts Express liga o parque a Hogsmeade, '
      || 'no Islands of Adventure, mas só para quem tem ingresso '
      || 'park-to-park.',
      'Assim que a catraca liberar, siga direto para Diagon Alley e a fila '
      || 'de Escape from Gringotts, a mais concorrida do parque; deixe a '
      || 'área para explorar com calma depois.',
      'Dia inteiro',
      'Logo na abertura, para Diagon Alley e New York',
      'Famílias com crianças maiores, adolescentes e fãs de Harry Potter'
    ),
    (
      'Islands of Adventure', 'islands-of-adventure',
      array['ponto_turistico', 'parque_tematico']::attraction_category[],
      'Parque dividido em ilhas temáticas, com destaque para The Wizarding '
      || 'World of Harry Potter, Hogsmeade, o vilarejo nevado com a '
      || 'montanha-russa Hagrid''s Magical Creatures Motorbike Adventure e '
      || 'o simulador Harry Potter and the Forbidden Journey no castelo de '
      || 'Hogwarts. Também reúne o Jurassic Park, com a Jurassic World '
      || 'VelociCoaster, a Marvel Super Hero Island, com The Incredible '
      || 'Hulk Coaster e The Amazing Adventures of Spider-Man, além de '
      || 'Skull Island: Reign of Kong, Seuss Landing e Toon Lagoon.',
      'Chegue cedo e vá direto para Hogsmeade e a fila de Hagrid''s '
      || 'Magical Creatures, a atração mais concorrida do parque; Jurassic '
      || 'Park é a segunda parada natural, enquanto o parque ainda está '
      || 'mais vazio.',
      'Dia inteiro',
      'Logo na abertura, para Hogsmeade e Jurassic Park',
      'Famílias com crianças maiores, adolescentes e fãs de Harry Potter'
    )
) as attraction(
  name, slug, categories, description, important_tips, average_visit_time,
  best_time_of_day, recommended_audience
)
where cities.slug = 'orlando'
on conflict (slug) do nothing;

update attractions
set parent_attraction_id = (select id from attractions where slug = 'parques')
where slug in ('universal-studios-orlando', 'islands-of-adventure');

-- Restaurantes que são parada obrigatória dentro dos dois parques.
insert into attractions (
  city_id, parent_attraction_id, name, slug, categories, description,
  important_tips
)
select
  cities.id, parent.id, item.name, item.slug, item.categories,
  item.description, item.important_tips
from cities
cross join (
  values
    (
      'universal-studios-orlando', 'Leaky Cauldron', 'leaky-cauldron',
      array['restaurante']::attraction_category[],
      'Restaurante do Beco Diagonal (Diagon Alley), com pratos inspirados '
      || 'na culinária inglesa, como peixes e carnes, além de opções '
      || 'vegetarianas.',
      'Dá pra pedir pelo app da Universal e evitar fila.'
    ),
    (
      'islands-of-adventure', 'Three Broomsticks', 'three-broomsticks',
      array['restaurante']::attraction_category[],
      'Um dos restaurantes mais gostosos do parque, em Hogsmeade, com '
      || 'preço justo e pratos fartos. É onde se compra a cerveja '
      || 'amanteigada (Butterbeer), inclusive em versão sorvete.',
      'Dá pra pedir pelo app da Universal e evitar fila.'
    ),
    (
      'islands-of-adventure', 'Mythos Restaurant', 'mythos-restaurant',
      array['restaurante']::attraction_category[],
      'Restaurante em The Lost Continent, eleito por seis anos o melhor '
      || 'restaurante de parque temático do mundo, com cardápio variado e '
      || 'de boa qualidade.',
      'Reserve mesa pelo app da Universal com antecedência.'
    )
) as item(parent_slug, name, slug, categories, description, important_tips)
join attractions parent
  on parent.slug = item.parent_slug and parent.city_id = cities.id
where cities.slug = 'orlando'
on conflict (slug) do nothing;
