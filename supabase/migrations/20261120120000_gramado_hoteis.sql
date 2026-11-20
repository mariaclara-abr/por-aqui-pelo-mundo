-- Gramado: quatro hospedagens pedidas em 20/11/2026, no mesmo padrão dos hotéis de Orlando (categoria hotel, detalhes rápidos,
-- faixa de preço e o espaço exclusivo da Booking.com em exclusive_perk_*).
-- Dados dos sites oficiais, lidos em 20/11/2026: skyhoteis.com.br, laghettohoteis.com.br, hoteisfioreze.com.br e casadamontanha.com.br.
-- Sem relato pessoal (personal_experience fica em branco: a equipe não se hospedou). Sem fotos: no Wikimedia Commons só existem 3 fotos livres
-- (1 do Hotel Sky e 2 do Casa da Montanha), todas escuras ou sem qualidade, e nada do Laghetto Stilo Centro nem do Quero Quero.
-- Sem 3 fotos boas com licença comprovada, os quatro entram como rascunho (cards "Em breve" na página da cidade).
-- Faixa de preço segue a classificação do pedido: Sky = econômico (1), Laghetto Stilo Centro e Fioreze Quero Quero = intermediário (2),
-- Casa da Montanha = mais confortável (3).
-- exclusive_perk_url fica em branco de propósito: é onde entra o link de afiliada da Booking.com de cada hotel (pelo admin). Sem link, só aparece o texto.
-- Coordenadas pelo Nominatim, só onde o resultado bate com o nome ou o número do hotel (Sky, Laghetto Stilo Centro e Casa da Montanha).
-- O Quero Quero só tem a rua no mapa, sem o número 200, então fica sem coordenada.
insert into attractions (city_id, name, slug, categories, description, important_tips, average_visit_time, best_time_of_day, best_season, recommended_audience, price_range, weather_sensitive, has_air_conditioning, intense_physical_effort, requires_advance_purchase, requires_reservation, latitude, longitude, exclusive_perk_description, exclusive_perk_url, exclusive_perk_cta_label, status)
select c.id, v.name, v.slug, array['hotel']::attraction_category[], v.d, v.tips, 'Conforme hospedagem', v.best, 'O ano todo', v.aud, v.pr, false, v.ac, false, false, false, v.la, v.lo,
  $$Antes de reservar sua hospedagem, vale comparar os valores e as condições disponíveis! Na **Booking.com**, você pode encontrar ofertas especiais, benefícios do programa Genius e opções com cancelamento gratuito, conforme a tarifa escolhida.

Confira a disponibilidade para suas datas e veja qual opção combina melhor com sua viagem!$$,
  null::text, $$Consultar tarifas e disponibilidade$$, 'draft'::country_status
