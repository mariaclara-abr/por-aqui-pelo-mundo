-- Permite ocultar a nota de curadoria quando a autora não quiser avaliar
-- a atração especificamente. O check constraint já ignora valores nulos.
alter table attractions
  alter column curation_rating drop not null;
