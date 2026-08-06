-- Coordenadas próprias da cidade (centro geográfico), usadas como referência
-- de proximidade quando as atrações da cidade ainda não têm lat/lng cadastradas
-- individualmente (ex: cidades distantes entre si, sem overlap de raio de bairro).
alter table cities
  add column latitude numeric(9, 6),
  add column longitude numeric(9, 6);
