-- LEGOLAND Florida Theme Park (pai), LEGOLAND Water Park (filha) e Peppa Pig Theme Park Florida (independente).
-- As três já existiam (migration 20261112140000): aqui só corrigimos nome, hierarquia e texto conforme os sites oficiais
-- (legoland.com/florida e peppapigthemepark.com/florida, consultados em 12/11/2026).
-- Sem preços, horários ou condições de ingresso. Sem experiência pessoal (personal_experience segue vazio).
-- Water Park e Peppa Pig seguem como rascunho: não há 3 fotos livres no Wikimedia Commons (Water Park: 0, Peppa: 2).

-- 1) Pai: LEGOLAND Florida Theme Park (slug mantido, a URL não muda)
update attractions set
  name = $$LEGOLAND Florida Theme Park$$,
  description = $$O **LEGOLAND Florida Theme Park** fica em Winter Haven, a cerca de 1 hora de carro de Orlando, e por isso aparece aqui entre as opções de passeio a partir da cidade. É um parque de 150 acres, com mais de 50 brinquedos, shows e atrações inspirados no universo LEGO, pensado para famílias com crianças de **2 a 12 anos**. Adultos sem crianças também são bem-vindos.

Entre os destaques estão a **Miniland USA**, com cenas dos Estados Unidos montadas com mais de 32 milhões de peças LEGO, a Galacticoaster, montanha-russa de tema espacial que o site oficial apresenta como a atração mais nova, a Coastersaurus, a Driving School, onde as crianças ganham uma carteira de motorista LEGOLAND, e o LEGO NINJAGO The Ride, em 4D interativo. O parque também ocupa o terreno do histórico **Cypress Gardens**, um jardim botânico preservado, com uma figueira-de-bengala de mais de 85 anos, aberto para passeio.

O complexo reúne ainda o LEGOLAND Water Park, que fica dentro do parque temático, e o Peppa Pig Theme Park Florida, um parque separado ao lado, com ingresso próprio.

Uma boa sugestão é chegar na abertura, começar pelas atrações mais disputadas e deixar a Miniland USA e os shows para o meio do dia.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://www.legoland.com/florida$$,
  important_tips = $$✓ O parque é pensado para crianças de 2 a 12 anos, mas visitantes de todas as idades são bem-vindos.
✓ O LEGOLAND Water Park fica dentro do parque temático e exige ingresso que inclua os dois parques. O Peppa Pig Theme Park Florida é um parque separado, ao lado, com ingresso próprio.
✓ Cada atração tem altura mínima e regras de acompanhante: consulte a lista de restrições de altura no site oficial antes de ir.
✓ Os horários mudam conforme a data, então confira o calendário oficial antes de planejar o dia.
✓ O estacionamento pode ser comprado online ou na cabine do local, que abre cerca de 30 a 45 minutos antes da abertura do parque.
✓ Alguns alimentos e bebidas podem entrar no parque sob certas condições, e bebidas alcoólicas são proibidas: a lista de itens aceitos está no site oficial.
✓ Há eventos sazonais, como o LEGOLAND Christmas Bricktacular, em datas específicas: confirme o calendário no site oficial.
✓ Fica em Winter Haven, a cerca de 1 hora de carro de Orlando.$$,
  recommended_audience = $$Famílias com crianças de 2 a 12 anos$$
where slug = 'legoland-florida';

-- 2) Filha: LEGOLAND Water Park, vinculada ao pai (não aparece como card na página de Orlando)
update attractions set
  parent_attraction_id = (select id from attractions where slug = 'legoland-florida'),
  description = $$O **LEGOLAND Water Park** é o parque aquático do complexo LEGOLAND Florida e fica dentro do parque temático, em Winter Haven, a cerca de 1 hora de carro de Orlando. Segundo o site oficial, são mais de 1 milhão de galões de diversão aquática para crianças de várias idades.

