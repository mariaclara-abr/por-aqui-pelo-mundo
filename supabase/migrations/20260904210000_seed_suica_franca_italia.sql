-- Curadoria: Suíça (Zurique, Interlaken, Zermatt) > Itália (Milão) > França
-- (Paris), a partir do roteiro de planejamento da viagem de 28/06 a 10/07 de
-- 2023. País Suíça já existia (rascunho), Milão e Paris já existiam como
-- cidades vazias (Itália e França publicadas). Nota de curadoria em branco
-- de propósito, para a autora avaliar depois pelo painel /admin/atracoes.

insert into cities (country_id, name, slug, description)
select countries.id, city.name, city.slug, city.description
from countries
cross join (
  values
    (
      'Zurique', 'zurique',
      null
    ),
    (
      'Interlaken', 'interlaken',
      'Ponto de passagem entre Zurique e Zermatt pelo Swiss Travel Pass '
      || '(2h10 de trem desde a estação Zurich HB), usado como base para '
      || 'um dia livre de exploração da região de lagos e montanhas ao '
      || 'redor.'
    ),
    (
      'Zermatt', 'zermatt',
      'Cidade livre de automóveis a 1.608 metros acima do nível do mar, '
      || 'aos pés do Matterhorn: os únicos veículos que circulam por lá '
      || 'são miniaturas de ônibus elétricos. Na estação de trem há um '
      || 'escritório de turismo com mapas grátis e dicas da cidade. Com o '
      || 'céu claro, vale acordar cedo para ver o nascer do sol pintar o '
      || 'pico do Matterhorn de vermelho, um dos melhores pontos para '
      || 'isso é sobre uma ponte atrás da igreja Anglicana de St. Peter. '
      || 'Durante o verão, um "desfile" das cabras pretas e peludas '
      || 'Geissenkehr (blackneck, ou cabras de glaciar) cruza a '
      || 'Bahnhofstrasse toda manhã e à noite, e é possível assistir a um '
      || 'mini show de alphorn, o tradicional instrumento de sopro '
      || 'alpino. Antes de subir a qualquer uma das montanhas com vista '
      || 'panorâmica ao redor, vale checar as condições no centro de '
      || 'informações turísticas: com câmeras ao vivo, dá pra ver se não '
      || 'está tudo nublado.'
    )
) as city(name, slug, description)
where countries.slug = 'suica'
on conflict (slug) do nothing;

insert into cities (country_id, name, slug, description)
select countries.id,
  'Milão',
  'milao',
  'Capital da região da Lombardia e da moda italiana, com trem direto '
  || 'desde Zermatt até a Estação Central, cerca de 4h30 de viagem. A '
  || 'cerca de 813 km fica a Ilha de Capri (9h24 de carro ou 1h15 de '
  || 'avião) e a 269 km fica Veneza (2h45 de carro ou 2h30 de trem), boas '
  || 'opções para estender a viagem.'
from countries
where countries.slug = 'italia'
on conflict (slug) do update set description = excluded.description
where cities.description is null;

