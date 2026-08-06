-- Curadoria: continuação do roteiro da família na Riviera Francesa.
-- Completa Mônaco (país e cidade já existiam, só sem atrações) e Nice
-- (fim de tarde/noite), e cadastra três cidades novas em França: Cannes,
-- Saint-Tropez e Antibes (incluindo o Cap d'Antibes, tratado como a mesma
-- cidade por ser a península ao lado, sem curadoria própria separada).
-- Nota de curadoria: o roteiro não trazia nota explícita para nenhum
-- lugar, então todos entram com 5 estrelas como valor temporário —
-- ajustar depois pelo painel /admin/atracoes, lugar por lugar.

update cities
set description =
  'Principado de Mônaco é uma cidade-estado com cerca de 40 mil '
  || 'habitantes e aproximadamente 2 km², o segundo menor país do mundo '
  || '(após o Vaticano). Famoso por seu luxo, cassinos, Fórmula 1 (Grande '
  || 'Prêmio de Mônaco) e paraíso fiscal (sem imposto de renda), é '
  || 'governado pela Casa de Grimaldi. Èze fica a uns 10 km de Mônaco, em '
  || 'média 20 minutos de trajeto, e o estacionamento em Nice fica a uns '
  || '22 km de Mônaco, em média 40 minutos de trajeto.'
where slug = 'monaco';

insert into attractions (
  city_id, name, slug, category, description, important_tips, curation_rating
)
select cities.id, attraction.name, attraction.slug, attraction.category::attraction_category,
  attraction.description, attraction.important_tips, attraction.curation_rating