from cities c cross join (values
($$Hotel Sky Gramado$$, $$hotel-sky-gramado$$,
$$O **Hotel Sky** fica na Avenida das Hortênsias, 680, no bairro Planalto, em Gramado, a cerca de 800 metros do centro, segundo o site oficial. A construção segue o estilo **enxaimel germânico**, e o hotel se apresenta como um cartão-postal de Gramado, com atendimento de ambiente familiar.

O grande destaque é o **café da manhã estilo colonial**, que o hotel descreve como premiado e com mais de 80 variedades. Os apartamentos têm ar-condicionado, calefação central, TV a cabo, frigobar, Wi-Fi gratuito, cama box, travesseiros de pluma e secador de cabelos. O hotel conta com elevador, sala de estar com lareira e estacionamento pago à parte.

Para o jantar, que não está incluso na diária, há duas opções ligadas ao hotel: a **Sopas da Serra**, com a tradicional sopa no pão, cinco tipos de sopa por dia, sete opções de pratos quentes e buffet de saladas e sobremesas, e o **Restaurante Château Allemand**, casa de fondue com a "Noite Suíça" à luz de velas e música ao vivo.

O Hotel Sky é uma das unidades da rede Sky Hotéis, que tem vários hotéis em Gramado e Canela. Para consultar os serviços, as tarifas e as condições atualizadas, acesse o site oficial: [www.skyhoteis.com.br](https://www.skyhoteis.com.br/hotel-sky).$$,
$$✓ O estacionamento é cobrado à parte. Em consulta ao site oficial em 20/11/2026: R$ 40,00 por dia, por veículo, mais 10% de taxa de serviço. Confirme o valor na reserva.
✓ O jantar não está incluso na diária. Para jantar no hotel, há a Sopas da Serra e a Noite Suíça de fondue no Château Allemand.
✓ A página oficial do hotel não cita piscina. Se ela for importante para você, confirme com o hotel antes de reservar.
✓ A rede Sky Hotéis tem várias unidades em Gramado e Canela, como o Sky Premium e o Sky Centro. Confira se a reserva é do Hotel Sky, na Avenida das Hortênsias, 680.$$,
null::text, $$Famílias e casais$$, 1::smallint, true, -29.3862211::numeric, -50.8814348::numeric),
($$Hotel Laghetto Stilo Centro$$, $$hotel-laghetto-stilo-centro-gramado$$,
$$O **Hotel Laghetto Stilo Centro** fica na Rua São Pedro, 374, no centro de Gramado, a **400 metros da Rua Coberta** (2 minutos, segundo o site oficial) e a 700 metros da Rua Torta. A rodoviária fica a 1,2 km, e restaurantes, farmácia e supermercado estão a menos de 500 metros do hotel.

Faz parte da rede **Laghetto**, com área de bem-estar que inclui **jacuzzi** e academia, restaurante com room service e estacionamento pago no local. O **café da manhã** traz pães, bolos, sucos e frutas, além de pratos servidos à la carte, com opções vegetarianas, veganas, sem glúten e para diabéticos.

O hotel é **pet friendly**, e a rede oferece comodidades exclusivas para os animais. Confira a política de pets antes de reservar.

Para consultar os serviços, os horários e as condições atualizadas, acesse o site oficial: [www.laghettohoteis.com.br](https://www.laghettohoteis.com.br/hoteis/centro).$$,
$$✓ Horários, segundo o site oficial em 20/11/2026: check-in a partir das 14h e check-out até as 12h; café da manhã das 6h30 às 10h30; restaurante e room service das 12h às 23h; academia das 7h às 22h.
✓ O estacionamento e a recarga de veículos elétricos são pagos no local. Confirme os valores na reserva.
✓ Hotel pet friendly: confira a política de pets da rede Laghetto antes de reservar.
✓ O site oficial destaca jacuzzi e academia na área de bem-estar. Se a piscina for importante para você, confirme com o hotel antes de reservar.
✓ Segundo o site oficial, a [Rua Coberta](https://www.poraquipelomundo.com/brasil/gramado/rua-coberta-gramado) fica a 0,4 km, a [Rua Torta](https://www.poraquipelomundo.com/brasil/gramado/rua-torta-gramado) a 0,7 km e o [Lago Negro](https://www.poraquipelomundo.com/brasil/gramado/lago-negro-gramado) a 2,1 km.
✓ A rede Laghetto tem vários hotéis em Gramado, como o Laghetto Stilo Borges e o Laghetto Stilo Vita. Confira se a reserva é do Laghetto Stilo Centro, na Rua São Pedro, 374.$$,
$$Check-in a partir das 14h$$, $$Casais e famílias$$, 2::smallint, false, -29.3784415::numeric, -50.8752355::numeric),
($$Hotel Fioreze Quero Quero$$, $$hotel-fioreze-quero-quero-gramado$$,
$$O **Hotel Fioreze Quero Quero** fica na Rua Dartagnan de Oliveira, 200, na Avenida Central, em Gramado, a cerca de 2 km da Rua Coberta e a 5 km de Canela. Cercado por uma **ampla área verde**, tem proposta de tranquilidade e contato com a natureza, e o hóspede escolhe entre **chalés e apartamentos**. O hotel é administrado pela família Fioreze desde 2009.

A estrutura é pensada para famílias: **piscina térmica** adulta e infantil, com água entre 31 °C e 34 °C, **espaço kids**, sala de jogos com mesa de carteado e de ping-pong e a **Copa Baby**, que funciona 24 horas e tem fogão, micro-ondas, chaleira elétrica, frigobar e utensílios básicos para o preparo de refeições de bebês e crianças pequenas. Há ainda academia e bicicletas gratuitas para passeios leves.

O **café da manhã** é incluso e valoriza receitas da herança italiana e alemã da região. Todas as acomodações têm TV de tela plana com canais a cabo, frigobar, secador de cabelo e cofre, e o hotel oferece Wi-Fi gratuito e estacionamento não coberto. Pets de pequeno porte são aceitos nos chalés.

Para consultar os serviços, as tarifas e as condições atualizadas, acesse o site oficial: [www.hoteisfioreze.com.br](https://www.hoteisfioreze.com.br/hotel-fioreze-quero-quero/).$$,
$$✓ Fica a cerca de 2 km da Rua Coberta e a 5 km de Canela, segundo o site oficial. Considere o deslocamento até o centro ao montar o roteiro.
✓ Pets de pequeno porte são aceitos apenas nos chalés. Em consulta ao site oficial em 20/11/2026, há taxa pet de R$ 80,00. Confirme as regras antes de reservar.
✓ Para quem viaja com bebê, a Copa Baby funciona 24 horas e reúne fogão, micro-ondas, chaleira elétrica, frigobar e utensílios básicos.
✓ A decoração do quarto para lua de mel e bodas pode ser pedida, conforme a disponibilidade. Consulte a equipe no momento da reserva.
✓ Segundo o site oficial, ficam perto do hotel a [Chocolates Prawer](https://www.poraquipelomundo.com/brasil/gramado/chocolates-prawer), a [Kongo Pizzaria Temática](https://www.poraquipelomundo.com/brasil/gramado/kongo-pizzaria-tematica), o café colonial Bella Vista e o NBA Park.
✓ A rede Fioreze tem outras unidades em Gramado, como o Fioreze Centro e o Fioreze Chalés. Confira se a reserva é do Fioreze Quero Quero, na Rua Dartagnan de Oliveira, 200.$$,
null::text, $$Famílias e casais$$, 2::smallint, true, null::numeric, null::numeric),
($$Hotel Casa da Montanha$$, $$hotel-casa-da-montanha-gramado$$,
$$O **Hotel Casa da Montanha** fica na Avenida Borges de Medeiros, 3166, a principal rua de Gramado, a 550 metros da Rua Coberta e a 700 metros da Igreja Matriz. Em funcionamento desde 1997, tem **77 acomodações** entre apartamentos e suítes, com opções que vão de um casal a até seis pessoas.

A estadia inclui **café da manhã**, **chá da tarde**, welcome drink na chegada e frigobar de boas-vindas na acomodação, de acordo com o site oficial. A área de bem-estar tem **piscina interna aquecida**, sauna seca e úmida, academia e o **spa**, que também recebe quem não está hospedado e tem tratamentos da linha Raphàh. Bicicletas estão disponíveis para hóspedes sem custo, por solicitação na recepção.

Para as crianças, o hotel tem espaço kids, menu infantil nos restaurantes, programação sazonal e o **carrossel**, símbolo do hotel, que funciona diariamente até as 17h para hóspedes. Nas épocas de Natal e Páscoa, o hotel vira a **Casa de Natal** e a Casa de Páscoa, com decoração temática e programação especial.

A gastronomia reúne o **Giostra Cucina**, restaurante de culinária italiana da chef Carla Pernambuco, que abre às 19h para o jantar, e o **El Perro Bar e Snackeria**, aberto a partir das 11h. Os restaurantes e o café da manhã também recebem não hóspedes, conforme a disponibilidade.

Para consultar os serviços, os horários e as condições atualizadas, acesse o site oficial: [www.casadamontanha.com.br](https://www.casadamontanha.com.br/gramado).$$,
$$✓ Horários, segundo o site oficial em 20/11/2026: check-in a partir das 15h e check-out até as 12h; café da manhã das 7h30 às 12h; El Perro a partir das 11h; Giostra Cucina a partir das 19h.
✓ O Giostra Cucina recomenda reserva para o jantar.
✓ O hotel oferece estacionamento com valet para hóspedes e estação de recarga para veículos elétricos. Consulte os valores na recepção ou na reserva.
✓ Para viajar com pet, o site oficial indica o Petit Casa da Montanha, hotel da mesma coleção, a poucos metros.
✓ Natal e Páscoa são períodos muito disputados no hotel, e o site oficial recomenda reservar com antecedência.
✓ Segundo o site oficial, a [Rua Coberta](https://www.poraquipelomundo.com/brasil/gramado/rua-coberta-gramado) fica a 550 m, a [Aldeia do Papai Noel](https://www.poraquipelomundo.com/brasil/gramado/aldeia-do-papai-noel-gramado) a 1 km e o [Lago Negro](https://www.poraquipelomundo.com/brasil/gramado/lago-negro-gramado) a 3 km.$$,
$$Check-in a partir das 15h$$, $$Famílias e casais$$, 3::smallint, false, -29.3747612::numeric, -50.8754407::numeric)
) as v(name, slug, d, tips, best, aud, pr, ac, la, lo)
where c.slug = 'gramado'
  and not exists (select 1 from attractions x where x.city_id = c.id and (x.slug = v.slug or lower(x.name) = lower(v.name)));

-- Etiquetas, só do que o próprio cadastro comprova (mesmo critério do cadastro de 12/11): público do hotel e, para crianças pequenas,
-- só onde o site oficial lista estrutura infantil (Quero Quero: espaço kids, piscina infantil e Copa Baby; Casa da Montanha: espaço kids, carrossel e menu infantil).
insert into attraction_tags (attraction_id, tag_id)
select a.id, t.id
from attractions a
join cities c on c.id = a.city_id and c.slug = 'gramado'
join tags t on
  (t.slug = 'ideal_para_familias' and a.recommended_audience ~* 'fam[ií]li')
  or (t.slug = 'casais' and a.recommended_audience ~* 'casais')
  or (t.slug = 'criancas_pequenas' and a.slug in ('hotel-fioreze-quero-quero-gramado', 'hotel-casa-da-montanha-gramado'))
where a.slug in ('hotel-sky-gramado', 'hotel-laghetto-stilo-centro-gramado', 'hotel-fioreze-quero-quero-gramado', 'hotel-casa-da-montanha-gramado')
on conflict do nothing;