-- Zurique

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
      'Hotel Ibis Zurich Messe Airport', 'hotel-ibis-zurich-messe-airport',
      array['hotel']::attraction_category[],
      'Hospedagem a 9 minutos de carro do aeroporto de Zurique e a 4 '
      || 'minutos a pé do metrô Riedbach, com café da manhã incluído.',
      null
    ),
    (
      'Estação Central de Zurique (Zürich HB)', 'estacao-central-de-zurique',
      array['ponto_turistico']::attraction_category[],
      'Construída em 1871, é a maior estação de trens da Suíça, usada '
      || 'tanto para trajetos curtos quanto para viagens internacionais '
      || 'até Alemanha, Itália, Áustria e França. Por ali passam cerca de '
      || '3.000 trens por dia, uma das estações mais movimentadas do '
      || 'mundo, e é dela que é marcado o quilômetro zero dos CFF '
      || '(Caminhos de Ferro Federais).',
      null
    ),
    (
      'Bahnhofstrasse (Zurique)', 'bahnhofstrasse-zurique',
      array['compras', 'ponto_turistico']::attraction_category[],
      '"Rua da estação" em alemão, uma das principais ruas de Zurique e '
      || 'uma das zonas comerciais mais caras e exclusivas do mundo. '
      || 'Percorre 1,4 km até a Bürkliplatz, às margens do Lago de '
      || 'Zurique.',
      null
    ),
    (
      'Lindenhof', 'lindenhof',
      array['natureza', 'ponto_turistico']::attraction_category[],
      'Praça no alto da cidade, um dos melhores lugares para uma vista '
      || 'panorâmica da cidade antiga, do Rio Limmat e de vários pontos '
      || 'turísticos.',
      null
    ),
    (
      'Peterskirche', 'peterskirche',
      array['ponto_turistico']::attraction_category[],
      'O templo religioso mais antigo de Zurique, do século IX, com o '
      || 'maior relógio de igreja da Europa.',
      null
    ),
    (
      'Fraumünster (Kirche Fraumünster)', 'fraumunster',
      array['ponto_turistico']::attraction_category[],
      'Famosa pelos belos vitrais e pela torre azul que se destaca no '
      || 'horizonte, visível de vários pontos de Zurique.',
      null
    ),
    (
      'Grossmünster', 'grossmunster',
      array['ponto_turistico']::attraction_category[],
      'Uma das atrações mais visitadas de Zurique, com as torres gêmeas '
      || 'da igreja como um famoso ponto de referência.',
      null
    ),
    (
      'Predigerkirche', 'predigerkirche',
      array['ponto_turistico']::attraction_category[],
      'Considerada o edifício gótico mais alto da cidade.',
      null
    ),
    (
      'Sechseläutenplatz', 'sechselautenplatz',
      array['ponto_turistico']::attraction_category[],
      'A maior praça de Zurique, com o Opernhaus Zurich, a Casa de '
      || 'Concertos, uma das menores do mundo (1.100 lugares) e '
      || 'luxuosa por dentro e por fora, também palco de balé, teatro e '
      || 'música.',
      null
    ),
    (
      'Fábrica da Lindt "Home of Chocolate"', 'fabrica-da-lindt-home-of-chocolate',
      array['museu', 'compras']::attraction_category[],
      'Inaugurada em 2020 à beira do Lago de Zurique, reúne museu do '
      || 'chocolate e a maior loja do mundo da marca, com 500m². Tem '
      || 'áudio guia gratuito em vários idiomas logo na entrada, e uma '
      || 'fonte de 9 metros de altura com 1.500 litros de chocolate.',
      'Vá de ônibus 165, que sai de Bürkliplatz e passa a cada 30 '
      || 'minutos: desça na parada Kilchberg ZH, Bendlikon, a uns 5 '
      || 'minutos a pé da fábrica.'
    ),
    (
      'Museu da Fifa', 'museu-da-fifa',
      array['museu']::attraction_category[],
      'No distrito 2 de Zurique, ao lado da estação Bahnhof Enge.',
      'Pegue o tram número 6 até a estação final, Bahnhof Enge, ou um '
      || 'trem direto saindo de Zürich HB, trajeto de cerca de 10 '
      || 'minutos.'
    )
) as item(name, slug, categories, description, important_tips)
where cities.slug = 'zurique'
on conflict (slug) do nothing;

-- Interlaken

insert into attractions (city_id, name, slug, categories, description)
select
  cities.id,
  'Alpina Hotel',
  'alpina-hotel-interlaken',
  array['hotel']::attraction_category[],
  'Hospedagem a 5 minutos de carro (ou 21 minutos a pé) da estação '
  || 'Interlaken Ost, com café da manhã incluído.'