from cities
cross join (
  values
    (
      'Parking des Pêcheurs', 'parking-des-pecheurs-monaco', 'estacionamentos',
      'Estacionamento próximo ao Palácio do Príncipe, em Mônaco.',
      null, 5
    ),
    (
      'Parking du Casino', 'parking-du-casino-monaco', 'estacionamentos',
      'Estacionamento próximo ao Cassino de Monte-Carlo, em Mônaco.',
      null, 5
    ),
    (
      'Café de Paris', 'cafe-de-paris-monaco', 'cafe',
      'Ícone histórico e um dos bistrôs mais famosos do mundo, situado na '
      || 'prestigiada Place du Casino, em Mônaco.',
      null, 5
    ),
    (
      'Amazónico Monte-Carlo', 'amazonico-monte-carlo', 'restaurante',
      'Restaurante de luxo situado no telhado do Café de Paris, com '
      || 'decoração tropical exuberante.',
      null, 5
    ),
    (
      'Marché de La Condamine', 'marche-de-la-condamine', 'restaurante',
      'O "coração popular" de Mônaco, oferece comida local, massas e '
      || 'lanches a preços justos.',
      null, 5
    ),
    (
      'Maison des Pates Monaco', 'maison-des-pates-monaco', 'restaurante',
      'Fica perto do porto e é muito elogiado pela massa fresca com '
      || 'preço acessível.',
      null, 5
    ),
    (
      'Smash Monaco', 'smash-monaco', 'restaurante',
      'Excelente para lanches rápidos e hambúrgueres de qualidade, sem '
      || 'preços de restaurante de luxo.',
      null, 5
    ),
    (
      'Chez Les Grecs', 'chez-les-grecs-monaco', 'restaurante',
      'Opção grega fast-food muito bem avaliada, em Mônaco.',
      null, 5
    ),
    (
      'Circuito do Grande Prêmio de Mônaco', 'circuito-grande-premio-monaco', 'ponto_turistico',
      'As ruas do centro de Mônaco se transformam uma vez por ano no '
      || 'palco do Grande Prêmio de Fórmula 1. O circuito de rua é um dos '
      || 'mais desafiadores do mundo, com curvas fechadas, ruas estreitas '
      || 'e praticamente nenhuma área de escape, exigindo máxima precisão '
      || 'dos pilotos.',
      'Durante a corrida as vias são fechadas ao trânsito e recebem '
      || 'arquibancadas, barreiras e toda a estrutura temporária do '
      || 'evento, que é completamente desmontada após o GP, devolvendo a '
      || 'cidade à sua rotina.',
      5
    ),
    (
      'Palácio do Príncipe', 'palacio-do-principe-monaco', 'ponto_turistico',
      'Residência da família Grimaldi (a dinastia reinante de Mônaco há '
      || 'mais de 700 anos), abre para visitação sazonalmente (geralmente '
      || 'de março a outubro) das 10h às 18h, com duração de cerca de 40 '
      || 'minutos com audioguia. A troca da guarda acontece diariamente '
      || 'às 11h55 na Place du Palais, dura menos de 10 minutos e é '
      || 'realizada pelos Carabineiros do Príncipe, força militar criada '
      || 'em 1817. Se a bandeira estiver hasteada, o Príncipe Alberto II '
      || 'está no palácio.',
      'Não é permitido fotografar internamente. Ingresso: €13 e €8. '
      || 'Venda de bilhetes online temporariamente indisponível.',
      5
    ),
    (
      'Porto de Hércules', 'porto-de-hercules-monaco', 'ponto_turistico',
      'Principal porto de Mônaco, no bairro de La Condamine. Porto '
      || 'natural de águas profundas, famoso por abrigar super iates de '
      || 'luxo e navios de cruzeiro, além de ser palco de eventos como o '
      || 'Monaco Yacht Show e parte do circuito do Grande Prêmio de '
      || 'Mônaco.',
      'Caminhe pelo cais e desfrute dos cafés e restaurantes à '
      || 'beira-mar, apreciando a vista para o Palácio do Príncipe.',
      5
    ),
    (
      'Cassino de Monte-Carlo', 'cassino-de-monte-carlo', 'ponto_turistico',
      'Ícone de luxo e arquitetura Belle Époque, inaugurado em 1863. Lá '
      || 'foram gravadas cenas do filme de James Bond, Casino Royale. '
      || 'Visitas matinais gratuitas dão acesso ao Atrium, à Salle '
      || 'Renaissance, ao Café de la Rotonde, ao restaurante Le Salon '
      || 'Rose e à Boutique, onde o traje é mais casual (camisetas, '
      || 'bermudas e tênis permitidos).',
      'Para acessar as salas de jogos é preciso apresentar passaporte '
      || '(identidades digitais não são aceitas); para os salões '
      || 'privados à noite, terno e gravata são indispensáveis. '
      || 'Residentes de Mônaco são proibidos por lei de entrar nas áreas '
      || 'de jogo. €20 (inclui €10 para usar nas máquinas caça-níqueis ou '
      || 'no bar).',
      5
    )
) as attraction(name, slug, category, description, important_tips, curation_rating)
where cities.slug = 'monaco'
on conflict (slug) do nothing;

insert into attractions (
  city_id, name, slug, category, description, important_tips, curation_rating
)
select cities.id, attraction.name, attraction.slug, attraction.category::attraction_category,
  attraction.description, attraction.important_tips, attraction.curation_rating
