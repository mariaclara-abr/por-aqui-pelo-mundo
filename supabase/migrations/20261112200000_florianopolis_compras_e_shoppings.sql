-- Florianópolis: cadastro de compras e shoppings (todos como rascunho, sem fotos).
-- Jurerê Open entra no grupo de Jurerê. Itaguaçu e Continente Shopping ficam de fora: são de São José, não de Florianópolis.
-- A experiência pessoal (personal_experience) fica em branco de propósito.
insert into attractions (city_id, name, slug, categories, description, important_tips, average_visit_time, best_time_of_day, best_season, recommended_audience, weather_sensitive, has_air_conditioning, intense_physical_effort, requires_advance_purchase, requires_reservation, latitude, longitude, status)
select c.id, v.name, v.slug, v.cats, v.d, v.tips, v.visit, v.best, v.season, v.aud, v.ws, v.ac, v.eff, v.adv, v.res, v.la, v.lo, v.st::country_status
from cities c cross join (values
($$Decathlon$$, $$decathlon-florianopolis$$, array['compras']::attraction_category[], $$A **Decathlon de Florianópolis** é a loja de artigos esportivos da rede francesa, na SC-401, 3400, no bairro Saco Grande, perto do Floripa Shopping. Reúne **equipamentos e roupas para dezenas de esportes**, de corrida, trilha e ciclismo a esportes de praia e aquáticos, e é uma parada prática para quem precisa de tênis, mochila, roupa técnica ou acessórios de viagem.

A loja virou **ponto de parada de turistas argentinos**, que aproveitam as compras em Florianópolis, segundo reportagens, e por isso pode ter fila e prateleiras mais vazias na alta temporada.

Verifique as informações atualizadas, os horários e os produtos no site oficial: https://www.decathlon.com.br/lojas/decathlon-florianopolis$$, $$✓ Segundo o site oficial, a loja funciona de segunda a sábado das 10h às 22h, e aos domingos e feriados das 10h às 20h, com horários especiais em 24 e 31 de dezembro.
✓ Fica na SC-401, 3400, no Saco Grande, na região do Floripa Shopping, no caminho entre o Centro e o norte da ilha.
✓ Na alta temporada, a loja costuma ficar cheia, e alguns itens podem esgotar: vá cedo ou em dia de semana.
✓ É uma boa parada para repor itens de praia e trilha, como roupa técnica, calçado, mochila e acessórios.$$, $$1 a 2 horas$$, $$Manhã, em dias de semana$$, $$O ano todo$$, $$Famílias, casais e esportistas$$, false, false, false, false, false, -27.550655::numeric, -48.497503::numeric, 'draft'),
($$MULTI Open Shopping$$, $$multi-open-shopping$$, array['compras']::attraction_category[], $$O **MULTI Open Shopping** é um **shopping a céu aberto** no Rio Tavares, no sul da ilha, na Rodovia Dr. Antônio Luiz Moura Gonzaga, 3339. Foi inaugurado em 23 de março de 2018 e é dividido em três blocos, com cerca de **30 lojas** na área de compras e 155 salas de escritório.

O destaque é a **Plaza**, espaço aberto que recebe eventos, shows e feiras, e o **terraço com vista para a Ilha do Campeche**. Há ainda livraria, lojas de moda, ótica, joalheria e lojas de presentes, e o **CineMulti**, cinema com sala de 100 lugares, que é o único da região sul da ilha. Entre as opções de alimentação estão **Café Cultura, Gelato di Panna, Musume Sushi, Oakberry Açaí, Porto Oliveira Gastronomia e Shaka Fresh and Green**.

Verifique as informações atualizadas, os horários e a programação no site oficial: https://multiopenshopping.com.br$$, $$✓ O Visite Floripa indica o estacionamento gratuito, Wi-Fi e acesso para cadeirantes.
✓ Os restaurantes são listados com horário de segunda a sábado das 8h às 22h, e aos domingos das 12h às 20h; as lojas têm horário próprio, então confirme antes de ir.
✓ O CineMulti é o único cinema da região sul da ilha, e funciona de terça a domingo.
✓ Aproveite o terraço, com vista para a Ilha do Campeche, ao fim da tarde.
✓ Para compras, o foco é livraria, moda, ótica, joalheria e presentes; para comer, a lista inclui cafés, sorveteria, sushi, açaí e comida saudável.
✓ O shopping é a céu aberto: em dia de chuva forte, vale ter um plano B.$$, $$1 a 3 horas$$, $$Tarde$$, $$O ano todo$$, $$Famílias, casais e grupos de amigos$$, true, false, false, false, false, -27.657795::numeric, -48.4856::numeric, 'draft'),
($$Villa Romana Shopping$$, $$villa-romana-shopping$$, array['compras']::attraction_category[], $$O **Villa Romana Shopping** (antigo Shopping Iguatemi Florianópolis) fica na Avenida Madre Benvenuta, 687, em Santa Mônica, perto da Beira-Mar Norte e da rodovia que leva às praias do norte. Foi inaugurado em abril de 2007 e reúne **mais de 130 lojas**, **cinema**, **praça de alimentação e de lazer** e uma ampla **praça de eventos** com programação gratuita.

Entre as lojas estão marcas como **Zara, Sephora, Lacoste, Rip Curl, The North Face, Armani Exchange, BOSS, Arezzo, Adidas, Natura, Swarovski, Samsonite e H.Stern**. Na gastronomia, há de **Hard Rock Cafe e Coco Bambu a Outback, Madero, Starbucks, Spoleto, Giraffas, Havanna, Bacio di Latte, Kopenhagen e Cacau Show**, além de casas como o Bistrô Botânia por Mayra Pauli.

Verifique as informações atualizadas, os horários e a programação no site oficial: https://villaromanashopping.com.br$$, $$✓ Segundo o site oficial, as lojas abrem de segunda a sábado das 10h às 22h, e aos domingos e feriados das 14h às 20h.
✓ A alimentação abre de segunda a sábado das 10h às 22h, e aos domingos e feriados das 11h às 22h.
✓ O shopping tem cinema e uma agenda de eventos, com programação gratuita na Praça de Eventos e atividades infantis em feriados.
✓ O Hard Rock Cafe Florianópolis e o Coco Bambu ficam dentro do shopping.
✓ É o ponto onde termina o passeio do Floripa By Bus, que desembarca os passageiros aqui.
✓ Confira as condições de estacionamento na página de comodidades do site oficial.$$, $$2 a 4 horas$$, $$Tarde e noite$$, $$O ano todo; ótimo em dias de chuva$$, $$Famílias, casais e grupos de amigos$$, false, true, false, false, false, -27.589825::numeric, -48.515096::numeric, 'draft'),
($$Beiramar Shopping$$, $$beiramar-shopping$$, array['compras']::attraction_category[], $$O **Beiramar Shopping** fica na Rua Bocaiúva, 2468, no Centro de Florianópolis, e tem **mais de 30 anos de história**. É referência em Santa Catarina para **moda, gastronomia, lazer e entretenimento**, com **lojas**, **praça de alimentação**, **cinema (Cine Show)**, serviços, **Centro de Saúde e Bem-estar** e Centro Executivo.

Entre os serviços estão o supermercado **Imperatriz Gourmet**, farmácia, agência dos Correios, banco e academia. Na praça de alimentação, guias citam redes como **Bob's, Burger King, Giraffas, Divino Fogão, Spoleto, Outback e Madero**, além de opções locais.

Verifique as informações atualizadas, os horários e a programação no site oficial: https://beiramarshopping.com.br$$, $$✓ Segundo o site oficial, as lojas abrem de segunda a sábado das 10h às 22h, e aos domingos das 14h às 20h.
✓ A praça de alimentação abre de segunda a sábado das 10h às 22h, e aos domingos das 11h às 22h.
✓ O estacionamento fica nos pisos G1, G2 e G3. No site oficial, carros pagam R$ 20 por até 3 horas (os primeiros 15 minutos são grátis), com frações adicionais de R$ 10.
✓ O Imperatriz Gourmet abre das 8h às 23h, e a farmácia abre todos os dias das 7h às 23h.
✓ Os bares e restaurantes funcionam em horário próprio, em geral até as 23h, então confira a programação.
✓ É uma boa opção para dias de chuva, perto do Centro.$$, $$2 a 3 horas$$, $$Tarde$$, $$O ano todo; ótimo em dias de chuva$$, $$Famílias, casais e grupos de amigos$$, false, true, false, false, false, -27.584779::numeric, -48.545049::numeric, 'draft'),
($$Floripa Shopping$$, $$floripa-shopping$$, array['compras']::attraction_category[], $$O **Floripa Shopping** fica na região de Saco Grande, na SC-401, 3116, com segundo acesso pela Rodovia Virgílio Várzea, 587. Fica no caminho entre o Centro e as praias do norte e reúne **lojas, praça de alimentação, restaurantes e cinema Cinemark**, além de serviços do dia a dia.

Entre as operações estão o **supermercado Imperatriz**, a **Cia do Lazer**, o **Rhino Skate Park**, a lavanderia Lavland, a lotérica, a Imunizar Vacinas e um **posto de emissão de passaportes da Polícia Federal**. Na área de restaurantes estão o **Botequim Guanabara, o Little Carbone, o Shack Steakhouse e o Noir Sushi**.

Verifique as informações atualizadas, os horários e a programação no site oficial: https://www.floripashopping.com.br$$, $$✓ Segundo o site oficial, as lojas e cafés abrem de segunda a sábado das 10h às 22h, e a praça de alimentação das 11h às 22h.
✓ Aos domingos e feriados, as lojas abrem das 14h às 20h, e a praça de alimentação das 11h às 21h.
✓ O site informa que o shopping funciona com horário reduzido por tempo indeterminado, então confirme os horários antes de ir.
✓ O posto da Polícia Federal para emissão de passaportes funciona de segunda a sexta, das 10h às 16h.
✓ Os restaurantes Botequim Guanabara, Little Carbone, Shack Steakhouse e Noir Sushi funcionam das 11h às 22h de segunda a sábado, e das 11h às 19h aos domingos e feriados.
✓ O cinema é da rede Cinemark, e o shopping tem a Cia do Lazer e o Rhino Skate Park como opções de lazer.$$, $$2 a 3 horas$$, $$Tarde$$, $$O ano todo; ótimo em dias de chuva$$, $$Famílias, casais e grupos de amigos$$, false, true, false, false, false, -27.554001::numeric, -48.498481::numeric, 'draft')
) as v(name, slug, cats, d, tips, visit, best, season, aud, ws, ac, eff, adv, res, la, lo, st)
where c.slug='florianopolis'
  and not exists (select 1 from attractions x where x.city_id=c.id and (x.slug=v.slug or lower(x.name)=lower(v.name)));