from cities
where cities.slug = 'interlaken'
on conflict (slug) do nothing;

-- Zermatt

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
      'Igreja de St. Mauritius', 'igreja-de-st-mauritius',
      array['ponto_turistico']::attraction_category[],
      'Demarca o centrinho da cidade, na praça principal de Zermatt.',
      null
    ),
    (
      'Rua Hinterdorfstrasse', 'rua-hinterdorfstrasse',
      array['ponto_turistico']::attraction_category[],
      'A parte mais antiga de Zermatt, com chalezinhos do século XV. Tem '
      || 'uma fonte em homenagem ao guia que mais subiu o Matterhorn, '
      || 'mais de 300 vezes, morto aos 90 anos, a mesma idade de sua '
      || 'última subida.',
      null
    ),
    (
      'Matterhorn Museum', 'matterhorn-museum',
      array['museu']::attraction_category[],
      'Mostra o desenvolvimento de Zermatt, de vila de agricultores nas '
      || 'montanhas a resort alpino mundialmente famoso, com casas e '
      || 'interiores originais e recriações da vida dos antigos '
      || 'exploradores alpinos. Também recria a primeira ascensão ao '
      || 'Matterhorn, em 14 de julho de 1865, com a corda original que '
      || 'arrebentou naquele dia.',
      'Aberto de 1º de julho a 30 de setembro, das 14h às 18h.'
    ),
    (
      'Bahnhofstrasse (Zermatt)', 'bahnhofstrasse-zermatt',
      array['compras']::attraction_category[],
      'Principal rua de Zermatt, com diversas lojinhas, restaurantes e '
      || 'cafés.',
      null
    ),
    (
      'Sunnegga (Estação Sunnegga-Rothorn)', 'sunnegga',
      array['natureza', 'passeio']::attraction_category[],
      'A 2.288 metros de altura, é o paraíso das famílias: no verão o '
      || 'lago Leisee oferece um mergulho refrescante, no inverno é uma '
      || 'ótima opção para aprender a esquiar ou praticar snowboard no '
      || 'Wolli-Park. Tem bar e restaurante.',
      'Duas rotas saem de Zermatt: de funicular (5 min) ou a pé (32 '
      || 'min). No verão só há neve nos picos, dá pra ver, mas não pra '
      || 'brincar nela. Dali dá pra seguir de teleférico até a estação '
      || 'de Rothorn (3.100 m), mas essa ligação não funciona no verão.'
    ),
    (
      'Matterhorn Glacier Paradise', 'matterhorn-glacier-paradise',
      array['natureza', 'passeio']::attraction_category[],
      'A 3.883 metros, é o ponto mais alto da Europa acessível por '
      || 'gôndola, com neve o ano todo e possibilidade de esquiar 365 '
      || 'dias por ano. Da plataforma de observação dá pra ver mais de '
      || '40 montanhas com mais de 4.000m de altura. Tem restaurante com '
      || 'acesso à pista de ski e o Glacier Palace, o palácio de gelo '
      || 'mais alto do mundo.',
      'A subida é feita em três etapas de teleférico, com paradas para '
      || 'descer e passear nos arredores, 60 minutos ao todo. Na '
      || 'plataforma de observação não é possível caminhar na neve: '
      || 'confirme numa parada anterior se dá pra brincar na neve por '
      || 'ali. O mini-esquibunda é cobrado à parte.'
    ),
    (
      'Gornergrat', 'gornergrat',
      array['natureza', 'passeio']::attraction_category[],
      'A 3.089 metros, tem uma vista sensacional do Matterhorn, estação '
      || 'de esqui e o Hotel Gornergrat Kulm, o mais alto da Europa, com '
      || 'observatório, lojas, restaurantes e binóculos para conhecer '
      || 'mais sobre as montanhas.',
      'Subida de trem funicular, cerca de 35 minutos, com uma janelinha '
      || 'que abre na parte superior do trem. No verão só há neve nos '
      || 'picos, dá pra ver mas não pra brincar; no inverno é possível '
      || 'caminhar na neve por lá.'
    ),
    (
      'Glacier Express', 'glacier-express',
      array['passeio']::attraction_category[],
      'O trem panorâmico mais famoso da Suíça, apelidado de "o trem '
      || 'expresso mais lento do mundo": percorre vales alpinos entre '
      || 'Zermatt e St. Moritz em 7h45, com assentos confortáveis em '
      || 'baías de 4, grandes janelas panorâmicas, informações '
      || 'multilíngues por fone gratuito, mesas em cada assento e um '
      || 'ônibus-bar aberto durante toda a viagem, com almoço de três '
      || 'pratos disponível mediante reserva.',
      '2ª classe custa CHF 213. O trecho também pode ser feito em trens '
      || 'regionais, que dispensam reserva de assento.'
    ),
    (
      'Hotel Capricorn', 'hotel-capricorn',
      array['hotel']::attraction_category[],
      '1 Suíte Júnior com vista para o Matterhorn e café da manhã '
      || 'incluído, a 2 minutos de carro (ou 11 minutos a pé) da estação '
      || 'de Zermatt.',
      null
    )
) as item(name, slug, categories, description, important_tips)
where cities.slug = 'zermatt'
on conflict (slug) do nothing;

