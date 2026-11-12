-- Orlando: remove da descrição da cidade os blocos "Outras opções de parques" e "Dicas de compras" (viram atrações),
-- cadastra as atrações que ainda não existiam e completa 3 ou mais fotos (Wikimedia Commons, com crédito na legenda).
-- Rascunho: atrações com menos de 3 fotos livres (Peppa Pig, Adventure Island, The Loop, LEGOLAND Water Park, Lake Buena Vista Factory Stores).
update cities set description = regexp_replace(description, E'\\*\\*Outras opções de parques em Orlando e arredores\\*\\*.*?(?=\\*\\*Informações úteis\\*\\*)', '', 's')
where slug='orlando' and description like '%Outras opções de parques em Orlando%';

insert into attractions (city_id, name, slug, categories, description, important_tips, average_visit_time, best_time_of_day, best_season, recommended_audience, weather_sensitive, has_air_conditioning, intense_physical_effort, requires_advance_purchase, requires_reservation, latitude, longitude, status)
select c.id, v.name, v.slug, v.cats, v.d, v.tips, v.visit, v.best, v.season, v.aud, v.ws, v.ac, v.eff, v.adv, v.res, v.la, v.lo, v.st::country_status
from cities c cross join (values
($$Aquatica Orlando$$, $$aquatica-orlando$$, array['ponto_turistico','parque_aquatico']::attraction_category[], $$O **Aquatica Orlando** é o parque aquático do mesmo grupo do SeaWorld, com cerca de 15 atrações entre toboáguas, duas piscinas de ondas e um rio de correnteza, tudo cercado de vegetação tropical e uma ambientação colorida inspirada nas ilhas do Pacífico Sul.

O parque funciona para vários perfis: há toboáguas de emoção, como o **Taumata Racer**, onde os visitantes descem deitados em colchonetes numa disputa lado a lado, e áreas pensadas para crianças menores, além do **Roa's Rapids**, rio de correnteza para relaxar entre um brinquedo e outro.

Uma boa sugestão é chegar cedo, ir primeiro aos toboáguas mais disputados e deixar o rio de correnteza e as piscinas de ondas para o meio do dia.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://aquatica.com/orlando$$, $$✓ Cada brinquedo tem a altura mínima indicada na entrada, e o parque faz a conferência de altura no atendimento ao visitante.
✓ Pulseiras coloridas indicam quais brinquedos cada visitante pode usar, o que evita fila à toa.
✓ Os horários mudam ao longo do ano, então confira o calendário do parque para a sua data.
✓ Leve protetor solar, toalha e troca de roupa, e use sapato próprio para água nos trechos de piso quente.
✓ Armários e áreas de descanso ficam dentro do parque, mas vale deixar objetos de valor no hotel.$$, $$Dia inteiro$$, $$A partir da abertura$$, $$Primavera e verão$$, $$Famílias, casais e grupos de amigos$$, true, false, false, true, false, 28.4156276, -81.456997, 'published'),
($$Discovery Cove$$, $$discovery-cove$$, array['ponto_turistico','parque_aquatico']::attraction_category[], $$O **Discovery Cove** é um dia de resort à beira d'água, com atendimento limitado de visitantes para manter tudo mais calmo do que um parque tradicional. O ingresso inclui alimentação, bebidas e lanches durante o dia todo, além de equipamento de snorkel e coletes salva-vidas para todas as idades.

Entre as experiências está a **nadada com golfinhos**, um encontro interativo em pequenos grupos que exige o ingresso que a inclui. Há também lagoas de águas cristalinas, praias de areia, um rio de correnteza entre vegetação, recifes para fazer snorkel entre peixes tropicais e raias, e aviário.

Uma boa sugestão é chegar na abertura. O horário da nadada com golfinhos é definido no check-in conforme a disponibilidade, e quem chega mais cedo tem mais opções de escolha.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://discoverycove.com/orlando$$, $$✓ A nadada com golfinhos só está inclusa nos ingressos que a contemplam, então confira o tipo de ingresso antes de comprar.
✓ Para nadar com os golfinhos, a idade mínima é 6 anos e a altura mínima é 42 polegadas, segundo as regras divulgadas, e crianças menores acompanham com um adulto participante.
✓ Crianças de 0 a 2 anos não pagam entrada.
✓ O horário da nadada com golfinhos é definido no check-in, e chegar cedo dá mais opções.
✓ Reserve com antecedência: a visitação diária é limitada e as datas mais procuradas esgotam.$$, $$Dia inteiro$$, $$A partir da abertura$$, $$O ano todo$$, $$Famílias e casais$$, true, false, false, true, true, 28.4052936, -81.4639097, 'published'),
($$Busch Gardens Tampa Bay$$, $$busch-gardens-tampa-bay$$, array['ponto_turistico','parque_tematico']::attraction_category[], $$O **Busch Gardens Tampa Bay** mistura montanhas-russas de peso com um zoológico a céu aberto temático da África, e por isso agrada tanto quem busca emoção quanto quem quer ver animais de perto. O parque tem mais de 2 mil animais e a **Serengeti Plain**, área de 65 acres onde girafas, zebras e outros animais circulam.

Entre as montanhas-russas estão a **Iron Gwazi**, híbrida de madeira e aço com altura mínima de 48 polegadas, a **SheiKra**, de queda livre, com mínimo de 54 polegadas, e a clássica **Kumba**, aberta em 1993. Para os animais, vale a **Myombe Reserve**, com gorilas e chimpanzés, e o **Serengeti Express**, trem que percorre a área dos animais.

Uma boa sugestão é ir às montanhas-russas logo na abertura, porque as filas só crescem ao longo do dia, e deixar animais e shows para o resto da visita. Fica a cerca de 1h30 de carro de Orlando.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://buschgardens.com/tampa$$, $$✓ As filas das montanhas-russas crescem ao longo do dia, então vá primeiro a elas.
✓ Confira a programação dos shows ao chegar e monte o roteiro em torno dos horários.
✓ Cada brinquedo tem altura mínima própria, e a medição é conferida na entrada da atração.
✓ Fica em Tampa, a cerca de 1h30 de carro de Orlando, então planeje o dia inteiro para o parque.
✓ Ingressos combinados com outros parques da região costumam compensar para quem pretende visitar mais de um.$$, $$Dia inteiro$$, $$A partir da abertura$$, $$Outono e inverno, quando faz menos calor$$, $$Famílias, adolescentes e casais$$, true, false, false, true, false, 28.0370823, -82.4212613, 'published'),
($$Adventure Island$$, $$adventure-island-tampa$$, array['ponto_turistico','parque_aquatico']::attraction_category[], $$O **Adventure Island** é o parque aquático de Tampa, ao lado do Busch Gardens, com toboáguas para quem busca emoção e piscinas para relaxar. Entre os brinquedos estão o **Solar Vortex**, descrito como o primeiro toboágua duplo em espiral dos Estados Unidos, o **Colossal Curl**, em que botes para 4 pessoas descem por um tubo fechado antes de cair numa meia-lua, e o **Vanish Point**, com alçapão.

O parque funciona de forma sazonal, com abertura aproximada de março a novembro e horários que variam conforme a data.

Uma boa sugestão é combinar o dia no Adventure Island com o Busch Gardens, já que os dois ficam lado a lado e há ingressos combinados.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://adventureisland.com$$, $$✓ O parque funciona em temporada, aproximadamente de março a novembro, e os horários mudam por data.
✓ A altura mínima varia por toboágua, então confira as placas na entrada de cada brinquedo.
✓ Leve protetor solar, toalha e troca de roupa.
✓ Fica em Tampa, a cerca de 1h30 de carro de Orlando.$$, $$Dia inteiro$$, $$A partir da abertura$$, $$Primavera e verão$$, $$Famílias, adolescentes e grupos de amigos$$, true, false, false, false, false, 28.0419781, -82.4135261, 'draft'),
($$LEGOLAND Florida$$, $$legoland-florida$$, array['ponto_turistico','parque_tematico']::attraction_category[], $$O **LEGOLAND Florida** fica em Winter Haven, em um terreno de cerca de 150 acres, e é pensado para famílias com crianças de **2 a 12 anos**. As atrações misturam brinquedos, escolas de direção, oficinas de construção e cenários feitos de peças LEGO.

O destaque é a **Miniland USA**, com monumentos e cidades americanas recriados em miniatura com milhões de peças. Há também a **Ninjago World**, onde não existe altura mínima, mas crianças com menos de 48 polegadas precisam ir com um acompanhante de 14 anos ou mais e 48 polegadas ou mais. O parque ocupa o terreno do antigo **Cypress Gardens**, e os jardins históricos continuam abertos para passeio.

Uma boa sugestão é começar pelas atrações mais disputadas e deixar a Miniland para o meio do dia, quando o calor aperta.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://www.legoland.com/florida$$, $$✓ O parque é pensado para crianças de 2 a 12 anos, e adultos sozinhos aproveitam menos.
✓ Confira as alturas mínimas de cada atração antes de ir, para evitar frustração na fila.
✓ Os jardins do antigo Cypress Gardens são um bom lugar para uma pausa sem pressa.
✓ Fica em Winter Haven, a cerca de 1 hora de carro de Orlando.
✓ O parque aquático e o parque da Peppa Pig ficam no mesmo complexo, com ingressos separados ou combinados.$$, $$Dia inteiro$$, $$A partir da abertura$$, $$O ano todo$$, $$Famílias com crianças de 2 a 12 anos$$, true, false, false, true, false, 27.9920627, -81.6919685, 'published'),
($$LEGOLAND Water Park$$, $$legoland-water-park-florida$$, array['ponto_turistico','parque_aquatico']::attraction_category[], $$O **LEGOLAND Water Park** é um parque aquático mais tranquilo e voltado às crianças, dentro do complexo do LEGOLAND Florida. A piscina de ondas é suave e serve para todas as idades, e o **Build-A-Raft River** é um rio de correnteza onde a família monta o próprio bote com peças.

Entre as áreas estão o **Joker Soaker**, playground aquático com toboáguas, escaladas e um grande balde que derrama água sobre quem está embaixo, o **DUPLO Splash Safari**, para os pequenos, o **Splash Out** e o **Twin Chasers**.

Uma boa sugestão é ir cedo para garantir lugar nas áreas de descanso e deixar o rio e a piscina de ondas para o meio do dia.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://www.legoland.com/florida/things-to-do/water-park/$$, $$✓ A altura mínima muda por atração, então confira as placas e os guias oficiais.
✓ A piscina de ondas e as áreas para os pequenos aceitam crianças de várias idades.
✓ O parque aquático tem ingresso próprio ou combinado com o parque principal.
✓ Leve protetor solar, toalha e troca de roupa.$$, $$Meio período a dia inteiro$$, $$A partir da abertura$$, $$Primavera e verão$$, $$Famílias com crianças$$, true, false, false, false, false, 27.9920627, -81.6919685, 'draft'),
($$Peppa Pig Theme Park Florida$$, $$peppa-pig-theme-park-florida$$, array['ponto_turistico','parque_tematico']::attraction_category[], $$O **Peppa Pig Theme Park** é um parque pequeno, dentro do complexo do LEGOLAND Florida, feito para quem tem filhos pequenos, de cerca de 2 a 6 anos. A montanha-russa suave, a **Daddy Pig's Roller Coaster**, é o ponto central, e os brinquedos foram pensados para que adultos andem junto com as crianças.

Há ainda áreas temáticas inspiradas no desenho, uma área de brincar com água, um restaurante com cardápio infantil, apresentações ao vivo e jogos de carnaval gratuitos.

Uma boa sugestão é encaixar o parque numa manhã mais leve, combinado com o LEGOLAND Florida, já que os ingressos podem ser conjuntos.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://www.legoland.com/florida/peppa-pig-theme-park/$$, $$✓ O parque é pequeno e pensado para crianças de cerca de 2 a 6 anos.
✓ Os ingressos têm data marcada para controlar a capacidade, então compre antes.
✓ Há ingressos combinados com o LEGOLAND Florida.
✓ Fica em Winter Haven, a cerca de 1 hora de carro de Orlando.$$, $$3 a 4 horas$$, $$Manhã$$, $$O ano todo$$, $$Famílias com crianças pequenas$$, true, false, false, true, false, 27.9920627, -81.6919685, 'draft'),
($$Lake Buena Vista Factory Stores$$, $$lake-buena-vista-factory-stores$$, array['compras']::attraction_category[], $$O **Lake Buena Vista Factory Stores** é um outlet ao ar livre perto da região da Disney, com lojas de marcas conhecidas como Eddie Bauer, Gap Factory, Nike, Converse e Samsonite. É uma opção prática para quem quer comprar sem se afastar muito dos parques.

O estacionamento é gratuito e fica em frente às lojas, e o centro oferece um serviço de ônibus gratuito para compras saindo de hotéis da região de Kissimmee.

Uma boa sugestão é ir pela manhã, em dia de semana, e comparar preços antes de comprar, já que nem toda peça de outlet compensa.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://lbvfs.com$$, $$✓ O estacionamento é gratuito e fica em frente às lojas.
✓ Há ônibus gratuito de compras saindo de hotéis de Kissimmee, e os horários estão no site.
✓ Os horários variam em feriados, e o centro fecha no Dia de Ação de Graças e no Natal.
✓ Compare os preços antes de comprar: nem tudo compensa só por estar em outlet.$$, $$1 a 3 horas$$, $$Manhã, em dias de semana$$, $$O ano todo$$, $$Famílias, casais e grupos de amigos$$, true, false, false, false, false, 28.3495945, -81.4872758, 'draft'),
($$The Loop$$, $$the-loop-kissimmee$$, array['compras']::attraction_category[], $$O **The Loop** é um complexo de compras ao ar livre em Kissimmee, no cruzamento da John Young Parkway com a Osceola Parkway, nos arredores de Orlando. Reúne lojas de departamento, calçados, material de arte, livros e outras redes, como Kohl's, JCPenney, Books-A-Million, Michaels, DSW, T.J. Maxx, Burlington e Bath & Body Works.

Na área de alimentação há restaurantes como Chili's e BJ's Restaurant & Brewhouse, e ao lado funciona um cinema Regal com 16 salas.

Uma boa sugestão é reservar uma tarde de compras e fechar com jantar ou sessão de cinema, tudo no mesmo lugar.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://experiencetheloop.com$$, $$✓ O centro é dividido em The Loop East e The Loop West, que têm donos diferentes, então confira em qual lado fica a loja desejada.
✓ O cinema Regal fica ao lado, no mesmo complexo.
✓ Os horários variam por loja e restaurante, então confirme antes de ir.$$, $$2 a 3 horas$$, $$Tarde$$, $$O ano todo$$, $$Famílias, casais e grupos de amigos$$, true, false, false, false, false, 28.3446596, -81.4222677, 'draft'),
($$Anthropologie$$, $$anthropologie$$, array['compras']::attraction_category[], $$A **Anthropologie** é uma loja para quem gosta de roupas, acessórios e peças de decoração com visual autoral, e em Orlando fica dentro do The Mall at Millenia. A experiência é bem de **loja-vitrine**: ambientação cuidada, peças de casa, louças, velas e itens de presente ao lado da moda feminina.

Para panelas e utensílios de cozinha, vale conferir também a **Le Creuset**, que tem loja no Orlando International Premium Outlets.

Uma boa sugestão é ir a um horário calmo, olhar com tempo a seção de casa e jardim, e comparar preços com outras lojas do shopping antes de decidir.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://www.anthropologie.com$$, $$✓ A loja fica dentro do The Mall at Millenia, então dá para combinar com as outras lojas e a praça de alimentação.
✓ Os horários seguem os do shopping e variam em feriados.
✓ Para utensílios de cozinha da Le Creuset, confira a loja do Orlando International Premium Outlets.
✓ Compare preços: nem tudo compensa só por estar numa loja de grife.$$, $$30 minutos a 1 hora$$, $$Manhã e início da tarde$$, $$O ano todo$$, $$Casais e amigos$$, false, true, false, false, false, null::numeric, null::numeric, 'published'),
($$Whole Foods Market$$, $$whole-foods-market$$, array['mercado']::attraction_category[], $$O **Whole Foods Market** é a rede especializada em alimentos **naturais e orgânicos**, com foco em ingredientes de qualidade, produtos frescos e atenção a restrições alimentares.

É um ótimo endereço para quem busca opções **sem glúten, veganas ou vegetarianas**, além de saladas, pratos prontos, barras de comida quente e uma boa seleção de cafés, chás e vinhos.

Uma boa sugestão é montar um **almoço rápido** nos balcões de comida pronta e levar para comer ao ar livre ou na casa alugada.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://www.wholefoodsmarket.com$$, $$✓ Os preços costumam ser mais altos que os de supermercados tradicionais.
✓ Os balcões de comida pronta são uma alternativa prática ao fast food.
✓ Os rótulos indicam com clareza produtos sem glúten, veganos e orgânicos.
✓ Para economizar, vale comparar os itens da marca própria 365.$$, $$30 minutos a 1 hora$$, $$Manhã e início da tarde$$, $$O ano todo$$, $$Famílias, casais e grupos de amigos$$, false, true, false, false, false, 28.449171, -81.476494, 'published'),
($$Trader Joe's$$, $$trader-joes$$, array['mercado']::attraction_category[], $$O **Trader Joe's** é um mercado de lojas pequenas e clima descontraído, famoso pela grande quantidade de produtos de **marca própria** a preços justos e por itens que não se encontram em outras redes.

É um lugar querido para quem gosta de descobrir **snacks, congelados, queijos, chocolates e molhos** diferentes, além de flores e vinhos a bons preços. Muitos visitantes aproveitam para levar produtos de presente.

Uma boa sugestão é reservar um tempo para **explorar sem pressa** e provar as novidades, já que a loja é pequena, mas cheia de surpresas.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://www.traderjoes.com$$, $$✓ As lojas são menores e podem ficar cheias nos fins de semana e no fim da tarde.
✓ Quase tudo é de marca própria, então não espere marcas conhecidas.
✓ Os produtos congelados e os snacks costumam ser os mais procurados.
✓ Leve uma sacola reutilizável para as compras.$$, $$30 minutos a 1 hora$$, $$Manhã, em dias de semana$$, $$O ano todo$$, $$Famílias, casais e grupos de amigos$$, false, true, false, false, false, 28.450308, -81.496538, 'published')
) as v(name, slug, cats, d, tips, visit, best, season, aud, ws, ac, eff, adv, res, la, lo, st)
where c.slug='orlando' and not exists (select 1 from attractions x where x.city_id=c.id and x.slug=v.slug);

