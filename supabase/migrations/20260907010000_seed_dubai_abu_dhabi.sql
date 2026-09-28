-- Curadoria: Emirados Árabes > Dubai e Abu Dhabi, a partir do roteiro de
-- planejamento da viagem de julho. País Emirados Árabes já existia
-- (publicado, sem cidades). Nota de curadoria em branco de propósito, para
-- a autora avaliar depois pelo painel /admin/atracoes.

insert into cities (country_id, name, slug, description)
select
  countries.id,
  'Dubai',
  'dubai',
  'Cidade do mundo que mais cresceu na última década, na costa do Golfo '
  || 'Pérsico, cercada pelo deserto. Fica 7 horas à frente do horário de '
  || 'Brasília. Brasileiros não precisam de visto. Julho: nascer e '
  || 'pôr-do-sol por volta das 05h42 e 19h04, com temperaturas entre 25°C '
  || 'e 40°C e chuva praticamente nula; os meses mais amenos vão de '
  || 'outubro a abril. Moeda oficial é o dirham (AED). É possível pagar '
  || 'com cartão na maioria dos lugares, mas vale levar dinheiro em '
  || 'espécie para táxis e lojas pequenas. A CNH brasileira não é aceita '
  || 'para alugar carro: é preciso a Permissão Internacional para Dirigir '
  || '(PID), emitida pelo Detran. Os dias úteis vão de domingo a '
  || 'quinta-feira; sexta é dia sagrado e sábado funciona como domingo. '
  || 'Voltagem 220V com tomada de três pinos, diferente da brasileira.'
from countries
where countries.slug = 'emirados-arabes'
on conflict (slug) do nothing;

insert into cities (country_id, name, slug, description)
select
  countries.id,
  'Abu Dhabi',
  'abu-dhabi',
  'Capital dos Emirados Árabes Unidos, a 150 km (1h30) de Dubai. Sede da '
  || 'Yas Island, onde ficam o Ferrari World e o circuito de Fórmula 1 de '
  || 'Abu Dhabi (Yas Marina Circuit).'
from countries
where countries.slug = 'emirados-arabes'
on conflict (slug) do nothing;

insert into attractions (
  city_id, name, slug, categories, description, important_tips,
  requires_advance_purchase, requires_reservation
)
select
  cities.id, item.name, item.slug, item.categories, item.description,
  item.important_tips, item.requires_advance_purchase, item.requires_reservation
