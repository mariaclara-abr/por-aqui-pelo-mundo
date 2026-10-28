-- Categoria para parques aquáticos (Disney, Universal). Precisa ficar numa migration
-- própria: o Postgres não deixa usar um valor de enum recém-criado na mesma transação
-- em que ele foi adicionado (mesmo padrão de 20260902140000_add_parque_tematico_category.sql).

alter type attraction_category add value 'parque_aquatico';
