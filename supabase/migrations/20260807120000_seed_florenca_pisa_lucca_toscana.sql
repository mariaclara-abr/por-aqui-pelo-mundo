-- Curadoria: Itália, a partir dos Dias 10 a 13 da viagem da família
-- (Florença, Pisa, Lucca e a volta pela Toscana até Montalcino, San
-- Quirico d'Orcia, Pienza e Montepulciano).
-- Florença, Pisa e Lucca já existiam como cidade, então só entram novas
-- atrações. Montalcino, San Quirico d'Orcia, Pienza e Montepulciano são
-- cidades novas.
-- Nota de curadoria: o roteiro não trazia nota explícita para nenhum
-- lugar, então todos entram com 5 estrelas como valor temporário, para
-- ajustar depois pelo painel /admin/atracoes, lugar por lugar.
-- A lista de vinícolas próximas a Florença (Antinori, Tenuta di
-- Capezzana, Castello di Nipozzano, Castello di Brolio, Castello
-- Tricerchi, Biondi-Santi, Argiano, Ciacci Piccolomini d'Aragona) ficou
-- de fora por enquanto: é uma lista de opções de referência no roteiro,
-- sem confirmação de visita nem cidade clara para cada uma. Castello
-- Banfi entrou porque tinha horário marcado no dia (11:00) e é o único
-- da lista com visita efetivamente roteirizada.

insert into cities (country_id, name, slug, description, latitude, longitude)
select countries.id, city.name, city.slug, city.description, city.latitude, city.longitude
from countries
cross join (
  values
    (
      'Montalcino', 'montalcino',
      'Vilarejo medieval da província de Siena, com pouco mais de 5.000 '
      || 'habitantes, situado em uma colina a 564 metros acima do nível '
      || 'do mar. É o berço do Brunello di Montalcino.',
      43.056700, 11.489700
    ),
    (
      'San Quirico d''Orcia', 'san-quirico-dorcia',
      'Pequena cidade do Val d''Orcia, na província de Siena, no meio do '
      || 'caminho entre Montalcino e Pienza.',
      43.056300, 11.608600
    ),
    (
      'Pienza', 'pienza',
      'Comuna da província de Siena planejada no século XV pelo Papa '
      || 'Pio II como cidade ideal renascentista, Patrimônio da UNESCO '
      || 'desde 1996.',
      43.078200, 11.678400
    ),
    (
      'Montepulciano', 'montepulciano',
      'Cidade da Toscana famosa pela arquitetura renascentista e pelo '
      || 'vinho Nobile di Montepulciano.',
      43.093000, 11.786000
    )
) as city(name, slug, description, latitude, longitude)
where countries.slug = 'italia'
on conflict (slug) do nothing;

update cities
set description =
  'O aeroporto fica a uns 8 a 9 km do centro, em média 15 a 20 minutos '
  || 'de trajeto de carro. De tram, a linha T2 do aeroporto leva a uns '
  || '25 minutos até a estação Santa Maria Novella. Evite dirigir dentro '
  || 'da Zona de Tráfego Limitado (ZTL) no centro histórico e reserve o '
  || 'estacionamento do hotel com antecedência. Limite legal de álcool '
  || 'na Itália: 0,5 g/L, então modere nas degustações de vinho.'
where slug = 'florenca' and description is null;

insert into attractions (
  city_id, name, slug, category, description, important_tips, curation_rating
)
select cities.id, attraction.name, attraction.slug, attraction.category::attraction_category,
  attraction.description, attraction.important_tips, attraction.curation_rating
from cities
cross join (
  values
    (
      'Hotel Donatello', 'hotel-donatello', 'hotel',
      'Hotel com 4 diárias, 2 quartos, café da manhã incluso. Check-in '
      || 'às 14:00, check-out às 11:00.',
      null, 5
    ),
    (
      'Parcheggio Stazione Fortezza Fiera', 'parcheggio-stazione-fortezza-fiera', 'estacionamentos',
      'Estacionamento na Piazzale Caduti nei Lager, 50129 Firenze, '
      || 'indicado pelo Hotel Donatello.',
      'Peça a indicação de estacionamentos direto com o hotel, com '
      || 'antecedência.', 5
    ),
    (
      'Locadora Hertz Firenze', 'locadora-hertz-firenze', 'outro',
      'Locadora de carros a cerca de 8 a 9 km do Hotel Donatello, em '
      || 'média 15 a 20 minutos de trajeto, próxima à estação Santa '
      || 'Maria Novella. Ponto de retirada do carro alugado para os '
      || 'passeios a Pisa, Lucca e à Toscana.',
      'Tire fotos e faça vídeos de todos os ângulos do carro na '
      || 'retirada, incluindo rodas e para-choques.', 5
    ),
    (
      'Mando Burger', 'mando-burger', 'restaurante',
      'Os hambúrgueres são muito elogiados como os melhores da vida, e '
      || 'as batatas fritas são uma perfeição. Lugar pequeno, com '
      || 'atendimento acolhedor.',
      null, 5
    ),
    (
      'Ganza - Mai Abbastanza', 'ganza-mai-abbastanza', 'restaurante',
      'Pizza incrível e barata, uma ótima opção para comer andando pela '
      || 'cidade. Atendimento agradável e pedido rápido.',
      null, 5
    ),
    (
      'Ala Grande Caffè', 'ala-grande-caffe', 'cafe',
      'Também conhecido como Caffè Rosanò, é um charmoso e popular café '
      || 'e casa de brunch, altamente recomendado pelo atendimento e '
      || 'pela comida saborosa.',
      'Destaque para os croissants com creme de baunilha e de '
      || 'pistache.', 5
    ),
    (
      'Catedral de Santa Maria del Fiore', 'catedral-de-santa-maria-del-fiore-florenca', 'ponto_turistico',
      'Popularmente conhecida como Duomo de Florença, é uma joia da '
      || 'engenharia renascentista e a quinta maior igreja da Europa, '
      || 'com capacidade para até trinta mil pessoas. Possui 153 metros '
      || 'de comprimento e 90 metros de largura. A construção começou '
      || 'em 1296 e a catedral foi consagrada em 1436, ao fim das obras '
      || 'da cúpula. No interior da cúpula, o teto é decorado com '
      || 'mosaicos bizantinos dourados do século XIII, retratando o '
      || 'Juízo Final e histórias bíblicas.',
      'O acesso ao interior é gratuito. É obrigatório cobrir ombros e '
      || 'joelhos, e não é permitida a entrada com chapéus, óculos '
      || 'escuros, chinelos ou regatas.', 5
    ),
    (
      'Batistério de São João', 'batisterio-de-sao-joao-florenca', 'ponto_turistico',
      'Em frente ao Duomo, é uma das construções mais antigas de '
      || 'Florença, consagrada em 1059. Famoso pelo estilo românico, '
      || 'pela cúpula com mosaicos bizantinos e pelas três portas de '
      || 'bronze, entre elas a Porta do Paraíso, criada por Lorenzo '
      || 'Ghiberti no século XV com painéis em relevo do Antigo '
      || 'Testamento. As portas visíveis hoje no exterior são cópias, '
      || 'os painéis originais estão protegidos e em exibição no Museu '
      || 'da Catedral (Opera del Duomo). Ingresso: 15,00 € e 5,00 €.',
      null, 5
    ),
    (
      'Leonardo da Vinci Interactive Museum', 'leonardo-da-vinci-interactive-museum', 'museu',
      'Localizado no coração do centro histórico, na Via dei Servi, a '
      || 'poucos passos da Galleria dell''Accademia e da Catedral de '
      || 'Florença. O grande diferencial do museu é permitir aos '
      || 'visitantes tocar, testar e mover réplicas das máquinas '
      || 'projetadas por Leonardo da Vinci, com mais de 50 réplicas '
      || 'mecânicas baseadas em seus códigos originais, organizadas por '
      || 'tema entre Terra, Água, Ar e Fogo. Ingresso: 8,30 € e 7,30 €.',
      'O passeio completo pelas salas costuma levar de 1 hora a 1 hora '
      || 'e meia.', 5
    ),
    (
      'Piazza della Signoria', 'piazza-della-signoria', 'ponto_turistico',
      'Centro histórico e político de Florença, cheia de monumentos '
      || 'importantes, entre eles uma cópia do David de Michelangelo.',
      null, 5
    ),
    (
      'Palazzo Vecchio', 'palazzo-vecchio', 'ponto_turistico',
      'Antiga sede do governo de Florença, construída a partir de 1299, '
      || 'e mais tarde residência da poderosa família Médici. Hoje é a '
      || 'sede da atual prefeitura, na Piazza della Signoria.',
      null, 5
    ),
    (
      'Loggia dei Lanzi', 'loggia-dei-lanzi', 'ponto_turistico',
      'Galeria ao ar livre na Piazza della Signoria, reunindo obras de '
      || 'diferentes períodos que simbolizam o poder cívico e artístico '
      || 'de Florença.',
      null, 5
    ),
    (
      'Fontana del Nettuno', 'fontana-del-nettuno-florenca', 'ponto_turistico',
      'Fonte na Piazza della Signoria encomendada para celebrar o '
      || 'casamento de Francisco I de Médici com Joana da Áustria, '
      || 'simbolizando o domínio florentino sobre o mar. Esculpida por '
      || 'Bartolomeo Ammannati entre 1563 e 1575.',
      null, 5
    ),
    (
      'Palazzo della Mercanzia', 'palazzo-della-mercanzia-gucci-garden', 'compras',
      'Edifício histórico medieval de 1359, na Piazza della Signoria, '
      || 'que era a sede do tribunal onde se resolviam conflitos entre '
      || 'as associações de trabalhadores da época. Hoje abriga o Gucci '
      || 'Garden, reunindo um museu (Gucci Garden Galleria), a Gucci '
      || 'Osteria da Massimo Bottura e uma loja exclusiva com itens '
      || 'únicos.',
      null, 5
    ),
    (
      'Galleria degli Uffizi', 'galleria-degli-uffizi', 'museu',
      'Antigo palácio que hoje funciona como um dos museus de arte mais '
      || 'importantes e famosos do mundo, com obras do Renascimento. '
      || 'Guarda tesouros de mestres da arte italiana como Da Vinci, '
      || 'Gentileschi e Michelangelo, além de peças da cultura '
      || 'greco-romana.',
      null, 5
    ),
    (
      'Corredor Vasari', 'corredor-vasari', 'ponto_turistico',
      'Passagem elevada e fechada, construída em nove meses a pedido de '
      || 'Cosme I de Médici em 1565, para que a família Médici pudesse '
      || 'se deslocar com segurança pela cidade. Conecta o Palazzo '
      || 'Vecchio ao Palazzo Pitti, passando pela Galleria degli Uffizi '
      || 'e sobre a Ponte Vecchio, com cerca de um quilômetro de '
      || 'comprimento.',
      null, 5
    ),
    (
      'Palazzo Pitti', 'palazzo-pitti', 'ponto_turistico',
      'Imponente palácio renascentista que já foi residência da família '
      || 'Médici. Hoje abriga vários museus e galerias de arte, além de '
      || 'estar ligado aos Jardins de Boboli, Patrimônio da UNESCO, com '
      || 'grutas, fontes, pérgulas, um pequeno lago e centenas de '
      || 'estátuas de mármore.',
      null, 5
    ),
    (
      'Pôr do sol em Piazzale Michelangelo', 'por-do-sol-piazzale-michelangelo', 'ponto_turistico',
      'Praça mirante planejada para contemplar a vista da cidade e '
      || 'apreciar o pôr do sol. Localizada em uma colina, oferece um '
      || 'cenário incrível com destaque para o rio Arno, a Ponte Vecchio '
      || 'e a cúpula da Catedral de Santa Maria del Fiore.',
      null, 5
    )
) as attraction(name, slug, category, description, important_tips, curation_rating)
where cities.slug = 'florenca'
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
      'Piazza dei Miracoli', 'piazza-dei-miracoli-pisa', 'ponto_turistico',
      'Também chamada oficialmente de Piazza del Duomo, é o coração '
      || 'turístico de Pisa e um dos complexos medievais mais famosos '
      || 'do mundo, construído entre 1173 e 1372. Cercada por antigas '
      || 'muralhas e um amplo gramado, reúne quatro obras primas da '
      || 'arquitetura românica, reconhecidas como Patrimônio da '
      || 'Humanidade pela UNESCO.',
      'O acesso ao gramado é gratuito, mas é necessário comprar '
      || 'ingresso para entrar nos monumentos.', 5
    ),
    (
      'Torre de Pisa', 'torre-de-pisa', 'ponto_turistico',
      'Torre sineira da catedral de Pisa e símbolo da cidade, com cerca '
      || 'de 58 metros de altura e quase 4 graus de inclinação devido '
      || 'ao solo instável. É possível subir seus 294 degraus para ter '
      || 'uma vista panorâmica.',
      null, 5
    ),
    (
      'Duomo di Santa Maria Assunta', 'duomo-di-santa-maria-assunta-pisa', 'ponto_turistico',
      'Catedral de Pisa, joia do românico toscano, construída a partir '
      || 'de 1064 e consagrada em 1118. Destaca-se pelo mármore branco '
      || 'e preto, pelas influências árabes e bizantinas, e pelo '
      || 'púlpito esculpido no interior.',
      null, 5
    ),
    (
      'Battistero di San Giovanni', 'battistero-di-san-giovanni-pisa', 'ponto_turistico',
      'Maior batistério da Itália, famoso pela arquitetura híbrida: '
      || 'base românica e parte superior gótica, construída entre 1152 '
      || 'e 1363. Interior simples, focado na pia batismal octogonal, '
      || 'com uma acústica incrível.',
      null, 5
    ),
    (
      'Camposanto Monumentale', 'camposanto-monumentale-pisa', 'ponto_turistico',
      'Cemitério histórico em estilo gótico, construído entre 1278 e '
      || '1464, formado por um grande claustro com arcos e galerias. '
      || 'Abriga sarcófagos romanos e afrescos medievais, muitos '
      || 'restaurados após danos na Segunda Guerra Mundial.',
      null, 5
    )
) as attraction(name, slug, category, description, important_tips, curation_rating)
where cities.slug = 'pisa'
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
      'Muralhas de Lucca', 'muralhas-de-lucca', 'ponto_turistico',
      'Conjunto de fortificações que cercam o centro histórico de '
      || 'Lucca, construídas entre os séculos XVI e XVII ao longo de '
      || 'mais de 100 anos. Têm mais de 4 km de extensão, 12 metros de '
      || 'altura e 30 metros de largura, e são um dos exemplos mais bem '
      || 'preservados de muralhas renascentistas da Europa.',
      'Alugar bicicletas para percorrer o topo da muralha é uma das '
      || 'atividades mais populares, por cerca de 5,00 € a hora em '
      || 'lojas próximas à Porta San Pietro.', 5
    ),
    (
      'Piazza dell''Anfiteatro', 'piazza-dellanfiteatro-lucca', 'ponto_turistico',
      'Praça histórica construída sobre as ruínas de um antigo '
      || 'anfiteatro romano do século II d.C., com capacidade original '
      || 'para cerca de 10.000 espectadores. Seu formato totalmente '
      || 'oval preserva o contorno da arena, hoje cercado por prédios, '
      || 'restaurantes e lojas.',
      'Para apreciar o formato oval do alto, suba os 230 degraus da '
      || 'Torre Guinigi.', 5
    ),
    (
      'Torre Guinigi', 'torre-guinigi', 'ponto_turistico',
      'Um dos monumentos mais icônicos de Lucca, famosa pelo jardim '
      || 'suspenso com azinheiras centenárias no topo. Construída no '
      || 'século XIV pela família Guinigi, tem cerca de 45 metros de '
      || 'altura, sem elevador, com cerca de 230 degraus até o topo. '
      || 'Oferece a melhor vista panorâmica da cidade e das montanhas '
      || 'toscanas, sendo a única torre medieval intacta da região.',
      null, 5
    )
) as attraction(name, slug, category, description, important_tips, curation_rating)
where cities.slug = 'lucca'
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
      'Montalcino', 'montalcino-vila', 'ponto_turistico',
      'Vilarejo medieval da província de Siena, com pouco mais de '
      || '5.000 habitantes, situado em uma colina a 564 metros acima '
      || 'do nível do mar. É o berço do Brunello di Montalcino, vinho '
      || 'feito 100% com uvas sangiovese grosso, protegido pela '
      || 'Denominação de Origem Controlada e Garantida (DOCG) e '
      || 'liberado para consumo após 5 anos de preparação. Entre os '
      || 'destaques da cidade estão a Fortaleza (Rocca), de 1361, o '
      || 'Palazzo dei Priori do século XII, a Piazza del Popolo, com '
      || 'arcos dos séculos XIV e XV, a igreja renascentista Madonna '
      || 'del Soccorso e a Cattedrale del Santissimo Salvatore, do '
      || 'século XIV, na parte mais alta da cidade.',
      null, 5
    ),
    (
      'Castello Banfi', 'castello-banfi', 'passeio',
      'Um dos destinos mais prestigiados da Toscana, complexo medieval '
      || 'do século XIII originalmente chamado Poggio alle Mura, que '
      || 'combina uma vinícola de renome mundial com um hotel de luxo '
      || 'e alta gastronomia. É um dos maiores produtores de Brunello '
      || 'di Montalcino, com degustações de vinhos, azeites e vinagre '
      || 'balsâmico, além de loja e dois restaurantes: o requintado La '
      || 'Sala dei Grappoli e a mais informal La Taverna.',
      null, 5
    ),
    (
      'Trattoria Fiorella', 'trattoria-fiorella-montalcino', 'restaurante',
      'Ótima comida toscana autêntica, com serviço gentil e atencioso. '
      || 'Restaurante pequeno, simples e de bom custo-benefício.',
      null, 5
    ),
    (
      'Osteria di Porta al Cassero', 'osteria-di-porta-al-cassero', 'restaurante',
      'Boa opção para degustar os vinhos Brunello e almoçar, ou fazer '
      || 'outras refeições. Serviço excelente, comida deliciosa e '
      || 'preço bem razoável.',
      null, 5
    ),
    (
      'Enoteca La Fortezza di Montalcino', 'enoteca-la-fortezza-di-montalcino', 'restaurante',
      'Fica dentro do castelo medieval de Montalcino e funciona como '
      || 'uma wine bar, com réguas de degustação de vinhos por taça.',
      'Não é obrigatório reservar mesa para refeição.', 5
    )
) as attraction(name, slug, category, description, important_tips, curation_rating)
where cities.slug = 'montalcino'
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
      'Cappella della Madonna di Vitaleta', 'cappella-della-madonna-di-vitaleta', 'ponto_turistico',
      'Pequena igreja famosa pela localização isolada entre ciprestes '
      || 'e colinas, no caminho entre San Quirico d''Orcia e Pienza. É '
      || 'propriedade privada, mas os visitantes costumam poder '
      || 'caminhar até a capela para fotos. Segundo a tradição local, '
      || 'foi construída no local onde a Virgem Maria apareceu a uma '
      || 'pastora no século XVI, e passou por uma restauração completa '
      || 'em 2021.',
      'Para a foto clássica mais distante, muitos turistas preferem '
      || 'registrar a capela a partir da estrada principal SP146, '
      || 'usando lentes com zoom.', 5
    ),
    (
      'Estrada cenário do filme Gladiador', 'estrada-cenario-filme-gladiador', 'passeio',
      'Estrada rural onde Maximus caminhou ao encontro da sua família '
      || 'no filme Gladiador, a poucos minutos de Pienza. É uma '
      || 'propriedade privada, mas o caminho é acessível aos turistas, '
      || 'entre uma estrada de ciprestes e campos de trigo.',
      'No Waze, busque por Gladiator Shooting Spot ou Panorama il '
      || 'Gladiatore. Estacione próximo e siga a pé.', 5
    ),
    (
      'Podere Belvedere', 'podere-belvedere', 'natureza',
      'Casa de fazenda no topo de uma colina perto de San Quirico '
      || 'd''Orcia, um dos locais mais fotogênicos da região do Val '
      || 'd''Orcia, Patrimônio da UNESCO. Conhecida pelas vistas com '
      || 'ciprestes, colinas onduladas e névoa matinal, é ideal para '
      || 'fotografias ao nascer do sol.',
      'É necessário estacionar na beira da estrada SP146 e caminhar '
      || 'por uma trilha entre arbustos até o ponto de observação, que '
      || 'fica na estrada ao lado da propriedade, não dentro dela.', 5
    )
) as attraction(name, slug, category, description, important_tips, curation_rating)
where cities.slug = 'san-quirico-dorcia'
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
      'Pienza', 'pienza-vila', 'ponto_turistico',
      'Charmosa comuna da província de Siena, planejada no século XV '
      || 'pelo Papa Pio II, que transformou sua pequena vila natal em '
      || 'cidade ideal renascentista entre 1459 e 1462. Projetada pelo '
      || 'arquiteto Bernardo Rossellino com base em conceitos '
      || 'humanistas de harmonia, beleza e funcionalidade urbana, '
      || 'inclui a Catedral Santa Maria Assunta, o Palazzo Piccolomini, '
      || 'o Palazzo Comunale e a Piazza Pio II. Em 1996 o centro '
      || 'histórico foi inscrito como Patrimônio da UNESCO. A cidade '
      || 'também é famosa pela produção do queijo Pecorino e é uma boa '
      || 'base para explorar o Val d''Orcia, perto de Montepulciano e '
      || 'Montalcino.',
      null, 5
    )
) as attraction(name, slug, category, description, important_tips, curation_rating)
where cities.slug = 'pienza'
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
      'Montepulciano', 'montepulciano-vila', 'ponto_turistico',
      'Cidade famosa pela arquitetura renascentista e pelo vinho '
      || 'Nobile di Montepulciano, tinto de alta qualidade com '
      || 'Denominação de Origem Controlada e Garantida (DOCG). As '
      || 'principais atrações incluem a Piazza Grande, coração da '
      || 'cidade, onde estão o Duomo di Montepulciano, a Catedral de '
      || 'Santa Maria Assunta e o Palazzo Comunale, além de adegas '
      || 'subterrâneas como a Contucci e a Talosa para degustar o '
      || 'vinho Nobile, a rua principal Il Corso, cheia de lojas, '
      || 'edifícios históricos e cafés, e vistas panorâmicas do Val '
      || 'd''Orcia.',
      null, 5
    ),
    (
      'Osteria Acquacheta', 'osteria-acquacheta', 'restaurante',
      'O lugar mais famoso de Montepulciano para comer a autêntica '
      || 'bistecca fiorentina, assada na brasa de carvalho. Ambiente '
      || 'rústico, mesas compartilhadas e clima animado.',
      null, 5
    ),
    (
      'La Pentolaccia', 'la-pentolaccia', 'restaurante',
      'Restaurante pequeno e familiar no coração do centro histórico '
      || 'de Montepulciano. Excelente para massas frescas e pratos com '
      || 'trufas, com ótima relação custo-benefício.',
      null, 5
    ),
    (
      'Caffè Poliziano', 'caffe-poliziano', 'cafe',
      'Perfeito para uma refeição mais leve ou lanche da tarde, com '
      || 'uma varanda com vista para o Val d''Orcia. Ótimo lugar para '
      || 'provar o vinho local (Vino Nobile) acompanhado de cantucci '
      || 'com vin santo.',
      null, 5
    )
) as attraction(name, slug, category, description, important_tips, curation_rating)
where cities.slug = 'montepulciano'
on conflict (slug) do nothing;

-- Etiqueta: entrada gratuita.
insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'gratuito'
where attractions.slug in (
  'catedral-de-santa-maria-del-fiore-florenca',
  'piazza-dei-miracoli-pisa'
)
on conflict do nothing;
