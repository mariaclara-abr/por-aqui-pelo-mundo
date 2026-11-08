-- Categoria para supermercados e mercados. Fica numa migration própria: o Postgres não deixa
-- usar um valor de enum recém-criado na mesma transação em que foi adicionado.

alter type attraction_category add value 'mercado';