-- Anthropologie fica dentro do The Mall at Millenia: usa as mesmas coordenadas.
update attractions a set latitude=m.latitude, longitude=m.longitude from attractions m, cities c
where c.slug='orlando' and a.city_id=c.id and m.city_id=c.id and a.slug='anthropologie' and m.slug='the-mall-at-millenia' and a.latitude is null;

insert into attraction_tags (attraction_id, tag_id)
select a.id, t.id from attractions a join cities c on c.id=a.city_id and c.slug='orlando'
join (values
('aquatica-orlando','ideal_para_familias'),
('aquatica-orlando','dia_inteiro'),
('aquatica-orlando','melhor_dias_sol'),
('aquatica-orlando','vale_acordar_cedo'),
('discovery-cove','ideal_para_familias'),
('discovery-cove','dia_inteiro'),
('discovery-cove','reserva_necessaria'),
('discovery-cove','vale_acordar_cedo'),
('discovery-cove','melhor_dias_sol'),
('busch-gardens-tampa-bay','ideal_para_familias'),
('busch-gardens-tampa-bay','dia_inteiro'),
('busch-gardens-tampa-bay','adolescentes'),
('busch-gardens-tampa-bay','vale_acordar_cedo'),
('adventure-island-tampa','ideal_para_familias'),
('adventure-island-tampa','dia_inteiro'),
('adventure-island-tampa','melhor_dias_sol'),
('legoland-florida','ideal_para_familias'),
('legoland-florida','criancas_pequenas'),
('legoland-florida','dia_inteiro'),
('legoland-florida','vale_acordar_cedo'),
('legoland-water-park-florida','ideal_para_familias'),
('legoland-water-park-florida','criancas_pequenas'),
('legoland-water-park-florida','melhor_dias_sol'),
('peppa-pig-theme-park-florida','ideal_para_familias'),
('peppa-pig-theme-park-florida','criancas_pequenas'),
('peppa-pig-theme-park-florida','meio_periodo'),
('lake-buena-vista-factory-stores','melhor_dias_chuva'),
('lake-buena-vista-factory-stores','meio_periodo'),
('the-loop-kissimmee','melhor_dias_chuva'),
('the-loop-kissimmee','meio_periodo'),
('anthropologie','melhor_dias_chuva'),
('anthropologie','meio_periodo'),
('anthropologie','casais'),
('whole-foods-market','melhor_dias_chuva'),
('whole-foods-market','meio_periodo'),
('trader-joes','melhor_dias_chuva'),
('trader-joes','meio_periodo')
) as v(aslug,tslug) on v.aslug=a.slug
join tags t on t.slug=v.tslug on conflict do nothing;

