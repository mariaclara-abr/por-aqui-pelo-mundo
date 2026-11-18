-- Natal Luz de Gramado: revisão com a programação vigente da 41ª edição (22/10/2026 a 17/01/2027).
-- Fonte: site oficial natalluzdegramado.com.br (home, páginas de cada espetáculo, acessibilidade e notícias), lido em 17/11/2026.
-- Complementa o conteúdo existente. Não mexe em personal_experience nem nas fotos (o Natal Luz e os filhos não têm relato nem foto cadastrados).
-- A lista antiga de espetáculos (Fantástica Fábrica de Natal, Reino do Natal, Light of Christmas) saiu: não consta na programação 2026.
-- Coordenada do Natal Luz: Palácio dos Festivais (Show de Acendimento), no centro da programação gratuita.

update attractions set
  description = $$O **Natal Luz de Gramado** é a grande festa de Natal da cidade, apresentada pela organização como o maior Natal do mundo. A **41ª edição** vai de **22 de outubro de 2026 a 17 de janeiro de 2027** (88 dias e noites), com espetáculos pagos, atrações gratuitas pelo centro e a cidade toda decorada. A realização é da Gramadotur.

Os **espetáculos pagos** têm ingressos vendidos pela tiqueteira oficial, com lugares numerados e limitados: o **Nativitaten**, no Serra Park, a céu aberto sobre as águas, com música, fogos e águas dançantes; **O Grande Desfile de Natal**, no Expogramado, em espaço coberto, com carros alegóricos e personagens; **O Brilho do Natal**, no Palácio dos Festivais, com dança, música e figurinos que acendem no palco; e o **Natal Luz In Concert**, com a Orquestra de Gramado, também no Palácio dos Festivais e novidade desta edição.

As **atrações gratuitas** não pedem ingresso: a **Vila de Natal**, na Praça das Etnias, com mercado natalino, gastronomia e a Casa do Papai Noel (todos os dias até 17 de janeiro, das 9h às 21h); o **Show de Acendimento**, que acende as luzes da cidade em frente ao Palácio dos Festivais (todos os dias até 10 de janeiro, às 20h); o **Palco da Rua Coberta** (de terça a domingo, às 18h30, e aos sábados e domingos também às 11h30); a **Parada de Natal**, na Avenida Borges de Medeiros (sextas, sábados e domingos, às 16h, com edições extras em feriadões); e o **Caminho de Luzes**, percurso iluminado da Praça das Etnias até a Rua Coberta (todas as terças, às 19h).

