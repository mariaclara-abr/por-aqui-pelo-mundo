-- Faixa de preço da atração (1 a 4, exibida como $ a $$$$ nos detalhes
-- rápidos), curada pela autora igual à nota de curadoria.

alter table attractions
  add column price_range smallint check (price_range between 1 and 4);