-- Fotos: entram só as que ainda não estão cadastradas; a ordem continua depois das que já existem.
insert into attraction_photos (attraction_id, url, "order", caption)
select a.id, v.url, coalesce((select max(p."order")+1 from attraction_photos p where p.attraction_id=a.id),0)+v.ord, v.cap
from attractions a join cities c on c.id=a.city_id and c.slug='orlando'
join (values
($$aquatica-orlando$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/Dolphinplunge-adjusted.jpg/1280px-Dolphinplunge-adjusted.jpg$$, 0, $$Foto: WillMcC / Wikimedia Commons, CC BY-SA 4.0.$$),
($$aquatica-orlando$$, $$https://upload.wikimedia.org/wikipedia/commons/4/4a/Aquatica-roasrapids.jpg$$, 1, $$Foto: WillMcC / Wikimedia Commons, CC BY-SA 4.0.$$),
($$aquatica-orlando$$, $$https://upload.wikimedia.org/wikipedia/commons/2/23/Aquaticaentrance.jpg$$, 2, $$Foto: WillMcC / Wikimedia Commons, CC BY-SA 3.0.$$),
($$aquatica-orlando$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/Taumata_Racer.jpg/1280px-Taumata_Racer.jpg$$, 3, $$Foto: Brian Marshall / Wikimedia Commons, CC BY 2.0.$$),
($$discovery-cove$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/DisccoveRiver.jpg/1280px-DisccoveRiver.jpg$$, 0, $$Foto: Michael Lowin / Wikimedia Commons, CC BY-SA 2.0.$$),
($$discovery-cove$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Discovery_Cove%2C_Orlando_-_panoramio_%2812%29.jpg/1280px-Discovery_Cove%2C_Orlando_-_panoramio_%2812%29.jpg$$, 1, $$Foto: Bob Linsdell / Wikimedia Commons, CC BY 3.0.$$),
($$discovery-cove$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Discovery_Cove%2C_Orlando_-_panoramio_%2810%29.jpg/1280px-Discovery_Cove%2C_Orlando_-_panoramio_%2810%29.jpg$$, 2, $$Foto: Bob Linsdell / Wikimedia Commons, CC BY 3.0.$$),
($$discovery-cove$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/Discovery_Cove%2C_Orlando_-_panoramio_%288%29.jpg/1280px-Discovery_Cove%2C_Orlando_-_panoramio_%288%29.jpg$$, 3, $$Foto: Bob Linsdell / Wikimedia Commons, CC BY 3.0.$$),
($$busch-gardens-tampa-bay$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Busch_Gardens_Afrika_-_Timbuktu.JPG/1280px-Busch_Gardens_Afrika_-_Timbuktu.JPG$$, 0, $$Foto: Wolle8ball / Wikimedia Commons, CC BY 3.0.$$),
($$busch-gardens-tampa-bay$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Iron_Gwazi_-_Busch_Gardens_Tampa.jpg/1280px-Iron_Gwazi_-_Busch_Gardens_Tampa.jpg$$, 1, $$Foto: Railfan99 / Wikimedia Commons, CC BY-SA 4.0.$$),
($$busch-gardens-tampa-bay$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Iron_Gwazi_lift_hill.jpg/1280px-Iron_Gwazi_lift_hill.jpg$$, 2, $$Foto: Adog / Wikimedia Commons, CC BY-SA 4.0.$$),
($$busch-gardens-tampa-bay$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/Bird_Gardens_%28Busch_Gardens_Africa%29.JPG/1280px-Bird_Gardens_%28Busch_Gardens_Africa%29.JPG$$, 3, $$Foto: Wolle8ball / Wikimedia Commons, CC BY 3.0.$$),
($$busch-gardens-tampa-bay$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Myombe_Reserve_Busch_Gardens_Tampa.jpg/1280px-Myombe_Reserve_Busch_Gardens_Tampa.jpg$$, 4, $$Foto: Adog / Wikimedia Commons, CC BY-SA 4.0.$$),
($$legoland-florida$$, $$https://upload.wikimedia.org/wikipedia/commons/9/98/Lego_Kingdoms_Legoland_Florida.jpg$$, 0, $$Foto: RangerRick / Wikimedia Commons, CC BY-SA 2.0.$$),
($$legoland-florida$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/Legoland_FL_%288219744040%29.jpg/1280px-Legoland_FL_%288219744040%29.jpg$$, 1, $$Foto: Lucy Gray / Wikimedia Commons, CC BY-SA 2.0.$$),
($$legoland-florida$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1d/Legoland_FL_%288218631319%29.jpg/1280px-Legoland_FL_%288218631319%29.jpg$$, 2, $$Foto: Lucy Gray / Wikimedia Commons, CC BY-SA 2.0.$$),
($$legoland-florida$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/Legoland_Florida_30_%286827756757%29.jpg/1280px-Legoland_Florida_30_%286827756757%29.jpg$$, 3, $$Foto: Nathan Forget / Wikimedia Commons, CC BY 2.0.$$),
($$peppa-pig-theme-park-florida$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Peppa_Pig_Theme_Park_%2855138963310%29.jpg/1280px-Peppa_Pig_Theme_Park_%2855138963310%29.jpg$$, 0, $$Foto: Jeremy Thompson / Wikimedia Commons, CC BY 4.0.$$),
($$peppa-pig-theme-park-florida$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Peppa_Pig_Theme_Park_%2855138968685%29.jpg/1280px-Peppa_Pig_Theme_Park_%2855138968685%29.jpg$$, 1, $$Foto: Jeremy Thompson / Wikimedia Commons, CC BY 4.0.$$),
($$adventure-island-tampa$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/US_Navy_100313-N-3271W-153_Sailors_compete_in_a_volleyball_tournament_at_Adventure_Island_waterpark.jpg/1280px-US_Navy_100313-N-3271W-153_Sailors_compete_in_a_volleyball_tournament_at_Adventure_Island_waterpark.jpg$$, 0, $$Foto: U.S. Navy / Wikimedia Commons, domínio público.$$),
($$adventure-island-tampa$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/US_Navy_100313-N-3271W-074_Chief_Master-at-Arms_Cris_Miller_swims_with_a_young_patron_at_Adventure_Island_waterpark.jpg/1280px-US_Navy_100313-N-3271W-074_Chief_Master-at-Arms_Cris_Miller_swims_with_a_young_patron_at_Adventure_Island_waterpark.jpg$$, 1, $$Foto: U.S. Navy / Wikimedia Commons, domínio público.$$),
($$the-loop-kissimmee$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/John_Young_and_Osceola_Parkways_Aerial_%2849525041251%29.jpg/1280px-John_Young_and_Osceola_Parkways_Aerial_%2849525041251%29.jpg$$, 0, $$Foto: formulanone / Wikimedia Commons, CC BY-SA 2.0.$$),
($$anthropologie$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/AnthropologieGlendale.jpg/1280px-AnthropologieGlendale.jpg$$, 0, $$Foto: Minnaert / Wikimedia Commons, CC BY-SA 3.0.$$),
($$anthropologie$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Anthropologie_Walnut_Creek_1_2017-04-29.jpg/1280px-Anthropologie_Walnut_Creek_1_2017-04-29.jpg$$, 1, $$Foto: FASTILY / Wikimedia Commons, CC BY-SA 4.0.$$),
($$anthropologie$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Anthropologie_Walnut_Creek_2_2017-04-29.jpg/1280px-Anthropologie_Walnut_Creek_2_2017-04-29.jpg$$, 2, $$Foto: FASTILY / Wikimedia Commons, CC BY-SA 4.0.$$),
($$anthropologie$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Anthropologie_Chinook_Centre.jpg/1280px-Anthropologie_Chinook_Centre.jpg$$, 3, $$Foto: Rowanlovescars / Wikimedia Commons, CC BY-SA 4.0.$$),
($$whole-foods-market$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/Whole_Foods_Market_Richmond.jpg/1280px-Whole_Foods_Market_Richmond.jpg$$, 0, $$Foto: Jared Preston / Wikimedia Commons, CC BY-SA 3.0.$$),
($$whole-foods-market$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Whole_Foods_Market_Bayhill_-_Dr._Phillips%2C_Orlando%2C_Florida%2C_USA.jpg/1280px-Whole_Foods_Market_Bayhill_-_Dr._Phillips%2C_Orlando%2C_Florida%2C_USA.jpg$$, 1, $$Foto: Nielsoncaetanosalmeron / Wikimedia Commons, CC BY 4.0.$$),
($$whole-foods-market$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/WFM_Bayhill_Flower_Shop.jpg/1280px-WFM_Bayhill_Flower_Shop.jpg$$, 2, $$Foto: Nielsoncaetanosalmeron / Wikimedia Commons, CC BY 4.0.$$),
($$whole-foods-market$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Whole_Foods_Grocery_Store_%2813933379468%29.jpg/1280px-Whole_Foods_Grocery_Store_%2813933379468%29.jpg$$, 3, $$Foto: Mike Mozart / Wikimedia Commons, CC BY 2.0.$$),
($$trader-joes$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/Trader_Joe%27s_in_Nichols_Hills%2C_Oklahoma.jpg/1280px-Trader_Joe%27s_in_Nichols_Hills%2C_Oklahoma.jpg$$, 0, $$Foto: DoulosBen / Wikimedia Commons, CC BY 4.0.$$),
($$trader-joes$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Trader_Joe%27s_-_Redmond_-_20250824_-_02.jpg/1280px-Trader_Joe%27s_-_Redmond_-_20250824_-_02.jpg$$, 1, $$Foto: Sikander / Wikimedia Commons, CC BY-SA 4.0.$$),
($$trader-joes$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/TJ_Produce.jpg/1280px-TJ_Produce.jpg$$, 2, $$Foto: Francinegirvan / Wikimedia Commons, CC0.$$),
($$trader-joes$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/TJ_Sign2.jpg/1280px-TJ_Sign2.jpg$$, 3, $$Foto: Francinegirvan / Wikimedia Commons, CC0.$$),
($$publix$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/Produce_section_of_a_Publix_store.jpg/1280px-Produce_section_of_a_Publix_store.jpg$$, 0, $$Foto: Nielsoncaetanosalmeron / Wikimedia Commons, CC BY 4.0.$$),
($$publix$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/Publix_Deli_Orlando%2C_Florida.jpg/1280px-Publix_Deli_Orlando%2C_Florida.jpg$$, 1, $$Foto: Nielsoncaetanosalmeron / Wikimedia Commons, CC BY 4.0.$$),
($$publix$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Publix_fruit_juices.jpg/1280px-Publix_fruit_juices.jpg$$, 2, $$Foto: Nielsoncaetanosalmeron / Wikimedia Commons, CC BY 4.0.$$),
($$the-florida-mall$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/The_Florida_Mall_west_entrance_near_Macy%27s.jpg/1280px-The_Florida_Mall_west_entrance_near_Macy%27s.jpg$$, 0, $$Foto: Dough4872 / Wikimedia Commons, CC BY-SA 3.0.$$),
($$the-florida-mall$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/The_Florida_Mall_05.jpg/1280px-The_Florida_Mall_05.jpg$$, 1, $$Foto: Miosotis Jade / Wikimedia Commons, CC BY-SA 4.0.$$),
($$the-florida-mall$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/TheFloridaMall.JPG/1280px-TheFloridaMall.JPG$$, 2, $$Foto: Chaplin62 / Wikimedia Commons, CC BY-SA 3.0.$$),
($$the-mall-at-millenia$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Millenia_Mall_02.JPG/1280px-Millenia_Mall_02.JPG$$, 0, $$Foto: Miosotis Jade / Wikimedia Commons, CC BY-SA 4.0.$$),
($$the-mall-at-millenia$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/Millenia_Mall_on_Chritmas.JPG/1280px-Millenia_Mall_on_Chritmas.JPG$$, 1, $$Foto: Miosotis jade / Wikimedia Commons, CC BY-SA 3.0.$$),
($$the-mall-at-millenia$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/Macy%27s_The_Mall_at_Millenia.jpg/1280px-Macy%27s_The_Mall_at_Millenia.jpg$$, 2, $$Foto: Nielsoncaetanosalmeron / Wikimedia Commons, CC BY 4.0.$$),
($$walgreens$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/The_fanciest_Walgreens_ever%2C_Key_West%2C_Florida.jpg/1280px-The_fanciest_Walgreens_ever%2C_Key_West%2C_Florida.jpg$$, 0, $$Foto: Sergey Galyonkin / Wikimedia Commons, CC BY-SA 2.0.$$),
($$walgreens$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Walgreens_In_Florida_2013.jpeg/1280px-Walgreens_In_Florida_2013.jpeg$$, 1, $$Foto: otisfrog / Wikimedia Commons, CC BY-SA 3.0.$$),
($$cvs-pharmacy$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/CVS_pharmacy_%2853120936920%29.jpg/1280px-CVS_pharmacy_%2853120936920%29.jpg$$, 0, $$Foto: Todd Van Hoosear / Wikimedia Commons, CC BY-SA 2.0.$$),
($$cvs-pharmacy$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/CVS_Pharmacy_Kissimmee_%2849892395711%29.jpg/1280px-CVS_Pharmacy_Kissimmee_%2849892395711%29.jpg$$, 1, $$Foto: Todd Van Hoosear / Wikimedia Commons, CC BY-SA 2.0.$$),
($$target$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/BookTok_section_at_a_Target_store_in_Orlando%2C_Florida.jpg/1280px-BookTok_section_at_a_Target_store_in_Orlando%2C_Florida.jpg$$, 0, $$Foto: Nielsoncaetanosalmeron / Wikimedia Commons, CC BY 4.0.$$),
($$target$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/Target_in_Hollywood_FL.JPG/1280px-Target_in_Hollywood_FL.JPG$$, 1, $$Foto: Otisfrog (Tazewel Noah) / Wikimedia Commons, CC BY-SA 3.0.$$),
($$target$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/Target_at_Shoppes_at_Black_Diamond%2C_Florida.jpg/1280px-Target_at_Shoppes_at_Black_Diamond%2C_Florida.jpg$$, 2, $$Foto: The Bushranger / Wikimedia Commons, CC BY-SA 4.0.$$),
($$walmart$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Walmart_Supercenter_on_Cypress_Gardens_Blvd.jpg/1280px-Walmart_Supercenter_on_Cypress_Gardens_Blvd.jpg$$, 0, $$Foto: PCHS-NJROTC / Wikimedia Commons, CC BY-SA 4.0.$$),
($$walmart$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Walmart_Supercenter_interior_-_Tallahassee%2C_Leon_County%2C_FL_-_Thomasville_Road.jpg/1280px-Walmart_Supercenter_interior_-_Tallahassee%2C_Leon_County%2C_FL_-_Thomasville_Road.jpg$$, 1, $$Foto: Winnebaggo / Wikimedia Commons, CC BY-SA 4.0.$$),
($$ross-dress-for-less$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Ross_Dress_for_Less%2C_Butler_Plaza_Central%2C_Gainesville.jpg/1280px-Ross_Dress_for_Less%2C_Butler_Plaza_Central%2C_Gainesville.jpg$$, 0, $$Foto: Michael Rivera / Wikimedia Commons, CC BY 4.0.$$),
($$ross-dress-for-less$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Ross_Dress_for_Less%2C_Gleason_Place%2C_Lake_City.jpg/1280px-Ross_Dress_for_Less%2C_Gleason_Place%2C_Lake_City.jpg$$, 1, $$Foto: Michael Rivera / Wikimedia Commons, CC BY-SA 4.0.$$),
($$marshalls$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Marshalls%2C_Sawgrass_Mills%2C_Sunrise%2C_Florida_February_20%2C_2022.jpg/1280px-Marshalls%2C_Sawgrass_Mills%2C_Sunrise%2C_Florida_February_20%2C_2022.jpg$$, 0, $$Foto: AITFFan1 / Wikimedia Commons, CC BY-SA 4.0.$$),
($$tj-maxx$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/TJ_Maxx_%2814347306712%29.jpg/1280px-TJ_Maxx_%2814347306712%29.jpg$$, 0, $$Foto: Mike Mozart / Wikimedia Commons, CC BY 2.0.$$),
($$tj-maxx$$, $$https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/TJ_Maxx_%2815225566801%29.jpg/1280px-TJ_Maxx_%2815225566801%29.jpg$$, 1, $$Foto: Mike Mozart / Wikimedia Commons, CC BY 2.0.$$)
) as v(slug,url,ord,cap) on v.slug=a.slug
where not exists (select 1 from attraction_photos p where p.attraction_id=a.id and p.url=v.url);
