-- Compartilhamento público de roteiros: um link somente-leitura por roteiro,
-- identificado por um token aleatório em vez do id interno.

create table shared_itineraries (
  id uuid primary key default gen_random_uuid(),
  -- Um compartilhamento por roteiro: reativar/desativar em vez de acumular
  -- tokens novos a cada clique em "Compartilhar".
  itinerary_id uuid not null unique references itineraries(id) on delete cascade,
  share_token text not null unique,
  created_by uuid not null references auth.users(id) on delete cascade,
  is_public boolean not null default true,
  -- Não fazia parte do schema pedido, mas é necessária pra cumprir "mostra o
  -- nome de quem planejou (ou anônimo, conforme preferência do usuário)".
  show_author_name boolean not null default true,
  created_at timestamptz not null default now()
);

create index shared_itineraries_share_token_idx on shared_itineraries(share_token);

alter table shared_itineraries enable row level security;

create policy "Owners can view their own shares" on shared_itineraries
  for select using (auth.uid() = created_by);

create policy "Anyone can view a public share" on shared_itineraries
  for select using (is_public = true);

create policy "Owners can create shares for their own itineraries" on shared_itineraries
  for insert with check (
    auth.uid() = created_by
    and exists (
      select 1 from itineraries
      where itineraries.id = itinerary_id and itineraries.user_id = auth.uid()
    )
  );

create policy "Owners can update their own shares" on shared_itineraries
  for update using (auth.uid() = created_by) with check (auth.uid() = created_by);

create policy "Owners can delete their own shares" on shared_itineraries
  for delete using (auth.uid() = created_by);

-- Um roteiro compartilhado publicamente (e seus itens) fica visível pra
-- qualquer visitante, mesmo sem login — além da policy já existente que só
-- deixa o dono ver o próprio roteiro.
create policy "Anyone can view a publicly shared itinerary" on itineraries
  for select using (
    exists (
      select 1 from shared_itineraries
      where shared_itineraries.itinerary_id = itineraries.id
      and shared_itineraries.is_public = true
    )
  );

create policy "Anyone can view items of a publicly shared itinerary" on itinerary_items
  for select using (
    exists (
      select 1 from shared_itineraries
      where shared_itineraries.itinerary_id = itinerary_items.itinerary_id
      and shared_itineraries.is_public = true
    )
  );
