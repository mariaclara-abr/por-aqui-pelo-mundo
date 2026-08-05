-- Perfis de usuário. Um registro por conta em auth.users, criado automaticamente
-- pelo trigger on_auth_user_created definido abaixo.

create type user_role as enum ('user', 'author');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text,
  avatar_url text,
  bio text,
  role user_role not null default 'user',
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Profiles are viewable by their owner"
  on profiles for select
  using (auth.uid() = id);

create policy "Profiles are editable by their owner"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- A coluna "role" fica de fora do grant de update: mesmo a policy acima permitindo
-- editar a própria linha, o Postgres rejeita qualquer tentativa de alterar "role"
-- (ou "id") via API. Só é possível promover alguém a author com acesso direto ao banco.
revoke update on profiles from authenticated;
grant update (username, display_name, avatar_url, bio, preferences) on profiles to authenticated;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
begin
  base_username := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));

  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    base_username || '_' || substr(new.id::text, 1, 6),
    coalesce(
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name'
    ),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
