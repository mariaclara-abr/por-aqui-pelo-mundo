-- Restaurantes, lojas e experiências citados nos roteiros de planejamento da
-- Disney que ainda não estavam cadastrados. Entram como "em breve" (draft),
-- só com o que está nos roteiros. Nota de curadoria em branco de propósito.
insert into attractions (
  city_id, parent_attraction_id, name, slug, categories, description,
  important_tips, status
)
select
  cities.id, parent.id, item.name, item.slug, item.categories,
  item.description, item.important_tips, 'draft'
from cities
join (
  values
    ('hollywood-studios', 'Hollywood Brown Derby', 'hollywood-brown-derby',
      array['restaurante']::attraction_category[],
      'Na Hollywood Boulevard, um dos restaurantes mais sofisticados dentro de parque. Não é nada barato, mas a comida é excelente: carne com manteiga de redução de vinho e purê de batatas trufado.',
      null),
    ('hollywood-studios', 'Docking Bay 7 Food and Cargo', 'docking-bay-7',
      array['restaurante']::attraction_category[],
      'Em Star Wars: Galaxy''s Edge, o fast-food mais legal da área. Tem bastante espaço para sentar, é inteiramente tematizado no universo Star Wars e tem opções variadas e gostosas.',
      null),
    ('hollywood-studios', '50''s Prime Time Café', '50s-prime-time-cafe',
      array['restaurante']::attraction_category[],
      'Em Echo Lake, tematizado como uma casa dos anos 50, com garçons que interagem com os clientes em clima divertido. Comida boa e preço justo.',
      null),
    ('hollywood-studios', 'Oasis Canteen', 'oasis-canteen',
      array['cafe']::attraction_category[],
      'Em Echo Lake, é onde se encontra o melhor doce da Disney: o Funnel Cake com calda de morango.',
      null),
    ('hollywood-studios', 'ABC Commissary', 'abc-commissary',
      array['restaurante']::attraction_category[],
      'Na Commissary Lane, com opções diferentes e mais saudáveis: salada, peixe, frango e carne grelhada. Para quem prefere, também tem o tradicional cheeseburger.',
      null),
    ('hollywood-studios', 'Mama Melrose''s Ristorante Italiano', 'mama-melroses-ristorante-italiano',
      array['restaurante']::attraction_category[],
      'Na Grand Avenue, comida típica italiano-americana, honesta pelo preço cobrado, em ambiente bonito.',
      'Boa opção para comer bem e garantir lugar para o Fantasmic.'),
    ('hollywood-studios', 'Savi''s Workshop', 'savis-workshop',
      array['compras']::attraction_category[],
      'Em Star Wars: Galaxy''s Edge, a loja onde se monta o próprio sabre de luz. É uma experiência paga à parte.',
      'É preciso fazer reserva antecipadamente.'),
    ('hollywood-studios', 'Droid Depot', 'droid-depot',
      array['compras']::attraction_category[],
      'Em Star Wars: Galaxy''s Edge, a loja onde se monta o próprio droid. É uma experiência paga à parte.',
      'É preciso fazer reserva antecipadamente.'),
    ('epcot', 'Creations Shop', 'creations-shop',
      array['compras']::attraction_category[],
      'Hoje é a maior loja da Disney dentro de parque.',
      'Se estiver muito cheia, use a opção Mobile Checkout: dá para pagar direto no app da Disney, sem parar no caixa.'),
    ('epcot', 'La Cantina de San Angel', 'la-cantina-de-san-angel',
      array['restaurante']::attraction_category[],
      'O fast-food do pavilhão do México. Experimente as empanadas.',
      null),
    ('epcot', 'Boulangerie & Patisserie', 'boulangerie-patisserie-epcot',
      array['cafe']::attraction_category[],
      'No pavilhão da França, uma padaria que fica bem no fundo do pavilhão.',
      null),
    ('magic-kingdom', 'Main Street Bakery', 'main-street-bakery',
      array['cafe']::attraction_category[],
      'Na Main Street, U.S.A., uma opção para tomar café da manhã, com Starbucks.',
      null),
    ('magic-kingdom', 'Cinderella''s Royal Table', 'cinderellas-royal-table',
      array['restaurante']::attraction_category[],
      'Restaurante no Castelo da Cinderela, com almoço e jantar.',
      'É preciso fazer reserva com 1 ou 2 meses de antecedência.')
) as item(parent_slug, name, slug, categories, description, important_tips)
  on true
join attractions parent
  on parent.slug = item.parent_slug and parent.city_id = cities.id
where cities.slug = 'orlando'
  and not exists (select 1 from attractions x where x.slug = item.slug);

-- Beaches & Cream fica no Disney's Beach Club Resort, sem ficha de hotel.
insert into attractions (
  city_id, name, slug, categories, description, important_tips, status
)
select
  cities.id, 'Beaches & Cream Soda Shop', 'beaches-and-cream-soda-shop',
  array['cafe']::attraction_category[],
  'No Disney''s Beach Club Resort, serve o Mickey''s Kitchen Sink Sundae (a pia do Mickey), a mesma sobremesa do Plaza Ice Cream Parlor, no Magic Kingdom.',
  'Fica na 1800 Epcot Resorts Blvd e funciona das 11h às 23h.', 'draft'
from cities
where cities.slug = 'orlando'
  and not exists (
    select 1 from attractions x where x.slug = 'beaches-and-cream-soda-shop'
  );