A **decoração da cidade** faz parte do passeio: a Avenida Borges de Medeiros recebe os pinheirinhos decorados por empresas e estabelecimentos locais no **Tannenbaumfest**, a festa dos pinheirinhos, em novembro, e as fachadas de Gramado disputam o concurso **Brilha Gramado**, com votação popular de 30 de novembro a 12 de dezembro e resultado em 18 de dezembro. Entre as **experiências natalinas** estão o Passaporte Experience, que coloca o visitante em um carro alegórico do Grande Desfile, a Corrida e Caminhada do Noel (6 de dezembro de 2026, com largada na Rua Coberta), o passeio noturno do [Bustour Illumination Show](https://www.poraquipelomundo.com/brasil/gramado/bustour-illumination-show) e a [Aldeia do Papai Noel](https://www.poraquipelomundo.com/brasil/gramado/aldeia-do-papai-noel-gramado), que fica aberta o ano todo.

Verifique a programação atualizada, as datas dos espetáculos e os ingressos no site oficial: https://natalluzdegramado.com.br$$,
  important_tips = $$✓ A programação é sazonal: datas e horários mudam a cada edição. O calendário dia a dia está no site oficial.
✓ Os quatro espetáculos pagos têm meia-entrada para estudantes, pessoas com 60 anos ou mais e PCD (com comprovação), e os melhores lugares esgotam primeiro: compre antes pela tiqueteira oficial.
✓ Valores no site oficial em 17/11/2026 (inteira): Nativitaten de R$ 360 a R$ 520; O Grande Desfile de Natal de R$ 420 a R$ 520 (Passaporte Experience R$ 900); O Brilho do Natal e Natal Luz In Concert de R$ 120 a R$ 380. Confirme antes de comprar.
✓ Onde: o Nativitaten é no Serra Park, ao ar livre (leve agasalho); o Grande Desfile é no Expogramado, coberto; O Brilho do Natal e o Natal Luz In Concert são no Palácio dos Festivais, também coberto.
✓ As atrações gratuitas não pedem ingresso, mas enchem à noite e em feriados: chegue cedo à Vila de Natal e à Rua Coberta.
✓ Estacionar no centro é difícil durante o evento: deixe o carro no hotel ou em um estacionamento e caminhe, ou use aplicativo de transporte.
✓ Acessibilidade: todos os espetáculos têm área para cadeirantes, com direito a um acompanhante. O Nativitaten e o Grande Desfile têm cabines de acolhimento sensorial e setor TEA, e algumas apresentações têm interpretação em Libras (detalhes em natalluzdegramado.com.br/acessibilidade).
✓ Veja as páginas do [Nativitaten](https://www.poraquipelomundo.com/brasil/gramado/nativitaten-gramado) e de [O Grande Desfile de Natal](https://www.poraquipelomundo.com/brasil/gramado/o-grande-desfile-de-natal-gramado), e, em Canela, o [Sonho de Natal de Canela](https://www.poraquipelomundo.com/brasil/canela/sonho-de-natal-de-canela), que acontece na mesma época.
✓ Site oficial: https://natalluzdegramado.com.br$$,
  average_visit_time = $$Espetáculos de cerca de 1 hora; programe uma ou mais noites$$,
  best_time_of_day = $$Fim de tarde e noite$$,
  best_season = $$Natal Luz: 22 de outubro de 2026 a 17 de janeiro de 2027$$,
  recommended_audience = $$Famílias, casais e quem gosta do clima de Natal$$,
  weather_sensitive = true,
  requires_advance_purchase = true,
  latitude = -29.378978,
  longitude = -50.874065
where slug = 'natal-luz-de-gramado'
  and city_id = (select id from cities where slug = 'gramado');

update attractions set
  description = $$O **Nativitaten** é um dos espetáculos pagos do **Natal Luz de Gramado**: uma celebração ao nascimento de Jesus encenada a céu aberto sobre as águas do lago do **Serra Park**, com música, luzes, fogos de artifício, águas dançantes e efeitos especiais. Nesta edição, o palco foi ampliado e o elenco ganhou novos talentos, segundo a organização. O show dura cerca de 60 minutos e começa às 20h, em dias determinados da semana, segundo as fontes consultadas.

A programação do Natal Luz é **sazonal**: a temporada 2026/2027 vai de 22 de outubro de 2026 a 17 de janeiro de 2027, e o Nativitaten tem um calendário próprio de datas dentro desse período. Os ingressos são vendidos por setor (Prata, Ouro, VIP e Setor TEA) e devem ser comprados **com antecedência**.

Verifique as informações atualizadas, as datas e os ingressos no site oficial: https://natalluzdegramado.com.br$$,
  important_tips = $$✓ Espetáculo pago, com ingresso comprado antes pela tiqueteira oficial: as sessões esgotam em datas de pico.
✓ Valores no site oficial em 17/11/2026 (inteira e meia): Prata R$ 360 e R$ 180 (lugares não numerados); Ouro R$ 420 e R$ 210 (não numerados, com visão centralizada dos fogos); VIP R$ 520 e R$ 260 (numerados, mais perto do palco). O Setor TEA custa R$ 180 por ingresso, valor único, com vagas limitadas.
✓ A meia-entrada vale para estudantes, pessoas com 60 anos ou mais e PCD, com comprovação na entrada.
✓ O espetáculo é ao ar livre e à noite, e o Setor VIP é descoberto: leve agasalho e acompanhe a previsão do tempo.
✓ O Serra Park fica na Rua Viação Férrea, 100, no centro de Gramado. O estacionamento é pago: chegue com antecedência para se acomodar com tranquilidade.
✓ Há área para cadeirantes (com direito a um acompanhante), cabines de acolhimento sensorial e interpretação em Libras na sessão de 26/12, às 20h.
✓ Veja a programação gratuita e os outros espetáculos na página do [Natal Luz de Gramado](https://www.poraquipelomundo.com/brasil/gramado/natal-luz-de-gramado).
✓ Site oficial: https://natalluzdegramado.com.br$$
where slug = 'nativitaten-gramado'
  and city_id = (select id from cities where slug = 'gramado');

update attractions set
  description = $$**O Grande Desfile de Natal** é um dos espetáculos pagos mais tradicionais do **Natal Luz de Gramado**. Volta a ser realizado no **Expogramado**, em espaço coberto, na Avenida Borges de Medeiros, 4111, e reúne carros alegóricos, personagens encantados, figurinos, trilha sonora e efeitos visuais em uma narrativa que celebra os valores do Natal para visitantes de todas as idades. A audiodescrição oficial do desfile tem pouco mais de 1 hora, o que dá uma ideia da duração do espetáculo.

Segundo as fontes consultadas, as sessões são às 20h (portões às 18h30), geralmente às quartas, sextas e domingos, de 23 de outubro de 2026 a 10 de janeiro de 2027. Como a programação é **sazonal**, as datas e os horários devem ser confirmados na fonte oficial.

Verifique as informações atualizadas, as datas e os ingressos no site oficial: https://natalluzdegramado.com.br$$,
  important_tips = $$✓ Espetáculo pago, com ingresso comprado antes pela tiqueteira oficial: os lugares são numerados e limitados, e as sessões esgotam primeiro nos fins de semana e feriados.
✓ Valores no site oficial em 17/11/2026 (inteira e meia): Arquibancada R$ 420 e R$ 210 (não numerada, visão panorâmica); Cadeira de Pista R$ 520 e R$ 260 (numerada, primeira fileira, perto dos personagens). O Setor TEA custa R$ 210 por ingresso, valor único.
✓ O Passaporte Experience (R$ 900 por pessoa, vagas limitadas, grupos de até 10 pessoas) coloca você em um carro alegórico, com figurino especial, bastidores do espetáculo e foto com o Papai Noel.
✓ Por ser em área coberta, o espetáculo funciona mesmo com chuva ou frio, mas leve um agasalho.
✓ Há área para cadeirantes (com direito a um acompanhante), cabines de acolhimento sensorial, audiodescrição e interpretação em Libras na sessão de 6/12, às 20h.
✓ O estacionamento no Expogramado é pago: chegue com antecedência para se acomodar com tranquilidade.
✓ Veja a programação gratuita e os outros espetáculos na página do [Natal Luz de Gramado](https://www.poraquipelomundo.com/brasil/gramado/natal-luz-de-gramado).
✓ Site oficial: https://natalluzdegramado.com.br$$
where slug = 'o-grande-desfile-de-natal-gramado'
  and city_id = (select id from cities where slug = 'gramado');

-- Etiquetas do Natal Luz (o registro não tinha nenhuma): só o que o cadastro comprova.
insert into attraction_tags (attraction_id, tag_id)
select a.id, t.id
from attractions a
join cities c on c.id = a.city_id and c.slug = 'gramado'
join tags t on
  (t.slug = 'reserva_necessaria' and a.requires_advance_purchase)
  or (t.slug = 'ideal_para_familias' and a.recommended_audience ~* 'fam[ií]li')
  or (t.slug = 'casais' and a.recommended_audience ~* 'casais')
where a.slug = 'natal-luz-de-gramado'
on conflict do nothing;
