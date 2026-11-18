-- Gramado e Canela: ajustes da revisão de 17/11/2026 nos rascunhos que já existiam (fotos, relatos pessoais e categorias não são tocados).
-- Fontes: sites oficiais lidos em 17/11/2026 (festivaldecinemadegramado.com, natalluzdegramado.com.br, hectordragao.com.br,
-- aliceeochapeleiro.com.br, parquecaracol.com.br, castelinhocaracol.com.br, dreamland.com.br, lumnigramado.com.br).

-- 1. O domínio festivaldegramado.net, usado como "site oficial" em 3 registros, não responde. O site oficial é festivaldecinemadegramado.com.
--    O site oficial grafa "Elizabeth Rosenfeld" (criadora do Kikito): alinhado nos registros ligados ao Kikito.
update attractions set
  description = replace(replace(description, 'https://festivaldegramado.net', 'https://festivaldecinemadegramado.com'), 'Elisabeth Rosenfeld', 'Elizabeth Rosenfeld'),
  important_tips = replace(replace(important_tips, 'https://festivaldegramado.net', 'https://festivaldecinemadegramado.com'), 'Elisabeth Rosenfeld', 'Elizabeth Rosenfeld')
where description like '%festivaldegramado.net%' or important_tips like '%festivaldegramado.net%'
   or description like '%Elisabeth Rosenfeld%' or important_tips like '%Elisabeth Rosenfeld%';

-- 2. Palácio dos Festivais: número do endereço (site do Natal Luz: Av. Borges de Medeiros, 2697) e próxima edição do festival.
update attractions set
  description = replace(description, 'fica na Avenida Borges de Medeiros, no centro de Gramado', 'fica na Avenida Borges de Medeiros, 2697, no centro de Gramado'),
  important_tips = replace(important_tips, 'A edição de 2026 foi de 12 a 22 de agosto.', 'A edição de 2026 foi de 12 a 22 de agosto, e a 55ª está marcada para 7 a 21 de agosto de 2027.')
where slug = 'palacio-dos-festivais-gramado';

-- 3. Festival de Cinema de Gramado, com destaque para o Kikito (história e datas do site oficial).
update attractions set
  description = $$O **Festival de Cinema de Gramado** é o festival de cinema mais importante do Brasil e acontece todos os anos, em agosto, no **Palácio dos Festivais**, no centro da cidade. Estreou em janeiro de 1973 e firmou Gramado como a "Capital do Cinema Brasileiro", reunindo a produção competitiva do Brasil e do Rio Grande do Sul e, desde 1992, a mostra ibero-americana.

