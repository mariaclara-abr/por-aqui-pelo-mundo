-- Permite marcar uma cidade como "em breve" individualmente, mesmo que o
-- país a que ela pertence já esteja publicado. Reaproveita o enum
-- country_status (draft/published) criado em 20260831190000_country_status.sql.
alter table cities
  add column status country_status not null default 'published';
