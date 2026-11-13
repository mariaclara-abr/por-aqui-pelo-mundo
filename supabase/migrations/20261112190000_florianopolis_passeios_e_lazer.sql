-- Florianópolis: cadastro de passeios e lazer (todos como rascunho, sem fotos).
-- Beira-Mar Norte não entra: já existe como "Beira-Mar Norte e Letreiro Floripa".
-- A experiência pessoal (personal_experience) fica em branco de propósito.
insert into attractions (city_id, name, slug, categories, description, important_tips, average_visit_time, best_time_of_day, best_season, recommended_audience, weather_sensitive, has_air_conditioning, intense_physical_effort, requires_advance_purchase, requires_reservation, latitude, longitude, status)
select c.id, v.name, v.slug, v.cats, v.d, v.tips, v.visit, v.best, v.season, v.aud, v.ws, v.ac, v.eff, v.adv, v.res, v.la, v.lo, v.st::country_status
from cities c cross join (values
($$Floripa By Bus$$, $$floripa-by-bus$$, array['passeio','ponto_turistico']::attraction_category[], $$O **Floripa By Bus** é o city tour de **ônibus turístico de teto aberto** que percorre a ilha em cerca de **8h30**, com guia especializado. A empresa, a By Bus Turismo, foi fundada em 2008, e o ônibus tem teto retrátil, então o passeio acontece mesmo em dia de chuva.

O roteiro **Toda a Ilha** passa por pontos como o **Mercado Público**, a **cabeceira da Ponte Hercílio Luz** (Parque da Luz), a **Lagoa da Conceição**, a **Praia da Joaquina**, a **Praia de Jurerê Internacional** e a **freguesia de Santo Antônio de Lisboa**, com paradas de cerca de 30 a 40 minutos.

Uma boa sugestão é fazer o passeio no primeiro ou no último dia da viagem, para conhecer as regiões da ilha e escolher onde voltar com mais calma.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://www.floripabybus.com.br$$, $$✓ O embarque acontece de manhã, entre 6h40 e 10h, em mais de 13 pontos espalhados pela ilha, e o desembarque é no Villa Romana Shopping, na Avenida Madre Benvenuta.
✓ O Visite Floripa divulga ingressos de R$ 150 (adulto, de 13 a 64 anos), R$ 120 (idosos acima de 65 anos e pessoas com deficiência) e R$ 70 (crianças de 4 a 12 anos). Confirme os valores atuais com a empresa.
✓ As refeições não estão incluídas: leve dinheiro ou cartão para o almoço nas paradas.
✓ O passeio é indicado para todas as idades, mas não é recomendado para pessoas com problemas de coluna.$$, $$Dia inteiro$$, $$Manhã$$, $$O ano todo$$, $$Famílias, casais e quem visita Florianópolis pela primeira vez$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Kattamaram$$, $$kattamaram-floripa$$, array['passeio','ponto_turistico']::attraction_category[], $$O **Kattamaram Floripa** é um **catamarã para 250 pessoas**, climatizado, que sai do **píer da Beira-Mar Norte** e percorre cerca de **32 km** até a **ilha de Ratones Grande**, em um passeio de aproximadamente **2h30**. A bordo há **buffet** com pratos preparados na cozinha da embarcação e **dois bares**, um deles no deck superior, com **música ao vivo**.

O segundo deck é para quem quer contemplar a paisagem e o **pôr do sol**. Pelo caminho aparece a **Ponte Hercílio Luz**, que à noite se transforma em um espetáculo de luzes.

Uma boa sugestão é escolher a saída do fim da tarde, para ver a ponte iluminada na volta.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://www.catamarafloripa.com.br$$, $$✓ Os ingressos podem ser comprados no site (na aba de reservas) ou nas bilheterias do Kattamaram: uma no trapiche da Beira-Mar Norte e outra na Praia de Canasvieiras.
✓ A compra pelo site garante o embarque e evita fila, porque a lotação do barco é limitada.
✓ Uma reportagem de 2023 citava saídas às 12h, 15h, 17h30 e 20h, com ingresso de R$ 180 e 50% de desconto para moradores de Florianópolis, São José e Palhoça mediante comprovante. Confirme os valores e horários atuais.
✓ Chegue com antecedência ao píer da Beira-Mar Norte para o embarque.
✓ A embarcação é climatizada, mas leve um agasalho leve para o deck aberto à noite.$$, $$2h30$$, $$Fim de tarde$$, $$O ano todo$$, $$Casais, famílias e grupos de amigos$$, false, true, false, false, false, null::numeric, null::numeric, 'draft'),
($$Kart dos Ingleses$$, $$kart-dos-ingleses$$, array['passeio','ponto_turistico']::attraction_category[], $$O **Kartódromo dos Ingleses** fica no norte da ilha, na Estrada Anarolina Silveira Santos, em Vargem do Bom Jesus, perto da região da Praia dos Ingleses. A pista tem **traçado técnico, com curvas fechadas e retas rápidas**, e já recebeu competições importantes, como o **Panamericano de Kart de 2006**, com cerca de cem pilotos de nove países da América do Sul, e etapas do Campeonato Brasileiro.

Para quem não é piloto, há a opção de **bateria de kart de aluguel**, com instrução de segurança antes de entrar na pista, em uma atividade de lazer para amigos e famílias.

Verifique as informações atualizadas, os horários e os preços nos canais oficiais da pista.$$, $$✓ As regras de idade e altura mínima variam entre as fontes (de 7 a 14 anos, e altura em torno de 1,30 m a 1,50 m), então confirme antes de levar crianças.
✓ É obrigatório o uso de calçado fechado, e os pilotos recebem instruções de segurança antes da bateria.
✓ Guias indicam que o valor da bateria inclui kart, capacete, balaclava e luvas, mas confirme os preços e o tempo de cada bateria na pista.
✓ Confirme se a pista está aberta ao público no dia, porque ela também recebe campeonatos e treinos.$$, $$1 a 2 horas$$, $$Tarde$$, $$O ano todo$$, $$Adolescentes, adultos e grupos de amigos$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Água Show Park$$, $$agua-show-park$$, array['ponto_turistico','parque_aquatico']::attraction_category[], $$O **Água Show Park** é o parque aquático da Praia dos Ingleses, no norte da ilha, na Rodovia Armando Calil Bulos (SC-403), 3868. Reúne **16 atrações** entre toboáguas, piscinas e áreas para os pequenos, como o **Kamikaze do Crocodilo**, o **Toboágua da Nave**, o **Toboágua da Bóia**, o **Complexo do Rio Lento**, o **Complexo das Abelhas**, a **Piscina de Ondas** e a **Piscina Aquecida**.

O parque tem equipe de **guarda-vidas** e foi pensado para famílias, com atrações para todas as idades, de adrenalina a relaxamento.

Verifique as informações atualizadas, os dias de funcionamento e os ingressos no site oficial: https://www.aguashowpark.com.br$$, $$✓ O funcionamento varia ao longo do ano: no inverno o parque abre em dias específicos, com a piscina aquecida, e o site publica o calendário de cada mês. Confira os dias antes de ir.
✓ O guia oficial, de 2024, indicava horário das 10h às 18h no verão e das 10h às 17h no inverno.
✓ O estacionamento é pago (R$ 25 por carro e R$ 10 por moto, segundo o guia oficial de 2024), e o guarda-volumes custava R$ 30.
✓ Os ingressos podem ser comprados online no site oficial, com descontos para compra antecipada.
✓ Leve roupa de banho, toalha, protetor solar e capa à prova d'água para o celular.$$, $$Dia inteiro$$, $$A partir da abertura$$, $$Verão e dias quentes$$, $$Famílias, adolescentes e grupos de amigos$$, true, false, false, false, false, -27.444741::numeric, -48.419242::numeric, 'draft'),
($$Projeto Tamar$$, $$projeto-tamar-florianopolis$$, array['ponto_turistico','passeio','museu']::attraction_category[], $$O **Centro de Visitantes do Projeto Tamar** fica na Praia da Barra da Lagoa, a 50 metros do mar, e foi inaugurado em 2005. O espaço tem **cinco tanques** com quatro das cinco espécies de tartarugas marinhas do litoral brasileiro (**tartaruga-verde, cabeçuda, oliva e de-pente**), em diferentes fases da vida, além de uma piscina e um **aquário** com animais marinhos da região.

O **museu** reúne espaços temáticos, como o **Espaço Pesquisa**, sobre o trabalho de campo, e o **Espaço Ameaças**, sobre os perigos que as tartarugas enfrentam. Há ainda **gramado, parquinho infantil** e uma cabana com café, pipoca, picolé e bebidas.

Verifique as informações atualizadas, os horários e os ingressos no site oficial: https://www.tamar.org.br$$, $$✓ Segundo o site oficial, funciona de quarta a segunda, das 9h30 às 17h.
✓ O ingresso custa R$ 44 (inteira) e R$ 22 (meia-entrada, para idosos acima de 60 anos, estudantes, professores, ID Jovem, crianças a partir de 6 anos, doadores com comprovante e pessoas com deficiência e acompanhante).
✓ Crianças de até 5 anos e moradores da Barra da Lagoa com comprovante não pagam.
✓ A estrutura é adaptada para cadeirantes e pode ser visitada em dias de chuva.
✓ A experiência Biólogo por um Dia exige agendamento, e grupos e escolas precisam agendar com antecedência.
✓ O endereço é Rua Professor Ademir Francisco, s/n, Barra da Lagoa, e o telefone é (48) 3236-2015.$$, $$1h30 a 2 horas$$, $$Manhã ou tarde$$, $$O ano todo$$, $$Famílias com crianças$$, false, false, false, false, false, -27.572084::numeric, -48.427776::numeric, 'draft'),
($$Fortalezas históricas$$, $$fortalezas-historicas$$, array['ponto_turistico','museu','passeio']::attraction_category[], $$As **fortalezas históricas** da Ilha de Santa Catarina formam o chamado **Triângulo de Fogo**, o sistema defensivo da Baía Norte erguido no século XVIII. Três delas recebem visitantes e são administradas pela UFSC: **São José da Ponta Grossa**, na Praia do Forte, a única com acesso por terra; **Santa Cruz de Anhatomirim**, na ilha de Anhatomirim; e **Santo Antônio de Ratones**, na ilha de Ratones Grande.

A **Fortaleza de São José da Ponta Grossa** começou a ser construída por volta de 1740, por ordem do brigadeiro José da Silva Paes, primeiro governador da Capitania de Santa Catarina, e é **Monumento Histórico Nacional** desde 1938. A visita passa pelas **muralhas, canhões, Casa do Comandante com exposição arqueológica e Capela de São José**.

Verifique as informações atualizadas, os horários e os ingressos no site oficial: https://fortalezas.ufsc.br$$, $$✓ Segundo o site oficial, São José da Ponta Grossa e Santo Antônio de Ratones abrem todos os dias, das 8h30 às 18h30, incluindo feriados, com entrada até as 18h. A abertura às segundas voltou em 9 de novembro de 2026.
✓ A Fortaleza de Santa Cruz de Anhatomirim está temporariamente fechada, desde novembro de 2026, por causa de obras no trapiche de acesso. Confira a reabertura antes de planejar.
✓ A taxa de visitação é de R$ 20 (inteira) e R$ 10 (meia). O ingresso duplo para Ratones e Anhatomirim custa R$ 30 (inteira) e R$ 15 (meia).
✓ O pagamento na portaria é só em dinheiro em Anhatomirim e Ratones, e em dinheiro ou PIX em Ponta Grossa. Também dá para pagar antes, pelo site fortalezas.eventos.ufsc.br.
✓ No último domingo de cada mês, de março a novembro, a visitação é gratuita nas três fortalezas.
✓ Têm isenção idosos a partir de 60 anos, crianças de até 5 anos e pessoas com deficiência que usam cadeira de rodas.
✓ A UFSC não é responsável pelo transporte até as ilhas: Anhatomirim e Ratones exigem travessia de barco, contratada à parte.$$, $$2 a 3 horas$$, $$Manhã$$, $$O ano todo, em dias de tempo firme$$, $$Famílias, casais e quem gosta de história$$, true, false, false, false, false, -27.431535::numeric, -48.517889::numeric, 'draft')
) as v(name, slug, cats, d, tips, visit, best, season, aud, ws, ac, eff, adv, res, la, lo, st)
where c.slug='florianopolis'
  and not exists (select 1 from attractions x where x.city_id=c.id and (x.slug=v.slug or lower(x.name)=lower(v.name)));