O grande símbolo é o **Kikito**, o troféu entregue aos vencedores: uma escultura de Elizabeth Rosenfeld que celebra o artesanato local e da qual mais de mil exemplares já foram distribuídos desde a primeira edição. Há uma réplica gigante do troféu na [Estátua do Kikito e Rótula das Bandeiras](https://www.poraquipelomundo.com/brasil/gramado/estatua-do-kikito-rotula-das-bandeiras), um dos pontos mais fotografados da cidade.

A **54ª edição** aconteceu de 12 a 22 de agosto de 2026, e a **55ª edição** está marcada para **7 a 21 de agosto de 2027**, segundo o site oficial. O evento é **sazonal**, as datas mudam a cada ano e ele não deve ser tratado como atração permanente. Durante o festival, o tapete vermelho liga o palácio à Rua Coberta, e a programação também inclui sessões gratuitas, como as reprises da manhã seguinte.

Verifique as informações atualizadas, a programação e os ingressos no site oficial: https://festivaldecinemadegramado.com$$,
  important_tips = $$✓ O festival acontece em agosto e as datas mudam a cada edição: a 55ª está marcada para 7 a 21 de agosto de 2027. Confirme o calendário no site oficial antes de reservar a viagem.
✓ As sessões têm ingresso pago, vendido pelo site oficial (botão Ingressos), e as mais disputadas esgotam rápido. Os valores de edições anteriores não valem para a próxima.
✓ Parte da programação, como reprises e mostras paralelas, pode ter entrada livre: consulte a programação do dia no site.
✓ Para conhecer o cenário fora da época do festival, visite o [Palácio dos Festivais](https://www.poraquipelomundo.com/brasil/gramado/palacio-dos-festivais-gramado) e a [Estátua do Kikito e Rótula das Bandeiras](https://www.poraquipelomundo.com/brasil/gramado/estatua-do-kikito-rotula-das-bandeiras).
✓ A central de atendimento do festival responde pelo telefone (54) 3698-9575.
✓ Site oficial: https://festivaldecinemadegramado.com$$,
  latitude = -29.378978,
  longitude = -50.874065
where slug = 'festival-de-cinema-de-gramado'
  and city_id = (select id from cities where slug = 'gramado');

-- 4. Lumni: o nome oficial é Lumni Experience (título do site lumnigramado.com.br). O endereço da página (slug) não muda.
update attractions set
  name = 'Lumni Experience',
  description = replace(description, '**Lumni Gramado** (Lumni Experience)', '**Lumni Experience** (Lumni Gramado)')
where slug = 'parque-lumni-gramado'
  and city_id = (select id from cities where slug = 'gramado');

-- 5. Alice e o Chapeleiro e Hector Dragão: informa que são experiências pagas e as regras para crianças (sites oficiais).
--    price_range (faixa $) segue em branco: sem preço de refeição verificado em Tripadvisor/cardápio, não se classifica.
update attractions set
  important_tips = replace(important_tips, '✓ Site oficial: https://www.aliceeochapeleiro.com.br', E'✓ Experiência paga, com ingresso comprado no site oficial. Crianças até 2 anos e 11 meses não pagam, e as bebidas e a taxa de serviço não estão incluídas no valor.\n✓ Site oficial: https://www.aliceeochapeleiro.com.br')
where slug = 'alice-e-o-chapeleiro-gramado'
  and city_id = (select id from cities where slug = 'gramado');

update attractions set
  important_tips = replace(important_tips, '✓ Site oficial: https://hectordragao.com.br', E'✓ Experiências pagas, com reserva. Em consulta ao site oficial em 17/11/2026: a Pizzaria Temática a partir de R$ 289,90 na compra antecipada (de R$ 349,90), com abertura dos portões às 17h; a Ferrovia Secreta a R$ 199,90 (de R$ 269,00). Na Ferrovia, crianças de 0 a 4 anos embarcam de graça (mas entram na reserva) e de 5 a 12 anos pagam R$ 99,90.\n✓ Site oficial: https://hectordragao.com.br')
where slug = 'hector-dragao-gramado'
  and city_id = (select id from cities where slug = 'gramado');

-- 6. Endereços que faltavam na descrição (sites oficiais).
update attractions set description = replace(description, 'é o Parque Estadual do Caracol, em Canela,', 'é o Parque Estadual do Caracol, na Rodovia RS-466, km 0, no bairro Caracol, em Canela,')
where slug = 'parque-do-caracol-canela';

update attractions set description = replace(description, 'O **Castelinho Caracol** é um museu em uma das primeiras residências de Canela, construída', 'O **Castelinho Caracol** fica na Estrada do Caracol, km 3, no bairro Caracol, a 4,5 km do centro de Canela. É um museu em uma das primeiras residências da cidade, construída')
where slug = 'castelinho-caracol-canela';

update attractions set description = replace(description, 'foi inaugurado em 2009, em Gramado,', 'foi inaugurado em 2009, na Avenida das Hortênsias, 5507, em Gramado,')
where slug = 'dreamland-museu-de-cera-gramado';

-- 7. Coordenadas (Nominatim/OpenStreetMap, só resultados em que o nome ou o número do endereço batem com o lugar exato).
--    Ficaram sem coordenada, por falta de resultado exato: Aldeia do Papai Noel, Lumni Experience, Hector Dragão, Alice e o Chapeleiro,
--    Mirante do Vale do Quilombo, Pórticos, Avenida Borges de Medeiros, Bustour e Sonho de Natal de Canela. Nunca sobrescreve coordenada existente.
update attractions a set latitude = v.la, longitude = v.lo
from (values
  ('rua-coberta-gramado', -29.3785900::numeric, -50.8732034::numeric),
  ('rua-torta-gramado', -29.3824974, -50.8713646),
  ('fonte-do-amor-eterno-gramado', -29.3794784, -50.8743672),
  ('palacio-dos-festivais-gramado', -29.3789780, -50.8740647),
  ('praca-das-etnias-gramado', -29.3830445, -50.8717208),
  ('praca-major-nicoletti-gramado', -29.3792138, -50.8731132),
  ('estatua-do-kikito-rotula-das-bandeiras', -29.3854552, -50.8734036),
  ('mini-mundo-gramado', -29.3845237, -50.8753705),
  ('snowland-gramado', -29.3938538, -50.9214836),
  ('le-jardin-parque-de-lavanda', -29.4154510, -50.8709216),
  ('acquamotion-gramado', -29.3912540, -50.9268785),
  ('gramadozoo', -29.4315461, -50.8538933),
  ('dreamland-museu-de-cera-gramado', -29.3610243, -50.8487266),
  ('hollywood-dream-cars-gramado', -29.3655897, -50.8601570),
  ('super-carros-gramado', -29.3615768, -50.8573160),
  ('mundo-de-chocolate-lugano', -29.3805806, -50.8728230),
  ('parque-do-caracol-canela', -29.3135384, -50.8543185),
  ('skyglass-canela', -29.2701875, -50.8441796),
  ('mundo-a-vapor-canela', -29.3616839, -50.8348580),
  ('alpen-park-canela', -29.3615506, -50.7854599),
  ('parque-terra-magica-florybal-canela', -29.3444634, -50.8355522),
  ('castelinho-caracol-canela', -29.3355454, -50.8501539),
  ('estacao-campos-de-canella', -29.3643999, -50.8137405),
  ('space-adventure-canela', -29.3601669, -50.8355767)
) as v(slug, la, lo)
join cities c on c.slug in ('gramado','canela')
where a.slug = v.slug and a.city_id = c.id and a.latitude is null and a.longitude is null;