Entre as atrações estão a **LEGO Wave Pool**, piscina de ondas na medida para todas as idades, o **Build-A-Raft Lazy River**, rio de correnteza em que a família monta o próprio bote com peças LEGO, o Joker Soaker, área interativa com toboáguas, escaladas e jatos d'água, o Twin Chasers, par de toboáguas fechados de 375 pés (cerca de 114 metros), e o Splash Out, toboágua para quem busca mais emoção. Também é possível alugar cabanas.

O parque aquático funciona em temporada e fica fechado em parte do ano. Como a entrada exige ingresso que inclua também o parque temático, vale reservar o dia inteiro para os dois.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://www.legoland.com/florida/things-to-do/water-park/$$,
  important_tips = $$✓ O LEGOLAND Water Park fica dentro do parque temático. É possível visitar somente o parque temático, mas, para acessar o parque aquático, é necessário um ingresso que inclua também o parque temático.
✓ Verifique os tipos de ingresso e o calendário de funcionamento no site oficial: o parque aquático funciona em temporada.
✓ Passes anuais do tipo Standard não incluem o parque aquático, segundo o site oficial.
✓ Toalhas não são gratuitas, exceto para hóspedes dos hotéis LEGOLAND. A loja Surf Shop, perto da entrada, vende toalhas, sapatos aquáticos, protetor solar e capas à prova d'água.
✓ Evite roupas de banho com zíperes ou botões expostos.
✓ Há aluguel de cabanas, com atendimento de comidas e bebidas o dia todo.
✓ Alguns alimentos e bebidas podem entrar sob certas condições, e bebidas alcoólicas são proibidas.
✓ Cada atração tem regras próprias de altura, então confira as informações no site oficial.$$
where slug = 'legoland-water-park-florida';

-- 3) Independente: Peppa Pig Theme Park Florida (sem parent_attraction_id, entrada e ingresso próprios)
update attractions set
  parent_attraction_id = null,
  description = $$O **Peppa Pig Theme Park Florida** fica em Winter Haven, a cerca de 1 hora de carro de Orlando, ao lado da entrada principal do LEGOLAND Florida Resort. Apesar da vizinhança, é um parque independente, com ingresso próprio, e pode ser visitado separadamente, sem passar pelo LEGOLAND.

É feito para crianças pequenas, principalmente de **2 a 5 anos**, e os brinquedos foram pensados para a família andar junto. O site oficial lista seis brinquedos e atrações interativas, entre eles a **Daddy Pig's Roller Coaster**, descrita como uma ótima primeira montanha-russa, e a Grampy Rabbit's Dinosaur Adventure. Há ainda jogos grátis no Fun Fair, o passeio de bicicleta Peppa's Pedal Bike Tour, a área de água Muddy Puddles Splash Pad e shows ao vivo no Mr. Potato's Showtime Arena, com encontro com a Peppa e sua família.

Uma boa sugestão é combinar os dois parques na mesma viagem: eles dividem o estacionamento principal e há ingressos de vários parques, mas cada parque precisa estar incluído no ingresso.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://www.peppapigthemepark.com/florida/$$,
  important_tips = $$✓ É um parque separado do LEGOLAND, com ingresso próprio ou pacote de vários parques, e pode ser visitado sem entrar no LEGOLAND.
✓ Fica ao lado da entrada principal do LEGOLAND Florida Resort, em Winter Haven, e os dois parques dividem o estacionamento principal.
✓ O público principal são crianças de 2 a 5 anos.
✓ Cada brinquedo tem regras de altura e acompanhante. Na Grampy Rabbit's Dinosaur Adventure, por exemplo, a idade mínima é 2 anos e a altura mínima é 34 polegadas.
✓ Nos brinquedos de água é exigido traje de banho adequado, e os toboáguas do Muddy Puddles Splash Pad pedem altura mínima de 36 polegadas.
✓ Verifique os tipos de ingresso e os horários no site oficial.
✓ Fica a cerca de 1 hora de carro de Orlando.$$,
  recommended_audience = $$Famílias com crianças pequenas, de 2 a 5 anos$$
where slug = 'peppa-pig-theme-park-florida';
