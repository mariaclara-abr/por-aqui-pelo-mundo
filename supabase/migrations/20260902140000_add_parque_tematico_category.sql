-- Categoria para parques temáticos completos (Disney, Universal). Permite
-- agrupar esses parques numa pasta própria na aba Atrações do admin,
-- separada do restante das atrações "ponto turístico" da mesma cidade.
-- Precisa ficar numa migration própria: o Postgres não deixa usar um valor
-- de enum recém-criado na mesma transação em que ele foi adicionado (ver
-- 20260805230000_add_estacionamentos_category.sql, mesmo padrão).

alter type attraction_category add value 'parque_tematico';
