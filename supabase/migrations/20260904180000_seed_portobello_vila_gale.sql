-- Curadoria: Brasil > Mangaratiba e Angra dos Reis (RJ), a partir do
-- roteiro de comparação de resorts para as férias de janeiro de 2021.
-- País Brasil já existia (rascunho). Preços listados são os da época da
-- pesquisa (2021) e servem como referência de faixa, não como valor atual.
-- Nota de curadoria em branco de propósito, para a autora avaliar depois
-- pelo painel /admin/atracoes.

insert into cities (country_id, name, slug)
select countries.id, city.name, city.slug
from countries
cross join (
  values ('Mangaratiba', 'mangaratiba'), ('Angra dos Reis', 'angra-dos-reis')
) as city(name, slug)
where countries.slug = 'brasil'
on conflict (slug) do nothing;

insert into attractions (
  city_id, name, slug, categories, description, important_tips
)
select
  cities.id,
  'Portobello Resort & Safári',
  'portobello-resort-e-safari',
  array['hotel']::attraction_category[],
  'Resort all inclusive de frente para o mar em Mangaratiba, com 152 '
  || 'apartamentos, todos com vista para o mar, banheiro privativo, '
  || 'minibar, TV por satélite, ar condicionado, cofre e wi-fi. A diária '
  || 'inclui pensão completa (café da manhã, almoço e jantar em buffet '
  || 'nos restaurantes Escuna e Pérgola, com cozinha brasileira e '
  || 'internacional), estacionamento 24h, atividades de lazer com '
  || 'monitores, e 1 hora diária por pessoa de caiaque, bicicleta e '
  || 'tênis. Aos fins de semana e feriados funcionam também a Pizzaria e '
  || 'o Sushi. Tem acesso direto à Praia Portobello, com espreguiçadeiras '
  || 'em frente aos quartos, Miniclube Kids para crianças de 4 a 12 anos, '
  || 'e Fitness Center das 8h às 20h. Bebidas (nos bares, no room service '
  || 'e no frigobar do quarto) são pagas à parte, assim como o Spa.',
  'Consulte com antecedência opções para dietas restritivas, antes do '
  || 'check-in, pelo e-mail reservas@portobelloresort.com.br. O '
  || 'Miniclube Kids funciona das 9h às 22h na alta estação, feriados '
  || 'prolongados e fins de semana, e das 9h às 19h de domingo a '
  || 'quinta na baixa estação.'
from cities
where cities.slug = 'mangaratiba'
on conflict (slug) do nothing;

insert into attractions (
  city_id, parent_attraction_id, name, slug, categories, description,
  important_tips
)
select
  cities.id, parent.id, item.name, item.slug, item.categories,
  item.description, item.important_tips
from cities
join attractions parent
  on parent.slug = 'portobello-resort-e-safari' and parent.city_id = cities.id
