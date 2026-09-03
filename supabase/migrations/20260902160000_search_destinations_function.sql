-- Busca de destinos (países, cidades e atrações) tolerante a maiúsculas/
-- minúsculas, acentos e pequenos erros de digitação. Antes, a busca do site
-- só olhava países e cidades, então uma atração como "Magic Kingdom" nunca
-- aparecia mesmo buscando o nome exato.
create extension if not exists pg_trgm;
create extension if not exists unaccent;

create index if not exists countries_name_trgm_idx
  on countries using gin (name gin_trgm_ops);
create index if not exists cities_name_trgm_idx
  on cities using gin (name gin_trgm_ops);
create index if not exists attractions_name_trgm_idx
  on attractions using gin (name gin_trgm_ops);

create or replace function search_destinations(
  search_query text,
  include_drafts boolean default false
)
returns table (
  result_type text,
  id uuid,
  name text,
  slug text,
  city_name text,
  city_slug text,
  country_name text,
  country_slug text,
  rank real
)
language sql
stable
as $$
  with normalized as (
    select unaccent(trim(search_query)) as q
  )
  select *
  from (
    select
      'country' as result_type,
      c.id,
      c.name,
      c.slug,
      null::text as city_name,
      null::text as city_slug,
      null::text as country_name,
      null::text as country_slug,
      similarity(unaccent(c.name), normalized.q) as rank
    from countries c, normalized
    where (c.status = 'published' or include_drafts)
      and (
        unaccent(c.name) ilike '%' || normalized.q || '%'
        or similarity(unaccent(c.name), normalized.q) > 0.25
      )

    union all

    select
      'city',
      ci.id,
      ci.name,
      ci.slug,
      null,
      null,
      co.name,
      co.slug,
      similarity(unaccent(ci.name), normalized.q)
    from cities ci
    join countries co on co.id = ci.country_id
    cross join normalized
    where (co.status = 'published' or include_drafts)
      and (
        unaccent(ci.name) ilike '%' || normalized.q || '%'
        or similarity(unaccent(ci.name), normalized.q) > 0.25
      )

    union all

    select
      'attraction',
      a.id,
      a.name,
      a.slug,
      ci.name,
      ci.slug,
      co.name,
      co.slug,
      similarity(unaccent(a.name), normalized.q)
    from attractions a
    join cities ci on ci.id = a.city_id
    join countries co on co.id = ci.country_id
    cross join normalized
    where (co.status = 'published' or include_drafts)
      and (
        unaccent(a.name) ilike '%' || normalized.q || '%'
        or similarity(unaccent(a.name), normalized.q) > 0.25
      )
  ) results
  order by rank desc, name
  limit 15;
$$;