-- Milão

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
      'Hotel Metro', 'hotel-metro-milao',
      array['hotel']::attraction_category[],
      'Hospedagem com quarto quádruplo família e café da manhã '
      || 'incluído, a 2 minutos a pé do metrô (linha 1 vermelha, estação '
      || 'Wagner). O aeroporto mais próximo é o de Milão-Linate.',
      null
    ),
    (
      'Estação Central de Milão', 'estacao-central-de-milao',
      array['ponto_turistico']::attraction_category[],
      'Uma das maiores e mais impressionantes estações da Europa, com '
      || 'mistura de estilos arquitetônicos. Inaugurada em 1931, tem '
      || 'enormes cúpulas de aço e cristal abrigando 24 plataformas, com '
      || 'trens para algumas das principais capitais europeias e outras '
      || 'cidades italianas retratadas nos painéis de azulejo das '
      || 'paredes.',
      null
    ),
    (
      'Piazza del Duomo', 'piazza-del-duomo-milao',
      array['ponto_turistico']::attraction_category[],
      'Um dos pontos mais movimentados de Milão. No centro está o '
      || 'Monumento Equestre de Vittorio Emanuele II, primeiro rei da '
      || 'Itália, cercado de construções famosas, cafés, restaurantes e '
      || 'lojas, além de uma das estações de metrô mais movimentadas da '
      || 'cidade.',
      null
    ),
    (
      'Duomo di Milano (Catedral de Milão)', 'duomo-di-milano',
      array['ponto_turistico', 'museu']::attraction_category[],
      'A igreja mais importante de Milão e um dos templos mais belos do '
      || 'mundo, feito inteiro em mármore branco-rosa. O projeto levou '
      || 'mais de 500 anos para ficar pronto, começou a ser erguido em '
      || '1386, e reúne 3,4 mil estátuas, 135 gárgulas e outras 700 '
      || 'figuras na área externa. É a terceira maior igreja do mundo, '
      || 'atrás só da Basílica de São Pedro e da Catedral de Sevilha: '
      || 'são 157m de comprimento, 92m de largura e 108m de altura no '
      || 'ponto mais alto, onde fica a estátua dourada da Madonnina. O '
      || 'interior gótico impressiona com pilares, vitrais e a nave '
      || 'central. Dá pra subir ao topo para a vista da cidade, ou '
      || 'visitar o subterrâneo, com restos arqueológicos.',
      'Leve passaporte ou carteira de identidade. Não é permitido '
      || 'entrar de salto alto, short, minissaia, camiseta regata ou '
      || 'roupas transparentes, nem levar comida e bebida, armas ou '
      || 'objetos cortantes, malas grandes, drones, sprays ou animais '
      || '(exceto cão-guia). O ingresso combinado inclui catedral, '
      || 'terraço de elevador, museu e a Igreja de São Gotardo em Corte: '
      || 'comece a visita pelo terraço, na entrada do elevador do lado '
      || 'esquerdo da catedral.'
    ),
    (
      'Terrazza Aperol', 'terrazza-aperol',
      array['restaurante']::attraction_category[],
      'Rooftop com vista para o Duomo, point para experimentar o Aperol '
      || 'Spritz, aperitivo típico italiano (referência: 19€), com '
      || 'opções de coquetéis e bebidas não alcoólicas (referência: '
      || '12€), servidas com uma seleção de petiscos.',
      'Funciona todos os dias das 11h às 23h. Para chegar: de frente '
      || 'para a porta principal do Duomo, siga à esquerda até a '
      || 'Galleria Vittorio Emanuele II, passe pela loja da Tiffany & '
      || 'Co. até a entrada do Il Mercato del Duomo (Milano Food '
      || 'Square). O acesso fica no segundo piso, atrás da loja Café '
      || 'Motta.'
    ),
    (
      'Galleria Vittorio Emanuele II', 'galleria-vittorio-emanuele-ii',
      array['compras', 'ponto_turistico']::attraction_category[],
      'Galeria comercial do século XIX, conhecida como o Salão de '
      || 'Milão, com as lojas mais famosas da cidade. A entrada é feita '
      || 'por um Arco do Triunfo, e cerca de 200 metros depois se chega '
      || 'à Piazza della Scala. Reúne restaurantes históricos, como o '
      || 'Biffi (1867), e até um McDonald''s com decoração preto e '
      || 'dourada à altura da elegância do local. No teto da abóbada '
      || 'central, um mosaico retrata os quatro continentes; no octógono '
      || 'central, o escudo da família Savoia com um touro: dar uma '
      || 'volta completa sobre ele, com o pé direito e olhos fechados, '
      || 'dizem que dá sorte.',
      null
    ),
    (
      'La Rinascente', 'la-rinascente',
      array['compras']::attraction_category[],
      'A maior cadeia de lojas de departamento da Itália, com a '
      || 'primeira unidade inaugurada em 1865, reúne marcas italianas e '
      || 'internacionais em 7 andares, com o último dedicado à '
      || 'gastronomia, com bares, restaurantes, cafeterias e '
      || 'chocolataria.',
      'Funciona diariamente das 9h30 às 22h.'
    ),
    (
      'Padaria Panzerotti Luini', 'padaria-panzerotti-luini',
      array['restaurante', 'cafe']::attraction_category[],
      'Point para experimentar o panzerotto mais famoso de Milão, um '
      || 'saboroso pãozinho recheado (frito ou assado), típico do sul da '
      || 'Itália. Fica nos arredores do Duomo, ao lado da La Rinascente.',
      null
    ),
    (
      'Piazza della Scala', 'piazza-della-scala',
      array['ponto_turistico']::attraction_category[],
      'Praça que reúne o Teatro alla Scala e o Monumento a Leonardo da '
      || 'Vinci, do escultor Pietro Magni, inaugurado em 1872.',
      null
    ),
    (
      'Quadrilátero da Moda', 'quadrilatero-da-moda',
      array['compras']::attraction_category[],
      'Bairro das lojas das principais marcas de luxo italianas e '
      || 'mundiais, delimitado pelas vias Monte Napoleone, Alessandro '
      || 'Manzoni, della Spiga e corso Venezia. A via Monte Napoleone '
      || 'está entre as dez ruas de compras mais luxuosas do mundo, ao '
      || 'lado da parisiense Champs-Élysées e da nova-iorquina Fifth '
      || 'Avenue, com bastante carro de luxo circulando por ali, '
      || 'principalmente nos fins de semana.',
      null
    ),
    (
      'Pasticceria Marchesi', 'pasticceria-marchesi',
      array['cafe']::attraction_category[],
      'Confeitaria no Quadrilátero da Moda, com destaque para o pudim '
      || 'de arroz, o panetone, as variedades de brioche, tortas, '
      || 'bombons e amêndoas confeitadas (praline).',
      'O preço no balcão é bem diferente do preço à mesa.'
    ),
    (
      'Pasticceria Cova', 'pasticceria-cova',
      array['cafe']::attraction_category[],
      'Confeitaria no Quadrilátero da Moda, com destaque para os doces '
      || 'milaneses, tortas, pralinas, bombons, gianduia, colomba e '
      || 'panetone, feito com a mesma receita secreta desde 1817.',
      null
    ),
    (
      'Bosco Verticale', 'bosco-verticale',
      array['ponto_turistico', 'natureza']::attraction_category[],
      'Dois prédios residenciais, de 76 e 110 metros de altura, '
      || 'inaugurados em 2014, cobertos por mais de 800 árvores, 4.500 '
      || 'arbustos e 15.000 plantas, que ajudam a reduzir a temperatura '
      || 'interna em 2 a 3 graus no verão e deixam entrar mais luz no '
      || 'inverno, quando as folhas caem. Reconhecido como referência '
      || 'mundial de inovação, sustentabilidade e design.',
      null
    ),
    (
      'Eataly', 'eataly-milao',
      array['compras', 'restaurante']::attraction_category[],
      'Mais de 5.000 m² divididos em 3 andares dedicados à comida '
      || 'italiana, com o objetivo de vender produtos de alta qualidade '
      || 'a preços acessíveis. Abriga o restaurante Alice, com 1 estrela '
      || 'Michelin, ambiente elegante e acolhedor.',
      null
    ),
    (
      'Le Cotolette', 'le-cotolette',
      array['restaurante']::attraction_category[],
      'Restaurante para experimentar a dobradinha tipicamente '
      || 'milanesa: risoto de açafrão e costeleta à milanesa, os dois '
      || 'pratos mais típicos da cidade.',
      null
    ),
    (
      'California Bakery', 'california-bakery',
      array['cafe']::attraction_category[],
      'Um cantinho da América em Milão, com panquecas americanas, '
      || 'saladas de fruta, iogurte com granola, ovos com bacon, '
      || 'sanduíches, tortas, cheesecakes, cupcakes e muffins.',
      null
    ),
    (
      '10 Corso Como', '10-corso-como',
      array['compras']::attraction_category[],
      'Loja-conceito badalada e exclusiva, sem vitrine, com entrada '
      || 'escondida atrás de um portão coberto de plantas. Vende roupas '
      || 'de estilistas famosos e emergentes, decoração, livros, bolsas, '
      || 'sapatos e revistas de moda, além de ter uma das livrarias mais '
      || 'bonitas da Itália e um bar e restaurante charmosos.',
      'A menos de 500 metros dali, na rua Enrico Tazzoli 3, fica o '
      || 'Outlet 10 Corso Como, com peças de coleções passadas por '
      || 'preços mais acessíveis.'
    ),
    (
      'Castelo Sforzesco', 'castelo-sforzesco',
      array['ponto_turistico', 'museu']::attraction_category[],
      'Fortaleza do século XV idealizada por Francesco Sforza sobre as '
      || 'ruínas de uma fortaleza medieval, com sete séculos de '
      || 'história. Hoje reúne uma Pinacoteca, o Museu Arqueológico '
      || '(dividido em Pré-história e Egito) e a última obra de '
      || 'Michelangelo, a Pietà Rondanini, escultura em mármore que '
      || 'ficou inacabada com a morte do artista em 1564. Ao lado fica o '
      || 'Parque Sempione, um grande espaço verde no estilo dos jardins '
      || 'ingleses, construído entre 1890 e 1893.',
      null
    ),
    (
      'Igreja Santa Maria delle Grazie', 'igreja-santa-maria-delle-grazie',
      array['ponto_turistico', 'museu']::attraction_category[],
      'Construída entre 1463 e 1482 em estilo gótico lombardo, guarda '
      || 'no antigo refeitório dos dominicanos a pintura "A Última '
      || 'Ceia", de Leonardo da Vinci, encomendada pelo duque Ludovico '
      || 'Sforza.',
      null
    ),
    (
      'Navigli', 'navigli',
      array['ponto_turistico', 'passeio']::attraction_category[],
      'Bairro cortado por canais, com o Naviglio Grande, o canal mais '
      || 'antigo de Milão (início do século XII), usado antigamente '
      || 'para transportar vinho, alimentos, carvão, madeira e mármore '
      || 'para a construção do Duomo. De dia reúne mercadinhos, galerias '
      || 'de arte, lojas de artesanato e livrarias; à noite vira um dos '
      || 'bairros mais movimentados da cidade, com o famoso aperitivo: '
      || 'paga-se a bebida e come-se à vontade num buffet de frios, '
      || 'massas e pães, a partir das 18h.',
      'Esqueça o salto alto: boa parte do percurso é irregular, com '
      || 'pedras e desníveis. Leve repelente, há muito pernilongo no fim '
      || 'da primavera e no verão.'
    ),
    (
      'Estádio Giuseppe Meazza (San Siro)', 'estadio-giuseppe-meazza-san-siro',
      array['ponto_turistico']::attraction_category[],
      'Estádio que o Milan e a Internazionale (Inter) dividem desde '
      || '1946, com capacidade para 84.310 pessoas, o maior da Itália. '
      || 'Inaugurado em 1926, foi rebatizado em 1980 em homenagem a '
      || 'Giuseppe Meazza, jogador que defendeu os dois times da cidade. '
      || 'Também recebe shows e festivais.',
      null
    )
) as item(name, slug, categories, description, important_tips)
where cities.slug = 'milao'
on conflict (slug) do nothing;

