-- Curadoria: Estados Unidos > Miami, a primeira leva de atrações da cidade,
-- a partir dos roteiros de planejamento da viagem de julho de 2024. Nota de
-- curadoria em branco de propósito, para a autora avaliar depois pelo
-- painel /admin/atracoes.

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
      'South Beach', 'south-beach-miami',
      array['natureza', 'ponto_turistico']::attraction_category[],
      'A praia mais famosa e badalada de Miami Beach, com areia branca e '
      || 'água cristalina, ladeada pelas famosas casinhas coloridas de '
      || 'salva-vidas que viraram cartão-postal da cidade. Tem chuveiros '
      || 'nos calçadões, aluguel de bicicleta e playground para crianças. '
      || 'No fim, a caminhada leva ao South Pointe Park Pier, um bom lugar '
      || 'para ver o pôr do sol e os navios de cruzeiro saindo do porto.',
      'Bebida alcoólica na praia é proibida. Passe no Walmart ou na '
      || 'Target antes para comprar guarda-sol, toalha e petiscos: alugar '
      || 'cadeira e guarda-sol na praia costuma custar uns US$20 cada.',
      'Meio período',
      'Manhã, antes do sol ficar mais forte, ou fim de tarde para o '
      || 'pôr do sol',
      'Famílias, casais e grupos de amigos'
    ),
    (
      'Ocean Drive', 'ocean-drive-miami',
      array['ponto_turistico', 'passeio']::attraction_category[],
      'A avenida mais famosa de Miami Beach, à beira da praia, com uma '
      || 'rica coleção de edifícios em estilo Art Déco dos anos 1920, nos '
      || 'tons pastéis característicos da cidade. Uma das casas mais '
      || 'fotografadas é a Versace Mansion, antiga residência do '
      || 'estilista Gianni Versace, hoje hotel e restaurante. É repleta '
      || 'de bares e restaurantes, com bons drinks, e vale a visita tanto '
      || 'de dia quanto de noite.',
      'De dia o clima é mais tranquilo, para caminhar e fazer exercício '
      || 'na praia; à noite a avenida fica bem mais animada, com música e '
      || 'movimento nos bares.',
      'Meio período',
      'Dia e noite têm climas bem diferentes, vale conhecer nos dois '
      || 'horários',
      'Casais e grupos de amigos'
    ),
    (
      'Lincoln Road', 'lincoln-road-miami',
      array['compras', 'passeio']::attraction_category[],
      'Rua fechada para carros desde 2006, em Miami Beach, com sete '
      || 'quarteirões de lojas, restaurantes, cafés e galerias de arte, '
      || 'entre elas a do artista Romero Britto. Reúne marcas como H&M, '
      || 'Zara, Nike e Apple, além de uma unidade do Shake Shack.',
      'Por ser toda pedestre, é um passeio tranquilo mesmo com crianças '
      || 'ou carrinho de bebê.',
      'Meio período',
      'Fim de tarde e noite',
      'Casais, famílias e quem gosta de compras'
    ),
    (
      'Española Way', 'espanola-way-miami',
      array['restaurante', 'passeio']::attraction_category[],
      'Rua fechada e charmosa em Miami Beach, entre a Ocean Drive e a '
      || 'Lincoln Road, com prédios de arquitetura espanhola e '
      || 'restaurantes em sua maioria de culinária espanhola. É ainda '
      || 'mais bonita à noite, boa pedida para uma pizza acompanhada de '
      || 'vinho.',
      null,
      'Meio período',
      'Noite',
      'Casais'
    ),
    (
      'Wynwood Walls', 'wynwood-walls-miami',
      array['museu', 'ponto_turistico']::attraction_category[],
      'O bairro mais colorido de Miami, conhecido pelos murais de arte '
      || 'de rua em grande escala, a maior instalação do gênero no mundo, '
      || 'assinados por artistas como o brasileiro Kobra e Os Gêmeos. O '
      || 'ingresso com direito a spray freestyle permite desenhar por '
      || 'dois minutos numa parede própria. Tem também um restaurante '
      || 'famoso no bairro, o Bakan Wynwood.',
      'Funciona das 10h às 19h de domingo a quinta e até as 20h nas '
      || 'sextas e sábados. Crianças até 12 anos entram de graça.',
      'Meio período',
      'Fim de tarde, com boa luz para fotos',
      'Casais, adolescentes e apaixonados por arte'
    ),
    (
      'Design District', 'design-district-miami',
      array['compras', 'passeio']::attraction_category[],
      'Um dos bairros mais sofisticados de Miami, ao norte de Wynwood, '
      || 'com 18 quarteirões dedicados a moda, arte e gastronomia de '
      || 'luxo. Vale o passeio mesmo sem intenção de comprar, só para '
      || 'apreciar a arquitetura, os murais e as esculturas espalhadas '
      || 'pelas ruas.',
      null,
      'Meio período',
      'Fim de tarde',
      'Casais e quem gosta de moda e design'
    ),
    (
      'Little Havana', 'little-havana-miami',
      array['ponto_turistico', 'restaurante']::attraction_category[],
      'Um pedacinho de Cuba dentro dos Estados Unidos, com ruas '
      || 'coloridas, música animada e restaurantes temáticos. A Calle '
      || 'Ocho é a rua principal, onde fica a Calçada da Fama dedicada a '
      || 'artistas latino-americanos, e o Domino Park, onde moradores se '
      || 'reúnem para jogar dominó. Vale experimentar o café cubano na '
      || 'The House of Cuban Coffee e, para comer, o tradicional '
      || 'restaurante Versalles, com preços acessíveis.',
      'Dá pra acompanhar de perto a produção artesanal de charutos '
      || 'cubanos em algumas lojas do bairro.',
      'Meio período',
      'Tarde',
      'Casais e famílias'
    ),
    (
      'Downtown Miami', 'downtown-miami',
      array['ponto_turistico', 'compras']::attraction_category[],
      'O centro financeiro e histórico da cidade, com a Freedom Tower '
      || '(dos anos 1920) ao lado de arranha-céus modernos que formam a '
      || 'skyline de Miami. O Bayside Marketplace é um shopping a céu '
      || 'aberto à beira da Biscayne Bay, com restaurantes como Bubba '
      || 'Gump Shrimp e Hard Rock Café, passeios de barco que saem de lá, '
      || 'e a roda-gigante Skyviews Miami Observation Wheel, com mais de '
      || '50 metros de altura. Vale também caminhar pelo Bayfront Park e '
      || 'passar pelo Museum Park, que reúne o Museu de Ciências (Frost '
      || 'Science) e o Museu de Artes.',
      'A vista fica ainda mais bonita à noite, com as luzes dos prédios '
      || 'refletindo na água.',
      'Meio período',
      'Fim de tarde e noite',
      'Famílias e casais'
    ),
    (
      'Frost Science Museum', 'frost-science-museum-miami',
      array['museu']::attraction_category[],
      'O museu de ciências de Miami, dentro do Museum Park, no Downtown. '
      || 'Tem exposições interativas de ciência e tecnologia, um '
      || 'planetário e um aquário de várias andares com espécies '
      || 'marinhas da região.',
      null,
      'Meio período',
      'Manhã',
      'Famílias com crianças'
    ),
    (
      'Brickell', 'brickell-miami',
      array['ponto_turistico', 'compras']::attraction_category[],
      'Separado do Downtown só por uma ponte, é o distrito financeiro '
      || 'mais moderno da cidade, com pontes levadiças que abrem para '
      || 'navios de carga. O River Walk é uma pista de caminhada à beira '
      || 'do Rio Miami, e o shopping moderno Brickell City Centre reúne '
      || 'lojas e restaurantes, incluindo a vila Mary Brickell Village. '
      || 'Para uma boa vista da região, o Metromover, trem de superfície '
      || 'gratuito e todo de vidro, circula pela área central e '
      || 'financeira de Miami.',
      null,
      'Meio período',
      'Fim de tarde',
      'Casais e quem gosta de arquitetura urbana'
    ),
    (
      'Key Biscayne', 'key-biscayne-miami',
      array['natureza', 'passeio']::attraction_category[],
      'Ilha residencial a cerca de 20 minutos do centro de Miami, ligada '
      || 'por seis quilômetros de ponte suspensa. Reúne praias de areia, '
      || 'reservas naturais e restaurantes com vista, como o Rusty '
      || 'Pelican, além de opções de passeio de barco e esportes '
      || 'náuticos.',
      null,
      'Meio período',
      'Almoço, para aproveitar a vista dos restaurantes',
      'Casais e famílias'
    ),
    (
      'Zoo Miami', 'zoo-miami',
      array['natureza']::attraction_category[],
      'O maior e mais antigo jardim zoológico da Flórida, com mais de '
      || '3.000 animais de mais de 500 espécies, incluindo várias '
      || 'ameaçadas de extinção. Por estar perto dos trópicos, consegue '
      || 'abrigar bem espécies da Ásia, África e Austrália, em áreas '
      || 'abertas parecidas com o habitat natural, sem gaiolas. O parque '
      || 'é grande e oferece quadriciclo, trem e monorail para '
      || 'locomoção interna.',
      'Aberto todos os dias das 10h às 17h, com estacionamento '
      || 'gratuito.',
      'Dia inteiro',
      'Manhã, para fugir do calor mais forte',
      'Famílias com crianças'
    ),
    (
      'Miami Seaquarium', 'miami-seaquarium',
      array['natureza', 'ponto_turistico']::attraction_category[],
      'O maior e mais antigo oceanário do país, criado em 1955, onde foi '
      || 'filmado o seriado Flipper. Abriga golfinhos, tubarões, '
      || 'baleias-orcas, tartarugas-marinhas e peixe-boi, com shows '
      || 'diários de interação entre treinadores e animais. Também '
      || 'oferece atividades extras pagas, como encontro com golfinhos e '
      || 'mergulho com escafandro.',
      'Aberto todos os dias das 10h às 17h.',
      'Dia inteiro',
      'Manhã',
      'Famílias com crianças'
    ),
    (
      'Jungle Island', 'jungle-island-miami',
      array['natureza']::attraction_category[],
      'Parque de eco-aventura que mistura parque, zoológico e floresta, '
      || 'com espécies raras de animais e shows treinados ao longo do '
      || 'dia. É bastante procurado por famílias com crianças, que podem '
      || 'ter contato mais próximo com alguns bichos.',
      null,
      'Meio período',
      'Manhã',
      'Famílias com crianças pequenas'
    ),
    (
      'Everglades National Park', 'everglades-national-park',
      array['natureza']::attraction_category[],
      'Um imenso pantanal americano, formado por cinco biomas '
      || 'diferentes entre água doce, água salgada e mangues, com '
      || 'jacarés, crocodilos, águias, garças e dezenas de outras '
      || 'espécies. A forma mais legal de conhecer é o passeio de air '
      || 'boat, um barco a hélice que entra no meio dos pântanos e '
      || 'permite ver os animais de perto; o barulho é forte, mas a '
      || 'paisagem compensa. Passeios saem de Miami, Fort Lauderdale e '
      || 'Orlando.',
      null,
      'Meio período',
      'Manhã',
      'Famílias com crianças maiores e apaixonados por natureza'
    ),
    (
      'Key West', 'key-west',
      array['natureza', 'ponto_turistico']::attraction_category[],
      'Ilha paradisíaca no extremo sul da Flórida, com praias e '
      || 'paisagens de tirar o fôlego. O trajeto de carro até lá, cerca '
      || 'de 3h30 desde Miami, é considerado um dos mais bonitos do '
      || 'mundo: quase todo sobre pontes suspensas que ligam as pequenas '
      || 'ilhas do arquipélago de Florida Keys.',
      'É um passeio longo, vale reservar o dia inteiro (ou mais) para a '
      || 'ida e a volta.',
      'Dia inteiro',
      'Manhã, para aproveitar o dia todo na ilha',
      'Casais e famílias que têm um dia livre na agenda'
    ),
    (
      'Praias da região norte de Miami', 'praias-regiao-norte-miami',
      array['natureza']::attraction_category[],
      'Hollywood Beach, Fort Lauderdale e Boca Raton ficam a cerca de 50 '
      || 'minutos de Miami e são mais paradisíacas e tranquilas que as '
      || 'praias de Miami Beach, com mar calmo e areia branca. Costumam '
      || 'ter boa estrutura de vestiário e ducha, e a Hollywood Beach em '
      || 'especial é conhecida por receber famosos que moram em mansões '
      || 'com vista para o mar.',
      null,
      'Meio período',
      'Manhã',
      'Famílias e casais que preferem praia mais tranquila'
    ),
    (
      'Sawgrass Mills', 'sawgrass-mills',
      array['compras']::attraction_category[],
      'O maior outlet da Flórida e o segundo maior do mundo, com mais '
      || 'de 350 lojas, a cerca de 45 minutos de Miami.',
      null,
      'Meio período',
      'Manhã, para ter mais tempo de loja em loja',
      'Quem gosta de compras'
    )
) as attraction(
  name, slug, categories, description, important_tips, average_visit_time,
  best_time_of_day, recommended_audience
)
where cities.slug = 'miami'
on conflict (slug) do nothing;
