-- Gramado: novas atrações (pontos turísticos, parques, passeios, restaurantes temáticos), todas como rascunho e sem fotos.
-- A autora vai enviar as fotos pessoais depois. A experiência pessoal (personal_experience) fica em branco de propósito.
-- Já existiam e NÃO são recriados: Kongo Pizzaria Temática, Natal Luz de Gramado, Chocolates Prawer (loja e fábrica),
-- Chocolate Lugano (loja da Av. Borges de Medeiros, 2529; o Mundo de Chocolate é outro lugar) e Bustour Illumination Show.
insert into attractions (city_id, name, slug, categories, description, important_tips, average_visit_time, best_time_of_day, best_season, recommended_audience, weather_sensitive, has_air_conditioning, intense_physical_effort, requires_advance_purchase, requires_reservation, latitude, longitude, status)
select c.id, v.name, v.slug, v.cats, v.d, v.tips, v.visit, v.best, v.season, v.aud, v.ws, v.ac, v.eff, v.adv, v.res, v.la, v.lo, v.st::country_status
from cities c cross join (values
-- 1. Pontos turísticos e fotografia
($$Rua Coberta$$, $$rua-coberta-gramado$$, array['ponto_turistico']::attraction_category[], $$A **Rua Coberta** é uma rua de pedestres coberta no centro de Gramado, entre a **Avenida Borges de Medeiros** e a **Rua Garibaldi**, bem em frente ao Palácio dos Festivais. São cerca de 100 metros de extensão ocupados por restaurantes, cafés e lojas, um passeio a pé que funciona bem mesmo em dia de chuva.

É um dos cenários mais fotografados da cidade e um dos palcos do **Natal Luz**: na programação gratuita do evento há apresentações musicais e culturais na Rua Coberta ao entardecer e à noite. Durante o Festival de Cinema, o tapete vermelho liga o Palácio dos Festivais à rua.

Uma boa sugestão é passar uma vez de dia, para ver as vitrines com calma, e voltar à noite, quando a decoração e a programação ganham vida.

Verifique a programação atualizada nos canais oficiais do Natal Luz: https://natalluzdegramado.com.br$$, $$✓ A entrada é livre e a rua fica no caminho a pé entre a [Praça Major Nicoletti](https://www.poraquipelomundo.com/brasil/gramado/praca-major-nicoletti-gramado) e o [Palácio dos Festivais](https://www.poraquipelomundo.com/brasil/gramado/palacio-dos-festivais-gramado).
✓ A programação gratuita do Natal Luz é sazonal: os horários e as atrações mudam a cada edição, então confirme no site oficial.
✓ Por ser coberta, funciona em dias de chuva e de frio, mas o movimento é grande à noite e em feriados.
✓ Para fotos mais limpas, vá logo cedo, antes de as lojas e os restaurantes encherem.
✓ Site oficial do Natal Luz, com a programação do evento: https://natalluzdegramado.com.br$$, $$30 minutos a 1 hora$$, $$Fim de tarde e noite$$, $$O ano todo, com programação especial no Natal Luz$$, $$Famílias, casais e quem gosta de passear a pé$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Rua Torta$$, $$rua-torta-gramado$$, array['ponto_turistico']::attraction_category[], $$A **Rua Torta** é uma das ruas mais fotografadas de Gramado: a Rua Emílio Sorgetz, no centro, perto da Avenida Borges de Medeiros, com **traçado sinuoso** que desce em curvas entre casas, jardins e floreiras.

O apelido vem justamente do desenho torto da via, e o cenário é de cartão-postal, principalmente em dia de sol ou com a decoração natalina. Em 2022, a chocolateria Lugano abriu uma unidade na esquina, com jardim e vista para a avenida.

Vale como parada rápida dentro de um passeio a pé pelo centro, a poucos passos da Praça das Etnias.

Verifique informações sobre a cidade nos canais oficiais de turismo: https://www.gramado.rs.gov.br$$, $$✓ A rua é pública, sem ingresso, e fica a poucos passos da [Praça das Etnias](https://www.poraquipelomundo.com/brasil/gramado/praca-das-etnias-gramado).
✓ Há calçadas, mas o traçado sinuoso e a inclinação deixam alguns trechos irregulares: use calçado confortável.
✓ Com carrinho de bebê ou cadeira de rodas, vale avaliar o percurso antes, por causa da inclinação.
✓ Cuidado ao fotografar na pista: os carros também passam pela rua.
✓ Site da Prefeitura de Gramado: https://www.gramado.rs.gov.br$$, $$15 a 30 minutos$$, $$Manhã$$, $$O ano todo$$, $$Famílias, casais e quem gosta de fotografia$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Igreja Matriz São Pedro$$, $$igreja-matriz-sao-pedro-gramado$$, array['ponto_turistico']::attraction_category[], $$A **Igreja Matriz São Pedro** (Paróquia São Pedro Apóstolo) fica na **Avenida Borges de Medeiros**, ao lado da Praça Major Nicoletti, e é um dos cartões-postais de Gramado. A construção é em **pedra basáltica** e se destaca pela torre e pelos vitrais, que têm desenhos atribuídos ao artista alemão Peter Dobmeier.

À noite, a igreja ganha iluminação especial e fica ainda mais bonita nas fotos, principalmente com a decoração do Natal Luz ao redor. Também é possível assistir à missa, respeitando o silêncio e o horário das celebrações.

As fontes divergem quanto ao ano de início da obra e à altura da torre, por isso esses dados não são citados aqui. Para detalhes históricos, consulte a paróquia ou a Prefeitura.

Verifique os horários de missas e visitação nos canais da paróquia e nos canais oficiais de turismo: https://www.gramado.rs.gov.br$$, $$✓ A entrada é livre, mas é um templo em funcionamento: vá com roupa adequada e respeite as celebrações.
✓ Confirme com a paróquia os horários de missas e de visitação, porque não há um horário único divulgado.
✓ O melhor momento para fotos é o fim de tarde e a noite, com a fachada iluminada.
✓ Fica ao lado da [Fonte do Amor Eterno](https://www.poraquipelomundo.com/brasil/gramado/fonte-do-amor-eterno-gramado) e da [Praça Major Nicoletti](https://www.poraquipelomundo.com/brasil/gramado/praca-major-nicoletti-gramado).
✓ Site da Prefeitura de Gramado: https://www.gramado.rs.gov.br$$, $$15 a 30 minutos$$, $$Fim de tarde e noite$$, $$O ano todo$$, $$Famílias, casais e quem gosta de arquitetura$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Fonte do Amor Eterno$$, $$fonte-do-amor-eterno-gramado$$, array['ponto_turistico']::attraction_category[], $$A **Fonte do Amor Eterno** fica na Avenida Borges de Medeiros, 2659, no centro, ao lado da **Igreja Matriz São Pedro**, na Praça Major Nicoletti. É um dos pontos preferidos dos casais de Gramado.

A fonte é inspirada na Fontana di Trevi, de Roma, e o costume é o casal prender um **cadeado com as iniciais gravadas** nas grades ao redor, como promessa de amor. Há milhares de cadeados no local, e várias lojas próximas vendem o seu.

O acesso é livre e a praça funciona bem para um passeio sem pressa, com fotos da fonte e da igreja ao fundo.

Verifique informações atualizadas nos canais oficiais de turismo: https://www.gramado.rs.gov.br$$, $$✓ O acesso é gratuito e livre, sem horário de funcionamento: a fonte fica na praça, ao ar livre.
✓ Se quiser deixar o seu cadeado, leve um já gravado ou compre em uma das lojas próximas.
✓ Evite os horários de pico no fim de semana e à noite, quando a praça fica muito cheia para fotos.
✓ Aproveite para ver a [Igreja Matriz São Pedro](https://www.poraquipelomundo.com/brasil/gramado/igreja-matriz-sao-pedro-gramado) iluminada, logo ao lado.
✓ Site da Prefeitura de Gramado: https://www.gramado.rs.gov.br$$, $$15 a 30 minutos$$, $$Fim de tarde e noite$$, $$O ano todo$$, $$Casais e famílias$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Palácio dos Festivais$$, $$palacio-dos-festivais-gramado$$, array['ponto_turistico','museu']::attraction_category[], $$O **Palácio dos Festivais** fica na Avenida Borges de Medeiros, no centro de Gramado, e é a sede do **Festival de Cinema de Gramado**. A estrutura, de estilo colonial, tem a fachada ornamentada pelo **Kikito**, o troféu do festival, criado pela artista Elisabeth Rosenfeld. A sala de projeção tem capacidade para cerca de **1.100 lugares**.

Fora do festival, o palácio recebe exibições de filmes e espetáculos ao longo do ano, e abriga o Museu do Festival de Cinema de Gramado. Durante o Natal Luz, também recebe apresentações da programação do evento. Na época do festival, o tapete vermelho liga o palácio à Rua Coberta.

Uma boa sugestão é visitar à noite, quando a fachada fica iluminada, e conferir a programação do dia, que pode incluir sessões e espetáculos.

Verifique a programação e os ingressos no site oficial do Festival: https://festivaldegramado.net$$, $$✓ A fachada pode ser vista e fotografada a qualquer hora, de graça. Sessões, espetáculos e o museu têm programação própria, então confirme a abertura do dia.
✓ O festival acontece em agosto, mas as datas mudam a cada edição. A edição de 2026 foi de 12 a 22 de agosto.
✓ Durante o festival, ingressos para as sessões noturnas são vendidos pelo site oficial e esgotam rápido.
✓ Fica a poucos passos da [Rua Coberta](https://www.poraquipelomundo.com/brasil/gramado/rua-coberta-gramado) e da [Praça Major Nicoletti](https://www.poraquipelomundo.com/brasil/gramado/praca-major-nicoletti-gramado).
✓ Site oficial do Festival de Cinema de Gramado: https://festivaldegramado.net$$, $$20 a 40 minutos$$, $$Noite$$, $$O ano todo, com movimento maior em agosto e no Natal Luz$$, $$Famílias, casais e quem gosta de cinema$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Estátua do Kikito e Rótula das Bandeiras$$, $$estatua-do-kikito-rotula-das-bandeiras$$, array['ponto_turistico']::attraction_category[], $$A **Estátua do Kikito**, na **Rótula das Bandeiras**, é uma réplica gigante do troféu do Festival de Cinema de Gramado, colocada em um jardim florido na Praça Leopoldo Rosenfeldt, na Avenida Borges de Medeiros, perto da rodoviária. É um dos primeiros pontos de fotografia de quem chega à cidade.

O **Kikito** é o prêmio máximo do **Festival de Cinema de Gramado**, o mais importante festival de cinema do Brasil. A estatueta representa o "deus do bom humor", mede 33 centímetros e foi criada pela artesã gramadense Elisabeth Rosenfeld, que também deu o nome ao troféu. Antes de virar o prêmio do festival, o Kikito era o símbolo da cidade. Até 1989 era feito de madeira imbuia; hoje é fabricado em bronze.

O festival, que acontece no Palácio dos Festivais, teve sua primeira edição oficializada em janeiro de 1973 e, desde a edição de 1992, é o Festival de Cinema Brasileiro e Latino.

Verifique informações do festival no site oficial: https://festivaldegramado.net$$, $$✓ A estátua fica em uma rótula de trânsito intenso: fotografe pela praça e com cuidado ao atravessar.
✓ O acesso é livre e gratuito, a qualquer hora, mas a luz do fim de tarde é a melhor para fotos.
✓ Para entender a história do troféu, conheça também o [Palácio dos Festivais](https://www.poraquipelomundo.com/brasil/gramado/palacio-dos-festivais-gramado) e o [Festival de Cinema de Gramado](https://www.poraquipelomundo.com/brasil/gramado/festival-de-cinema-de-gramado).
✓ Site oficial do Festival de Cinema de Gramado: https://festivaldegramado.net$$, $$10 a 15 minutos$$, $$Fim de tarde$$, $$O ano todo$$, $$Famílias, casais e quem gosta de cinema$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Praça das Etnias$$, $$praca-das-etnias-gramado$$, array['ponto_turistico']::attraction_category[], $$A **Praça das Etnias** fica no centro de Gramado, perto da rodoviária, e homenageia os povos que formaram a cidade. Ali ficam **casas coloniais** que representam as culturas alemã, italiana e portuguesa, algumas funcionando como pequenos museus, de entrada gratuita. Um dos museus é mantido por uma associação de imigrantes italianos da região de Trento.

A praça recebe eventos sazonais, como a Vila de Páscoa e, segundo a programação do **Natal Luz**, a Vila de Natal, com feirinha de artesanato e atrações ao longo do dia.

É um passeio curto e tranquilo para quem quer conhecer a história da imigração em Gramado sem pagar ingresso.

Verifique informações atualizadas nos canais oficiais de turismo: https://www.gramado.rs.gov.br$$, $$✓ A praça e as casas coloniais têm entrada gratuita, mas os horários de cada casa podem variar: confirme no local ou com a Prefeitura.
✓ A programação sazonal (Páscoa e Natal) muda a cada edição: consulte a programação oficial do [Natal Luz de Gramado](https://www.poraquipelomundo.com/brasil/gramado/natal-luz-de-gramado).
✓ Fica perto da [Rua Torta](https://www.poraquipelomundo.com/brasil/gramado/rua-torta-gramado), então os dois pontos combinam em um passeio a pé.
✓ Com crianças, é um passeio leve, com espaço para brincar e caminhar.
✓ Site da Prefeitura de Gramado: https://www.gramado.rs.gov.br$$, $$30 minutos a 1 hora$$, $$Manhã$$, $$O ano todo, com programação especial na Páscoa e no Natal Luz$$, $$Famílias e quem gosta de história$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Praça Major Nicoletti$$, $$praca-major-nicoletti-gramado$$, array['ponto_turistico']::attraction_category[], $$A **Praça Major Nicoletti** é o coração do centro de Gramado, na região onde se encontram a **Avenida Borges de Medeiros** e a Avenida das Hortênsias. Ali ficam a **Igreja Matriz São Pedro**, a **Fonte do Amor Eterno**, o Palácio dos Festivais e a entrada da Rua Coberta, tudo a poucos passos.

A praça leva o nome do major José Nicoletti Filho, apontado pelas fontes como o primeiro administrador de Gramado, e é o melhor ponto de partida para um passeio a pé pelo centro. Durante o Natal Luz, a região recebe a decoração e parte da programação do evento.

Uma boa sugestão é começar por aqui, seguir até a Rua Coberta e terminar a caminhada pela avenida principal.

Verifique informações atualizadas nos canais oficiais de turismo: https://www.gramado.rs.gov.br$$, $$✓ O acesso é livre e gratuito, a qualquer hora.
✓ Concentra a [Igreja Matriz São Pedro](https://www.poraquipelomundo.com/brasil/gramado/igreja-matriz-sao-pedro-gramado), a [Fonte do Amor Eterno](https://www.poraquipelomundo.com/brasil/gramado/fonte-do-amor-eterno-gramado), o [Palácio dos Festivais](https://www.poraquipelomundo.com/brasil/gramado/palacio-dos-festivais-gramado) e a [Rua Coberta](https://www.poraquipelomundo.com/brasil/gramado/rua-coberta-gramado).
✓ Estacionar no centro é difícil em feriados e no Natal Luz: deixe o carro no hotel ou em um estacionamento e caminhe.
✓ O movimento é maior no fim de tarde e à noite.
✓ Site da Prefeitura de Gramado: https://www.gramado.rs.gov.br$$, $$30 minutos a 1 hora$$, $$Fim de tarde e noite$$, $$O ano todo$$, $$Famílias, casais e quem gosta de passear a pé$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Avenida Borges de Medeiros$$, $$avenida-borges-de-medeiros-gramado$$, array['ponto_turistico','compras']::attraction_category[], $$A **Avenida Borges de Medeiros** é a principal avenida de Gramado e o melhor lugar para entender a cidade a pé. Ao longo dela ficam lojas de chocolate, restaurantes temáticos, a **Aldeia do Papai Noel**, o **Mundo de Chocolate**, a Fonte do Amor Eterno, o Palácio dos Festivais e a Igreja Matriz.

No fim do ano, a avenida ganha uma sequência de pinheiros natalinos e recebe a Parada de Natal, dentro da programação do **Natal Luz**. Nos demais períodos, é um passeio de vitrines, cafés e fotos, com arquitetura de inspiração europeia.

Uma boa sugestão é caminhar o trecho central de dia, para as lojas, e voltar à noite, para a iluminação.

Verifique informações atualizadas nos canais oficiais de turismo: https://www.gramado.rs.gov.br$$, $$✓ O passeio é gratuito: gaste só com as lojas, os restaurantes e as atrações que escolher.
✓ A programação do Natal Luz (pinheiros e Parada de Natal) é sazonal: confirme o calendário no site oficial do evento, https://natalluzdegramado.com.br.
✓ Atrações no trecho central: [Aldeia do Papai Noel](https://www.poraquipelomundo.com/brasil/gramado/aldeia-do-papai-noel-gramado), [Mundo de Chocolate Lugano](https://www.poraquipelomundo.com/brasil/gramado/mundo-de-chocolate-lugano) e [Hector Dragão](https://www.poraquipelomundo.com/brasil/gramado/hector-dragao-gramado).
✓ Em feriados e no Natal Luz, o trânsito fica lento: prefira caminhar e usar aplicativo de transporte.
✓ Site da Prefeitura de Gramado: https://www.gramado.rs.gov.br$$, $$1 a 3 horas$$, $$Fim de tarde e noite$$, $$O ano todo, com decoração especial no Natal Luz$$, $$Famílias, casais e quem gosta de passear e comprar$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Pórticos de Gramado$$, $$porticos-de-gramado$$, array['ponto_turistico']::attraction_category[], $$Os **Pórticos de Gramado** são os dois portais que recebem quem chega à cidade e viraram símbolos dela. O da estrada que vem de **Nova Petrópolis** (RS-235) é de estilo **bávaro** e foi inaugurado em 6 de janeiro de 1973, na gestão do prefeito Horst Volk, com projeto do arquiteto Guinther Schlieper. O da estrada que vem de **Taquara** (RS-115) é de estilo **normando**, inaugurado em 1991 ou 1992, conforme a fonte, na região de Várzea Grande.

São paradas rápidas para a foto de chegada, e combinam com quem entra pela Rota Romântica ou pela subida da serra.

Verifique informações atualizadas nos canais oficiais de turismo: https://www.gramado.rs.gov.br$$, $$✓ Os pórticos ficam em rodovias movimentadas: pare só onde houver acostamento ou área de parada e tenha cuidado ao atravessar.
✓ O acesso é gratuito e livre, a qualquer hora.
✓ O pórtico da RS-115 fica a cerca de 700 metros do GramadoZoo, na mesma região.
✓ O melhor momento para fotos é de manhã ou no fim de tarde, com a luz mais suave.
✓ Site da Prefeitura de Gramado: https://www.gramado.rs.gov.br$$, $$10 a 20 minutos$$, $$Manhã e fim de tarde$$, $$O ano todo$$, $$Famílias e quem gosta de fotografia$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Mirante do Vale do Quilombo$$, $$mirante-do-vale-do-quilombo$$, array['natureza','ponto_turistico']::attraction_category[], $$O **Mirante do Vale do Quilombo**, também chamado de **Belvedere**, fica na Avenida das Hortênsias, no caminho entre Gramado e Canela, e é uma parada gratuita com vista aberta para o vale e a mata. O acesso é fácil, de carro ou a pé a partir do centro.

É um bom lugar para fotos, principalmente de manhã e no fim de tarde, e para uma pausa rápida entre as atrações da avenida. O local é aberto e costuma ventar bastante.

As fontes divergem quanto ao número exato do endereço (2536 ou 2565, na Avenida das Hortênsias), então confira no mapa antes de sair.

Verifique informações atualizadas nos canais oficiais de turismo: https://www.gramado.rs.gov.br$$, $$✓ O acesso é livre e gratuito. Por ser uma área aberta, a tendência é não ter horário de funcionamento, mas isso não foi confirmado oficialmente.
✓ Leve um agasalho: venta bastante no local.
✓ Há pouco espaço para estacionar: pare com cuidado, porque o mirante fica à beira da rodovia.
✓ Se for a pé a partir da Avenida Borges de Medeiros, o trecho até o mirante leva cerca de 5 a 10 minutos de caminhada, segundo guias de viagem.
✓ Site da Prefeitura de Gramado: https://www.gramado.rs.gov.br$$, $$15 a 30 minutos$$, $$Manhã e fim de tarde$$, $$O ano todo, em dias de céu aberto$$, $$Famílias, casais e quem gosta de fotografia$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
-- 2. Parques e experiências
($$Mini Mundo$$, $$mini-mundo-gramado$$, array['parque_tematico','ponto_turistico']::attraction_category[], $$O **Mini Mundo** é um parque de **construções em miniatura**, na Rua Horácio Cardoso, 291, no bairro Planalto, em Gramado. Reúne réplicas de prédios e de cenas de cidades e de vilas, com trens, carrinhos e personagens, e uma **Vila dos Imigrantes** que conta a história da colonização da região.

O parque funciona todos os dias, das 9h às 17h, segundo as informações mais recentes encontradas, e a visita leva de 1h30 a 3 horas, dependendo do ritmo. É um programa que agrada crianças e adultos e tem muitos detalhes escondidos para descobrir.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://www.minimundo.com.br$$, $$✓ O parque abre todos os dias, das 9h às 17h, mas confirme no site oficial, porque os horários podem mudar por temporada.
✓ Os valores variam por época e por forma de compra: consulte o preço atual no site oficial. Há descontos para estudantes e crianças mediante documento, e crianças de até 2 anos não pagam, segundo guias locais.
✓ Chegue na abertura para fugir da maior movimentação.
✓ O parque não tem estacionamento próprio, mas há estacionamento privado em frente.
✓ Site oficial: https://www.minimundo.com.br$$, $$1h30 a 3 horas$$, $$Manhã$$, $$O ano todo$$, $$Famílias com crianças$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Snowland$$, $$snowland-gramado$$, array['parque_tematico','passeio']::attraction_category[], $$O **Snowland** é um parque de **neve de verdade**, na RS-235, 9009, bairro Carazal, a cerca de 7 km do centro de Gramado, na saída para Nova Petrópolis. O ingresso inclui a **Montanha de Neve**, a patinação no gelo, o tubing e o empréstimo de roupas de neve, segundo guias e revendedores. Esqui e snowboard são cobrados à parte.

O site oficial informa que não há idade mínima para entrar, e que crianças até 3 anos e 11 meses não pagam.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://www.snowland.com.br$$, $$✓ Funciona de quinta a terça, das 10h às 17h (fechado às quartas), segundo o site. Na alta temporada (julho e de 12 de dezembro a 1º de janeiro) o horário é de 12h às 17h, e as atrações encerram cerca de 30 minutos antes do fechamento.
✓ É preciso apresentar documento original com foto na bilheteria, e menores de 18 anos devem estar acompanhados de um responsável adulto.
✓ A entrada com alimentos perecíveis não é permitida.
✓ O ingresso comum não inclui esqui e snowboard: confirme o que está incluso antes de comprar.
✓ Há revendedores com horários de entrada definidos (por exemplo, entre 11h e 14h): confirme a regra do ingresso que comprar.
✓ Site oficial: https://www.snowland.com.br$$, $$3 a 4 horas$$, $$Tarde$$, $$O ano todo$$, $$Famílias com crianças e adolescentes$$, false, false, false, true, false, null::numeric, null::numeric, 'draft'),
($$Le Jardin Parque de Lavanda$$, $$le-jardin-parque-de-lavanda$$, array['natureza','ponto_turistico']::attraction_category[], $$O **Le Jardin Parque de Lavanda** é um jardim de lavandas e flores na Rodovia RS-115, nº 37700, na região de Várzea Grande, na entrada de Gramado. O parque tem cerca de 20 anos e funciona como um refúgio de perfumes e jardins, com estufas, café e lojas de produtos de lavanda.

A lavanda floresce principalmente entre **outubro e dezembro**, segundo a maioria dos guias (algumas fontes citam de setembro a novembro, e a época muda com a temperatura de cada ano). O jardim tem flores o ano todo.

O Le Jardin também tem a Loja Temática, a Boutique no Centro e um bistrô.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://www.lavandas.com.br$$, $$✓ Guias indicam funcionamento de terça a domingo, das 9h30 às 17h30 (última entrada por volta das 17h20), com as estufas e o café fechando às 17h. Confirme os dias no site oficial.
✓ O site oficial tem página de ingressos: consulte o valor atual, porque as fontes de terceiros trazem preços muito diferentes.
✓ Grupos acima de 12 pessoas devem agendar a visita com antecedência.
✓ Para ver as lavandas floridas, programe a visita entre outubro e dezembro, de preferência em dia de sol.
✓ Site oficial: https://www.lavandas.com.br$$, $$1 a 2 horas$$, $$Manhã$$, $$Primavera (outubro a dezembro), mas há flores o ano todo$$, $$Famílias, casais e quem gosta de fotografia$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Olivas de Gramado$$, $$olivas-de-gramado$$, array['passeio','natureza']::attraction_category[], $$O **Parque Olivas de Gramado** fica na área rural da cidade, na Rua Vereador José Alexandre Benetti, 1808, em Linha Nova, a cerca de **14 km de asfalto** do centro. O parque está no alto de um canyon, cercado de Mata Atlântica, e combina **azeite de oliva, gastronomia e natureza**.

Entre as experiências do site oficial estão a **Azeiteria**, a **Trattoria**, o pôr do sol no Olivas Sunset, a degustação sensorial, a Bike Voadora, a fazendinha, o passeio a cavalo, o tour rural, as trilhas, a oliveira centenária, o Bosque Encantado e a Casa do Hobbit.

Os azeites do parque já receberam premiações, e a loja vende azeites e cosméticos.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://olivasdegramado.com.br$$, $$✓ A página inicial do site informa funcionamento de quinta a terça, das 10h às 18h, com o parque e todas as atrações fechados às quartas. A página de localização traz outro horário (diariamente das 10h30 às 18h): confirme antes de ir.
✓ O acesso é por estrada de asfalto, com paisagem rural no caminho, e o trajeto é parte do passeio.
✓ As atrações têm cobrança e regras próprias: veja o que está incluso no ingresso do parque no site oficial.
✓ Para o pôr do sol, confira o horário e se há reserva para o Olivas Sunset.
✓ Site oficial: https://olivasdegramado.com.br$$, $$Meio período a dia inteiro$$, $$Fim de tarde$$, $$O ano todo$$, $$Famílias, casais e quem gosta de gastronomia e natureza$$, true, false, false, false, false, -29.328820::numeric, -50.925407::numeric, 'draft'),
($$Aldeia do Papai Noel$$, $$aldeia-do-papai-noel-gramado$$, array['parque_tematico','ponto_turistico']::attraction_category[], $$A **Aldeia do Papai Noel** é um parque natalino que fica aberto o ano todo, na Rua Borges de Medeiros, 2.300, no centro de Gramado. O site oficial a apresenta como o único parque natalino aberto o ano todo no hemisfério Sul.

O espaço mostra o dia a dia da fábrica do Papai e da Mamãe Noel, com atrações como o **Expresso Natalino**, o **Bosque Gelado**, a **Central de Cartas**, o **Ateliê da Mamãe Noel**, a **Máquina de Bolinhas**, o **Natalímetro**, o **Laboratório de Guloseimas**, a **Oficina de Presentes**, o **Escritório do Papai Noel**, o **Teleférico dos Desejos**, o **Monorail** e o **Trenó Voador**.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://aldeiadopapainoel.com.br$$, $$✓ O horário é diário, das 9h30 às 18h, e de novembro a janeiro das 9h30 às 19h, segundo o site oficial.
✓ O ingresso pode ser comprado pelo site oficial: confirme os tipos de ingresso e as regras para crianças antes de ir.
✓ Fica na avenida principal, então combina com um passeio a pé pelo centro e com a [Avenida Borges de Medeiros](https://www.poraquipelomundo.com/brasil/gramado/avenida-borges-de-medeiros-gramado).
✓ Em novembro, dezembro e janeiro o movimento é maior: prefira o começo da manhã.
✓ Site oficial: https://aldeiadopapainoel.com.br$$, $$1 a 2 horas$$, $$Manhã$$, $$O ano todo, com mais movimento de novembro a janeiro$$, $$Famílias com crianças$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Acquamotion$$, $$acquamotion-gramado$$, array['parque_aquatico']::attraction_category[], $$O **Acquamotion** é um parque aquático de **águas termais e temático**, na Estrada Municipal Linha Ávila, Rua Linha Carazal, 501, em Gramado, a cerca de 15 a 20 minutos de carro do centro. O endereço e o funcionamento aparecem no site oficial.

O parque combina piscinas aquecidas, toboáguas e áreas para crianças, em uma proposta para curtir mesmo nos meses frios. Os ingressos não incluem alimentação, bebidas nem toalha.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://acquamotion.com.br$$, $$✓ A maioria das fontes indica funcionamento das 10h às 18h. O site oficial informa que as cozinhas atendem até 17h e as piscinas e atrações fecham às 17h30.
✓ Os dias variam: guias citam abertura diária em dezembro, janeiro e julho, e de terça a domingo nos demais meses. Confira o calendário no site oficial.
✓ Crianças até 3 anos não pagam, segundo guias de viagem.
✓ Os preços variam muito por época e por revendedor, e a compra pelo site do parque costuma ser mais vantajosa que a bilheteria. A toalha tem custo à parte (cerca de R$ 70 na loja, segundo guias).
✓ Site oficial: https://acquamotion.com.br$$, $$Dia inteiro$$, $$Manhã$$, $$O ano todo$$, $$Famílias com crianças$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$GramadoZoo$$, $$gramadozoo$$, array['parque_tematico','natureza']::attraction_category[], $$O **GramadoZoo** funciona desde setembro de 2008 na ERS-115, km 35, em Várzea Grande, a 7 km do centro de Gramado e a 700 metros do pórtico de entrada da cidade. O zoológico tem **só animais da fauna brasileira** e substitui grades e jaulas por vidros blindados e grandes viveiros de imersão.

A visita é feita por uma **trilha única de 1.800 metros**, que passa por **34 viveiros**. No meio do caminho há uma lanchonete em forma de oca, com banheiros, fraldários e wi-fi. Bem-estar animal, pesquisa, educação e conservação ambiental são os pilares do projeto.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://gramadozoo.com.br$$, $$✓ De novembro de 2026 a março de 2027 o zoo abre diariamente, das 10h às 16h (último acesso), com algumas datas fechadas, como 25/12 e 25/01 (confira a lista no site).
✓ O site oficial informa ingresso único de R$ 115,00, crianças menores de 3 anos isentas e que não é necessário reservar.
✓ O estacionamento custa R$ 15,00. Há ônibus, táxi e aplicativos de transporte.
✓ O percurso é longo: leve água, use calçado confortável e reserve tempo para a lanchonete no meio da trilha.
✓ Site oficial: https://gramadozoo.com.br$$, $$2 a 3 horas$$, $$Manhã$$, $$O ano todo$$, $$Famílias com crianças$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Parque Lumni$$, $$parque-lumni-gramado$$, array['parque_tematico','passeio']::attraction_category[], $$O **Lumni Gramado** (Lumni Experience) é um parque de luzes para visitar à noite, na Rua Semilda Fisch Riegel, 2900, no bairro da Tapera, a cerca de 15 minutos de carro do centro. O ingresso dá acesso a **todas as atrações do parque**, incluindo a Área Kids, e à livre circulação nas áreas internas.

Entre as atrações estão o **Campo Iluminado**, o jardim de tulipas e o túnel iluminado. O Campo Iluminado funciona por até 4 horas a partir da abertura do parque, então chegar cedo ajuda.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://lumnigramado.com.br$$, $$✓ O horário de abertura muda por temporada (por exemplo, 19h30 de 1º de novembro a 31 de dezembro, e 20h em janeiro e fevereiro), e o parque encerra à meia-noite. Consulte o calendário no site, porque o parque pode não abrir em todos os dias.
✓ O ingresso é digital e não inclui consumo em restaurantes, lojas e serviços adicionais.
✓ Crianças até 3 anos e 11 meses não pagam, com documento. Os demais descontos exigem comprovação no dia.
✓ O estacionamento no local custa R$ 30,00, e os aplicativos de transporte funcionam normalmente.
✓ Promoções, como a entrada gratuita para crianças em outubro, são pontuais: confirme no site.
✓ Site oficial: https://lumnigramado.com.br$$, $$2 a 3 horas$$, $$Noite$$, $$O ano todo$$, $$Famílias, casais e adolescentes$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Dreamland Museu de Cera$$, $$dreamland-museu-de-cera-gramado$$, array['museu','parque_tematico']::attraction_category[], $$O **Dreamland Museu de Cera** foi inaugurado em 2009, em Gramado, como o segundo empreendimento do Grupo Dreams, e é apresentado como o **primeiro museu de cera da América Latina**. São mais de **100 personagens** em mais de 1.000 m² de cenários, com réplicas de personalidades nacionais e internacionais ligadas ao cinema, à música, ao esporte, à política e ao universo geek.

A proposta é a interação: o visitante pode posar ao lado dos personagens, como num tapete vermelho, e fazer fotos nos cenários.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://dreamland.com.br/gramado$$, $$✓ O site oficial informa funcionamento de domingo a quinta, das 8h às 18h30, e às sextas, sábados e feriados, das 8h às 19h.
✓ O ingresso é vendido pelo site oficial: veja as opções e os combos com outras atrações do Grupo Dreams.
✓ O museu é coberto, então funciona bem em dia de chuva ou de frio.
✓ Com crianças pequenas, vale conferir antes se há personagens que assustam.
✓ Site oficial: https://dreamland.com.br/gramado$$, $$1 a 2 horas$$, $$Tarde$$, $$O ano todo$$, $$Famílias, casais e grupos de amigos$$, false, true, false, false, false, null::numeric, null::numeric, 'draft'),
($$Hollywood Dream Cars$$, $$hollywood-dream-cars-gramado$$, array['museu','ponto_turistico']::attraction_category[], $$O **Hollywood Dream Cars** é um museu de carros e motos clássicos na Avenida das Hortênsias, 4151, no bairro Dutra, em Gramado. O tema é a Hollywood dos anos dourados, com mais de **30 carros e motos** de marcas famosas, entre eles raridades das décadas de 1920 a 1960.

O destaque é a **maior coleção de Cadillacs da América Latina**. A estrutura tem cerca de 1.000 metros de área de lazer. É uma atração do Grupo Dreams.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://hollywooddreamcars.com.br$$, $$✓ O site oficial informa atendimento todos os dias, das 9h às 17h30, e telefone (54) 3286-5100.
✓ O ingresso pode ser comprado pelo site oficial.
✓ É um passeio rápido e coberto, bom para quem gosta de carros e de cinema, e combina com o [Super Carros](https://www.poraquipelomundo.com/brasil/gramado/super-carros-gramado) e com o [Dreamland Museu de Cera](https://www.poraquipelomundo.com/brasil/gramado/dreamland-museu-de-cera-gramado).
✓ Site oficial: https://hollywooddreamcars.com.br$$, $$40 minutos a 1 hora$$, $$Tarde$$, $$O ano todo$$, $$Famílias, casais e apaixonados por carros e cinema$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Super Carros$$, $$super-carros-gramado$$, array['museu','passeio']::attraction_category[], $$O **Salão Super Carros** fica na Avenida das Hortênsias, 4635, bairro Carniel, na RS-235, a estrada entre Gramado e Canela. Reúne uma exposição de superesportivos e carros de coleção, como Porsche, McLaren, Lamborghini, Tesla, BMW, Chevrolet Camaro, Corvette, Dodge Challenger, Nissan GT-R e **Ferraris**.

Além da exposição, o salão oferece a **experiência de dirigir ou andar de carona** em alguns desses carros, em um trajeto pré-determinado de cerca de 10,5 km, que leva de 15 a 20 minutos, com um instrutor ao lado. A experiência de dirigir é vendida à parte, e os valores variam muito de carro para carro.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://www.supercarros.com.br$$, $$✓ O site oficial informa funcionamento diário, das 9h às 18h (alguns revendedores citam até as 19h): confirme no dia. O atendimento é pelo telefone (54) 98140-0063.
✓ O ingresso do salão e o drive experience são vendidos separadamente, e os valores do drive dependem do carro escolhido. Consulte a tabela atual no site oficial antes de decidir.
✓ Confira no site as exigências para pilotar (como habilitação) antes de comprar o passeio.
✓ É uma boa combinação com o [Hollywood Dream Cars](https://www.poraquipelomundo.com/brasil/gramado/hollywood-dream-cars-gramado), na mesma avenida.
✓ Site oficial: https://www.supercarros.com.br$$, $$1 hora (exposição); o drive leva 15 a 20 minutos$$, $$Tarde$$, $$O ano todo$$, $$Adultos, adolescentes e apaixonados por carros$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Mundo de Chocolate Lugano$$, $$mundo-de-chocolate-lugano$$, array['parque_tematico','ponto_turistico']::attraction_category[], $$O **Mundo de Chocolate** é um parque temático da marca Lugano na Avenida Borges de Medeiros, 2497, no centro de Gramado. Não é uma fábrica com visita à produção: a atração é um **percurso guiado** por cenários de vários países, que conta a história de um personagem suíço e de sua neta.

O parque reúne mais de **200 esculturas de chocolate**, feitas com mais de 30 toneladas de chocolate maciço, segundo os guias. Ao lado fica a loja da marca. Algumas modalidades de ingresso incluem a degustação de chocolate derretido e a sala de cinema.

Não confundir com a loja Chocolate Lugano, também na avenida, que é um endereço separado.

Verifique as informações atualizadas, os horários e os preços nos canais oficiais da Lugano.$$, $$✓ Os horários divergem entre as fontes (por exemplo, de domingo a quinta das 9h30 às 20h, e sexta e sábado até as 21h30; outra fonte cita das 9h às 22h): confirme antes de ir.
✓ Segundo guias, crianças de 0 a 5 anos não pagam, e há meia-entrada e combos de família. Os valores mudam: confirme o ingresso atual.
✓ Alguns ingressos incluem degustação e cinema, outros não: veja o que está incluso na hora da compra.
✓ Fica na avenida principal, perto de outros pontos: veja a [Avenida Borges de Medeiros](https://www.poraquipelomundo.com/brasil/gramado/avenida-borges-de-medeiros-gramado).
✓ Confirme preços, horários e tipos de ingresso diretamente no local ou nos canais da Lugano antes de ir.$$, $$1 hora$$, $$Tarde$$, $$O ano todo$$, $$Famílias com crianças$$, false, true, false, false, false, null::numeric, null::numeric, 'draft'),
-- 3. Passeios e cultura
($$Bustour Gramado e Canela$$, $$bustour-gramado-e-canela$$, array['passeio']::attraction_category[], $$O **Bustour Gramado e Canela** é um **ônibus turístico** (não é trem) que liga as duas cidades, com paradas nas principais atrações. O ticket vale por um dia e permite descer e subir quantas vezes quiser, no estilo hop-on hop-off.

As fontes citam cerca de 30 a 38 pontos de parada, entre eles a Catedral de Pedra, o centro de Canela, os Bondinhos Aéreos, o Alpen Park, o Mundo a Vapor, o Museu do Automóvel de Canela, o Lago Negro e a Estação Campos de Canella. Um aplicativo mostra a localização dos ônibus em tempo real, e o QR Code em cada parada informa o horário do próximo.

O Bustour também tem um passeio noturno de Natal, o Bustour Illumination Show, que é outro produto.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://www.bustour.com.br$$, $$✓ O ticket vale por um dia a partir do embarque. As entradas das atrações, o transporte até os pontos e as refeições não estão incluídos.
✓ Os horários e os dias de circulação variam por temporada (as fontes citam de 8h30 a 18h30, e circulação mais ampla em julho e de novembro a janeiro): confirme a grade do dia no site ou no aplicativo.
✓ Segundo uma fonte, crianças com menos de 6 anos não pagam. Confirme a regra e os preços atuais no site oficial.
✓ O voucher comprado em revendedores pode ser trocado por ticket nos ônibus, em algumas paradas ou nas lojas.
✓ Veja também o passeio noturno [Bustour Illumination Show](https://www.poraquipelomundo.com/brasil/gramado/bustour-illumination-show).
✓ Site oficial: https://www.bustour.com.br$$, $$Dia inteiro$$, $$Manhã$$, $$O ano todo$$, $$Famílias, casais e quem não quer dirigir$$, true, false, false, true, false, null::numeric, null::numeric, 'draft'),
($$Festival de Cinema de Gramado$$, $$festival-de-cinema-de-gramado$$, array['passeio','ponto_turistico']::attraction_category[], $$O **Festival de Cinema de Gramado** é o festival de cinema mais importante do Brasil e acontece todos os anos no **Palácio dos Festivais**, no centro da cidade. O prêmio máximo é o **Kikito**, e desde 1992 o festival é o Festival de Cinema Brasileiro e Latino.

A primeira edição oficializada foi em janeiro de 1973, a partir de mostras de cinema que nasceram na Festa das Hortênsias. A **54ª edição** aconteceu de 12 a 22 de agosto de 2026. O evento é **sazonal**, e as datas mudam a cada ano, então não deve ser tratado como atração permanente.

Durante o festival, o tapete vermelho liga o palácio à Rua Coberta, e a programação também inclui sessões gratuitas, como as reprises da manhã seguinte.

Verifique as informações atualizadas, a programação e os ingressos no site oficial: https://festivaldegramado.net$$, $$✓ As datas mudam a cada edição, e o evento costuma ser em agosto: confirme o calendário do ano no site oficial antes de planejar a viagem.
✓ Os ingressos das sessões noturnas são vendidos pelo site oficial (aba Ingressos) e esgotam rápido. Os valores das edições anteriores não valem para a atual.
✓ Parte da programação, como reprises e mostras paralelas, pode ter entrada livre: consulte a programação do dia.
✓ Para ver onde o festival acontece fora da época, visite o [Palácio dos Festivais](https://www.poraquipelomundo.com/brasil/gramado/palacio-dos-festivais-gramado) e a [Estátua do Kikito](https://www.poraquipelomundo.com/brasil/gramado/estatua-do-kikito-rotula-das-bandeiras).
✓ Site oficial: https://festivaldegramado.net$$, $$Varia conforme a programação$$, $$Noite$$, $$Agosto (as datas mudam a cada ano)$$, $$Adultos, casais e quem gosta de cinema$$, false, false, false, true, false, null::numeric, null::numeric, 'draft'),
-- 4. Restaurantes temáticos
($$Alice e o Chapeleiro$$, $$alice-e-o-chapeleiro-gramado$$, array['restaurante']::attraction_category[], $$O **Alice e o Chapeleiro** é um **restaurante temático inspirado em Alice no País das Maravilhas**, na Rua Wilma Dinnebier, 111, no centro de Gramado. O espaço tem cenografias exclusivas, a mesa do **chá de desaniversário** com personagens, apresentações e shows, pratos temáticos com opções para veganos e vegetarianos e drinks autorais com e sem álcool.

A proposta é uma experiência: os clientes tiram fotos com os personagens e acompanham as apresentações ao longo da noite. É um programa para famílias e para comemorações, e vale reservar com antecedência.

Verifique as informações atualizadas, os horários e a reserva no site oficial: https://www.aliceeochapeleiro.com.br$$, $$✓ O site oficial informa que o restaurante abre todos os dias, em dois horários: das 18h às 20h30 e das 21h às 23h30. Confirme antes de ir, porque guias citam horários diferentes.
✓ A reserva e a compra da experiência são feitas pelo site oficial: reserve com antecedência, principalmente em feriados e no Natal Luz.
✓ O telefone informado no site é (54) 3422-5217.
✓ Há opções vegetarianas e veganas no cardápio temático, e o cardápio está no site.
✓ Site oficial: https://www.aliceeochapeleiro.com.br$$, $$2 a 3 horas$$, $$Noite$$, $$O ano todo$$, $$Famílias, casais e grupos de amigos$$, false, true, false, false, true, null::numeric, null::numeric, 'draft'),
($$Hector Dragão$$, $$hector-dragao-gramado$$, array['restaurante','passeio']::attraction_category[], $$O **Hector Dragão** é um universo temático em Gramado, criado em torno do pequeno mago dragão Hector, da ilha de Trélion, e da escola de magia Ônyra. Reúne três experiências no centro: a **Pizzaria Temática** (Avenida Borges de Medeiros, 1791), a **Ferrovia Secreta** (Avenida Borges de Medeiros, 2875) e o **Fondue Temático**, além de uma loja.

Na **Ferrovia Secreta**, o visitante embarca em um trem mágico, escondido no centro da cidade, que atravessa universos e reinos diferentes. A viagem inclui um **Serviço de Bordo 1ª Classe**, com uma sequência de comida americana para compartilhar. Outras bebidas e sobremesas podem ser consumidas à parte.

Não confundir com a Kongo Pizzaria Temática, que é outro restaurante.

Verifique as informações atualizadas, os horários e a reserva no site oficial: https://hectordragao.com.br$$, $$✓ A reserva e a compra do bilhete são feitas pelo site oficial. Comprar a data desejada com antecedência ajuda a evitar filas longas na Ferrovia Secreta.
✓ Cada experiência (pizzaria, ferrovia e fondue) tem endereço e regras próprios: confirme no site qual você quer fazer.
✓ A Ferrovia Secreta é pensada para famílias e cabe no passeio pelo centro, perto da [Avenida Borges de Medeiros](https://www.poraquipelomundo.com/brasil/gramado/avenida-borges-de-medeiros-gramado).
✓ Valores e horários mudam por experiência e por data: consulte sempre o site oficial.
✓ Site oficial: https://hectordragao.com.br$$, $$1 a 2 horas$$, $$Noite$$, $$O ano todo$$, $$Famílias com crianças$$, false, true, false, false, true, null::numeric, null::numeric, 'draft')
) as v(name, slug, cats, d, tips, visit, best, season, aud, ws, ac, eff, adv, res, la, lo, st)
where c.slug='gramado'
  and not exists (select 1 from attractions x where x.city_id=c.id and (x.slug=v.slug or lower(x.name)=lower(v.name)));

-- 5. Natal Luz: atrações vinculadas ao evento (filhas da página "Natal Luz de Gramado", que não é alterada).
insert into attractions (city_id, parent_attraction_id, name, slug, categories, description, important_tips, average_visit_time, best_time_of_day, best_season, recommended_audience, weather_sensitive, has_air_conditioning, intense_physical_effort, requires_advance_purchase, requires_reservation, latitude, longitude, status)
select c.id, p.id, v.name, v.slug, v.cats, v.d, v.tips, v.visit, v.best, v.season, v.aud, v.ws, v.ac, v.eff, v.adv, v.res, v.la, v.lo, v.st::country_status
from cities c
join attractions p on p.city_id = c.id and p.slug = 'natal-luz-de-gramado'
cross join (values
($$Nativitaten$$, $$nativitaten-gramado$$, array['passeio']::attraction_category[], $$O **Nativitaten** é um dos espetáculos pagos do **Natal Luz de Gramado**: um **balé aquático com pirotecnia** encenado no **lago do Serra Park** (Centro de Eventos Serra Park). O show dura cerca de 60 minutos e começa às 20h, em dias determinados da semana.

A programação do Natal Luz é **sazonal**: a temporada geral de 2026/2027 vai de 22 de outubro de 2026 a 17 de janeiro de 2027, e o Nativitaten tem um calendário próprio de datas dentro desse período. As sessões são vendidas por setor, e os ingressos devem ser comprados **com antecedência**.

Verifique as informações atualizadas, as datas e os ingressos no site oficial: https://natalluzdegramado.com.br$$, $$✓ O ingresso é pago e deve ser comprado antes, pelo site oficial ou por canais autorizados: as sessões esgotam em datas de pico.
✓ Os valores variam por setor, por data e por vendedor. Em consultas de novembro de 2026, fontes de revenda citavam de cerca de R$ 280 a R$ 396 para os setores comuns e valores mais altos para o setor VIP: confirme o preço no site oficial.
✓ O espetáculo é ao ar livre, à noite: leve agasalho, e confira se há mudança de data por chuva.
✓ O estacionamento no Serra Park é pago (uma notícia citada por guias fala em R$ 60 por carro), e há serviços de transfer a partir de hotéis em Gramado.
✓ Veja a programação gratuita do evento na página do [Natal Luz de Gramado](https://www.poraquipelomundo.com/brasil/gramado/natal-luz-de-gramado).
✓ Site oficial: https://natalluzdegramado.com.br$$, $$1 hora (espetáculo)$$, $$Noite$$, $$Natal Luz (outubro a janeiro)$$, $$Famílias e casais$$, true, false, false, true, false, null::numeric, null::numeric, 'draft'),
($$O Grande Desfile de Natal$$, $$o-grande-desfile-de-natal-gramado$$, array['passeio']::attraction_category[], $$**O Grande Desfile de Natal** é um espetáculo pago do **Natal Luz de Gramado**, em uma área coberta do **Expogramado**, na Avenida Borges de Medeiros, 4111, na Sala Araucária. As fontes consultadas indicam que, em 2026, o desfile mudou de local e não é mais no Serra Park.

O espetáculo dura cerca de 60 minutos e, segundo as fontes, as sessões são às 20h (portões às 18h30), geralmente às quartas, sextas e domingos, de 23 de outubro de 2026 a 10 de janeiro de 2027. Como a programação é **sazonal**, as datas e os horários devem ser confirmados na fonte oficial.

Verifique as informações atualizadas, as datas e os ingressos no site oficial: https://natalluzdegramado.com.br$$, $$✓ O ingresso é pago e deve ser comprado com antecedência, pelo site oficial ou por canais autorizados.
✓ Os valores variam por setor (arquibancada e cadeira numerada) e por vendedor. Em consultas de novembro de 2026, apareciam preços entre cerca de R$ 294 e R$ 520: confirme o valor no site oficial.
✓ Por ser em área coberta, o espetáculo funciona mesmo com chuva ou frio, mas leve um agasalho.
✓ Em 2026 o local mudou: confira o endereço no ingresso antes de sair.
✓ Veja a programação gratuita do evento na página do [Natal Luz de Gramado](https://www.poraquipelomundo.com/brasil/gramado/natal-luz-de-gramado).
✓ Site oficial: https://natalluzdegramado.com.br$$, $$1 hora (espetáculo)$$, $$Noite$$, $$Natal Luz (outubro a janeiro)$$, $$Famílias com crianças e casais$$, false, false, false, true, false, null::numeric, null::numeric, 'draft')
) as v(name, slug, cats, d, tips, visit, best, season, aud, ws, ac, eff, adv, res, la, lo, st)
where c.slug='gramado'
  and not exists (select 1 from attractions x where x.city_id=c.id and (x.slug=v.slug or lower(x.name)=lower(v.name)));
