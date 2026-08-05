-- Bucket público para fotos de países, cidades e atrações, enviadas pelo painel
-- de administração. Leitura pública (mesmo padrão das tabelas de conteúdo);
-- escrita restrita a usuários com profiles.role = 'author'.

insert into storage.buckets (id, name, public)
values ('media', 'media', true);

create policy "Public read access on media bucket"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "Authors can upload to media bucket"
  on storage.objects for insert
  with check (bucket_id = 'media' and public.is_author());

create policy "Authors can update media bucket"
  on storage.objects for update
  using (bucket_id = 'media' and public.is_author())
  with check (bucket_id = 'media' and public.is_author());

create policy "Authors can delete from media bucket"
  on storage.objects for delete
  using (bucket_id = 'media' and public.is_author());
