-- Meu Roteiro: cada usuário monta sua viagem adicionando atrações, como um
-- carrinho de compras. v1 usa um único roteiro ativo por usuário (status
-- 'planejando'); o esquema já suporta múltiplos roteiros para o histórico futuro.

create type itinerary_status as enum ('planejando', 'concluida');

create table itineraries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Meu Roteiro',
  destination_city_id uuid references cities(id) on delete set null,
  start_date date,
  end_date date,
  status itinerary_status not null default 'planejando',
  created_at timestamptz not null default now()
);

create index itineraries_user_id_idx on itineraries(user_id);

create table itinerary_items (
  id uuid primary key default gen_random_uuid(),
  itinerary_id uuid not null references itineraries(id) on delete cascade,
  attraction_id uuid not null references attractions(id) on delete cascade,
  "order" integer not null default 0,
  day_number integer,
  notes text,
  unique (itinerary_id, attraction_id)
);

create index itinerary_items_itinerary_id_idx on itinerary_items(itinerary_id);

alter table itineraries enable row level security;
alter table itinerary_items enable row level security;

create policy "Users can view their own itineraries" on itineraries
  for select using (auth.uid() = user_id);
create policy "Users can insert their own itineraries" on itineraries
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own itineraries" on itineraries
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own itineraries" on itineraries
  for delete using (auth.uid() = user_id);

create policy "Users can view items of their own itineraries" on itinerary_items
  for select using (
    exists (
      select 1 from itineraries
      where itineraries.id = itinerary_items.itinerary_id
      and itineraries.user_id = auth.uid()
    )
  );
create policy "Users can insert items into their own itineraries" on itinerary_items
  for insert with check (
    exists (
      select 1 from itineraries
      where itineraries.id = itinerary_items.itinerary_id
      and itineraries.user_id = auth.uid()
    )
  );
create policy "Users can update items of their own itineraries" on itinerary_items
  for update using (
    exists (
      select 1 from itineraries
      where itineraries.id = itinerary_items.itinerary_id
      and itineraries.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from itineraries
      where itineraries.id = itinerary_items.itinerary_id
      and itineraries.user_id = auth.uid()
    )
  );
create policy "Users can delete items of their own itineraries" on itinerary_items
  for delete using (
    exists (
      select 1 from itineraries
      where itineraries.id = itinerary_items.itinerary_id
      and itineraries.user_id = auth.uid()
    )
  );
