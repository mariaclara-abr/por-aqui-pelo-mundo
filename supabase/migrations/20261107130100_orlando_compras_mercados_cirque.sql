-- Compras e mercados em Orlando (guia de compras) e o show Drawn to Life, do Cirque du Soleil.
-- Entram como rascunho: faltam fotos com crédito e a experiência pessoal. Sem latitude e longitude
-- nas redes, pois há várias unidades. Experiência fica vazia de propósito.
insert into attractions (city_id, name, slug, categories, description, important_tips, average_visit_time, best_time_of_day, best_season, recommended_audience, weather_sensitive, has_air_conditioning, status)
select c.id, v.name, v.slug, v.categories, v.description, v.tips, v.visit_time, v.best_time, v.season, v.audience, false, v.ac, 'draft'
from cities c
cross join (values
($$Walmart$$, $$walmart$$, array['mercado','compras']::attraction_category[], $$O **Walmart** é a maior rede de varejo dos Estados Unidos e, em Orlando, costuma ser a parada mais prática para quem precisa de tudo em um só lugar. Nos **Supercenters**, o supermercado fica junto de roupas, brinquedos, eletrônicos, artigos de casa, material de praia e uma seção de farmácia.

Para quem aluga casa ou apartamento, é o endereço clássico da **compra do básico da estadia**: água, café da manhã, lanches para os parques, fraldas, protetor solar e itens de limpeza, geralmente com preços entre os mais acessíveis da região.

Uma boa sugestão é fazer a compra grande logo no **primeiro dia de viagem**, e escolher a unidade mais próxima do hotel ou da casa pelo mapa, já que há várias lojas espalhadas por Orlando e Kissimmee.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.walmart.com$$, $$✓ Confira no site ou no aplicativo qual unidade fica mais perto de onde você vai ficar.
✓ Muitas lojas têm farmácia, ótica e seção de eletrônicos, mas os serviços variam de unidade para unidade.
✓ Vale levar sacolas reutilizáveis para as compras de supermercado.
✓ Itens de uso nos parques, como poncho de chuva, garrafa e lanches, costumam ter preço menor aqui do que dentro dos parques.
✓ Em dias de fim de semana e à noite, o movimento aumenta. Para compras tranquilas, prefira a manhã.$$, $$1 a 2 horas$$, $$Manhã, em dias de semana$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Target$$, $$target$$, array['mercado','compras']::attraction_category[], $$A **Target** é uma das redes de varejo mais queridas pelos brasileiros em viagem: lojas amplas, organizadas e com um mix que mistura supermercado, moda, casa, brinquedos, beleza e papelaria em corredores fáceis de percorrer.

É conhecida pelas **marcas próprias**, como roupas e itens de casa de design cuidado, e pela seção infantil, boa para presentes e lembrancinhas. Muitas unidades têm também farmácia e um café dentro da loja.

Uma boa sugestão é separar um tempo para a **seção de brinquedos e a de casa**, onde costumam estar as melhores descobertas, e deixar o supermercado para o fim.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.target.com$$, $$✓ Baixe o aplicativo da Target antes de ir: ele mostra ofertas, cupons e a disponibilidade dos produtos na unidade.
✓ Muitas lojas têm Starbucks dentro, uma boa pausa durante as compras.
✓ As promoções mudam com frequência, então vale conferir os cartazes no início dos corredores.
✓ Para o Brasil, lembre-se de checar o limite de compras isento na volta.$$, $$1 a 2 horas$$, $$Manhã, em dias de semana$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Publix$$, $$publix$$, array['mercado']::attraction_category[], $$A **Publix** é a rede de supermercados mais tradicional da Flórida, nascida no próprio estado, e é reconhecida pelo atendimento cuidadoso, pelos corredores limpos e pela qualidade de padaria, açougue e hortifruti.

Seu item mais famoso é o **Pub Sub**, o sanduíche feito na hora no balcão de frios, que virou uma refeição prática e saborosa para levar aos parques ou comer na casa alugada.

Uma boa sugestão é conferir as **ofertas da semana**, em que muitos itens entram na promoção de leve um, pague um, e provar o sanduíche no balcão.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.publix.com$$, $$✓ Os sanduíches Pub Sub são feitos na hora e dá para escolher pão, recheio e molhos.
✓ As promoções de leve um e pague um mudam toda semana e podem ser vistas no site ou no aplicativo.
✓ Os preços costumam ser um pouco acima de redes como Walmart e ALDI, em troca de atendimento e variedade.
✓ Muitas unidades têm farmácia dentro da loja.$$, $$30 minutos a 1 hora$$, $$Manhã e início da tarde$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$ALDI$$, $$aldi$$, array['mercado']::attraction_category[], $$O **ALDI** é um supermercado de formato enxuto, com lojas menores e a maioria dos produtos de **marca própria**, o que ajuda a manter os preços entre os mais baixos do mercado americano.

Funciona bem para quem aluga casa e quer abastecer a estadia sem gastar muito: leite, pães, frios, frutas, congelados, snacks e itens de café da manhã, em corredores simples e rápidos de percorrer.

Uma boa sugestão é aproveitar o **corredor de ofertas especiais**, que muda toda semana com itens sazonais, de utilidades a produtos de verão.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.aldi.us$$, $$✓ Leve uma moeda de 25 centavos: os carrinhos são liberados com ela, e ela volta quando o carrinho é devolvido.
✓ Leve sacolas reutilizáveis, pois as sacolas são cobradas e você mesmo embala as compras.
✓ Os produtos são em maioria de marca própria, então nem sempre há as marcas conhecidas.
✓ As lojas são menores, com menos variedade que um Walmart ou uma Publix, mas com ótimo custo-benefício.$$, $$30 minutos a 1 hora$$, $$Manhã, em dias de semana$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Whole Foods Market$$, $$whole-foods-market$$, array['mercado']::attraction_category[], $$O **Whole Foods Market** é a rede especializada em alimentos **naturais e orgânicos**, com foco em ingredientes de qualidade, produtos frescos e atenção a restrições alimentares.

É um ótimo endereço para quem busca opções **sem glúten, veganas ou vegetarianas**, além de saladas, pratos prontos, barras de comida quente e uma boa seleção de cafés, chás e vinhos.

Uma boa sugestão é montar um **almoço rápido** nos balcões de comida pronta e levar os itens para comer ao ar livre ou na casa alugada.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.wholefoodsmarket.com$$, $$✓ Os preços costumam ser mais altos que os de supermercados tradicionais.
✓ Os balcões de comida pronta são uma alternativa prática ao fast food.
✓ Os rótulos indicam com clareza produtos sem glúten, veganos e orgânicos, o que ajuda quem tem restrições.
✓ Para economizar, vale comparar os itens da marca própria 365.$$, $$30 minutos a 1 hora$$, $$Manhã e início da tarde$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Trader Joe's$$, $$trader-joes$$, array['mercado']::attraction_category[], $$O **Trader Joe's** é um mercado de lojas pequenas e clima descontraído, famoso pela grande quantidade de produtos de **marca própria** a preços justos e por itens que não se encontram em outras redes.

É um lugar querido para quem gosta de descobrir **snacks, congelados, queijos, chocolates e molhos** diferentes, além de flores e vinhos a bons preços. Muitos visitantes aproveitam para levar produtos de presente.

Uma boa sugestão é reservar um tempo para **explorar sem pressa** e provar as novidades, já que a loja é pequena, mas cheia de surpresas.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.traderjoes.com$$, $$✓ As lojas são menores e podem ficar cheias nos fins de semana e no fim da tarde.
✓ Quase tudo é de marca própria, então não espere marcas conhecidas.
✓ Os produtos congelados e os snacks costumam ser os mais procurados.
✓ Leve uma sacola reutilizável para as compras.$$, $$30 minutos a 1 hora$$, $$Manhã, em dias de semana$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Sprouts Farmers Market$$, $$sprouts-farmers-market$$, array['mercado']::attraction_category[], $$O **Sprouts Farmers Market** é um mercado com foco em **frutas, legumes e verduras frescos**, que ficam logo na entrada, em um layout que lembra uma feira.

Também tem corredores de produtos naturais e orgânicos, itens a granel, suplementos e opções para dietas específicas, o que o torna uma boa escolha para quem quer comer de forma mais leve durante a viagem.

Uma boa sugestão é montar uma **cesta de frutas e lanches saudáveis** para os dias de parque.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.sprouts.com$$, $$✓ Os produtos a granel permitem comprar só a quantidade necessária, ótimo para uma estadia curta.
✓ O hortifruti fica na entrada e costuma ter promoções semanais.
✓ Há boas opções de snacks naturais para levar aos parques.
✓ Confira as promoções da semana no site ou no aplicativo.$$, $$30 minutos a 1 hora$$, $$Manhã e início da tarde$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Seabra Foods$$, $$seabra-foods$$, array['mercado']::attraction_category[], $$O **Seabra Foods** é um supermercado voltado a produtos **brasileiros e internacionais**, ótimo para quem sente falta de itens do dia a dia do Brasil durante a viagem.

Nas prateleiras é possível encontrar produtos de mercearia, congelados, doces, biscoitos e bebidas que lembram o sabor de casa, além de opções de açougue e padaria em algumas unidades.

Uma boa sugestão é passar por lá para **matar a saudade de itens brasileiros** ou comprar ingredientes para uma refeição da casa alugada.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://seabrafoods.com$$, $$✓ Os itens importados costumam ter preço acima do que se paga no Brasil.
✓ Os serviços e o mix de produtos variam de unidade para unidade, então confira a loja mais próxima.
✓ É uma boa opção para quem viaja com crianças que sentem falta de lanches brasileiros.
✓ Confirme os horários no site oficial antes de ir.$$, $$30 minutos a 1 hora$$, $$Manhã e início da tarde$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$SuperBras$$, $$superbras$$, array['mercado']::attraction_category[], $$O **SuperBras** é um supermercado brasileiro localizado na região da **International Drive**, em Orlando, com produtos de mercearia, carnes, congelados, bebidas e itens de limpeza.

Tem também uma **lanchonete** com salgados e doces típicos brasileiros, que ajuda quem quer um lanche rápido com sabor de casa sem sair da região turística.

Uma boa sugestão é parar lá para um **café da manhã brasileiro** ou um salgado no meio do dia de compras.

Verifique as informações atualizadas, os horários e o endereço da unidade antes de ir.$$, $$✓ Fica em uma região de fácil acesso para quem está hospedado perto da International Drive.
✓ A lanchonete é uma opção prática para um lanche rápido.
✓ Os horários podem variar nos domingos e feriados, então confirme antes de ir.
✓ Os produtos importados costumam ter preço acima do que se paga no Brasil.$$, $$30 minutos a 1 hora$$, $$Manhã e início da tarde$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Rokka's Market$$, $$rokkas-market$$, array['mercado']::attraction_category[], $$O **Rokka's Market** é um mercado na região de **Dr. Phillips**, em Orlando, com açougue, padaria, hortifruti e uma seleção de produtos brasileiros e especialidades italianas.

Combina mercado e **restaurante no sistema de buffet**, o que o torna uma boa parada para quem quer almoçar e, na mesma visita, comprar itens para a casa.

Uma boa sugestão é conhecer a **padaria e o açougue** e aproveitar o buffet em um dia de compras na região.

Verifique as informações atualizadas, os horários e o endereço da unidade antes de ir.$$, $$✓ Fica na região de Dr. Phillips, perto de restaurantes e opções de compras.
✓ Aproveite para almoçar no buffet durante a visita.
✓ Confira os horários e o cardápio do dia antes de ir, pois podem mudar.
✓ É uma boa alternativa para quem procura sabores brasileiros e italianos em um só lugar.$$, $$1 a 2 horas$$, $$Manhã e horário de almoço$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Walgreens$$, $$walgreens$$, array['compras']::attraction_category[], $$A **Walgreens** é uma das maiores redes de farmácias dos Estados Unidos, com lojas espalhadas por Orlando que vendem de medicamentos sem receita a itens de higiene, beleza, lanches e artigos de viagem.

É a parada ideal para quem esqueceu algo na mala: **protetor solar, repelente, curativos, remédios de uso comum, escova de dente e carregadores**, tudo em um lugar só.

Uma boa sugestão é passar na Walgreens logo no início da viagem para comprar **protetor solar e itens básicos de saúde** para os dias de parque.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.walgreens.com$$, $$✓ Muitas unidades têm atendimento até tarde e algumas funcionam por mais tempo, mas confira o horário da loja mais próxima.
✓ Protetor solar, repelente e remédios de uso comum costumam ter preço bem menor aqui do que nas lojas dos parques.
✓ Para medicamentos que exigem receita, consulte o atendimento da farmácia antes de ir.
✓ Há também cartões-postais, doces e lembrancinhas para quem busca algo simples.$$, $$15 a 30 minutos$$, $$Qualquer horário$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$CVS Pharmacy$$, $$cvs-pharmacy$$, array['compras']::attraction_category[], $$A **CVS Pharmacy** é outra grande rede de farmácias americana, com lojas fáceis de encontrar em Orlando e um mix que vai de medicamentos a beleza, higiene, snacks e itens de viagem.

Costuma ter um bom **corredor de beleza e cuidados com a pele**, além de produtos de primeiros socorros, repelentes, protetor solar e itens para crianças.

Uma boa sugestão é conferir se há uma unidade perto do hotel para **resolver imprevistos de saúde** sem precisar se deslocar muito.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.cvs.com$$, $$✓ Confira o horário da unidade mais próxima, pois alguns locais funcionam até mais tarde.
✓ Protetor solar, repelente e remédios de uso comum são os itens mais procurados por turistas.
✓ Para medicamentos que exigem receita, consulte o atendimento da farmácia.
✓ Em algumas lojas Target há uma CVS dentro da loja.$$, $$15 a 30 minutos$$, $$Qualquer horário$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Ross Dress for Less$$, $$ross-dress-for-less$$, array['compras']::attraction_category[], $$A **Ross Dress for Less** é uma rede de lojas de desconto que vende roupas, calçados, acessórios e itens de casa de marcas conhecidas por preços menores que os de loja de departamento.

O estoque muda o tempo todo, e é isso que faz o charme da busca: dá para encontrar **roupas de marca, calçados, malas e artigos de cama e banho** com bons descontos.

Uma boa sugestão é reservar **tempo para garimpar**, pois os melhores achados aparecem quando se olha com calma.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.rossstores.com$$, $$✓ O estoque muda com frequência: se gostar de uma peça, vale levar na hora.
✓ Confira os tamanhos, que seguem o padrão americano.
✓ As filas nos caixas podem ser longas em horários de pico.
✓ Confira a política de troca antes de comprar.$$, $$1 a 2 horas$$, $$Manhã, em dias de semana$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Marshalls$$, $$marshalls$$, array['compras']::attraction_category[], $$A **Marshalls** é uma loja de desconto que reúne roupas, calçados, bolsas, itens de casa e presentes de marcas conhecidas por preços abaixo dos de loja de departamento.

A graça está no **garimpo**: o estoque muda sempre, e em uma mesma visita é possível encontrar de moda infantil a utilidades domésticas e malas.

Uma boa sugestão é começar pelas **seções de bolsas, calçados e casa**, onde muitos visitantes encontram os melhores achados.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.marshalls.com$$, $$✓ O estoque muda com frequência, então não deixe para voltar depois.
✓ Confira os tamanhos, que seguem o padrão americano.
✓ Dê uma olhada com calma nas araras, pois as peças ficam misturadas.
✓ Confira a política de troca no caixa.$$, $$1 a 2 horas$$, $$Manhã, em dias de semana$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$T.J. Maxx$$, $$tj-maxx$$, array['compras']::attraction_category[], $$A **T.J. Maxx** é uma loja de desconto da mesma rede da Marshalls e da HomeGoods, com roupas, calçados, bolsas, perfumes, itens de casa e presentes de marcas conhecidas a preços menores.

É muito procurada pelos visitantes que gostam de **garimpar**: a variedade é grande e o estoque muda com frequência, o que torna cada visita diferente.

Uma boa sugestão é olhar as **seções de roupas e calçados de marca, bolsas e artigos de casa**, onde costumam estar os achados.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://tjmaxx.tjx.com$$, $$✓ O estoque muda com frequência, então vale levar a peça quando encontrar algo de que gostou.
✓ Os tamanhos seguem o padrão americano.
✓ Confira com atenção as etiquetas de preço e a política de troca.
✓ Há uma seção de presentes e itens de decoração que pode render boas lembranças.$$, $$1 a 2 horas$$, $$Manhã, em dias de semana$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Burlington$$, $$burlington$$, array['compras']::attraction_category[], $$A **Burlington** é uma rede de lojas de desconto com roupas, calçados, acessórios, itens de casa e uma boa seção infantil e de bebês, tudo com preços menores que os de lojas de departamento.

É uma opção interessante para quem precisa renovar o guarda-roupa da família, com **roupas de frio, malas e artigos de cama e banho** em bons preços.

Uma boa sugestão é conferir a **seção infantil e de bebês**, muito procurada por quem viaja com crianças.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.burlington.com$$, $$✓ O estoque muda com frequência: vale levar o que gostar na hora.
✓ Os tamanhos seguem o padrão americano.
✓ As lojas costumam ser grandes, então reserve tempo para percorrer com calma.
✓ Confira a política de troca no caixa.$$, $$1 a 2 horas$$, $$Manhã, em dias de semana$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$dd's DISCOUNTS$$, $$dds-discounts$$, array['compras']::attraction_category[], $$A **dd's DISCOUNTS** é uma rede de lojas de desconto ligada à Ross, com roupas, calçados, acessórios e itens de casa por preços ainda mais baixos.

Atende bem a quem procura **peças básicas e artigos do dia a dia** sem gastar muito, com seção infantil e de casa.

Uma boa sugestão é reservar um tempo para **olhar com calma**, já que o estoque muda e os achados aparecem em meio às araras.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.ddsdiscounts.com$$, $$✓ O estoque muda com frequência, então não deixe a compra para depois.
✓ Os tamanhos seguem o padrão americano.
✓ As lojas costumam ser mais simples que as de outras redes, com foco no preço.
✓ Confira a política de troca antes de comprar.$$, $$1 hora$$, $$Manhã, em dias de semana$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Five Below$$, $$five-below$$, array['compras']::attraction_category[], $$A **Five Below** é uma loja de variedades voltada ao público jovem e infantil, com itens de **preço baixo**, em geral até US$ 5, e uma área com produtos um pouco mais caros.

Vende brinquedos, jogos, artigos de beleza, capas de celular, snacks, papelaria e itens de decoração, ótima para **lembrancinhas e presentes** que cabem no bolso.

Uma boa sugestão é levar as crianças para **escolher uma lembrança** dentro de um valor combinado.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.fivebelow.com$$, $$✓ É uma boa alternativa para presentes e lembranças de baixo custo.
✓ As crianças costumam adorar, então combine antes quanto cada uma pode gastar.
✓ Os preços podem mudar, então confira as etiquetas.$$, $$30 minutos a 1 hora$$, $$Qualquer horário$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Dollar Tree$$, $$dollar-tree$$, array['compras']::attraction_category[], $$A **Dollar Tree** é uma rede de lojas de variedades com itens de **baixo custo**, a preços fixos e muito acessíveis, de artigos de festa e papelaria a utilidades domésticas e snacks.

É uma parada prática para quem precisa de **itens simples para a estadia**, como produtos de limpeza, utensílios, artigos de festa e lembrancinhas.

Uma boa sugestão é passar por lá para comprar **itens de uso rápido** que não valem um gasto maior, como capas de chuva e organizadores.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.dollartree.com$$, $$✓ Os preços são baixos, mas confira sempre a qualidade dos produtos.
✓ Os estoques variam bastante de loja para loja.
✓ É uma boa opção para artigos de festa e papelaria.
✓ Vale a pena para itens de uso curto durante a viagem.$$, $$30 minutos$$, $$Qualquer horário$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Dollar General$$, $$dollar-general$$, array['compras']::attraction_category[], $$A **Dollar General** é uma rede de lojas de conveniência de desconto, com itens de mercearia básica, limpeza, higiene, utilidades domésticas e artigos de papelaria a preços acessíveis.

As lojas são pequenas e fáceis de percorrer, úteis para quem precisa de **itens básicos** sem ir a um supermercado grande.

Uma boa sugestão é usar a loja como **parada rápida** para repor itens simples durante a estadia.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.dollargeneral.com$$, $$✓ As lojas são menores, com menos variedade que um supermercado completo.
✓ É uma opção prática para itens básicos de higiene e limpeza.
✓ Os preços são acessíveis, mas o estoque varia de unidade para unidade.
✓ Confira o horário da loja mais próxima.$$, $$15 a 30 minutos$$, $$Qualquer horário$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Macy's$$, $$macys$$, array['compras']::attraction_category[], $$A **Macy's** é uma das lojas de departamento mais tradicionais dos Estados Unidos, com roupas, calçados, bolsas, perfumes, cosméticos, joias e artigos de casa de marcas conhecidas.

Costuma ter **promoções sazonais** que valem a visita, e atende a vários perfis, de moda casual a itens para presente e para casa.

Uma boa sugestão é conferir a **seção de cosméticos e perfumes** e as vitrines de promoção, onde costumam aparecer boas ofertas.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.macys.com$$, $$✓ Confira as promoções no site ou no aplicativo antes de ir.
✓ Os tamanhos seguem o padrão americano.
✓ As lojas costumam ficar em shoppings, o que permite combinar a visita com outras compras.
✓ Guarde as notas fiscais para trocas e para a conferência na alfândega.$$, $$1 a 2 horas$$, $$Manhã e início da tarde$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Dillard's$$, $$dillards$$, array['compras']::attraction_category[], $$A **Dillard's** é uma loja de departamento de perfil mais sofisticado, com roupas, calçados, acessórios, cosméticos e artigos de casa de marcas conhecidas, em ambientes amplos e organizados.

Atende bem a quem procura **moda de qualidade e presentes**, com liquidações importantes em alguns períodos do ano.

Uma boa sugestão é olhar as **seções de liquidação**, onde peças de marca podem aparecer com descontos relevantes.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.dillards.com$$, $$✓ Confira se há liquidação na época da sua viagem.
✓ Os tamanhos seguem o padrão americano.
✓ As lojas costumam ficar em shoppings, o que permite combinar a visita com outras compras.
✓ Guarde as notas fiscais para trocas.$$, $$1 a 2 horas$$, $$Manhã e início da tarde$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Nordstrom$$, $$nordstrom$$, array['compras']::attraction_category[], $$A **Nordstrom** é uma loja de departamento de perfil elegante, conhecida pelo atendimento cuidadoso e pela seleção de moda, calçados, bolsas, cosméticos e acessórios de marcas conhecidas.

É uma boa escolha para quem quer **comprar com calma, com atendimento atencioso** e uma curadoria de marcas mais refinada.

Uma boa sugestão é separar um tempo para as **seções de calçados e de beleza**, em geral muito bem servidas.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.nordstrom.com$$, $$✓ O atendimento costuma ser um diferencial, então peça ajuda aos vendedores.
✓ Os tamanhos seguem o padrão americano.
✓ Os preços tendem a ser mais altos que os de lojas de desconto.
✓ Existe também a Nordstrom Rack, versão de desconto da rede.$$, $$1 a 2 horas$$, $$Manhã e início da tarde$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$HomeGoods$$, $$homegoods$$, array['compras']::attraction_category[], $$A **HomeGoods** é uma loja de desconto especializada em **casa e decoração**, com móveis pequenos, almofadas, utensílios de cozinha, artigos de cama e mesa, velas e itens de presente.

O estoque muda o tempo todo, e a graça é encontrar peças charmosas e originais a preços menores que os de lojas especializadas.

Uma boa sugestão é percorrer **sem pressa as seções de cozinha e decoração**, onde estão os achados mais cobiçados.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.homegoods.com$$, $$✓ O estoque muda com frequência: se gostou, leve na hora.
✓ Confira o tamanho e o peso das peças antes de comprar, para levar na mala.
✓ Há uma boa seleção de itens para presente.
✓ Confira a política de troca no caixa.$$, $$1 a 2 horas$$, $$Manhã, em dias de semana$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Williams-Sonoma$$, $$williams-sonoma$$, array['compras']::attraction_category[], $$A **Williams-Sonoma** é uma loja especializada em **utensílios e eletrodomésticos de cozinha**, com panelas, facas, assadeiras, itens de mesa e ingredientes especiais.

É um passeio agradável para quem gosta de cozinhar, com produtos de marcas renomadas e uma apresentação cuidadosa.

Uma boa sugestão é conhecer a seção de **utensílios e ingredientes**, ótima para presentes gastronômicos.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.williams-sonoma.com$$, $$✓ Os preços tendem a ser mais altos que os de lojas de desconto.
✓ Confira o peso e o tamanho das peças antes de comprar, para levar na mala.
✓ Eletrodomésticos podem ter voltagem diferente da do Brasil.
✓ A loja é ótima para presentes de cozinha.$$, $$30 minutos a 1 hora$$, $$Manhã e início da tarde$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$The Container Store$$, $$the-container-store$$, array['compras']::attraction_category[], $$A **The Container Store** é uma loja especializada em **organização**, com caixas, cestos, gavetas, prateleiras e soluções para armários, cozinhas, escritórios e malas.

Para quem viaja, é uma loja interessante para encontrar **organizadores de mala e itens práticos** que ajudam a manter tudo no lugar.

Uma boa sugestão é conhecer a seção de **viagem e organização de malas**, que costuma ter ideias úteis.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.containerstore.com$$, $$✓ Os organizadores de mala ajudam a aproveitar o espaço na volta.
✓ Confira o tamanho dos produtos antes de comprar.
✓ Os preços tendem a ser mais altos que os de lojas de desconto.
✓ A loja costuma ter soluções para armários e cozinhas.$$, $$30 minutos a 1 hora$$, $$Manhã e início da tarde$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Le Creuset$$, $$le-creuset$$, array['compras']::attraction_category[], $$A **Le Creuset** é a marca francesa de **panelas de ferro fundido esmaltado**, reconhecida pelas cores vibrantes e pela durabilidade, e muito desejada por quem gosta de cozinhar.

Além das panelas, a marca tem assadeiras, canecas, utensílios e peças de mesa, que também funcionam bem como presente.

Uma boa sugestão é conhecer a variedade de **cores e tamanhos** e comparar os preços com os do Brasil antes de decidir.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.lecreuset.com$$, $$✓ As peças de ferro fundido são pesadas, então pense no peso da mala.
✓ Compare os preços com os do Brasil antes de comprar.
✓ Peças menores, como canecas e utensílios, são boas opções de presente.
✓ Lembre-se do limite de compras isento na volta.$$, $$30 minutos a 1 hora$$, $$Manhã e início da tarde$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Best Buy$$, $$best-buy$$, array['compras']::attraction_category[], $$A **Best Buy** é a maior rede de **eletrônicos** dos Estados Unidos, com celulares, computadores, TVs, câmeras, fones de ouvido, videogames e acessórios de várias marcas.

É uma boa parada para quem procura **lançamentos de tecnologia** ou quer comparar modelos e preços com calma, com vendedores para tirar dúvidas.

Uma boa sugestão é pesquisar os preços **antes da viagem** e conferir se o produto é compatível com o Brasil.

Verifique as informações atualizadas, os horários e a unidade mais próxima no site oficial: https://www.bestbuy.com$$, $$✓ Confira a voltagem e o padrão de tomada dos aparelhos antes de comprar.
✓ Consulte a garantia: a cobertura pode não valer fora dos Estados Unidos.
✓ Lembre-se do limite de compras isento na volta ao Brasil.
✓ Guarde as notas fiscais e as caixas dos produtos.$$, $$1 a 2 horas$$, $$Manhã e início da tarde$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, true),
($$Drawn to Life (Cirque du Soleil)$$, $$cirque-du-soleil-drawn-to-life$$, array['passeio']::attraction_category[], $$O **Drawn to Life** é o espetáculo do **Cirque du Soleil em parceria com a Disney**, apresentado em Orlando, no complexo do **Disney Springs**. A produção leva o público ao universo da animação Disney com o estilo característico do Cirque: acrobacias, números aéreos, música e muita emoção.

A história acompanha **Julie**, uma menina corajosa que descobre um presente deixado pelo pai, já falecido: uma animação inacabada. Guiada por um lápis curioso, ela embarca em uma jornada pelas lembranças da infância com personagens e músicas dos clássicos da Disney.

O espetáculo dura cerca de **90 minutos** e agrada a todas as idades, de famílias com crianças a casais e grupos de amigos que gostam de arte e performance ao vivo.

Uma boa sugestão é combinar o show com um **passeio no Disney Springs**, chegando cedo para jantar, caminhar pelas lojas e ainda aproveitar o clima do complexo antes da sessão.

Verifique as informações atualizadas, os horários e os ingressos no site oficial: https://www.cirquedusoleil.com/drawn-to-life$$, $$✓ O show dura cerca de 90 minutos. Confira no site os dias e horários das sessões.
✓ Chegue com antecedência para estacionar, caminhar até o teatro e passar pela entrada com calma.
✓ O estacionamento no Disney Springs é gratuito e há opções próximas ao teatro. Veja no site oficial a melhor para o dia.
✓ O uso de flash e celular durante o espetáculo não é permitido.
✓ O teatro é acessível para cadeirantes. Em caso de necessidades específicas, entre em contato com a organização antes.
✓ Reserve com antecedência, principalmente para fins de semana, feriados e alta temporada.$$, $$Cerca de 90 minutos de espetáculo$$, $$Sessões da tarde e da noite$$, 'O ano todo', $$Famílias, casais e grupos de amigos$$, false)
) as v(name, slug, categories, description, tips, visit_time, best_time, season, audience, ac)
where c.slug = 'orlando'
  and not exists (select 1 from attractions a where a.city_id = c.id and a.slug = v.slug);
