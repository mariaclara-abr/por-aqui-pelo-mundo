-- Curadoria: Brasil > Gramado e Canela (Serra Gaúcha, RS), a partir do
-- roteiro do Natal Luz. País Brasil já existia. Nota de curadoria em branco
-- de propósito, para a autora avaliar depois pelo painel /admin/atracoes.

insert into cities (country_id, name, slug, description)
select
  countries.id,
  'Gramado',
  'gramado',
  'Cidade da Serra Gaúcha (RS) famosa pelo Natal Luz, festa de fim de ano '
  || 'que decora a cidade com luzes e espetáculos, geralmente entre '
  || 'outubro e janeiro. A Avenida Borges de Medeiros concentra boa parte '
  || 'do comércio, das chocolaterias e da decoração natalina.'
from countries
where countries.slug = 'brasil'
on conflict (slug) do nothing;

insert into cities (country_id, name, slug, description)
select
  countries.id,
  'Canela',
  'canela',
  'Cidade vizinha a Gramado, na Serra Gaúcha (RS), também decorada durante '
  || 'o Natal Luz. Sede dos Parques da Serra e da Cascata do Caracol.'
from countries
where countries.slug = 'brasil'
on conflict (slug) do nothing;

insert into attractions (
  city_id, name, slug, categories, description, important_tips
)
select
  cities.id, item.name, item.slug, item.categories, item.description,
  item.important_tips
