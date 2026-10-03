-- Data da última edição de atrações e dicas, exibida na página, no sitemap
-- (lastmod) e no JSON-LD (dateModified). O banco não guardava a data de edição,
-- então as linhas existentes começam com created_at e passam a ser atualizadas
-- por trigger a cada update.

create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

alter table attractions add column updated_at timestamptz not null default now();
alter table travel_tips add column updated_at timestamptz not null default now();

update attractions set updated_at = created_at;
update travel_tips set updated_at = created_at;

create trigger attractions_set_updated_at
  before update on attractions
  for each row execute function set_updated_at();

create trigger travel_tips_set_updated_at
  before update on travel_tips
  for each row execute function set_updated_at();
