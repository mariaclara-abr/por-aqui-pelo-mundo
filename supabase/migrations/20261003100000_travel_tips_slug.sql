-- Cada dica de viagem ganha uma URL própria (/dicas-de-viagem/{slug}) para ser
-- indexável. O slug nasce do título (sem o negrito **...**) e é gerado por
-- trigger no insert, então o admin não precisa informar nada. Não muda quando
-- o título é editado, para a URL continuar estável.

create extension if not exists unaccent;

alter table travel_tips add column slug text;

create or replace function travel_tips_make_slug() returns trigger
language plpgsql as $$
declare
  base text;
  candidate text;
  n integer := 1;
begin
  if new.slug is not null then
    return new;
  end if;

  base := trim(both '-' from regexp_replace(
    regexp_replace(lower(unaccent(replace(new.title, '**', ''))), '[^a-z0-9]+', '-', 'g'),
    '^(.{1,80})(-.*)?$', '\1'
  ));
  if base = '' then base := 'dica'; end if;

  candidate := base;
  while exists (select 1 from travel_tips where slug = candidate and id <> new.id) loop
    n := n + 1;
    candidate := base || '-' || n;
  end loop;

  new.slug := candidate;
  return new;
end;
$$;

create trigger travel_tips_slug_trigger
  before insert on travel_tips
  for each row execute function travel_tips_make_slug();

-- Backfill das dicas existentes: o update dispara a mesma lógica via insert-like
-- chamada manual, então reaproveitamos a função com um update de slug nulo.
do $$
declare
  r record;
  base text;
  candidate text;
  n integer;
begin
  for r in select id, title from travel_tips where slug is null order by "order", created_at loop
    base := trim(both '-' from regexp_replace(
      regexp_replace(lower(unaccent(replace(r.title, '**', ''))), '[^a-z0-9]+', '-', 'g'),
      '^(.{1,80})(-.*)?$', '\1'
    ));
    if base = '' then base := 'dica'; end if;
    candidate := base;
    n := 1;
    while exists (select 1 from travel_tips where slug = candidate) loop
      n := n + 1;
      candidate := base || '-' || n;
    end loop;
    update travel_tips set slug = candidate where id = r.id;
  end loop;
end;
$$;

alter table travel_tips alter column slug set not null;
create unique index travel_tips_slug_key on travel_tips(slug);
