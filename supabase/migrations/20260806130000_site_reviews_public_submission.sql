-- Permite que usuários autenticados enviem sua própria avaliação do site pela
-- home. Fica "pendente" até a autora aprovar no painel; avaliações cadastradas
-- manualmente pela autora (fluxo já existente) continuam entrando direto como
-- "aprovada" (valor default da coluna), sem passar por fila de moderação.

create type site_review_status as enum ('pendente', 'aprovada', 'oculta');

alter table site_reviews
  add column user_id uuid references auth.users(id) on delete cascade,
  add column status site_review_status not null default 'aprovada';

-- Uma avaliação por conta (unique permite múltiplos null, então não afeta as
-- avaliações cadastradas manualmente pela autora, que não têm user_id).
alter table site_reviews add constraint site_reviews_user_id_key unique (user_id);

drop policy "Public read access" on site_reviews;

create policy "Public read access" on site_reviews for select using (status = 'aprovada');

create policy "Authors can view all site_reviews"
  on site_reviews for select
  to authenticated
  using (public.is_author());

create policy "Users can view their own site review"
  on site_reviews for select
  to authenticated
  using (user_id = auth.uid());

create policy "Authenticated users can submit their own site review"
  on site_reviews for insert
  to authenticated
  with check (user_id = auth.uid() and status = 'pendente');