from cities
cross join (
  values
    (
      'Vieux Nice', 'vieux-nice', 'ponto_turistico',
      'Coração histórico de Nice, caracterizado por ruas estreitas e '
      || 'labirínticas, edifícios em tons pastel e atmosfera vibrante. É '
      || 'ideal para explorar a pé, com destaque para a gastronomia local '
      || '(socca), o mercado de flores Cours Saleya, igrejas barrocas — a '
      || 'principal é a Catedral Sainte-Réparate, do século XVII — e '
      || 'proximidade à Colina do Castelo.',
      null, 5
    ),
    (
      'Colline du Château', 'colline-du-chateau-nice', 'ponto_turistico',
      'A atração mais popular de Nice, oferece vista panorâmica '
      || 'espetacular do Mar Mediterrâneo e da Promenade. Inclui ruínas '
      || 'históricas, cachoeira artificial, áreas verdes e trilhas. É o '
      || 'ponto de observação mais famoso para o pôr do sol, com vista '
      || 'panorâmica de 360 graus dos telhados da Cidade Velha, a curva '
      || 'da Baía dos Anjos e o porto.',
      'A visita é gratuita. Pode-se subir por escadas ou utilizar um '
      || 'elevador gratuito, próximo ao Hotel Suisse.',
      5
    ),
    (
      'Promenade des Anglais', 'promenade-des-anglais', 'passeio',
      'O calçadão mais famoso de Nice, estendendo-se por cerca de 7 km, '
      || 'conectando o centro histórico Vieux Nice ao aeroporto. Com '
      || 'vista azul-turquesa, é ideal para caminhar, andar de bicicleta, '
      || 'sentar-se nas cadeiras azuis icônicas ou descansar sob '
      || 'pérgolas. A orla é composta por praias de pedras (galets), não '
      || 'areia.',
      null, 5
    ),
    (
      'Place Masséna', 'place-massena-nice', 'ponto_turistico',
      'Principal e mais icônica praça de Nice, bem no centro da cidade, '
      || 'ladeada por edifícios de cor vermelha em estilo neoclássico, '
      || 'chão em xadrez e pela Fontaine du Soleil, com uma estátua de '
      || 'mármore de 7 metros do deus grego Apolo. Durante a noite, sete '
      || 'estátuas de homens ajoelhados ou sentados no alto de mastros '
      || '(simbolizando os sete continentes) se iluminam e mudam de cor. '
      || 'A arte contemporânea Conversation à Nice, posicionada ao longo '
      || 'dos trilhos do bonde que atravessa a praça, simboliza a '
      || '"conversa" entre os continentes.',
      null, 5
    ),
    (
      'Basílica de Notre-Dame de Nice', 'basilica-notre-dame-nice', 'ponto_turistico',
      'A maior igreja de Nice e um dos marcos mais impressionantes da '
      || 'arquitetura neogótica na Riviera Francesa. Construída no '
      || 'século XIX (1864-1868), destaca-se pelas duas torres de 65 '
      || 'metros e, no interior, pelos vitrais coloridos e a grande '
      || 'rosácea que retrata a Assunção de Maria.',
      null, 5
    ),
    (
      'Catedral de São Nicolau de Nice', 'catedral-sao-nicolau-nice', 'ponto_turistico',
      'Inaugurada em 1912, é um dos marcos mais impressionantes de '
      || 'Nice, a maior catedral ortodoxa russa da Europa Ocidental. Sua '
      || 'arquitetura de estilo neorusso destaca-se pelas icônicas '
      || 'cúpulas em formato de cebola e mosaicos detalhados, servindo '
      || 'até hoje como centro espiritual para a comunidade russa da '
      || 'Riviera Francesa.',
      null, 5
    ),
    (
      'Hug Café', 'hug-cafe-nice', 'cafe',
      'Localizado bem ao pé da Basílica de Notre-Dame, conhecido por '
      || 'seu ambiente aconchegante, equipe atenciosa e por servir café '
      || 'de qualidade, com grãos torrados artesanalmente pela "La '
      || 'Torref de Fersen", de Antibes.',
      null, 5
    ),
    (
      'Pâtisserie LAC', 'patisserie-lac-nice', 'cafe',
      'Uma das confeitarias e chocolaterias mais prestigiadas de Nice.',
      null, 5
    ),
    (
      'Angéa Nice', 'angea-nice', 'cafe',
      'Doceria super charmosa localizada no coração da Vieux Nice, '
      || 'famosa pela variedade de macarons.',
      'Experimente o Macarons Glacés, carro-chefe da casa: sanduíches de '
      || 'sorvete feitos com macarons gigantes.',
      5
    ),
    (
      'Le Bistrot d''Antoine', 'le-bistrot-dantoine-nice', 'restaurante',
      'Em Vieux Nice, conhecido pela culinária francesa autêntica com '
      || 'um toque moderno. Detém a distinção Bib Gourmand do Guia '
      || 'Michelin, que premia estabelecimentos com excelente '
      || 'custo-benefício.',
      null, 5
    ),
    (
      'La Merenda', 'la-merenda-nice', 'restaurante',
      'Também em Vieux Nice, com a distinção Bib Gourmand do Guia '
      || 'Michelin, o local é famoso por servir a verdadeira culinária '
      || 'típica de Nice em um ambiente minúsculo e sem frescuras.',
      null, 5
    ),
    (
      'Bocca Mar', 'bocca-mar-nice', 'restaurante',
      'Beach club e restaurante sofisticado na Promenade des Anglais, '
      || 'em frente ao icônico Palais de la Méditerranée Hotel, '
      || 'conhecido pela cozinha franco-italiana (especialmente pratos '
      || 'para compartilhar), atmosfera festiva e decoração elegante em '
      || 'vime. Oferece espreguiçadeiras na praia, almoço, jantar e '
      || 'bebidas.',
      'Funciona diariamente das 9h30 à meia-noite.', 5
    ),
    (
      'Le Galet', 'le-galet-nice', 'restaurante',
      'Beach club e restaurante sofisticado na Promenade des Anglais, '
      || 'próximo ao Casino Barrière Le Ruhl. Oferece restaurante à '
      || 'beira-mar, espreguiçadeiras confortáveis e guarda-sóis — ótima '
      || 'opção para relaxar, almoçar ou jantar com vista para o '
      || 'Mediterrâneo, com boa relação custo-benefício.',
      null, 5
    )
) as attraction(name, slug, category, description, important_tips, curation_rating)
where cities.slug = 'nice'
on conflict (slug) do nothing;

