-- Curadoria: Brasil > Urubici (Serra Catarinense, SC), a partir do roteiro
-- de planejamento da viagem. País Brasil já existia, cidade nova (mesma
-- região de Bom Retiro, Alfredo Wagner e São Joaquim, já cadastradas em
-- 20260904190000_seed_serra_catarinense.sql). Nota de curadoria em branco
-- de propósito, para a autora avaliar depois pelo painel /admin/atracoes.

insert into cities (country_id, name, slug, description)
select
  countries.id,
  'Urubici',
  'urubici',
  'Município de 918 m de altitude na Serra Catarinense, com cerca de 11 '
  || 'mil habitantes, a 175 km (3h) de Florianópolis pela BR-282 até '
  || 'Lages e depois pela SC-430. Famosa pela gastronomia à base de '
  || 'truta e pinhão, e por cachoeiras, cânions e mirantes de altitude. '
  || 'Nas estradas rurais o acesso à internet costuma ser limitado, então '
  || 'vale pesquisar cada ponto turístico antes de sair. A maioria das '
  || 'atrações é acessível com carro comum, mas algumas exigem 4x4. Leve '
  || 'sempre casaco (mesmo no verão) e sapatos confortáveis.'
from countries
where countries.slug = 'brasil'
on conflict (slug) do nothing;

insert into attractions (
  city_id, name, slug, categories, description, important_tips,
  requires_advance_purchase, requires_reservation, intense_physical_effort
)
select
  cities.id, item.name, item.slug, item.categories, item.description,
  item.important_tips, item.requires_advance_purchase, item.requires_reservation,
  item.intense_physical_effort
