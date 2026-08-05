-- Monetização: rastreio de cliques em links de afiliado (Booking, GetYourGuide,
-- etc), usado pelo painel /admin/afiliados.

create table affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  affiliate_program text not null,
  attraction_id uuid references attractions(id) on delete set null,
  context text,
  created_at timestamptz not null default now()
);

create index affiliate_clicks_program_idx on affiliate_clicks(affiliate_program);
create index affiliate_clicks_attraction_id_idx on affiliate_clicks(attraction_id);

alter table affiliate_clicks enable row level security;

-- Clique é registrado para visitantes logados ou não; cada requisição só pode
-- gravar o próprio user_id (ou null, para quem não está logado).
create policy "Anyone can log their own affiliate clicks" on affiliate_clicks
  for insert with check (user_id is null or user_id = auth.uid());

create policy "Authors can view affiliate clicks" on affiliate_clicks
  for select using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'author'
    )
  );
