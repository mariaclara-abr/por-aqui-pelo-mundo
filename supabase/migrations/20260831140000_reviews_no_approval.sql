-- Avaliações não passam mais por fila de aprovação: toda avaliação enviada
-- aparece publicamente na hora. A autora modera excluindo pelo painel em vez
-- de aprovar/ocultar, então o status de moderação deixa de existir.

update site_reviews set status = 'aprovada' where status <> 'aprovada';

drop policy "Public read access" on site_reviews;
drop policy "Authors can view all site_reviews" on site_reviews;
drop policy "Users can view their own site review" on site_reviews;
drop policy "Authenticated users can submit their own site review" on site_reviews;

create policy "Public read access" on site_reviews for select using (true);

create policy "Authenticated users can submit their own site review"
  on site_reviews for insert
  to authenticated
  with check (user_id = auth.uid());

alter table site_reviews drop column status;
drop type site_review_status;
