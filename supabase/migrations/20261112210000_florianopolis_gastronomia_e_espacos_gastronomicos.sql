-- Florianópolis: cadastro de gastronomia e espaços gastronômicos (todos como rascunho, sem fotos).
-- Carboni e Cinco entram só com o essencial: não achei fonte confiável para confirmar quem são.
-- A experiência pessoal (personal_experience) fica em branco de propósito. Faixa de preço fica em branco: sem preço verificado.
insert into attractions (city_id, name, slug, categories, description, important_tips, average_visit_time, best_time_of_day, best_season, recommended_audience, weather_sensitive, has_air_conditioning, intense_physical_effort, requires_advance_purchase, requires_reservation, latitude, longitude, status)
select c.id, v.name, v.slug, v.cats, v.d, v.tips, v.visit, v.best, v.season, v.aud, v.ws, v.ac, v.eff, v.adv, v.res, v.la, v.lo, v.st::country_status
from cities c cross join (values
($$Ponta d'Agulha Costelaria$$, $$ponta-d-agulha-costelaria$$, array['restaurante']::attraction_category[], $$A **Ponta d'Agulha Costelaria** é uma casa de **costela e carnes nobres**, em ambiente rústico e aconchegante, com três restaurantes na região: no Centro, na SC-401 (km 8, número 7626, em Santo Antônio de Lisboa) e na Pedra Branca, em Palhoça. O prato principal é a **costela**, e o formato combina com um almoço longo com amigos e família.

As avaliações são mistas: há quem a considere uma das melhores da cidade e quem ache os preços altos, o que vale levar em conta ao escolher entre almoço e jantar.

Verifique as informações atualizadas, os horários e o cardápio nos canais oficiais da casa.$$, $$✓ Os horários variam bastante entre as fontes: guias indicam funcionamento de terça a sexta e aos fins de semana, em geral com almoço e jantar nos dias úteis e só almoço aos sábados e domingos. Confirme antes de ir.
✓ Há relatos de que a casa fecha às segundas, e alguns indicam que também às terças.
✓ O telefone divulgado para a unidade da SC-401 é (48) 3338-2850.
✓ A casa tem unidades em endereços diferentes: confirme qual delas atende melhor o seu roteiro.$$, $$1h30 a 2 horas$$, $$Almoço$$, $$O ano todo$$, $$Famílias, casais e grupos de amigos$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Carboni$$, $$carboni$$, array['restaurante']::attraction_category[], $$O **Carboni** é uma opção de gastronomia em Florianópolis, incluída entre os restaurantes da curadoria.

Verifique as informações atualizadas, os horários e o cardápio nos canais oficiais da casa.$$, null, null, null, null, null, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Cinco$$, $$cinco$$, array['restaurante']::attraction_category[], $$O **Cinco** é uma opção de gastronomia em Florianópolis, incluída entre os restaurantes da curadoria.

Verifique as informações atualizadas, os horários e o cardápio nos canais oficiais da casa.$$, null, null, null, null, null, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Jay Bistrô$$, $$jay-bistro$$, array['restaurante']::attraction_category[], $$O **Jay Bistrô** é um restaurante de **alta gastronomia** que nasceu em Jurerê Internacional, em novembro de 2013, e depois ganhou também uma unidade no Centro de Florianópolis (Jay Miramar). A casa trabalha com **ingredientes frescos e sazonais** e inspiração global, em ambiente refinado e intimista.

Pratos que aparecem nos relatos de visitantes incluem **ossobuco**, **polvo grelhado com molho tailandês** e **sobremesa de texturas de chocolate**, e elogios a vieiras e lagosta. O restaurante diz ter conquistado o prêmio Veja Comer e Beber de melhor restaurante e melhor chef.

Verifique as informações atualizadas, os horários e o cardápio no site oficial: https://www.jaybistro.com$$, $$✓ O site oficial informa o endereço atual em Jurerê Internacional, na Avenida dos Búzios, 3370, ao lado do Kuay Sushi. Listagens antigas ainda mostram o número 1136.
✓ O Instagram da casa indica abertura diária a partir das 19h e atendimento com reservas.
✓ Os telefones divulgados são (48) 3364-5997 e (48) 98864-6265.
✓ Avaliações são mistas: há elogios ao ambiente, ao atendimento e a pratos como o ossobuco e o risoto de pato, e algumas críticas a pratos considerados comuns.
✓ A casa tem unidades em Jurerê Internacional e no Centro: confirme em qual você vai jantar.$$, $$2 horas$$, $$Jantar$$, $$O ano todo$$, $$Casais e grupos de amigos$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Macarronada Italiana$$, $$macarronada-italiana$$, array['restaurante']::attraction_category[], $$A **Macarronada Italiana** é uma das casas mais tradicionais de Florianópolis. Em 1979, o italiano Ezio Giannino Librizzi abriu a primeira unidade da cidade, onde hoje fica o Beiramar Shopping, seguindo os passos da família que já tinha a casa de Balneário Camboriú, nascida em 1960. Em 1983 mudou-se para o endereço com entrada pela Avenida Beira-Mar Norte e pela Rua Bocaiúva.

Hoje a marca tem três casas: a **Beira Mar**, com vista para a Baía Norte, o **Librizzi**, com **pôr do sol e vista para a Ponte Hercílio Luz**, e o **Spotmarkt**, o único com **rodízio**. A cozinha é de **massas e molhos feitos na casa**, e visitantes citam o espaguete à bolonhesa, a lasanha quatro queijos e o tagliolini ao pesto.

Verifique as informações atualizadas, os horários e o cardápio no site oficial: https://macarronada.com.br$$, $$✓ O site oficial lista três casas, Beira Mar, Librizzi e Spotmarkt, e o rodízio é oferecido só no Spotmarkt.
✓ O site tem página de reservas e de delivery, e os horários variam por casa: confirme antes de ir.
✓ O Librizzi é voltado também a eventos, com vista para o pôr do sol e para a Ponte Hercílio Luz.
✓ Guias antigos citam unidades no Centro, na Lagoa e em Kobrasol: confirme o endereço atual antes de ir.$$, $$1h30 a 2 horas$$, $$Almoço e jantar$$, $$O ano todo$$, $$Famílias, casais e grupos de amigos$$, false, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Armazém Rita Maria$$, $$armazem-rita-maria$$, array['restaurante','ponto_turistico']::attraction_category[], $$O **Armazém Rita Maria** é um complexo multiuso de **gastronomia, arte e lazer** no Centro de Florianópolis, na Alameda Annita Hoepcke da Silva, 112. Ocupa **seis galpões históricos restaurados**, em um complexo industrial de 2 mil metros quadrados construído por Carl Hoepcke (1844 a 1924), o empreendedor que iniciou a industrialização de Santa Catarina.

São cerca de **20 operações** entre restaurantes, cafés, bares e lojas, como **Olivia Cucina** (italiana), **Nonna Celia Trattoria e Pizzeria**, **Noir Sushi**, **Vibe Poke**, **Marisqueira Sintra** (portuguesa), **Vacuno** (argentina), **Al Amir** (árabe), **Nacho Man** (mexicana), a **Kill Brew** e a **OnBier** (cervejarias), o **Gare du Vin**, o **Café Paris**, a **Freddo Gelateria**, a **Blend Cacao**, o **Boteco Rita Maria** e a brinquedoteca **Passeio Kids**.

Verifique as informações atualizadas, os horários e o cardápio no site oficial: https://www.armazemritamaria.com.br$$, $$✓ Segundo o site oficial, funciona de segunda e terça das 11h às 22h, de quarta a sábado das 11h à meia-noite e aos domingos das 9h às 22h. Cada operação tem horário próprio.
✓ O espaço não aceita reservas, então chegue com folga nos horários de maior movimento.
✓ O estacionamento tem acesso pela Alameda Annita Hoepcke da Silva, 112.
✓ Há uma brinquedoteca, a Passeio Kids, que também funciona como casa de festas, o que ajuda quem viaja com crianças.
✓ O complexo também tem galeria de arte e programação cultural.$$, $$2 a 3 horas$$, $$Tarde e noite$$, $$O ano todo$$, $$Famílias, casais e grupos de amigos$$, false, false, false, false, false, -27.594826::numeric, -48.558972::numeric, 'draft'),
($$Passeio Primavera$$, $$passeio-primavera$$, array['restaurante','compras']::attraction_category[], $$O **Passeio Primavera** é um **complexo a céu aberto**, na Rodovia SC-401, km 4, número 4150, na chamada Rota da Inovação, e é a sede da Acate e do Primavera Office. Mistura **gastronomia, lazer e cultura**, **lojas e serviços**, com destaque para um **Garden Center especializado, com 35 anos de história**.

A programação inclui uma **agenda cultural mensal**, com **música ao vivo, feiras criativas, oficinas infantis** e eventos especiais, como programação de Halloween e de Natal, voltados para toda a família.

Verifique as informações atualizadas, a programação e os restaurantes no site oficial: https://www.passeioprimavera.com.br$$, $$✓ O site oficial divulga a agenda cultural de cada mês, com música ao vivo, feiras e atividades para crianças.
✓ O complexo é a céu aberto: em dia de chuva forte, confirme se a programação foi mantida.
✓ O endereço é Rodovia SC-401, km 4, número 4150, no caminho entre o Centro e o norte da ilha.
✓ Para almoçar ou jantar, confira no site os restaurantes que estão em funcionamento e seus horários.
✓ O Garden Center é uma boa parada para quem gosta de plantas e decoração.$$, $$1 a 3 horas$$, $$Tarde e noite$$, $$O ano todo$$, $$Famílias, casais e grupos de amigos$$, true, false, false, false, false, -27.544532::numeric, -48.500185::numeric, 'draft'),
($$Passeio Sapiens$$, $$passeio-sapiens$$, array['restaurante']::attraction_category[], $$O **Passeio Sapiens** é o **ponto de encontro do Norte da Ilha**, na Avenida Luiz Boiteux Piazza, 1302, na Cachoeira do Bom Jesus, aberto ao público em junho de 2024. O complexo tem cerca de 28 mil metros quadrados, com dois prédios corporativos, **restaurantes**, áreas de **lazer** e a **Mercadoteca**, um **food hall com cerca de 15 operações gastronômicas**.

O conceito é **a rua como palco da vida**, com **programação cultural** mensal que reúne música ao vivo, feiras, oficinas infantis, jogos de tabuleiro, teatro e atividades para as crianças. O complexo está ligado ao Sapiens Parque, um polo de tecnologia e inovação, e fica perto de Canasvieiras.

Verifique as informações atualizadas, a programação e os restaurantes no site oficial: https://www.passeiosapiens.com.br$$, $$✓ O site oficial divulga a agenda cultural de cada mês, com atividades para toda a família.
✓ A Mercadoteca é um food hall com cerca de 15 operações, o que ajuda quando o grupo não concorda sobre o que comer.
✓ O endereço é Avenida Luiz Boiteux Piazza, 1302, Cachoeira do Bom Jesus, perto de Canasvieiras.
✓ Os restaurantes e os horários mudam: confirme no site oficial antes de ir.
✓ É uma boa opção para o fim de tarde ou a noite, depois de um dia de praia no norte.$$, $$1 a 3 horas$$, $$Tarde e noite$$, $$O ano todo$$, $$Famílias, casais e grupos de amigos$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Hard Rock Cafe Florianópolis$$, $$hard-rock-cafe-florianopolis$$, array['restaurante']::attraction_category[], $$O **Hard Rock Cafe Florianópolis** fica dentro do **Villa Romana Shopping** e foi inaugurado em 14 de dezembro de 2022. A casa tem **ambiente temático de rock**, com exposição de peças originais de artistas de renome mundial, e serve **cozinha americana**, com **hambúrgueres clássicos**, drinks da casa e carta de vinhos.

O espaço comporta até 350 pessoas em dois ambientes: o térreo, com o restaurante, e o mezanino, com paredes móveis para eventos e um **ambiente infantil com jogos, brinquedos e videogames**. A casa recebe **shows e festas com música ao vivo**, como a Hard Rock Party com o cantor Frejat, em fevereiro de 2023, e a **Rock Shop** vende **lembranças e itens exclusivos** da marca.

Verifique as informações atualizadas, os horários, a programação e as reservas no site oficial: https://cafe.hardrock.com/florianopolis/$$, $$✓ Segundo o site oficial, o restaurante funciona de segunda a quinta e aos domingos das 11h30 às 22h, e às sextas e sábados das 11h30 às 23h30.
✓ A Rock Shop abre de segunda a sábado das 10h às 22h, e aos domingos e feriados das 11h30 às 22h.
✓ Dá para reservar mesa pelo site oficial, o que ajuda em horários de maior movimento.
✓ O mezanino tem um espaço infantil exclusivo, com jogos, brinquedos e videogames.
✓ Por ficar no Villa Romana, combina com compras e cinema no mesmo passeio.$$, $$1h30 a 2 horas$$, $$Almoço e jantar$$, $$O ano todo$$, $$Famílias, casais e grupos de amigos$$, false, false, false, false, false, -27.589825::numeric, -48.515096::numeric, 'draft'),
($$Coco Bambu Florianópolis$$, $$coco-bambu-florianopolis$$, array['restaurante']::attraction_category[], $$O **Coco Bambu Florianópolis** fica dentro do **Villa Romana Shopping**, na Avenida Madre Benvenuta, 687, e faz parte da rede especializada em **frutos do mar**, cozinha regional e **pratos para compartilhar**. Os destaques da casa são os **pratos de camarão** e as **porções para dividir**.

No cardápio da rede aparecem opções como o **Camarão Coco Bambu**, com camarões empanados e recheados com Catupiry sobre arroz cremoso, em versões para grupos. A casa é ampla, com capacidade para até 480 pessoas, segundo a divulgação da abertura, em 2020.

Verifique as informações atualizadas, os horários e o cardápio no site oficial: https://www.cocobambu.com$$, $$✓ As listagens divergem sobre os horários: uma indica de segunda a quinta das 11h30 às 15h e das 17h às 23h, e de sexta a domingo das 11h30 às 23h, e o site do shopping mostra fechamento à meia-noite. Confirme antes de ir.
✓ O telefone divulgado é +55 48 3364-9445.
✓ Os pratos de camarão para compartilhar costumam servir de duas a seis pessoas, conforme a versão, e o cardápio varia por unidade.
✓ O restaurante fica dentro do shopping, o que combina com compras e cinema no mesmo passeio.
✓ A casa é grande, mas em horários e datas de maior movimento vale chegar cedo.$$, $$1h30 a 2 horas$$, $$Almoço e jantar$$, $$O ano todo$$, $$Famílias, casais e grupos de amigos$$, false, false, false, false, false, -27.589825::numeric, -48.515096::numeric, 'draft')
) as v(name, slug, cats, d, tips, visit, best, season, aud, ws, ac, eff, adv, res, la, lo, st)
where c.slug='florianopolis'
  and not exists (select 1 from attractions x where x.city_id=c.id and (x.slug=v.slug or lower(x.name)=lower(v.name)));