-- Paris

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
      'Passeio de barco pelo rio Sena (Bateaux Parisiens)', 'passeio-barco-rio-sena-bateaux-parisiens',
      array['passeio']::attraction_category[],
      'Cruzeiro guiado pelo Sena em barcos totalmente de vidro, com '
      || 'vista panorâmica da cidade, saindo do Port de la Bourdonnais '
      || '(ao pé da Torre Eiffel), no pontoon nº 3. A frota tem cinco '
      || 'barcos-restaurante e oito barcos de passeio.',
      'O cruzeiro guiado dura 1 hora, com partidas a cada hora entre '
      || '10h e 22h30 (referência: 16€, criança 8€). Já o Serviço '
      || 'Privilège dura 2 horas, com mesa à janela, entrada, prato, '
      || 'queijo e sobremesa à escolha, e seleção de vinhos finos '
      || '(referência: 89€, criança 34€), em mesas de 2 a 4 pessoas. O '
      || 'ingresso é comprado online e precisa ser trocado pelo físico '
      || 'na bilheteria. Leve fone de ouvido e celular carregados para o '
      || 'áudio guia, e sua própria máscara.'
    ),
    (
      'Torre Eiffel', 'torre-eiffel',
      array['ponto_turistico']::attraction_category[],
      'O maior cartão-postal de Paris.',
      'O acesso ao 2º andar dura cerca de 2 horas (referência: 69€ por '
      || 'pessoa); o acesso ao cume dura cerca de 1h30 (referência: '
      || '109,90€ por pessoa). Duas ruas coladas ao Champ de Mars, o '
      || 'parque onde fica a torre, têm ângulos bonitos para fotos sem '
      || 'carros: a rue de l''Université (a mais famosa) e a rue de '
      || 'Buenos Aires.'
    ),
    (
      'Novotel Paris Vaugirard Montparnasse', 'novotel-paris-vaugirard-montparnasse',
      array['hotel']::attraction_category[],
      'Quarto Classic com cama de casal e sofá-cama de casal, com '
      || 'acomodação e café da manhã incluídos, no 15º arrondissement de '
      || 'Paris.',
      null
    )
) as item(name, slug, categories, description, important_tips)
where cities.slug = 'paris'
on conflict (slug) do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'imperdivel'
where attractions.slug in (
  'duomo-di-milano', 'torre-eiffel', 'matterhorn-glacier-paradise'
)
on conflict do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'reserva_necessaria'
where attractions.slug in (
  'duomo-di-milano', 'passeio-barco-rio-sena-bateaux-parisiens',
  'torre-eiffel', 'glacier-express'
)
on conflict do nothing;

