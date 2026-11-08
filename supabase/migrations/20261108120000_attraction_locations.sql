-- Unidades de uma mesma atração (redes com várias lojas na cidade). A unidade principal continua em
-- attractions.latitude/longitude; esta tabela guarda todas, e a distância exibida usa a mais próxima.
create table attraction_locations (
  id uuid primary key default gen_random_uuid(),
  attraction_id uuid not null references attractions(id) on delete cascade,
  latitude numeric not null,
  longitude numeric not null,
  label text
);

create index attraction_locations_attraction_id_idx on attraction_locations(attraction_id);

alter table attraction_locations enable row level security;
create policy "Public read access" on attraction_locations for select using (true);
