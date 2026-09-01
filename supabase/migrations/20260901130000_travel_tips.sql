-- Dicas de viagem: cards curados com informações práticas, curiosidades e
-- dicas de bastidor, agrupados por categoria (ex: "Disney", "Aeroportos").
-- Mesma lógica de curadoria manual do restante do conteúdo: cadastradas pelo
-- painel admin, nunca geradas automaticamente.

create table travel_tips (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  content text not null,
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

create index travel_tips_order_idx on travel_tips("order");

alter table travel_tips enable row level security;

create policy "Public read access" on travel_tips for select using (true);

create policy "Authors can insert travel_tips" on travel_tips for insert with check (public.is_author());
create policy "Authors can update travel_tips" on travel_tips for update using (public.is_author()) with check (public.is_author());
create policy "Authors can delete travel_tips" on travel_tips for delete using (public.is_author());
