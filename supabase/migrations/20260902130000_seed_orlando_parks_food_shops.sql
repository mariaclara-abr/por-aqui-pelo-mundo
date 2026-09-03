-- Curadoria: nova camada dentro dos parques de Orlando já cadastrados
-- (magic-kingdom, epcot, hollywood-studios, animal-kingdom,
-- kennedy-space-center), a partir dos mesmos roteiros de planejamento.
-- Por enquanto só restaurantes, lojas e comidas específicas; o
-- detalhamento por brinquedo/atração interna fica para depois.
-- Nota de curadoria em branco de propósito, para a autora avaliar depois
-- pelo painel /admin/atracoes.

-- MAGIC KINGDOM
insert into attractions (
  city_id, parent_attraction_id, name, slug, categories, description,
  important_tips
)
select
  cities.id, parent.id, item.name, item.slug, item.categories,
  item.description, item.important_tips
from cities
join attractions parent
  on parent.slug = 'magic-kingdom' and parent.city_id = cities.id
cross join (
  values
    (
      'Plaza Ice Cream Parlor', 'plaza-ice-cream-parlor',
      array['cafe']::attraction_category[],
      'Sorveteria na Main Street, U.S.A., conhecida pelo sundae servido '
      || 'dentro de uma pia de louça, o Mickey''s Kitchen Sink Sundae (a '
      || 'pia do Mickey ou da Minnie), pensado para dividir entre várias '
      || 'pessoas.',
      'A mesma sobremesa também é servida no Beaches & Cream Soda Shop, no '
      || 'Disney''s Beach Club Resort.'
    ),
    (
      'Sleepy Hollow', 'sleepy-hollow-magic-kingdom',
      array['cafe']::attraction_category[],
      'Cabana rústica de tijolos ao lado do Castelo da Cinderela, na '
      || 'Liberty Square, com sanduíches e doces. O destaque é o Funnel '
      || 'Cake with Strawberry Topping and Whipped Cream, um dos lanches '
      || 'mais pedidos do parque.',
      'Dá pra pedir pelo app da Disney (Mobile Order) e evitar a fila.'
    ),
    (
      'Aloha Isle', 'aloha-isle',
      array['cafe']::attraction_category[],
      'Quiosque de sobremesas da Adventureland, famoso pelo Pineapple '
      || 'Float, uma espécie de suco de abacaxi com sorvete de creme ou de '
      || 'abacaxi boiando por cima.',
      null
    ),
    (
      'Carrinho de Rolinhos Primavera da Adventureland',
      'carrinho-rolinhos-primavera-adventureland',
      array['cafe']::attraction_category[],
      'Logo na entrada da Adventureland, para quem vem da Main Street, um '
      || 'carrinho vende rolinhos primavera fritos, um dos melhores '
      || 'lanchinhos do parque.',
      null
    )
) as item(name, slug, categories, description, important_tips)
where cities.slug = 'orlando'
on conflict (slug) do nothing;

-- EPCOT
insert into attractions (
  city_id, parent_attraction_id, name, slug, categories, description,
  important_tips
)
select
  cities.id, parent.id, item.name, item.slug, item.categories,
  item.description, item.important_tips
from cities
join attractions parent
  on parent.slug = 'epcot' and parent.city_id = cities.id
cross join (
  values
    (
      'Club Cool', 'club-cool',
      array['cafe']::attraction_category[],
      'Espaço na World Celebration, reaberto numa versão repaginada, onde '
      || 'dá pra experimentar de graça refrigerantes de todo o mundo.',
      'Cuidado com o refrigerante da Itália: é bem amargo.'
    ),
    (
      'Connections Café e Connections Eatery', 'connections-cafe-eatery',
      array['restaurante']::attraction_category[],
      'Duas opções de fast-food lado a lado na World Celebration, com '
      || 'cheeseburger e pizza que fogem do básico. O destaque é o Liege '
      || 'Waffle, massa de brioche passada em pérolas de açúcar e '
      || 'prensada na máquina de waffle belga, servida com morangos e '
      || 'calda de chocolate.',
      'Dá pra pedir direto pelo app da Disney e evitar as filas do caixa.'
    ),
    (
      'Space 220', 'space-220',
      array['restaurante']::attraction_category[],
      'Restaurante e lounge no World Discovery que simulam uma estação '
      || 'vendo a Terra a 220 milhas de distância. Tanto o restaurante '
      || 'como o lounge são disputadíssimos.',
      'Reserva recomendada com 60 dias de antecedência. Sem reserva, tente '
      || 'ir bem cedo ou fora dos horários de pico.'
    ),
    (
      'Karamell-Küche', 'karamell-kuche',
      array['compras']::attraction_category[],
      'Loja no pavilhão da Alemanha, no World Showcase, cujo nome '
      || 'significa "cozinha de caramelo": doces feitos com o famoso '
      || 'caramelo da marca Werther''s.',
      null
    ),
    (
      'L''Artisan des Glaces', 'lartisan-des-glaces',
      array['cafe']::attraction_category[],
      'Sorveteria no pavilhão da França, no World Showcase, com sorvetes '
      || 'artesanais maravilhosos.',
      null
    )
) as item(name, slug, categories, description, important_tips)
where cities.slug = 'orlando'
on conflict (slug) do nothing;

-- HOLLYWOOD STUDIOS
insert into attractions (
  city_id, parent_attraction_id, name, slug, categories, description,
  important_tips
)
select
  cities.id, parent.id, item.name, item.slug, item.categories,
  item.description, item.important_tips
