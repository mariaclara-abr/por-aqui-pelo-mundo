-- Nova categoria de atração: estacionamentos. Usada para indicar
-- "estacionamentos próximos" como recomendação ao lado das outras
-- categorias (restaurantes, hotéis, passeios) na página de uma atração.
--
-- IMPORTANTE: rode este arquivo sozinho no SQL Editor e espere terminar
-- antes de rodar 20260805230100_seed_estacionamentos.sql — o Postgres não
-- permite usar um valor de enum recém-criado na mesma transação em que ele
-- foi adicionado.

alter type attraction_category add value 'estacionamentos';
