-- Aviso prático distinto de has_air_conditioning: alerta explícito de que o
-- lugar não tem ar condicionado, útil em destinos quentes.

alter table attractions
  add column no_air_conditioning boolean not null default false;