from cities
join attractions parent
  on parent.slug = 'hollywood-studios' and parent.city_id = cities.id
cross join (
  values
    (
      'Woody''s Lunch Box', 'woodys-lunch-box',
      array['restaurante']::attraction_category[],
      'Fast-food da Toy Story Land, com opções diferentes e muito '
      || 'gostosas: o queijo quente com três queijos, acompanhado de sopa '
      || 'de tomate para molhar o sanduíche, e os totchos, bolinho de '
      || 'batata ralada e frita com queijo.',
      'Mobile order disponível pelo app da Disney.'
    ),
    (
      'Oga''s Cantina', 'ogas-cantina',
      array['restaurante']::attraction_category[],
      'Bar dentro de Star Wars: Galaxy''s Edge, num clima clandestino e '
      || 'super imersivo. Os garçons são despojados e interagem com os '
      || 'clientes, e um robô-DJ cuida do som.',
      null
    ),
    (
      'Milk Stand', 'milk-stand',
      array['cafe']::attraction_category[],
      'Quiosque de Star Wars: Galaxy''s Edge onde dá pra experimentar o '
      || 'leite azul e o leite verde da saga, com e sem álcool.',
      null
    ),
    (
      'The Trolley Car Café', 'trolley-car-cafe',
      array['cafe']::attraction_category[],
      'Um Starbucks temático no Hollywood Blvd, onde se encontra o Carrot '
      || 'Cake Cookie, um doce clássico do parque, um biscoitão de bolo de '
      || 'cenoura bem diferente do bolo de cenoura brasileiro.',
      null
    ),
    (
      'Epic Eats', 'epic-eats',
      array['cafe']::attraction_category[],
      'Quiosque na Echo Lake, um dos melhores lugares do parque para '
      || 'comprar funnel cake com calda de morango.',
      null
    )
) as item(name, slug, categories, description, important_tips)
where cities.slug = 'orlando'
on conflict (slug) do nothing;

-- ANIMAL KINGDOM
insert into attractions (
  city_id, parent_attraction_id, name, slug, categories, description,
  important_tips
)
select
  cities.id, parent.id, item.name, item.slug, item.categories,
  item.description, item.important_tips
from cities
join attractions parent
  on parent.slug = 'animal-kingdom' and parent.city_id = cities.id
cross join (
  values
    (
      'Satu''li Canteen', 'satuli-canteen',
      array['restaurante']::attraction_category[],
      'Restaurante rápido e casual de Pandora, The World of Avatar, com '
      || 'comidinha gostosa e preço justo.',
      'Pedido feito pelo mobile order, no app da Disney.'
    ),
    (
      'Pongu Pongu', 'pongu-pongu',
      array['cafe']::attraction_category[],
      'Janelinha de Pandora, perto da entrada de Flight of Passage e do '
      || 'Satu''li Canteen, famosa pelo Pongu Lumpia, uma massinha frita '
      || 'com recheio de cream cheese e abacaxi que faz muito sucesso.',
      null
    ),
    (
      'Yak & Yeti Local Food Cafes', 'yak-yeti-local-food-cafes',
      array['restaurante']::attraction_category[],
      'Opção de almoço na área da Ásia, farta e sem ser cara: o cardápio '
      || 'tem yakissoba, arroz frito e franguinho com arroz e mel '
      || 'deliciosos.',
      'Cuidado para não confundir com o restaurante de mesmo nome ao '
      || 'lado, que é table service (com garçom) e bem mais caro.'
    )
) as item(name, slug, categories, description, important_tips)
where cities.slug = 'orlando'
on conflict (slug) do nothing;

-- KENNEDY SPACE CENTER
insert into attractions (
  city_id, parent_attraction_id, name, slug, categories, description,
  important_tips
)
select
  cities.id, parent.id, item.name, item.slug, item.categories,
  item.description, item.important_tips
from cities
join attractions parent
  on parent.slug = 'kennedy-space-center' and parent.city_id = cities.id
cross join (
  values
    (
      'Orbit Café', 'orbit-cafe',
      array['restaurante']::attraction_category[],
      'A maior lanchonete do Kennedy Space Center, com opções '
      || 'tradicionais como cheeseburguer e hot dog, além de sanduíches '
      || 'mais saudáveis e um cardápio completo de saladas para montar '
      || 'por conta própria.',
      null
    ),
    (
      'Moon Rock Café', 'moon-rock-cafe',
      array['restaurante']::attraction_category[],
      'Lanchonete perto do Apollo/Saturn V Center, com sanduíches, '
      || 'hambúrgueres e pizza. O maior diferencial é a vista: dá pra '
      || 'comer olhando para a espaçonave Apollo.',
      null
    )
) as item(name, slug, categories, description, important_tips)
where cities.slug = 'orlando'
on conflict (slug) do nothing;

-- Etiquetas.
insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'imperdivel'
where attractions.slug in (
  'sleepy-hollow-magic-kingdom', 'carrinho-rolinhos-primavera-adventureland',
  'space-220', 'karamell-kuche', 'lartisan-des-glaces', 'woodys-lunch-box',
  'ogas-cantina', 'milk-stand', 'trolley-car-cafe', 'epic-eats',
  'pongu-pongu', 'yak-yeti-local-food-cafes'
)
on conflict do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'economico'
where attractions.slug in ('satuli-canteen', 'yak-yeti-local-food-cafes')
on conflict do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'reserva_necessaria'
where attractions.slug = 'space-220'
on conflict do nothing;