insert into cities (country_id, name, slug, description, latitude, longitude)
select
  countries.id,
  'Cannes',
  'cannes',
  'Cidade da Riviera Francesa mundialmente conhecida por sediar o '
  || 'Festival de Cinema de Cannes. O hotel em Nice fica a uns 33 km de '
  || 'Cannes, em média 50 minutos de trajeto. Cannes fica a uns 12 km de '
  || 'Antibes, em média 25 minutos de trajeto, e a uns 88 km de '
  || 'Saint-Tropez, em média 1 hora 30 minutos de trajeto. No dia com '
  || 'saída de Nice há duas opções de roteiro a partir de Cannes: Plano '
  || 'A (Cannes + Saint-Tropez) ou Plano B (Cannes + Antibes e Cap '
  || 'd''Antibes). É comum nas praias francesas as mulheres fazerem '
  || 'topless — cuidado para não filmar.',
  43.551854,
  7.017590
from countries
where countries.slug = 'franca'
on conflict (slug) do nothing;

insert into attractions (
  city_id, name, slug, category, description, important_tips, curation_rating
)
select cities.id, attraction.name, attraction.slug, attraction.category::attraction_category,
  attraction.description, attraction.important_tips, attraction.curation_rating
from cities
cross join (
  values
    (
      'Parking Palais des Festivals', 'parking-palais-des-festivals', 'estacionamentos',
      'Estacionamento próximo ao Palais des Festivals, em Cannes.',
      null, 5
    ),
    (
      'Boulevard de la Croisette', 'boulevard-de-la-croisette', 'passeio',
      'Com mais de 3 km, é a avenida litorânea mais famosa de Cannes, '
      || 'com palmeiras, hotéis de luxo (como o Carlton e o Majestic), '
      || 'grifes famosas e praias privadas e públicas. Local icônico '
      || 'para passeios, observação de celebridades e luxo à beira-mar.',
      null, 5
    ),
    (
      'Palais des Festivals', 'palais-des-festivals-cannes', 'ponto_turistico',
      'Inaugurado em 1982, é o icônico edifício moderno na Boulevard de '
      || 'la Croisette, conhecido mundialmente por sediar o Festival de '
      || 'Cinema de Cannes. Lar do tapete vermelho onde passam '
      || 'celebridades do mundo todo, da escadaria icônica (cenário '
      || 'clássico de fotos) e da calçada da fama, com marcas das mãos '
      || 'de artistas, que vai até o Cassino Barrière ao lado do Porto.',
      null, 5
    ),
    (
      'Hôtel de Ville de Cannes', 'hotel-de-ville-cannes', 'ponto_turistico',
      'Prefeitura da cidade, de frente para o Porto de Cannes.',
      null, 5
    ),
    (
      'Le Suquet', 'le-suquet-cannes', 'ponto_turistico',
      'Bairro mais antigo e charmoso de Cannes. Diferente do brilho '
      || 'moderno da Promenade de la Croisette, este bairro histórico é '
      || 'uma colina com ruas de paralelepípedos e casas que remontam a '
      || 'mais de 400 anos, com uma belíssima vista de Cannes. É um dos '
      || 'melhores lugares para o pôr do sol, ao lado do Museu de la '
      || 'Castre e da Boulevard de la Croisette.',
      null, 5
    ),
    (
      'Église Notre-Dame d''Espérance de Cannes', 'eglise-notre-dame-desperance-cannes', 'ponto_turistico',
      'Situada no topo da colina do Suquet, concluída em 1627 após mais '
      || 'de um século de construção. É famosa tanto por sua arquitetura '
      || 'quanto pela vista panorâmica deslumbrante que oferece sobre o '
      || 'Porto Velho, a Croisette e a Baía de Cannes.',
      null, 5
    )
) as attraction(name, slug, category, description, important_tips, curation_rating)
where cities.slug = 'cannes'
on conflict (slug) do nothing;

