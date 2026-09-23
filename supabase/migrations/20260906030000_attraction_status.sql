-- Permite marcar uma atração individual como "em breve" (rascunho), mesmo
-- que a cidade já esteja publicada. Mesmo padrão de countries/cities:
-- reaproveita o enum country_status (draft/published).
alter table attractions
  add column status country_status not null default 'published';
