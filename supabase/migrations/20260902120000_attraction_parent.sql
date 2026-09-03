-- Nova camada na hierarquia: uma atração pode pertencer a outra atração
-- "pai" (ex: um restaurante ou uma loja dentro de um parque temático).
-- Continua na mesma cidade do pai; null significa atração de primeiro
-- nível (a maioria). Atrações-filha não aparecem na grade da cidade, só
-- na página da atração-pai (ver getAttractionsByCity / getChildAttractions
-- em lib/queries.ts).

alter table attractions
  add column parent_attraction_id uuid references attractions(id) on delete cascade;

create index attractions_parent_attraction_id_idx on attractions(parent_attraction_id);
