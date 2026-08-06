-- Avaliações do site (não de atrações): depoimentos de quem usou o Por Aqui
-- Pelo Mundo para planejar uma viagem. Curadas pela autora a partir de
-- feedback real recebido fora do site (WhatsApp, Instagram etc.) e
-- cadastradas manualmente pelo painel admin — mesma lógica de curadoria do
-- restante do conteúdo, nunca geradas ou inventadas.

create table site_reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_name text not null,
  rating smallint not null check (rating between 1 and 5),
  comment text not null,
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

create index site_reviews_order_idx on site_reviews("order");

alter table site_reviews enable row level security;

create policy "Public read access" on site_reviews for select using (true);

create policy "Authors can insert site_reviews" on site_reviews for insert with check (public.is_author());
create policy "Authors can update site_reviews" on site_reviews for update using (public.is_author()) with check (public.is_author());
create policy "Authors can delete site_reviews" on site_reviews for delete using (public.is_author());