cross join (
  values
    (
      'Passeio ao Safári', 'passeio-ao-safari-portobello',
      array['passeio']::attraction_category[],
      'Em uma área de 300.000 metros quadrados, vivem aproximadamente '
      || '500 animais das faunas brasileira, europeia e africana, em '
      || 'liberdade. Passeio de 1h30 em veículo 4x4, incluindo os '
      || 'flamingos, habitantes mais recentes do safári.',
      'Somente para hóspedes do resort. Valor de referência (2021): '
      || 'R$90,00 por pessoa.'
    ),
    (
      'Passeio de Catamarã para Ilha Grande', 'passeio-catamara-ilha-grande-portobello',
      array['passeio']::attraction_category[],
      'Passeio de 7 horas de catamarã até a Ilha Grande, passando pela '
      || 'Lagoa Azul, Freguesia de Santana e Restaurante Saco do Céu. '
      || 'Inclui água, refrigerante e cerveja (3 itens de cada por '
      || 'pessoa), cesta de frutas, mix de amendoim, pães e biscoitos.',
      'Somente para hóspedes do resort, mínimo de 4 e máximo de 30 '
      || 'pessoas. O almoço não está incluído, e os restaurantes da '
      || 'região não aceitam cartão de crédito ou débito. Valor de '
      || 'referência (2021): R$200,00 por pessoa.'
    ),
    (
      'Passeio ao Palmital', 'passeio-ao-palmital-portobello',
      array['passeio', 'natureza']::attraction_category[],
      'Passeio ecológico de 3 horas em veículo motorizado ou a cavalo, '
      || 'acompanhado por guia, por trilhas em meio à Mata Atlântica, '
      || 'terminando com banho de rio, sauna a lenha e palmito na brasa.',
      'Inclui sauna, piscina natural, degustação de palmito na brasa e '
      || 'cachaça de Paraty.'
    ),
    (
      'Piscinas Naturais', 'piscinas-naturais-portobello',
      array['natureza']::attraction_category[],
      'Piscinas naturais em meio à Mata Atlântica, formadas por uma '
      || 'cascatinha de águas cristalinas de uma nascente dentro da '
      || 'propriedade do resort. Parada convidativa durante o trajeto de '
      || '4x4, ideal para um banho refrescante nos dias de calor.',
      null
    )
) as item(name, slug, categories, description, important_tips)
where cities.slug = 'mangaratiba'
on conflict (slug) do nothing;

insert into attractions (
  city_id, name, slug, categories, description, important_tips
)
select
  cities.id,
  'Vila Galé Eco Resort de Angra',
  'vila-gale-eco-resort-de-angra',
  array['hotel']::attraction_category[],
  'Resort all inclusive de frente para a Praia de Tanguá, em Angra dos '
  || 'Reis, com 321 apartamentos equipados com wi-fi, ar condicionado, '
  || 'TV a cabo, frigobar com reposição gratuita, cofre e roupão e '
  || 'chinelos. Tem 5 restaurantes (2 à la carte, com agendamento '
  || 'necessário, e 1 infantil) e 4 bares (1 molhado, 1 de praia e 1 na '
  || 'danceteria). A equipe de lazer programa hidroginástica, polo '
  || 'aquático, caminhada na praia, vôlei, acqua dance, futebol, '
  || 'relaxamento, aula de ritmos e bingo, além de noites animadas com '
  || 'música ao vivo, Galé the Voice, family show, noite de samba e '
  || 'boate. O Clube NEP, com monitores fantasiados, funciona todos os '
  || 'dias com brincadeiras, pintura, culinária e música para as '
  || 'crianças (0 a 3 anos precisam de responsável por perto). O Spa '
  || 'funciona das 11h às 21h, com massagens agendadas à parte pelo Spa '
  || 'Satsanga.',
  'A praia de Tanguá não tem serviço de alimentação próprio, para '
  || 'preservar o ambiente.'
from cities
where cities.slug = 'angra-dos-reis'
on conflict (slug) do nothing;

insert into attractions (
  city_id, parent_attraction_id, name, slug, categories, description,
  important_tips
)
select
  cities.id, parent.id,
  'Ilhas Paradisíacas (Angraway)', 'ilhas-paradisiacas-angraway',
  array['passeio']::attraction_category[],
  'Passeio de lancha pelas ilhas da região, passando pelas Ilhas de '
  || 'Botinas, Praia da Fazenda, Praia de Jurubaíba (Dentista), Praia '
  || 'das Flechas e Praia da Piedade.',
  'Operado pela Angraway (angraway@angraway.com.br, '
  || 'https://angraway.com.br, +55 24 3365-0232 / +55 24 98855-1494). '
  || 'Valor de referência (2021): a partir de R$120,00 por pessoa.'
from cities
join attractions parent
  on parent.slug = 'vila-gale-eco-resort-de-angra' and parent.city_id = cities.id
where cities.slug = 'angra-dos-reis'
on conflict (slug) do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug in ('ideal_para_familias', 'luxo')
where attractions.slug in (
  'portobello-resort-e-safari', 'vila-gale-eco-resort-de-angra'
)
on conflict do nothing;
