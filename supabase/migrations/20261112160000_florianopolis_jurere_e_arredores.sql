-- Florianópolis: cadastro de Jurerê e arredores (bairro, Jurerê Open, restaurantes e cafés).
-- Tudo como rascunho (draft) e sem fotos: as fotos entram depois, do acervo da autora.
-- A experiência pessoal (personal_experience) fica em branco de propósito. Faixa de preço fica em branco: sem preço verificado.
insert into attractions (city_id, name, slug, categories, description, important_tips, average_visit_time, best_time_of_day, best_season, recommended_audience, weather_sensitive, has_air_conditioning, intense_physical_effort, requires_advance_purchase, requires_reservation, latitude, longitude, status)
select c.id, v.name, v.slug, v.cats, v.d, v.tips, v.visit, v.best, v.season, v.aud, v.ws, v.ac, v.eff, v.adv, v.res, v.la, v.lo, v.st::country_status
from cities c cross join (values
($$Jurerê$$, $$jurere$$, array['ponto_turistico','passeio']::attraction_category[], $$**Jurerê** fica no norte da Ilha de Santa Catarina, a cerca de 23 km do Centro de Florianópolis, e reúne dois perfis de bairro: o **Jurerê Internacional**, planejado, sofisticado e movimentado, e o **Jurerê Tradicional**, mais calmo e familiar. É um dos endereços mais procurados da ilha na alta temporada.

Entre os atrativos estão a **praia de mar calmo e águas esverdeadas**, os **beach clubs** (como o P12 e o 300 Cosmo Beach), a **gastronomia de alto nível**, com restaurantes, cafés e padarias, e o **Jurerê Open**, shopping a céu aberto no centro do bairro. Ao entardecer, o movimento passa do pôr do sol nos beach clubs para a vida noturna.

Uma boa forma de aproveitar é chegar à tarde, curtir a praia ou um beach club e fechar o dia com um jantar no bairro. Dá para circular a pé ou de bicicleta, e muitos hotéis emprestam bikes.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ O bairro se divide em Jurerê Internacional, mais sofisticado e agitado, e Jurerê Tradicional, mais calmo e familiar.
✓ Na alta temporada o movimento cresce bastante: chegue cedo para estacionar perto da praia e reserve os restaurantes e beach clubs mais procurados.
✓ O Jurerê Open reúne lojas, cafés e restaurantes e funciona das 10h às 20h de segunda a sábado, segundo o site oficial.
✓ Caminhar e pedalar são as formas mais simples de circular, e muitos hotéis emprestam bicicletas.
✓ O pôr do sol nos beach clubs é um dos programas mais procurados do fim de tarde.$$, $$Meio período a dia inteiro$$, $$Tarde e fim de tarde$$, $$Verão para praia; o ano todo para a gastronomia$$, $$Famílias, casais e grupos de amigos$$, true, false, false, false, false, -27.440266::numeric, -48.502748::numeric, 'draft'),
($$Jurerê Open$$, $$jurere-open$$, array['compras']::attraction_category[], $$O **Jurerê Open** (antigo Jurerê Open Shopping) é o **shopping a céu aberto** no centro de Jurerê Internacional, na Avenida dos Búzios, 1800. Reúne mais de 60 estabelecimentos entre **lojas de moda, decoração e itens essenciais**, **restaurantes, cafés e bares** e **serviços** como bancos, clínicas, lavanderia e salão de beleza.

O passeio mistura compras e lazer ao ar livre, com **eventos culturais e esportivos**, agenda semanal de programação e as áreas chamadas Plataformas (01, 02 e 03), além do **Lounge da Plataforma 1**. É um dos pontos de encontro do bairro para tomar um café, almoçar ou passar o fim de tarde.

Uma boa sugestão é ir no fim da tarde e combinar o passeio com a praia ou com um jantar no bairro.

Verifique as informações atualizadas, os horários e a programação no site oficial: https://jurereopen.com.br$$, $$✓ Segundo o site oficial, as plataformas funcionam de segunda a sábado, das 10h às 20h.
✓ Aos domingos e feriados a alimentação abre das 12h às 20h e as lojas das 14h às 20h.
✓ O Lounge da Plataforma 1 abre de domingo a quinta das 12h às 22h, e às sextas, sábados e feriados das 12h às 23h.
✓ Para compras, o foco é moda, decoração e produtos exclusivos; para comer, há restaurantes, cafés e bares, de pratos clássicos a opções gourmet.
✓ Entre os cafés está o Café Cultura, na Avenida dos Búzios, 1760.
✓ O espaço tem serviços como bancos, clínicas, lavanderia e salão de beleza, e programação de lazer para todas as idades.
✓ O shopping é a céu aberto: em dia de chuva forte, vale ter um plano B.$$, $$1 a 3 horas$$, $$Fim de tarde$$, $$O ano todo; mais movimento no verão$$, $$Famílias, casais e grupos de amigos$$, true, false, false, false, false, -27.441005::numeric, -48.501543::numeric, 'draft'),
($$Casa Orientales$$, $$casa-orientales$$, array['restaurante']::attraction_category[], $$A **Casa Orientales** é uma **churrascaria de influência uruguaia** em Jurerê, na Rodovia Jornalista Maurício Sirotsky Sobrinho, 5910. O nome faz referência ao Uruguai, e a casa trabalha com **carnes e vinhos**. Avaliações de visitantes destacam os cortes de carne no estilo uruguaio, bem preparados.

Uma boa sugestão é ir para um almoço ou jantar mais demorado, com foco nas carnes e na carta de vinhos.

Verifique as informações atualizadas, os horários e o cardápio nos canais oficiais da casa.$$, $$✓ Os horários variam entre as fontes consultadas (uma delas indica funcionamento até as 22h), então confirme antes de ir.
✓ Não confundir com o Orientales Carnes y Vinos, que fica em Saco Grande, no Square SC.$$, $$1h30 a 2 horas$$, $$Almoço ou jantar$$, $$O ano todo$$, $$Casais, famílias e grupos de amigos$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Lucila Bistrô$$, $$lucila-bistro$$, array['restaurante','cafe']::attraction_category[], $$O **Lucila Bistrô** fica em Jurerê, a poucos metros da praia, na Alameda César Nascimento, 322, e é conhecido pelo **café da manhã com buffet** e pela **padaria própria**, com pães, doces, sucos e cafés. A marca tem três espaços no bairro, e o funcionamento vai do café da manhã até a noite, segundo as listagens consultadas.

Avaliações de visitantes elogiam a padaria, com **croissants, bolos, pães e suco de laranja natural**. É uma boa parada para começar o dia antes da praia ou para um café da tarde.

Verifique as informações atualizadas, os horários e o cardápio nos canais oficiais da casa.$$, $$✓ Os horários variam entre as fontes (uma delas indica das 8h às 23h), então confirme antes de ir.
✓ A marca tem três espaços em Jurerê: confira em qual deles você vai se sentar.
✓ O café da manhã com buffet e a padaria são os grandes destaques da casa.
✓ Fica a poucos metros da praia, o que combina bem com um café da manhã antes do dia de sol.$$, $$1 a 2 horas$$, $$Manhã$$, $$O ano todo$$, $$Famílias, casais e grupos de amigos$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Nice Restaurante$$, $$nice-restaurante$$, array['restaurante']::attraction_category[], $$O **Nice Restaurante** é um **buffet de comida caseira** em Jurerê, na Rodovia Jornalista Maurício Sirotsky Sobrinho, 6040. Durante a semana serve **buffet livre ou por quilo**, com mais de 30 opções entre pratos quentes e frios. Aos sábados há **feijoada por quilo** e aos domingos um **buffet com frutos do mar, carnes e acompanhamentos**, também por quilo.

É uma opção prática para almoçar sem pressa e sem sair do bairro. Avaliações de visitantes elogiam a variedade e o preço.

Verifique as informações atualizadas, os horários e o cardápio no site oficial: https://www.nicerestaurante.com.br$$, $$✓ Segundo o site oficial, funciona de segunda a sexta das 11h30 às 15h, e aos sábados, domingos e feriados das 11h30 às 15h30.
✓ Fora da temporada, o buffet livre costuma ser servido durante a semana, segundo comentários de clientes.
✓ Sábado é dia de feijoada por quilo, e domingo de buffet com frutos do mar e carnes.
✓ Telefones do restaurante: (48) 3282-0328 e (48) 99187-2600.
✓ Não confundir com o Estação 261, que também serve buffet por quilo e fica na Avenida das Raias.$$, $$1 hora$$, $$Almoço$$, $$O ano todo$$, $$Famílias e grupos de amigos$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Paniamo$$, $$paniamo$$, array['restaurante']::attraction_category[], $$O **Paniamo** é um **restaurante em formato de buffet** em Jurerê, com endereço indicado na Rodovia Jornalista Maurício Sirotsky Sobrinho, 5637, loja 01. Aparece em guias locais entre as casas bem avaliadas do bairro, ao lado do Nice Restaurante.

Uma boa sugestão é conferir o horário antes de ir, já que as casas de buffet da região costumam concentrar o movimento no almoço.

Verifique as informações atualizadas, os horários e o cardápio nos canais oficiais da casa.$$, $$✓ O endereço varia entre as fontes consultadas (a empresa aparece registrada no número 5135), então confirme antes de ir.
✓ Confira o horário de funcionamento diretamente com a casa: as listagens não coincidem.
✓ Guias do bairro citam o Paniamo e o Nice Restaurante entre as boas opções de buffet em Jurerê.$$, $$1 hora$$, $$Almoço$$, $$O ano todo$$, $$Famílias e grupos de amigos$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Café Cultura de Jurerê$$, $$cafe-cultura-de-jurere$$, array['cafe']::attraction_category[], $$O **Café Cultura de Jurerê** foi a primeira unidade da rede no Norte da Ilha, inaugurada em janeiro de 2019 no Jurerê Open, na Avenida dos Búzios, 1760, Bloco 1, Sala 9. O espaço tem 128 m², cerca de 54 lugares e um **lounge no calçadão**, com vista para o movimento do bairro.

O cardápio é focado em **cafés especiais**, com opções variadas de salgados e doces. Em 2019, a divulgação da abertura citava também espaço para crianças e para pets.

Verifique as informações atualizadas, os horários e o cardápio no site oficial: https://cafeculturabrasil.com$$, $$✓ O horário divulgado na abertura, em 2019, era das 9h às 21h; confirme o horário atual antes de ir.
✓ O café fica dentro do Jurerê Open, que funciona das 10h às 20h de segunda a sábado, segundo o site oficial do shopping.
✓ O lounge no calçadão é bom para quem quer ver o movimento do bairro tomando um café.
✓ A rede Café Cultura tem unidades em outros pontos de Florianópolis, em São José, Balneário Camboriú, Criciúma e Tubarão.$$, $$30 minutos a 1 hora$$, $$Manhã e tarde$$, $$O ano todo$$, $$Famílias, casais e grupos de amigos$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Café Cultura do Square$$, $$cafe-cultura-do-square$$, array['cafe']::attraction_category[], $$O **Café Cultura do Square** é a unidade da rede no Square SC, complexo corporativo na Rodovia José Carlos Daux (SC-401), loja 25, em uma das regiões de negócios que mais crescem de Florianópolis. Fica na região da SC-401, e não dentro de Jurerê.

A rede é conhecida pelos **cafés especiais**, e o cardápio reúne também salgados e doces. É uma boa pausa para quem passa pela SC-401 a caminho das praias do norte.

Verifique as informações atualizadas, os horários e o cardápio no site oficial: https://cafeculturabrasil.com$$, $$✓ O horário divulgado na abertura, em 2019, era de segunda a sábado, das 8h às 20h; confirme o horário atual antes de ir.
✓ Uma listagem indica que a unidade não abre aos domingos.
✓ Por ficar em um complexo corporativo, o movimento costuma acompanhar o horário comercial.$$, $$30 minutos a 1 hora$$, $$Manhã e tarde$$, $$O ano todo$$, $$Casais e grupos de amigos$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$The Coffee$$, $$the-coffee-jurere$$, array['cafe']::attraction_category[], $$A **The Coffee** é uma franquia de cafeteria que, em Jurerê Internacional, divide com a Breadbox um **espaço compacto, no formato de pequeno food hall**, de design minimalista e com proposta de brunch. A combinação reúne **café** e **padaria de fermentação natural** no mesmo lugar.

Uma boa sugestão é ir para um café da manhã ou brunch, aproveitando as duas casas lado a lado.

Verifique as informações atualizadas, os horários e o cardápio nos canais oficiais da casa.$$, $$✓ A The Coffee funciona no mesmo espaço da Breadbox, em Jurerê Internacional, um pequeno food hall.
✓ A Breadbox divulga atendimento de segunda a sexta das 7h30 às 20h, e aos sábados e domingos das 8h às 20h; confirme o horário da cafeteria antes de ir.
✓ O espaço é compacto, então em horários de pico pode haver espera por mesa.$$, $$30 minutos a 1 hora$$, $$Manhã$$, $$O ano todo$$, $$Casais e grupos de amigos$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Breadbox$$, $$breadbox-jurere$$, array['cafe']::attraction_category[], $$A **Breadbox** é uma **micropadaria** que trabalha com **pães de fermentação natural**, além de **ovos, sanduíches, pizza romana, granola, bolos, sobremesas e bebidas**. A unidade de Jurerê Internacional ocupa um espaço compacto, no formato de pequeno food hall, que também abriga a The Coffee.

O ambiente tem design minimalista e proposta de brunch, e é uma boa parada para o café da manhã ou um lanche antes da praia.

Verifique as informações atualizadas, os horários e o cardápio no site oficial: https://breadbox.com.br$$, $$✓ A marca divulga atendimento de segunda a sexta das 7h30 às 20h, e aos sábados e domingos das 8h às 20h; confirme o horário da unidade de Jurerê antes de ir.
✓ O site oficial permite pedir online e retirar na padaria.
✓ O espaço é compacto e divide o ambiente com a The Coffee.
✓ Os pães de fermentação natural e a pizza romana estão entre os destaques do cardápio.$$, $$30 minutos a 1 hora$$, $$Manhã$$, $$O ano todo$$, $$Casais e grupos de amigos$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Devito Cucina Italiana$$, $$devito-cucina-italiana$$, array['restaurante']::attraction_category[], $$O **Devito Cucina Italiana** é um restaurante italiano e **piano bar** do Grupo Novo Brasil, com **massas feitas à mão** e foco em clássicos da cozinha italiana. A casa abriu no Centro de Florianópolis, na Rua Bocaiúva, 2198, depois de uma primeira unidade em Jurerê Internacional.

O cardápio é desenhado pelos chefs Renato Carioni, Hugo Olaechea e Sara Sanchez, e visitantes elogiam pratos como o tortellini de ossobuco com molho de trufas, além do atendimento e da música ambiente.

Verifique as informações atualizadas, os horários e o cardápio nos canais oficiais da casa.$$, $$✓ Listagens antigas indicam funcionamento diário, do meio-dia à meia-noite; confirme o horário atual antes de ir.
✓ A casa trabalha com reservas: o telefone divulgado é (48) 3028-1881.
✓ Já houve almoço executivo em dias de semana: pergunte se continua disponível.
✓ A casa tem ou teve unidades em Jurerê Internacional e no Centro: confirme em qual você vai jantar.$$, $$1h30 a 2 horas$$, $$Jantar$$, $$O ano todo$$, $$Casais, famílias e grupos de amigos$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Pizzaria do Nêne$$, $$pizzaria-do-nene$$, array['restaurante']::attraction_category[], $$A **Pizzaria do Nêne** é uma pizzaria em Jurerê, com endereço na Rodovia Jornalista Maurício Sirotsky Sobrinho, 5880, em funcionamento desde 2020. É bem avaliada por visitantes: o Restaurant Guru mostra nota 4,9 em cerca de 960 avaliações.

O funcionamento é noturno, o que combina com um jantar descontraído depois de um dia de praia.

Verifique as informações atualizadas, os horários e o cardápio no Instagram oficial: https://www.instagram.com/pizzariadonene$$, $$✓ O Instagram da casa divulgou atendimento de terça a domingo a partir das 18h30, e às sextas e sábados das 19h à meia-noite; confirme o horário atual antes de ir.
✓ Listagens antigas mostram a pizzaria na Daniela (Avenida das Palmeiras, 461): confirme o endereço antes de ir.
✓ O telefone divulgado no Tripadvisor é (48) 98458-6913.$$, $$1h30$$, $$Jantar$$, $$O ano todo$$, $$Famílias, casais e grupos de amigos$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Estação 261$$, $$estacao-261$$, array['restaurante']::attraction_category[], $$A **Estação 261** é um restaurante de **buffet no almoço, com pratos de inspiração internacional**, na Avenida das Raias, 261, na entrada de Jurerê Internacional. Na alta temporada, de dezembro a março, a casa também abre à noite com **cardápio à la carte**, de frutos do mar, entradas, massas, carnes, risotos e sobremesas. Faz ainda buffet para eventos e catering.

É uma boa opção para o almoço de quem está no bairro e quer variedade sem pressa.

Verifique as informações atualizadas, os horários e o cardápio no site oficial: https://www.estacao261.com.br$$, $$✓ Um guia antigo indica almoço de segunda a domingo, das 11h30 às 14h30 (até as 15h aos fins de semana), e jantar à la carte de terça a sábado na alta temporada; confirme o horário atual.
✓ O telefone divulgado é (48) 3282-9944.
✓ Não confundir com o Estação 261 Praia Clube, que fica em Coqueiros, no Clube 12 de Agosto.
✓ O Nice Restaurante, também de buffet por quilo, fica na mesma região de Jurerê.$$, $$1 hora$$, $$Almoço$$, $$O ano todo; jantar na alta temporada$$, $$Famílias e grupos de amigos$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Café François$$, $$cafe-francois$$, array['cafe']::attraction_category[], $$O **Café François** é uma **padaria e café de inspiração francesa**, aberta em 2008 por Benoit Cousin, que trouxe da França a experiência em panificação e confeitaria. A casa é conhecida pelos **pães artesanais, doces refinados e cafés especiais**, e tem unidades em Coqueiros, Santo Antônio de Lisboa, Saco dos Limões e Jurerê.

Visitantes recomendam a **pâtisserie** de estilo francês e o omelete de claras. É uma boa pausa para o café da manhã ou para um lanche no meio do passeio.

Verifique as informações atualizadas, os horários e o cardápio nos canais oficiais da casa.$$, $$✓ A unidade de Jurerê aparece nas listagens na Rodovia Jornalista Maurício Sirotsky Sobrinho, 5674.
✓ Guias indicam que a casa fecha às segundas e abre às 9h nos demais dias; confirme o horário atual antes de ir.
✓ Em horários de pico, o serviço pode demorar, segundo avaliações.$$, $$1 hora$$, $$Manhã$$, $$O ano todo$$, $$Casais, famílias e grupos de amigos$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Uliano$$, $$uliano-jurere$$, array['restaurante']::attraction_category[], $$O **Uliano** é um restaurante de **buffet self-service, com opção de buffet livre e por quilo**, em Jurerê, na Rodovia Jornalista Maurício Sirotsky Sobrinho, 5756. A proposta é unir qualidade e preço justo, com funcionamento voltado ao almoço.

É uma opção prática para quem quer almoçar bem entre uma praia e outra, sem pressa.

Verifique as informações atualizadas, os horários e o cardápio nos canais oficiais da casa.$$, $$✓ O Tripadvisor indica almoço, em geral das 11h30 às 14h30 durante a semana e até as 15h aos fins de semana; a página do Facebook cita almoço de segunda a domingo.
✓ O telefone divulgado é (48) 99958-1144.
✓ Confirme o horário antes de ir, porque as fontes consultadas não coincidem.$$, $$1 hora$$, $$Almoço$$, $$O ano todo$$, $$Famílias e grupos de amigos$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Olivia Cucina Jurerê$$, $$olivia-cucina-jurere$$, array['restaurante']::attraction_category[], $$O **Olivia Cucina Jurerê** é o restaurante de **cozinha italiana contemporânea** do Grupo Noma na Avenida dos Salmões, 1200, em Jurerê Internacional, e virou ponto de encontro das famílias do bairro. O cardápio reúne **massas frescas feitas à mão** (como tagliatelle, tortelli, lasagna e nhoque), **pizzas artesanais** e carnes, além de drinks.

Visitantes elogiam as bebidas e pratos como a burrata e o risoto. Uma boa sugestão é ir para um jantar em família ou com amigos, em um ambiente descontraído.

Verifique as informações atualizadas, os horários e o cardápio no site oficial: https://www.oliviacucina.com.br$$, $$✓ As listagens divergem sobre os horários (uma delas indica que a casa fecha às terças): confirme antes de ir.
✓ O telefone divulgado é +55 48 99124-0027.
✓ O grupo tem outra unidade do Olivia Cucina no Armazém Rita Maria, no Centro de Florianópolis.
✓ As avaliações são mistas: os drinks e pratos como burrata e risoto aparecem entre os mais elogiados.$$, $$1h30 a 2 horas$$, $$Jantar$$, $$O ano todo$$, $$Famílias, casais e grupos de amigos$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Noma Sushi$$, $$noma-sushi$$, array['restaurante']::attraction_category[], $$O **Noma Sushi** é o restaurante de **culinária japonesa e asiática** do Grupo Noma em Jurerê Internacional, na Avenida dos Salmões, 1200. O cardápio traz **sushis e sashimis**, **pratos quentes** e um toque gourmet, em um ambiente chique e despojado.

O fundador do grupo, Ivo Pires, descreve a proposta como um lugar animado e descontraído, para amigos e casais, sem ser uma casa noturna. A marca tem ainda uma unidade no rooftop do Centro, de frente para a Ponte Hercílio Luz.

Verifique as informações atualizadas, os horários e o cardápio no site oficial: https://www.nomasushi.com.br$$, $$✓ O funcionamento é noturno: as listagens indicam abertura a partir das 18h30 ou 19h, e fechamento mais tarde às sextas e sábados.
✓ A página do Facebook da casa cita fechamento às terças; confirme o horário antes de ir.
✓ O telefone divulgado é (48) 99170-2729.
✓ As avaliações são mistas: há elogios à frescura dos peixes e ao ambiente, e algumas críticas ao serviço.$$, $$1h30 a 2 horas$$, $$Jantar$$, $$O ano todo$$, $$Casais e grupos de amigos$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Folha Beach Club$$, $$folha-beach-club$$, array['restaurante','beach_club']::attraction_category[], $$O **Folha Beach Club** fica à beira-mar em Jurerê Internacional, dentro do complexo do P12, na Servidão José Cardoso de Oliveira. Combina **dia de praia e noites de verão**, com **cozinha mediterrânea** assinada pelos chefs peruanos Hugo Olaechea e Sara Sanchez, com peixes e frutos do mar, e **feijoada aos fins de semana**.

A proposta é uma experiência elegante e descontraída, com música e vista para o mar. Uma boa sugestão é ir no fim da tarde e emendar o pôr do sol com o jantar.

Verifique as informações atualizadas, os horários e o cardápio nos canais oficiais da casa.$$, $$✓ As reservas são feitas pelo telefone (48) 3028-6614, divulgado na maior parte das fontes.
✓ O anúncio de abertura listava funcionamento de quarta a domingo; confirme o horário atual antes de ir.
✓ Por ficar dentro do complexo do P12, dá para combinar com o clima de beach club do bairro.
✓ A feijoada é uma atração dos fins de semana.$$, $$2 a 4 horas$$, $$Fim de tarde$$, $$Verão$$, $$Casais e grupos de amigos$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Subway de Jurerê$$, $$subway-jurere$$, array['restaurante']::attraction_category[], $$O **Subway de Jurerê** é a unidade do bairro da rede de lanchonetes Subway, conhecida pelos **sanduíches montados na hora**, com o pão, o recheio e os molhos escolhidos pelo cliente. É uma opção rápida para uma refeição simples entre a praia e os passeios do bairro.

Uma boa sugestão é usar como alternativa prática nos dias em que o restaurante de buffet ou o beach club não estão nos planos.

Verifique as informações atualizadas, os horários e o cardápio nos canais oficiais da rede.$$, $$✓ Confira o endereço e o horário da unidade no localizador de lojas do Subway antes de ir.
✓ Os sanduíches são montados na hora, com escolha de pão, recheios e molhos.
✓ É uma boa opção para uma refeição rápida em dia de praia.$$, $$30 minutos$$, $$Almoço ou lanche$$, $$O ano todo$$, $$Famílias e grupos de amigos$$, false, false, false, false, false, null::numeric, null::numeric, 'draft')
) as v(name, slug, cats, d, tips, visit, best, season, aud, ws, ac, eff, adv, res, la, lo, st)
where c.slug='florianopolis'
  and not exists (select 1 from attractions x where x.city_id=c.id and (x.slug=v.slug or lower(x.name)=lower(v.name)));