from cities
cross join (
  values
    (
      'Natal Luz de Gramado', 'natal-luz-de-gramado',
      array['passeio', 'ponto_turistico']::attraction_category[],
      'Festa de fim de ano de Gramado, geralmente entre outubro e '
      || 'janeiro, com programação gratuita e paga. A Avenida Borges de '
      || 'Medeiros ganha uma sequência de pinheiros natalinos e recebe a '
      || 'Parada de Natal, com banda de soldadinhos de chumbo e Papai '
      || 'Noel; a Praça das Etnias se transforma na Vila de Natal, com '
      || 'feirinha de artesanato e atrações ao longo do dia; a Rua '
      || 'Coberta tem shows musicais à noite; e há cerimônia diária de '
      || 'acendimento das luzes da cidade em frente ao palácio dos '
      || 'festivais.',
      'A programação completa (datas e horários mudam a cada edição) '
      || 'sai no site oficial natalluzdegramado.com.br. Entre as '
      || 'atrações pagas mais tradicionais, no ExpoGramado ou no Lago do '
      || 'Serra Park, estão: A Fantástica Fábrica de Natal (espetáculo '
      || 'musical), Nativitaten (balé aquático com pirotecnia no lago), O '
      || 'Grande Desfile de Natal, O Reino do Natal (percurso por áreas '
      || 'temáticas) e o Light of Christmas (Orquestra Sinfônica de '
      || 'Gramado). Valores de referência da época da pesquisa, sujeitos '
      || 'a alteração.',
      false
    ),
    (
      'Bustour Illumination Show', 'bustour-illumination-show',
      array['passeio']::attraction_category[],
      'Passeio noturno num ônibus temático de dois andares, percorrendo '
      || 'as ruas de Gramado e Canela para ver as decorações natalinas, '
      || 'com apresentações e surpresas ao longo do trajeto.',
      'Saída às 20h, na Loja Brocker Turismo Gramado (Av. das '
      || 'Hortênsias, 1845, centro). Duração de aproximadamente 90 '
      || 'minutos. Crianças até 5 anos não pagam.',
      false
    ),
    (
      'Lago Negro', 'lago-negro-gramado', array['natureza']::attraction_category[],
      'Lago cercado de árvores no bairro Planalto, com acesso livre 24 '
      || 'horas e pedalinhos disponíveis durante o dia.',
      'Pedalinhos disponíveis diariamente das 8h30 às 18h.',
      false
    ),
    (
      'Restaurante Pouso Novo', 'restaurante-pouso-novo',
      array['restaurante']::attraction_category[],
      'Restaurante que serve ceia de Natal com chegada do Papai Noel.',
      'Rua Garibaldi, 320, a 30 m da Rua Coberta.',
      false
    ),
    (
      'Chocolate Lugano', 'chocolate-lugano-gramado', array['compras']::attraction_category[],
      'Chocolateria na Avenida Borges de Medeiros, 2529.',
      null, false
    ),
    (
      'Chocolates Prawer', 'chocolates-prawer', array['compras']::attraction_category[],
      'Chocolateria com loja na Av. Borges de Medeiros, 2795, e fábrica '
      || 'na Av. das Hortênsias, 4100 (estrada Gramado/Canela).',
      null, false
    ),
    (
      'Malbec Restaurante', 'malbec-restaurante-gramado', array['restaurante']::attraction_category[],
      'Steakhouse e fondue na Avenida Borges de Medeiros, 2101.',
      null, false
    ),
    (
      'Dos Cocina', 'dos-cocina-gramado', array['restaurante']::attraction_category[],
      'Restaurante de carnes na Avenida das Hortênsias, 2233.',
      null, false
    ),
    (
      'Versoi Fondue & Restaurant', 'versoi-fondue-restaurant',
      array['restaurante']::attraction_category[],
      'Restaurante de fondue na Av. das Hortênsias, 1235.',
      null, false
    ),
    (
      'Restaurante Bella Gramado', 'restaurante-bella-gramado',
      array['restaurante']::attraction_category[],
      'Rodízio de pizza, carnes e comida caseira na Rua Euzébio '
      || 'Balzaretti, 798.',
      null, false
    ),
    (
      'Kongo Pizzaria Temática', 'kongo-pizzaria-tematica',
      array['restaurante']::attraction_category[],
      'Pizzaria temática na Av. das Hortênsias, 5683.',
      null, false
    ),
    (
      'Cucina Boniatto', 'cucina-boniatto', array['restaurante']::attraction_category[],
      'Restaurante italiano na Rua Leopoldo Rosenfeld, 1054.',
      'Funciona somente com reservas.',
      true
    ),
    (
      'San Tao Restobar', 'san-tao-restobar', array['restaurante']::attraction_category[],
      'Restaurante japonês na Rua Antônio Acorsi, 867.',
      null, false
    ),
    (
      'Casa Di Pietro', 'casa-di-pietro-gramado', array['restaurante']::attraction_category[],
      'Restaurante italiano com grelhados na Rua Pedro Benetti, 5.',
      null, false
    ),
    (
      'Restaurante Famiglia Guimarães', 'restaurante-familia-guimaraes',
      array['restaurante']::attraction_category[],
      'Restaurante italiano na Rua Wilma Dinnebier, 91.',
      null, false
    ),
    (
      'Vinícola Jolimont', 'vinicola-jolimont', array['passeio', 'restaurante']::attraction_category[],
      'Vinícola na Estrada Morro Calçado, 1420, em Canela, com '
      || 'visitação por ordem de chegada.',
      'Visitação das 9h às 16h30. O ingresso é válido por 1 ano e não '
      || 'precisa de agendamento. Passeio de aproximadamente 1 hora.',
      false
    ),
    (
      'Parques da Serra: Bondinho Aéreo e Cascata do Caracol', 'parques-da-serra-canela',
      array['natureza', 'passeio']::attraction_category[],
      'Primeiro bondinho aéreo do Rio Grande do Sul, com três estações '
      || '(embarque na do meio). No topo, vista bonita com muito verde ao '
      || 'redor, com opção de lanche ou caminhada em meio à mata. Na '
      || 'estação mais baixa está a Cascata do Caracol, um dos cartões '
      || 'postais da região.',
      'Endereço: Estrada da Ferradura, 699, Canela. Atendimento todos os '
      || 'dias das 9h às 17h. O desembarque é obrigatório em todas as '
      || 'estações. Estacionamento incluso no ingresso.',
      false
    ),
    (
      'Igreja Matriz de Nossa Senhora de Lourdes (Catedral de Pedra)', 'catedral-de-pedra-canela',
      array['ponto_turistico']::attraction_category[],
      'Conhecida popularmente como Catedral de Pedra, fica na Praça da '
      || 'Matriz de Canela.',
      null, false
    )
) as item(name, slug, categories, description, important_tips)
where cities.slug = case
  when item.slug in (
    'vinicola-jolimont', 'parques-da-serra-canela', 'catedral-de-pedra-canela'
  ) then 'canela'
  else 'gramado'
end
on conflict (slug) do nothing;