insert into cities (country_id, name, slug, description, latitude, longitude)
select
  countries.id,
  'Saint-Tropez',
  'saint-tropez',
  'Antiga vila de pescadores na Riviera Francesa que se tornou point de '
  || 'luxo e badalação, com iates e celebridades. O hotel em Nice fica a '
  || 'uns 112 km de Saint-Tropez, em média 1 hora 50 minutos de trajeto, '
  || 'e Cannes fica a uns 88 km, em média 1 hora 30 minutos. Rota '
  || 'sugerida: Cannes → A8 → Fréjus → Sainte-Maxime → Saint-Tropez. Faz '
  || 'parte do Plano A do roteiro a partir de Cannes (Cannes + '
  || 'Saint-Tropez), com retorno a Nice após o pôr do sol.',
  43.267112,
  6.639879
from countries
where countries.slug = 'franca'
on conflict (slug) do nothing;

insert into attractions (
  city_id, name, slug, category, description, important_tips, curation_rating
)
select cities.id, attraction.name, attraction.slug, attraction.category::attraction_category,
  attraction.description, attraction.important_tips, attraction.curation_rating
from cities
cross join (
  values
    (
      'Parking du Nouveau Port', 'parking-du-nouveau-port-saint-tropez', 'estacionamentos',
      'Estacionamento próximo ao porto novo de Saint-Tropez.',
      null, 5
    ),
    (
      'Parking des Lices', 'parking-des-lices-saint-tropez', 'estacionamentos',
      'Estacionamento próximo à Place des Lices, em Saint-Tropez.',
      null, 5
    ),
    (
      'Sénéquier', 'senequier-saint-tropez', 'cafe',
      'Café e restaurante icônico no porto, famoso pela fachada '
      || 'vermelha vibrante e terraço voltado para iates de luxo. Ideal '
      || 'para observar pessoas e tomar um Aperol Spritz, combinando um '
      || 'clima descontraído com a sofisticação da Riviera Francesa. '
      || 'Famoso pelo nougat tradicional, ravioli de trufa, filé com '
      || 'molho de pimenta e pavlova de sobremesa.',
      null, 5
    ),
    (
      'La Petite Plage', 'la-petite-plage-saint-tropez', 'restaurante',
      'Restaurante e lounge bar sofisticado no Porto Velho, com design '
      || 'rústico-chique, decoração em madeira e areia fina imitando uma '
      || 'pequena praia. Oferece culinária mediterrânea elegante, música '
      || 'ao vivo e uma atmosfera de festa animada durante a noite.',
      null, 5
    ),
    (
      'Le Bagatelle', 'le-bagatelle-saint-tropez', 'restaurante',
      'Cozinha francesa autêntica, saborosa e de bom custo-benefício. '
      || 'Fica aos fundos da Notre-Dame de l''Assomption. Destaques: sopa '
      || 'de peixes, bavette de boeuf à l''échalote (fraldinha com '
      || 'cebola) e, de sobremesa, a famosa Tarte Tropézienne, típica da '
      || 'cidade.',
      'Peça la formule: entrada, prato principal e sobremesa.', 5
    ),
    (
      'Porto de Saint-Tropez', 'porto-de-saint-tropez', 'ponto_turistico',
      'Marina icônica na Riviera Francesa, no coração da cidade. '
      || 'Famoso por receber iates de luxo e celebridades, combina o '
      || 'charme de uma antiga vila de pescadores com restaurantes '
      || 'sofisticados, cafés e lojas de grife. Oferece 734 vagas e é um '
      || 'ponto central de movimentação turística na Côte d''Azur.',
      null, 5
    ),
    (
      'A Citadelle', 'a-citadelle-saint-tropez', 'museu',
      'Fortaleza histórica do século XVII que domina a paisagem da '
      || 'cidade, oferecendo uma das vistas panorâmicas mais '
      || 'impressionantes da Riviera Francesa. Além da arquitetura '
      || 'militar, o local abriga o Musée d''histoire maritime, que '
      || 'detalha o passado náutico da região. É o melhor lugar para '
      || 'apreciar o pôr do sol em Saint-Tropez, que ocorre por volta '
      || 'das 21h00 às 21h15.',
      'Entrada para fortaleza e museu custa cerca de €4.', 5
    ),
    (
      'Place des Lices', 'place-des-lices-saint-tropez', 'ponto_turistico',
      'Coração vibrante de Saint-Tropez, uma praça de terra batida com '
      || 'enormes plátanos (árvores centenárias) que garantem sombra em '
      || 'quase toda a sua extensão. Famosa pela feira tradicional às '
      || 'terças e sábados (8h-13h), com moda (linho/seda), artesanato, '
      || 'produtos provençais, queijos e antiguidades. Ponto de encontro '
      || 'clássico, próximo ao Porto Velho e cercado por cafés '
      || 'charmosos.',
      null, 5
    ),
    (
      'Plage de Pampelonne', 'plage-de-pampelonne', 'natureza',
      'Em Ramatuelle (5 km de Saint-Tropez), com areia branca e águas '
      || 'azul-turquesa, ideal para banhos. Conhecida pelo glamour e '
      || 'beach clubs luxuosos, oferece áreas públicas e privadas, águas '
      || 'calmas e límpidas, excelente infraestrutura, restaurantes de '
      || 'luxo e alta badalação no verão.',
      'É comum nas praias francesas as mulheres fazerem topless — '
      || 'cuidado para não filmar.',
      5
    )
) as attraction(name, slug, category, description, important_tips, curation_rating)
where cities.slug = 'saint-tropez'
on conflict (slug) do nothing;

