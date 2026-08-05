-- Leitura pública já existe desde a migration inicial. Aqui adicionamos escrita
-- (insert/update/delete) restrita a usuários com profiles.role = 'author'.

create function public.is_author()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'author'
  );
$$;

create policy "Authors can insert countries" on countries for insert with check (public.is_author());
create policy "Authors can update countries" on countries for update using (public.is_author()) with check (public.is_author());
create policy "Authors can delete countries" on countries for delete using (public.is_author());

create policy "Authors can insert cities" on cities for insert with check (public.is_author());
create policy "Authors can update cities" on cities for update using (public.is_author()) with check (public.is_author());
create policy "Authors can delete cities" on cities for delete using (public.is_author());

create policy "Authors can insert attractions" on attractions for insert with check (public.is_author());
create policy "Authors can update attractions" on attractions for update using (public.is_author()) with check (public.is_author());
create policy "Authors can delete attractions" on attractions for delete using (public.is_author());

create policy "Authors can insert attraction_photos" on attraction_photos for insert with check (public.is_author());
create policy "Authors can update attraction_photos" on attraction_photos for update using (public.is_author()) with check (public.is_author());
create policy "Authors can delete attraction_photos" on attraction_photos for delete using (public.is_author());

create policy "Authors can insert tags" on tags for insert with check (public.is_author());
create policy "Authors can update tags" on tags for update using (public.is_author()) with check (public.is_author());
create policy "Authors can delete tags" on tags for delete using (public.is_author());

create policy "Authors can insert attraction_tags" on attraction_tags for insert with check (public.is_author());
create policy "Authors can update attraction_tags" on attraction_tags for update using (public.is_author()) with check (public.is_author());
create policy "Authors can delete attraction_tags" on attraction_tags for delete using (public.is_author());