insert into travel_tips (category, title, content, "order")
values
  (
    'Suíça',
    'Moeda, idioma e clima',
    'O franco suíço (CHF) valia cerca de R$5,56 na época da viagem (o '
    || 'euro também é bem aceito em cidades como Genebra e Zurique). Os '
    || 'idiomas oficiais são alemão, francês, italiano e romanche. O '
    || 'verão vai de junho a setembro, com temperatura média de 21°C: '
    || 'julho é o mês mais quente, mas também traz mais chuva. O fuso '
    || 'horário do país fica 5 horas à frente do horário de Brasília.',
    1
  ),
  (
    'Itália',
    'Moeda e clima em Milão',
    'O euro valia cerca de R$5,43 na época da viagem. Em Milão o verão '
    || 'é morno e úmido, com céu parcialmente encoberto o ano todo e '
    || 'temperatura variando entre -1°C e 30°C: a melhor época para '
    || 'clima quente vai do fim de junho ao fim de agosto. O fuso '
    || 'horário do país fica 5 horas à frente do horário de Brasília.',
    1
  ),
  (
    'Itália',
    'Comidas típicas de Milão',
    'Risotto alla Milanese: risoto com açafrão e manteiga, tradicional '
    || 'desde 1574, costuma ser acompanhado de ossobuco. Ossobuco: carne '
    || 'temperada com "gremolada" (alho, raspas de limão e salsa), '
    || 'servida com risoto, legumes ou polenta. Costoletta alla '
    || 'Milanese: o "bife à milanesa", frito na manteiga clarificada '
    || 'pelos milaneses. Panetone: o pão doce natalino que nasceu na '
    || 'cidade no século XV, com passas ou frutas cristalizadas.',
    2
  ),
  (
    'França',
    'Moeda e clima em Paris',
    'O euro valia cerca de R$5,43 na época da viagem. Em Paris o verão '
    || 'é curto, agradável e de céu parcialmente encoberto, com '
    || 'temperatura entre 2°C e 25°C ao longo do ano: a melhor época '
    || 'para clima quente vai de meados de junho a meados de setembro. '
    || 'O fuso horário do país fica 5 horas à frente do horário de '
    || 'Brasília.',
    1
  ),
  (
    'França',
    'Bebedouros públicos gratuitos em Paris',
    'Paris é a cidade europeia com mais fontes públicas de água '
    || 'potável, mais de 1.200 espalhadas pela cidade. Desde março de '
    || '2023 dá pra achá-las pelo Google Maps, digitando "fontaine": o '
    || 'app mostra o caminho até o bebedouro mais próximo, parte de uma '
    || 'iniciativa da Eau de Paris, a companhia de água da região, para '
    || 'reduzir o consumo de garrafas plásticas. Em outras cidades da '
    || 'Europa, o app Drinking Fountains ajuda a achar mais de 200 mil '
    || 'bebedouros pelo mundo.',
    2
  )
on conflict do nothing;