insert into cities (country_id, name, slug, description, latitude, longitude)
select
  countries.id,
  'Antibes',
  'antibes',
  'Cidade murada na Riviera Francesa entre Cannes e Nice, com a '
  || 'península do Cap d''Antibes ao lado — mais tranquila, com '
  || 'natureza, praias e vilas de luxo. Cannes fica a uns 12 km de '
  || 'Antibes, em média 25 minutos de trajeto. Faz parte do Plano B do '
  || 'roteiro a partir de Cannes (Cannes + Antibes e Cap d''Antibes), '
  || 'com retorno a Nice após o pôr do sol.',
  43.580418,
  7.125102
from countries
where countries.slug = 'franca'
on conflict (slug) do nothing;

insert into attractions (
  city_id, name, slug, category, description, important_tips, curation_rating
)
select cities.id, attraction.name, attraction.slug, attraction.category::attraction_category,
  attraction.description, attraction.important_tips, attraction.curation_rating
from cities
cross join (
  values
    (
      'Parking Pré des Pêcheurs', 'parking-pre-des-pecheurs-antibes', 'estacionamentos',
      'Estacionamento no centro histórico de Antibes.',
      null, 5
    ),
    (
      'Plage Keller', 'plage-keller-antibes', 'natureza',
      'Exclusivo beach club localizado na deslumbrante Baía de la '
      || 'Garoupe, no Cap d''Antibes.',
      null, 5
    ),
    (
      'Vieil Antibes', 'vieil-antibes', 'ponto_turistico',
      'Parte antiga da cidade, cheia de ruas estreitas, lojinhas, '
      || 'restaurantes e clima bem charmoso. Vale caminhar pelas '
      || 'ruazinhas, visitar o Marché Provençal, andar pela muralha com '
      || 'vista para o Mediterrâneo e observar o porto, cheio de iates '
      || 'impressionantes.',
      null, 5
    ),
    (
      'Marché Provençal de Antibes', 'marche-provencal-antibes', 'restaurante',
      'Mercado delicioso com comidas locais, no coração do centro '
      || 'histórico de Antibes.',
      null, 5
    ),
    (
      'Muralhas de Antibes', 'muralhas-antibes', 'ponto_turistico',
      'Fortificações históricas do século XVII que contornam a cidade '
      || 'velha à beira-mar, oferecendo vistas panorâmicas da Baía dos '
      || 'Anjos e conectando o porto ao Museu Picasso.',
      'A caminhada pela muralha é gratuita.', 5
    ),
    (
      'Musée Picasso Antibes', 'musee-picasso-antibes', 'museu',
      'Museu dedicado a Pablo Picasso, instalado num castelo à '
      || 'beira-mar em Antibes, com vista linda para o mar.',
      null, 5
    ),
    (
      'Port Vauban', 'port-vauban-antibes', 'ponto_turistico',
      'Maior marina da Europa e do Mediterrâneo em tonelagem, famosa '
      || 'por abrigar superiates de luxo no renomado "Cais dos '
      || 'Bilionários". Combina história com modernidade, oferecendo '
      || 'cerca de 1.500 a 2.000 vagas.',
      null, 5
    ),
    (
      'Cap d''Antibes', 'cap-dantibes', 'natureza',
      'Península ao lado da cidade, mais tranquila, com natureza, '
      || 'praias e vilas de luxo. Destaques incluem o Sentier du '
      || 'Littoral (trilha costeira), o Farol da Garoupe e luxuosos '
      || 'hotéis como o Cap d''Antibes Beach Hotel. O pôr do sol na '
      || 'península ocorre por volta das 21h50.',
      'Visite o Farol da Garoupe para uma vista incrível de Nice, '
      || 'Cannes e das Ilhas Lérins.',
      5
    ),
    (
      'Plage de la Garoupe', 'plage-de-la-garoupe', 'natureza',
      'Baía charmosa com areia fina e águas cristalinas, no início da '
      || 'trilha costeira Sentier du Littoral. Famosa pelo cenário '
      || 'pitoresco e histórico — tornou-se popular nos anos 1920, '
      || 'frequentada por figuras famosas da época.',
      'É comum nas praias francesas as mulheres fazerem topless — '
      || 'cuidado para não filmar.',
      5
    )
) as attraction(name, slug, category, description, important_tips, curation_rating)
where cities.slug = 'antibes'
on conflict (slug) do nothing;

-- Etiqueta: acesso gratuito.
insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'gratuito'
where attractions.slug in ('colline-du-chateau-nice', 'muralhas-antibes')
on conflict do nothing;
