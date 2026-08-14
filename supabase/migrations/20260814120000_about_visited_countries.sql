-- Lista de destinos visitados pela autora, exibida na seção "Destinos já
-- visitados" da página "Sobre a autora". Independente da tabela `countries`
-- da curadoria, pois a autora pode ter visitado lugares que ainda não têm
-- nenhuma atração cadastrada. Seed inicial copia os países já cobertos pela
-- curadoria para não deixar a lista vazia.

create table about_visited_countries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

insert into about_visited_countries (name)
select name from countries order by name;

alter table about_visited_countries enable row level security;

create policy "Public read access" on about_visited_countries for select using (true);
create policy "Authors can insert about_visited_countries" on about_visited_countries for insert with check (public.is_author());
create policy "Authors can delete about_visited_countries" on about_visited_countries for delete using (public.is_author());
