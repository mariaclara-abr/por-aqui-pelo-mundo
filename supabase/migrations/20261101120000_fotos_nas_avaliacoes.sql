-- Quem avalia o site pode anexar até 3 fotos. Bucket próprio, público para
-- leitura; cada pessoa só mexe na própria pasta (mesmo padrão dos avatares).
-- Limite de 3 MB e só imagens: o navegador já reduz a foto antes de enviar,
-- mas o bucket protege contra upload direto.

alter table site_reviews
  add column photos text[] not null default '{}',
  add constraint site_reviews_photos_max check (cardinality(photos) <= 3);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('review-photos', 'review-photos', true, 3145728, array['image/jpeg', 'image/png', 'image/webp']);

create policy "Public read access on review-photos bucket"
  on storage.objects for select
  using (bucket_id = 'review-photos');

create policy "Users can upload their own review photos"
  on storage.objects for insert
  with check (
    bucket_id = 'review-photos' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own review photos"
  on storage.objects for delete
  using (
    bucket_id = 'review-photos' and (storage.foldername(name))[1] = auth.uid()::text
  );