from cities
cross join (
  values
    (
      'Rancho Denver', 'rancho-denver-urubici', array['hotel']::attraction_category[],
      'Hospedagem a 1.438 m de altitude, a cerca de 29 km (28 min) do '
      || 'centro de Urubici, com trilha própria.',
      'Check-in a partir das 14h, check-out até às 11h. Endereço: '
      || 'Estrada Geral dos Bitus, s/n, Santa Tereza, Urubici.',
      false, false, false
    ),
    (
      'Morro da Igreja', 'morro-da-igreja-urubici', array['natureza']::attraction_category[],
      'A 1.822 m de altitude, é o segundo ponto mais alto de Santa '
      || 'Catarina. Foi o lugar onde se registrou a menor temperatura já '
      || 'medida no Brasil, -17,8°C em 1996. Do topo, vista espetacular '
      || 'para os cânions e para a Pedra Furada. O mirante fica dentro do '
      || 'Parque Nacional de São Joaquim.',
      'É necessário agendamento prévio do veículo pelo site do ICMBio, '
      || 'com retirada do ingresso na sede do ICMBio no centro de Urubici '
      || '(Av. Pedro Bernardo Warmling, 1542) a partir de dois dias antes '
      || 'da visita. Aberto das 8h às 17h, acesso gratuito, vagas '
      || 'limitadas e permanência máxima de 15 minutos no mirante.',
      true, false, false
    ),
    (
      'Pedra Furada', 'pedra-furada-urubici', array['natureza', 'passeio']::attraction_category[],
      'Um dos principais cartões-postais de Urubici: formação rochosa '
      || 'natural com uma abertura de aproximadamente 13 metros de altura '
      || 'por 6 metros de largura.',
      'Só é possível visitar com guia autorizado, com reserva pelo '
      || 'Parque Nacional de São Joaquim (preço em torno de R$ 200 por '
      || 'pessoa, ou R$ 500 para 3 pessoas). Trilha de nível pesado, 6,2 '
      || 'km ida e volta, com cerca de 5 horas de caminhada.',
      false, true, true
    ),
    (
      'Eco Parque Cascata Véu de Noiva', 'eco-parque-cascata-veu-de-noiva',
      array['natureza']::attraction_category[],
      'Parque com restaurante e pousada a cerca de 22 km (27 min) do '
      || 'centro, reunindo três quedas d''água: a Cascata Véu de Noiva, a '
      || 'Cachoeira dos Namorados e a Cachoeira Três Irmãs.',
      'São 150 m de caminhada asfaltada até a Cascata Véu de Noiva; cerca '
      || 'de 20 minutos de trilha mais íngreme até a Cachoeira dos '
      || 'Namorados; e cerca de 40 minutos de caminhada mais intensa até '
      || 'a Cachoeira Três Irmãs. Aberto todos os dias das 8h30 às 18h. '
      || 'Ingresso R$ 25.',
      false, false, false
    ),
    (
      'Serra do Rio do Rastro', 'serra-do-rio-do-rastro',
      array['natureza', 'ponto_turistico']::attraction_category[],
      'A 1.421 m de altitude, liga os municípios de Lauro Müller e Bom '
      || 'Jardim da Serra, a cerca de 82 km (1h21) do centro de Urubici. '
      || 'São 16 km de extensão e 284 curvas acentuadas na estrada SC-390, '
      || 'inaugurada em 1960, um dos cartões-postais do estado. O mirante '
      || 'de estrutura metálica, perto do topo, oferece a melhor vista '
      || 'das curvas.',
      'Melhor horário para visitar o mirante é entre 11h e 15h, quando '
      || 'há menos neblina e o sol está bem em cima. Há posto de polícia '
      || 'rodoviária, restaurante, lanchonete, banheiro e loja de '
      || 'souvenir junto ao mirante.',
      false, false, false
    ),
    (
      'Gruta Nossa Senhora de Lourdes', 'gruta-nossa-senhora-de-lourdes-urubici',
      array['ponto_turistico', 'natureza']::attraction_category[],
      'Caverna natural no distrito de Santa Tereza, cercada por paredões '
      || 'de pedra, com queda d''água de cerca de 10 metros. Recebeu o '
      || 'nome por abrigar, desde 1944, uma imagem de Nossa Senhora de '
      || 'Lourdes, alcançada por cerca de 120 metros de caminhada. No '
      || 'local também acontecem casamentos e a Romaria da Penitência, '
      || 'em outubro.',
      'A cerca de 13 km (17 min) do centro de Urubici, no caminho para a '
      || 'Serra do Corvo Branco ou o Morro da Igreja. Aberto das 8h às '
      || '18h. Ingresso R$ 5.',
      false, false, false
    ),
    (
      'Serra do Corvo Branco', 'serra-do-corvo-branco',
      array['natureza']::attraction_category[],
      'A 1.380 m de altitude, em Grão-Pará, é uma das estradas mais altas '
      || 'e impressionantes da região, cercada por montanhas pontiagudas, '
      || 'com o maior corte de rocha em estrada do Brasil (90 m de '
      || 'profundidade). Tem cinco mirantes: dois de vidro, com 11 metros '
      || 'de comprimento, e três panorâmicos acessados por transporte do '
      || 'parque.',
      'A cerca de 32 km (45 min) do centro de Urubici. Fechado em dias de '
      || 'chuva ou neblina forte: consulte o Instagram do parque antes de '
      || 'ir. Aberto das 8h30 às 17h (permanência até 18h). Ingresso R$ '
      || '60, gratuito para crianças até 10 anos. Chegue por volta do '
      || 'meio-dia, quando o sol está bem em cima, para as melhores '
      || 'fotos.',
      false, false, false
    ),
    (
      'Eco Parque Cachoeira Papuã', 'eco-parque-cachoeira-papua',
      array['natureza', 'passeio']::attraction_category[],
      'A cerca de 10 km (19 min) do centro, com mirante de vidro '
      || 'panorâmico para duas cachoeiras, mirante do cânion, sky bike, '
      || 'sky table, balanço infinito e arvorismo.',
      'Aberto todos os dias das 8h30 às 17h30. Ingresso R$ 60 (crianças '
      || 'até 10 anos não pagam). As atividades de aventura são compradas '
      || 'à parte.',
      false, false, false
    ),
    (
      'Parque Mundo Novo', 'parque-mundo-novo-urubici',
      array['natureza', 'passeio']::attraction_category[],
      'A cerca de 8 km (13 min) do centro, reúne a Cascata do Avencal, '
      || 'com 100 metros de queda livre e quatro mirantes (um deles de '
      || 'vidro), e a Cachoeira Mundo Novo, de 20 metros, cercada de mata '
      || 'nativa com xaxins centenários. Também tem trilhas, salto de '
      || 'pêndulo, tirolesa, balanço infinito, pedalinho, passeio a '
      || 'cavalo e mini fazenda.',
      'Aberto todos os dias das 8h às 18h. Ingresso R$ 40 (crianças até '
      || '10 anos não pagam).',
      false, false, false
    ),
    (
      'Mirante de Urubici (Mirante do Avencal)', 'mirante-de-urubici',
      array['natureza']::attraction_category[],
      'A 1.175 m de altitude, é a primeira parada para quem chega a '
      || 'Urubici ou segue para São Joaquim, com vista panorâmica da '
      || 'cidade cercada de montanhas, destacando a Igreja Matriz.',
      'Fica logo após uma curva acentuada na SC-110, a cerca de 22 km (27 '
      || 'min) do centro: não há estrutura de estacionamento, apenas um '
      || 'recuo na estrada.',
      false, false, false
    ),
    (
      'Igreja Matriz de Urubici (Paróquia Nossa Senhora Mãe dos Homens)',
      'igreja-matriz-de-urubici', array['ponto_turistico']::attraction_category[],
      'Um dos maiores templos da Diocese de Lages, com capacidade para '
      || '1.200 pessoas sentadas. Inaugurada em 1973, em estilo '
      || 'neogótico.',
      null, false, false, false
    ),
    (
      'Morro do Campestre', 'morro-do-campestre',
      array['natureza']::attraction_category[],
      'A 1.380 m de altitude, dentro da Fazenda Morro da Cruz, a cerca de '
      || '12 km (23 min) do centro. É possível subir de carro a maior '
      || 'parte do caminho até um estacionamento, seguindo depois a pé '
      || 'por escadarias até as formações rochosas de arenito no topo, '
      || 'com vista para o vale do Rio Canoas.',
      'Aberto todos os dias das 9h às 18h. Ingresso R$ 30. Vale fazer a '
      || 'trilha perto do pôr-do-sol.',
      false, false, false
    ),
    (
      'Morro do Parapente', 'morro-do-parapente',
      array['natureza', 'passeio']::attraction_category[],
      'A 1.300 m de altitude, a cerca de 22 km (27 min) do centro, com '
      || 'vista de 360 graus de Urubici, especialmente bonita no '
      || 'pôr-do-sol e no nascer do sol. Os voos de parapente são a '
      || 'atração principal, mas também dá para só apreciar a paisagem no '
      || 'mirante ou no balanço infinito.',
      'Acesso por estrada rural estreita de 4 km, com pedras. Aberto '
      || 'todos os dias das 6h às 18h. Ingresso R$ 30 (crianças até 10 '
      || 'anos não pagam), pago em dinheiro ou Pix na portaria. Leve '
      || 'casaco: venta e pode fazer muito frio.',
      false, false, false
    ),
    (
      'Cânion Espraiado', 'canion-espraiado',
      array['natureza']::attraction_category[],
      'Na divisa de Urubici com Grão Pará, a mais de 1.400 m de '
      || 'altitude, com paredões de até mil metros e uma queda d''água, a '
      || 'nascente do Rio Espraiado.',
      'A cerca de 38 km (1h) do centro. O acesso só é possível com '
      || 'veículo 4x4, por estrada íngreme e sinuosa. Não dá para chegar '
      || 'à borda do cânion de carro: são pelo menos 500 metros de '
      || 'caminhada por trilha com pontos encharcados (use calçado '
      || 'impermeável ou alugue galocha por R$ 10 no abrigo da montanha). '
      || 'Aberto das 8h30 às 18h. Ingresso R$ 25 antecipado ou R$ 30 no '
      || 'local.',
      false, false, true
    ),
    (
      'Restaurante Nossa Senhora das Graças', 'restaurante-nossa-senhora-das-gracas-urubici',
      array['restaurante']::attraction_category[],
      'Um dos restaurantes locais conhecidos pela culinária à base de '
      || 'truta e pinhão, típica da Serra Catarinense.',
      null, false, false, false
    ),
    (
      'Manali Bistrô', 'manali-bistro-urubici', array['restaurante']::attraction_category[],
      null, null, false, false, false
    ),
    (
      'La Man Bistrô e Wine Bar', 'la-man-bistro-e-wine-bar',
      array['restaurante']::attraction_category[],
      null, null, false, false, false
    ),
    (
      'La Fondue Müller', 'la-fondue-muller', array['restaurante']::attraction_category[],
      'Restaurante especializado em fondue.', null, false, false, false
    ),
    (
      'Casa Negra Trutaria', 'casa-negra-trutaria', array['restaurante']::attraction_category[],
      'Restaurante especializado em truta, peixe típico das águas frias '
      || 'da serra.',
      null, false, false, false
    ),
    (
      'Quinta das Bromélias Bistrô', 'quinta-das-bromelias-bistro',
      array['restaurante']::attraction_category[],
      null, null, false, false, false
    ),
    (
      'Sêmola', 'semola-urubici', array['restaurante']::attraction_category[],
      null, null, false, false, false
    ),
    (
      'Montês', 'montes-urubici', array['restaurante']::attraction_category[],
      null, null, false, false, false
    ),
    (
      'Paradouro Santo Antônio', 'paradouro-santo-antonio',
      array['restaurante']::attraction_category[],
      'Opção para almoço.', null, false, false, false
    ),
    (
      'Rota 370', 'rota-370-urubici', array['restaurante']::attraction_category[],
      'Barzinho local.', null, false, false, false
    ),
    (
      'Lá Morena', 'la-morena-urubici', array['restaurante']::attraction_category[],
      null, null, false, false, false
    ),
    (
      'Château du Valle', 'chateau-du-valle-urubici',
      array['restaurante']::attraction_category[],
      null, null, false, false, false
    )
) as item(
  name, slug, categories, description, important_tips,
  requires_advance_purchase, requires_reservation, intense_physical_effort
)
where cities.slug = 'urubici'
on conflict (slug) do nothing;
