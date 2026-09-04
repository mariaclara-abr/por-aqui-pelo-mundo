-- Junta os cards de dicas de países da Europa (que estavam separados por
-- categoria "Itália", "Suíça", "França") e as dicas específicas de países
-- europeus que estavam soltas em "Planejamento de viagem" num único
-- capítulo "Europa". "Planejamento de viagem" fica só com dicas que servem
-- para qualquer destino.

-- Itália -> Europa
update travel_tips set category = 'Europa', "order" = 3
  where id = 'c1454d1b-17dd-43f8-8d0b-acdd044780e7'; -- Moeda e clima em Milão
update travel_tips set category = 'Europa', "order" = 4
  where id = 'd44dc583-1a49-4c02-9cbc-e8e30c5af160'; -- Comidas típicas de Milão

-- Suíça -> Europa (título passa a citar o país)
update travel_tips
  set category = 'Europa', "order" = 7, title = 'Moeda, idioma e clima na **Suíça**'
  where id = 'eb781b41-f032-44a3-9a9d-5c708bf8aec8';

-- França -> Europa
update travel_tips set category = 'Europa', "order" = 8
  where id = 'e481e226-b2ba-4cac-97af-8c8f1e240f8c'; -- Moeda e clima em Paris
update travel_tips set category = 'Europa', "order" = 9
  where id = 'cabc1e94-cd59-4bec-860e-72279b1b534c'; -- Bebedouros públicos gratuitos em Paris

-- Dicas de "Planejamento de viagem" que na verdade falam de país/região
-- específica da Europa -> Europa
update travel_tips set category = 'Europa', "order" = 2
  where id = '1c9ad3bc-9e54-4736-bcab-86d3afec3c5a'; -- entrar na Europa em 2026
update travel_tips set category = 'Europa', "order" = 11
  where id = '72428b4c-8b33-48a7-b8f8-bb271dbde89e'; -- recuperar dinheiro de compras na Europa
update travel_tips set category = 'Europa', "order" = 12
  where id = 'b48b75a7-4b0b-4f53-b266-379d74189293'; -- água em restaurante na Europa
update travel_tips set category = 'Europa', "order" = 5
  where id = '218087fd-9682-46fb-9f63-4286b3cbe2c3'; -- multa na Itália
update travel_tips set category = 'Europa', "order" = 6
  where id = 'ca621c44-535a-4306-9184-088bdb982fcc'; -- vinho e dirigir na Itália
update travel_tips set category = 'Europa', "order" = 10
  where id = 'af6f26f2-32dd-45a3-b487-3e5b9ce1495c'; -- costume de praia na França
update travel_tips set category = 'Europa', "order" = 13
  where id = '0f084aca-007d-40eb-8104-1edf84665fd9'; -- erro comum na Europa no verão

-- Título do card de fuso horário passa a citar a região e destaca a
-- exceção (Londres) em negrito, para ficar consistente com o resto do
-- capítulo "Europa"
update travel_tips
  set title = 'Fuso horário na **Europa**: atenção a Londres', "order" = 1
  where id = '7dc8619a-3f17-481a-9567-6ca4699a4c25';
