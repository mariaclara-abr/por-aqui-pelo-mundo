-- Sinalizadores curados exibidos nos "detalhes rápidos" da atração: só
-- aparecem quando verdadeiros (não poluem a grade com "Não" para a maioria
-- das atrações, que não têm nada de especial nesses pontos).

alter table attractions
  add column weather_sensitive boolean not null default false,
  add column intense_physical_effort boolean not null default false,
  add column requires_advance_purchase boolean not null default false,
  add column requires_reservation boolean not null default false;
