-- Por Aqui Pelo Mundo: schema inicial
-- Hierarquia: countries > cities > attractions, com fotos e tags próprias.

create extension if not exists "pgcrypto";

create type attraction_category as enum (
  'ponto_turistico',
  'restaurante',
  'hotel',
  'museu',
  'natureza',
  'compras',
  'passeio',
  'cafe',
  'outro'
);

create table countries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  cover_image_url text,
  created_at timestamptz not null default now()
);

create table cities (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references countries(id) on delete cascade,
  name text not null,
  slug text not null unique,
  cover_image_url text,
  description text,
  created_at timestamptz not null default now()
);

create index cities_country_id_idx on cities(country_id);

create table attractions (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references cities(id) on delete cascade,
  name text not null,
  slug text not null unique,
  category attraction_category not null,
  description text,
  personal_experience text,
  important_tips text,
  average_visit_time text,
  best_time_of_day text,
  best_season text,
  recommended_audience text,
  important_notes text,
  curation_rating smallint not null check (curation_rating between 1 and 5),
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  created_at timestamptz not null default now()
);

create index attractions_city_id_idx on attractions(city_id);
create index attractions_category_idx on attractions(category);

create table attraction_photos (
  id uuid primary key default gen_random_uuid(),
  attraction_id uuid not null references attractions(id) on delete cascade,
  url text not null,
  "order" integer not null default 0
);

create index attraction_photos_attraction_id_idx on attraction_photos(attraction_id);

create table tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

create table attraction_tags (
  attraction_id uuid not null references attractions(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (attraction_id, tag_id)
);

create index attraction_tags_tag_id_idx on attraction_tags(tag_id);

-- Conteúdo é curadoria pública: leitura aberta via anon key, escrita reservada
-- à service role key (ferramentas internas de curadoria, sem policy de insert/update/delete).
alter table countries enable row level security;
alter table cities enable row level security;
alter table attractions enable row level security;
alter table attraction_photos enable row level security;
alter table tags enable row level security;
alter table attraction_tags enable row level security;

create policy "Public read access" on countries for select using (true);
create policy "Public read access" on cities for select using (true);
create policy "Public read access" on attractions for select using (true);
create policy "Public read access" on attraction_photos for select using (true);
create policy "Public read access" on tags for select using (true);
create policy "Public read access" on attraction_tags for select using (true);