from cities
cross join (
  values
    (
      'Deira', 'deira-dubai', array['ponto_turistico', 'compras']::attraction_category[],
      'Carinhosamente conhecida como "Dubai antigo", bairro fervilhante de '
      || 'personalidade e história, com souks tradicionais: o de temperos '
      || '(Spice Souk), o de tecidos (Textile Souk) e o do ouro (Gold '
      || 'Souk). Ruas estreitas às margens do canal Dubai Creek, onde '
      || 'comerciantes atracavam barcos trazendo perfume, especiarias, '
      || 'café e ouro. Ao lado, Al Seef homenageia a Dubai antiga com '
      || 'vilas beduínas árabes, torres de ventilação e shopping a céu '
      || 'aberto.',
      'Embarcações de madeira motorizadas (abras) levam passageiros entre '
      || 'Bur Dubai e Deira por 1 AED. Lojas abrem das 9h30 às 21h30.',
      false, false
    ),
    (
      'Dubai Frame', 'dubai-frame', array['ponto_turistico']::attraction_category[],
      'Um dos monumentos mais recentes da cidade: um edifício em forma de '
      || 'moldura, com 150 m de altura, que enquadra vistas do Dubai '
      || 'antigo e moderno. Oferece vistas panorâmicas de toda a cidade.',
      'Visita das 9h às 21h. Ingressos: 50 AED adulto e 20 AED criança.',
      false, false
    ),
    (
      'Ain Dubai', 'ain-dubai', array['ponto_turistico']::attraction_category[],
      'A maior e mais alta roda-gigante de observação do mundo, com 250 m '
      || 'de altura. Uma rotação leva cerca de 38 minutos.',
      'Não há banheiros na cabine: vá antes de embarcar. Ingressos: 130 '
      || 'AED adulto e 100 AED criança.',
      false, false
    ),
    (
      'The View at The Palm', 'the-view-at-the-palm', array['ponto_turistico']::attraction_category[],
      'Plataforma de observação no terraço do The Palm Tower, a 240 m de '
      || 'altura, com panorama de 360 graus da Palm Jumeirah.',
      'Horário não-prime (mais barato) das 9h às 16h e das 19h30 ao '
      || 'fechamento; horário nobre das 16h30 às 19h. Ingressos: 100 AED '
      || 'adulto e 69 AED criança.',
      false, false
    ),
    (
      'The Pointe', 'the-pointe-dubai', array['compras', 'passeio']::attraction_category[],
      'Destino à beira-mar na ilha Palm Jumeirah, com lojas, restaurantes '
      || 'e a Palm Fountain, a maior fonte musical do mundo, com shows '
      || 'noturnos.',
      null, false, false
    ),
    (
      'La Perle by Dragone', 'la-perle-by-dragone', array['passeio']::attraction_category[],
      'Espetáculo permanente em Al Habtoor City (no Hotel W), fusão de '
      || 'performances artísticas, imagens e tecnologia num teatro '
      || 'aquático com assentos em 270 graus. O palco é inundado e drenado '
      || 'em segundos enquanto artistas realizam acrobacias aquáticas e '
      || 'aéreas, com mergulhos de até 25 metros de altura.',
      'Sessões às 18h30 ou 21h/22h30. Ingressos a partir de 159 AED por '
      || 'pessoa. Vale reservar com antecedência, a agenda costuma lotar.',
      false, true
    ),
    (
      'Aquaventure Waterpark', 'aquaventure-waterpark',
      array['passeio', 'natureza']::attraction_category[],
      'Parque aquático do resort Atlantis, na Palm Jumeirah, com mais de '
      || '105 toboáguas, piscinas e 1 km de praia particular. Destaques: a '
      || 'Torre de Netuno, com trecho vertical dentro de um aquário onde é '
      || 'possível ver peixes, arraias e tubarões; a Torre de Poseidon, '
      || 'com vários toboáguas; o Aquaconda, um dos maiores toboáguas do '
      || 'mundo; e o Torrent River, ideal para quem só quer relaxar numa '
      || 'boia.',
      'Compre os ingressos online no site do hotel para evitar filas. '
      || 'Leve toalha própria para não pagar aluguel. Pegue um mapa na '
      || 'bilheteria, o parque é imenso. Fique para o pôr-do-sol.',
      true, false
    ),
    (
      'The Lost Chambers Aquarium', 'the-lost-chambers-aquarium',
      array['museu', 'passeio']::attraction_category[],
      'Aquário temático na lenda da cidade perdida de Atlantis, dentro do '
      || 'resort. Não é muito grande, cerca de uma hora é suficiente para '
      || 'uma boa visita.',
      'Visite depois de um dia no Aquaventure, já que o aquário fecha '
      || 'mais tarde.',
      false, false
    ),
    (
      'Burj Khalifa', 'burj-khalifa',
      array['ponto_turistico']::attraction_category[],
      'O prédio mais alto do mundo, inaugurado em 2010, com 828 metros de '
      || 'altura e 160 andares. Três pontos de observação (124º, 125º e '
      || '148º andares) com vista de 360 graus de Dubai, alcançando até as '
      || 'águas do golfo Pérsico.',
      'Bilheteria e acesso dentro do Dubai Mall. Horário não-nobre (mais '
      || 'barato) das 9h às 15h30 e das 19h à meia-noite; horário nobre '
      || 'das 16h às 18h30. Ingressos: 159 AED adulto e 124 AED criança.',
      false, false
    ),
    (
      'Dubai Mall', 'dubai-mall', array['compras']::attraction_category[],
      'O maior shopping do mundo, com mais de 1.200 lojas. Mesmo sem '
      || 'comprar nada vale visitar: o Dubai Aquarium (visível de graça '
      || 'por uma parede de vidro gigante), a Dubai Fountain (com shows '
      || 'diários, os melhores à noite a partir das 18h a cada 30 '
      || 'minutos), as Dubai Mall Waterfalls (24 m de altura), a pista de '
      || 'patinação Dubai Ice Rink e o esqueleto de dinossauro Dubai Dino.',
      'Show da fonte de sábado a quinta às 13h e 13h30, sexta às 13h30 e '
      || '14h. Horário do shopping: segunda a quinta das 10h às 23h, '
      || 'sexta a domingo das 10h à meia-noite.',
      false, false
    ),
    (
      'Dubai Marina', 'dubai-marina', array['ponto_turistico', 'natureza']::attraction_category[],
      'Clima tranquilo e orla conhecida como The Walk, à beira do maior '
      || 'canal artificial do mundo. Bom lugar para passeio de barco, '
      || 'bicicleta ou caminhada pelos cafés e restaurantes, com vista '
      || 'para um dos maiores conjuntos de prédios do mundo. A praia The '
      || 'Beach fica dentro do JBR (Jumeirah Beach Residence).',
      'É comum ver carros de luxo (Lamborghinis, Maseratis, Ferraris) por '
      || 'ali. Também são oferecidos passeios de camelo na praia.',
      false, false
    ),
    (
      'Burj Al Arab Jumeirah', 'burj-al-arab-jumeirah',
      array['hotel', 'restaurante']::attraction_category[],
      'Um dos marcos mais famosos de Dubai: o único hotel 7 estrelas do '
      || 'mundo, em forma de vela, construído em ilha própria, com 321 m '
      || 'de altura. Quem não se hospeda pode conhecer no chá da tarde ou '
      || 'no jantar.',
      'Chá da tarde das 15h às 18h (590 AED com champanhe, 490 AED sem). '
      || 'Almoço ou jantar à la carte a partir das 12h, com gasto mínimo '
      || 'de 200 AED por pessoa. Reserva necessária. Preços salgados, mas '
      || 'é a forma de conhecer sem se hospedar.',
      false, true
    ),
    (
      'Burj Al Arab Beach', 'burj-al-arab-beach', array['natureza']::attraction_category[],
      'Praia pública ao lado do Burj Al Arab, boa para apreciar a vista '
      || 'do hotel. Trecho pequeno, dividido entre banhistas e surfistas.',
      'É permitido usar roupa de banho normal, mas ela não é permitida '
      || 'fora do ambiente à beira-mar.',
      false, false
    ),
    (
      'Safári pelo Deserto de Dubai', 'safari-deserto-dubai',
      array['passeio', 'natureza']::attraction_category[],
      'Passeio pelo deserto que cerca a cidade em veículo 4x4.',
      null, false, false
    ),
    (
      'Corniche Road', 'corniche-road-abu-dhabi', array['natureza', 'passeio']::attraction_category[],
      'Avenida com mais de 8 km na faixa litorânea de Abu Dhabi, com '
      || 'parques, praia, calçadão com ciclovia à beira-mar, cafés, '
      || 'restaurantes e alguns dos maiores edifícios da cidade.',
      null, false, false
    ),
    (
      'Emirates Palace', 'emirates-palace', array['hotel', 'ponto_turistico']::attraction_category[],
      'Hotel 5 estrelas luxuoso às margens do golfo Pérsico, perto do '
      || 'shopping Abu Dhabi Marina Mall.',
      null, false, false
    ),
    (
      'Heritage Village', 'heritage-village-abu-dhabi', array['ponto_turistico', 'museu']::attraction_category[],
      'Recria um antigo vilarejo árabe, com souk, feira de artesanato, '
      || 'museu e camelos.',
      null, false, false
    ),
    (
      'Museu Guggenheim Abu Dhabi', 'museu-guggenheim-abu-dhabi', array['museu']::attraction_category[],
      null, null, false, false
    ),
    (
      'Louvre Abu Dhabi', 'louvre-abu-dhabi', array['museu']::attraction_category[],
      null, null, false, false
    ),
    (
      'Ferrari World', 'ferrari-world-abu-dhabi', array['passeio']::attraction_category[],
      'Na Yas Island, é o maior parque coberto do mundo, com atrações '
      || 'inspiradas no universo Ferrari. Vinte atrações ao todo, a '
      || 'maioria em ambiente totalmente climatizado. Destaques: G-Force, '
      || 'elevador de queda livre com 62 m de altura; Fiorano GT '
      || 'Challenge, montanha-russa dupla com carrinhos duelando lado a '
      || 'lado; e Formula Rossa, a montanha-russa mais rápida do mundo, '
      || 'atingindo 240 km/h.',
      'Estacionamento gratuito e enorme: tire foto de onde deixou o '
      || 'carro. Ingressos: 310 AED por pessoa. Aberto das 11h às 20h em '
      || 'julho e agosto.',
      false, false
    ),
    (
      'Yas Marina Circuit', 'yas-marina-circuit', array['passeio']::attraction_category[],
      'O mais luxuoso autódromo do mundo, sede do Grande Prêmio de Abu '
      || 'Dhabi de Fórmula 1, cercado por canais artificiais, marinas e '
      || 'hotéis. Oferece experiências em carro de corrida de assento '
      || 'único (Fórmula Yas 3000).',
      'Consulte no site o cronograma de dias e horários disponíveis para '
      || 'as experiências.',
      false, false
    )
) as item(
  name, slug, categories, description, important_tips,
  requires_advance_purchase, requires_reservation
)
where cities.slug = case
  when item.slug in (
    'corniche-road-abu-dhabi', 'emirates-palace', 'heritage-village-abu-dhabi',
    'museu-guggenheim-abu-dhabi', 'louvre-abu-dhabi', 'ferrari-world-abu-dhabi',
    'yas-marina-circuit'
  ) then 'abu-dhabi'
  else 'dubai'
