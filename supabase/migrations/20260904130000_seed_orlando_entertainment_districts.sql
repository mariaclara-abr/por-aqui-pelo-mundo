-- Curadoria: Estados Unidos > Orlando, os três grandes complexos de compras
-- e entretenimento fora dos parques (Disney Springs, Disney's Boardwalk e
-- Universal CityWalk), a partir dos roteiros de planejamento da viagem de
-- julho de 2024. Só entra a descrição geral de cada área, sem listar loja
-- ou restaurante por restaurante. Nota de curadoria em branco de
-- propósito, para a autora avaliar depois pelo painel /admin/atracoes.

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
      'Disney Springs', 'disney-springs',
      array['compras', 'restaurante', 'passeio']::attraction_category[],
      'Complexo a céu aberto fora dos parques, dividido em quatro áreas '
      || '(Marketplace, The Landing, Town Center e West Side), com lojas '
      || 'como a World of Disney, a maior da marca, restaurantes que vão '
      || 'do descontraído Rainforest Café ao sofisticado Wine Bar George, '
      || 'e atrações próprias como o espetáculo Drawn to Life do Cirque du '
      || 'Soleil e o boliche Splitsville Luxury Lanes. Funciona das 10h às '
      || '23h, e o estacionamento é gratuito.',
      'Muitos restaurantes aceitam reserva pelo app da Disney; para os '
      || 'mais concorridos, como o Raglan Road, vale reservar com '
      || 'antecedência.',
      'Meio período',
      'Fim de tarde e noite, quando as lojas e restaurantes ficam mais '
      || 'animados',
      'Famílias, casais e quem quer um dia sem fila de atração'
    ),
    (
      'Disney''s Boardwalk', 'disneys-boardwalk',
      array['passeio', 'restaurante']::attraction_category[],
      'Um calçadão à beira de um lago, no entorno do hotel Disney''s '
      || 'Boardwalk Inn, vizinho do Epcot e do Hollywood Studios. Reúne '
      || 'restaurantes como a Boardwalk Deli e a Trattoria Al Forno, o '
      || 'quiosque Joe''s Marvelous Margaritas e artistas de rua à noite, '
      || 'com shows de comédia, mágica e malabarismo. Dá pra ver os fogos '
      || 'do Epcot de longe, de graça, direto do calçadão.',
      'O acesso de carro costuma ser restrito a quem tem reserva em '
      || 'algum restaurante do local; o resto do complexo é livre para '
      || 'visitar a pé.',
      'Meio período',
      'Fim de tarde e noite',
      'Casais e famílias que já estão hospedadas ou visitando a região do '
      || 'Epcot'
    ),
    (
      'Universal CityWalk', 'universal-citywalk',
      array['compras', 'restaurante', 'passeio']::attraction_category[],
      'O centro de entretenimento entre a entrada dos parques Universal e '
      || 'os estacionamentos, com restaurantes como o Hard Rock Cafe (a '
      || 'maior unidade do mundo), o The Bubba Gump Shrimp Co e o Vivo '
      || 'Italian Kitchen, além de baladas e bares que exigem o CityWalk '
      || 'Party Pass para entrar. Funciona das 8h à meia-noite (até 1h nas '
      || 'sextas e sábados), e o estacionamento é gratuito a partir das '
      || '18h.',
      'Quem tem ingresso multi-day dos parques ganha o Party Pass de '
      || 'graça, só precisa apresentar o ingresso na entrada das baladas.',
      'Meio período',
      'Noite',
      'Casais e grupos de adultos e adolescentes'
    )
) as attraction(
  name, slug, categories, description, important_tips, average_visit_time,
  best_time_of_day, recommended_audience
)
where cities.slug = 'orlando'
on conflict (slug) do nothing;
