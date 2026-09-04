-- Renomeia a categoria "Pucón" para "Pucón, Chile", deixando claro o país
-- no nome do capítulo de dicas de viagem.
update travel_tips set category = 'Pucón, Chile' where category = 'Pucón';
