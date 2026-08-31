-- Mais um sinalizador curado nos "detalhes rápidos": só aparece quando
-- verdadeiro, junto dos outros já adicionados em
-- 20260831160000_attraction_quick_facts_flags.sql.

alter table attractions
  add column has_air_conditioning boolean not null default false;