end
on conflict (slug) do nothing;

insert into travel_tips (category, title, content, "order")
values
  (
    'Dubai e Abu Dhabi',
    'Moeda, fuso e clima nos **Emirados Árabes**',
    'A moeda oficial é o dirham (AED); em julho de 2026, 1 AED valia '
    || 'cerca de R$ 1,36. Os Emirados Árabes Unidos estão 7 horas à frente '
    || 'de Brasília. Julho é o auge do calor, com médias entre 25°C e '
    || '40°C e chuva praticamente nula; os meses mais agradáveis vão de '
    || 'outubro a abril. Valores de referência da época da pesquisa, '
    || 'sujeitos a alteração.',
    1
  ),
  (
    'Dubai e Abu Dhabi',
    'A regra de vestimenta que **pega turistas de surpresa**',
    'A maior parte dos emiráticos veste trajes tradicionais e pode se '
    || 'sentir incomodada com roupas muito ousadas. É recomendável cobrir '
    || 'ombros e joelhos, evitando transparências e decotes excessivos; '
    || 'nas mesquitas o uso do véu é obrigatório para mulheres. Já nas '
    || 'praias, parques aquáticos e piscinas, trajes de banho ocidentais '
    || '(inclusive biquínis) são aceitos normalmente.',
    2
  ),
  (
    'Dubai e Abu Dhabi',
    'Álcool e comportamento em **público**',
    'O consumo de álcool é permitido só para não-muçulmanos, em '
    || 'restaurantes, bares e espaços licenciados, a partir de 21 anos; a '
    || 'venda é restrita a poucos estabelecimentos. Em público, beijos e '
    || 'abraços não são bem vistos (andar de mãos dadas é tolerado), e '
    || 'nunca se deve fotografar moradores locais sem consentimento: os '
    || 'Emirados têm leis severas de proteção à imagem e privacidade.',
    3
  ),
  (
    'Dubai e Abu Dhabi',
    'A carteira de motorista brasileira **não é aceita**',
    'Para alugar carro nos Emirados é preciso a Permissão Internacional '
    || 'para Dirigir (PID), já que a CNH brasileira sozinha não é aceita. '
    || 'A emissão pelo Detran-SP custa cerca de R$ 362,67 e o documento '
    || 'físico chega em até 14 dias úteis pelo correio: solicite com '
    || 'antecedência.',
    4
  )
on conflict do nothing;
