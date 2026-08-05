-- Área de perfil: bucket de avatares (qualquer usuário autenticado pode
-- enviar o próprio, sem precisar ser author) e uma função pública para
-- checar disponibilidade de username sem expor os perfis de outras pessoas
-- (a policy de select em profiles já restringe leitura ao dono da linha).

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

create policy "Public read access on avatars bucket"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

create function public.is_username_available(check_username text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (
    select 1 from profiles
    where username = check_username and id <> auth.uid()
  );
$$;
