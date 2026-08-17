-- Notificações do usuário: boas-vindas no primeiro login, resposta da autora a
-- uma pergunta, e novo destino publicado no site. `user_id` nulo significa
-- notificação para todo mundo (usada em "novo destino").

create type notification_type as enum ('bem_vindo', 'pergunta_respondida', 'novo_destino');

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type notification_type not null,
  title text not null,
  message text not null,
  link text,
  created_at timestamptz not null default now()
);

create index notifications_user_id_idx on notifications (user_id);
create index notifications_created_at_idx on notifications (created_at desc);

create table notification_reads (
  notification_id uuid not null references notifications(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (notification_id, user_id)
);

alter table notifications enable row level security;
alter table notification_reads enable row level security;

-- Todo o insert em notifications acontece via triggers "security definer"
-- abaixo, nunca direto pelo cliente: só precisa de policy de leitura.
create policy "Users can view their own or broadcast notifications"
  on notifications for select
  to authenticated
  using (user_id = auth.uid() or user_id is null);

create policy "Users can view their own reads"
  on notification_reads for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can mark notifications as read for themselves"
  on notification_reads for insert
  to authenticated
  with check (user_id = auth.uid());

-- Boas-vindas: dispara junto da criação do perfil (primeiro login após
-- cadastro), reaproveitando o trigger on_auth_user_created já existente.
create or replace function public.handle_new_user()
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

  insert into public.notifications (user_id, type, title, message, link)
  values (
    new.id,
    'bem_vindo',
    'Bem-vindo(a) ao Por Aqui Pelo Mundo!',
    'Explore destinos com curadoria de verdade, feita por quem já esteve lá.',
    null
  );

  return new;
end;
$$;

-- Pergunta respondida: um trigger por tabela de resposta, cada um resolvendo o
-- caminho da página (país/cidade/atração) e o dono da pergunta para notificar.
create function public.notify_attraction_question_answered()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  q record;
begin
  select aq.user_id as asker_id, co.slug as country_slug, c.slug as city_slug, a.slug as attraction_slug
  into q
  from attraction_questions aq
  join attractions a on a.id = aq.attraction_id
  join cities c on c.id = a.city_id
  join countries co on co.id = c.country_id
  where aq.id = new.question_id;

  insert into public.notifications (user_id, type, title, message, link)
  values (
    q.asker_id,
    'pergunta_respondida',
    'Sua pergunta foi respondida',
    'A autora respondeu sua pergunta.',
    '/' || q.country_slug || '/' || q.city_slug || '/' || q.attraction_slug || '#question-' || new.question_id
  );
  return new;
end;
$$;

create trigger on_attraction_answer_notify
  after insert on attraction_answers
  for each row execute function public.notify_attraction_question_answered();

create function public.notify_city_question_answered()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  q record;
begin
  select cq.user_id as asker_id, co.slug as country_slug, c.slug as city_slug
  into q
  from city_questions cq
  join cities c on c.id = cq.city_id
  join countries co on co.id = c.country_id
  where cq.id = new.question_id;

  insert into public.notifications (user_id, type, title, message, link)
  values (
    q.asker_id,
    'pergunta_respondida',
    'Sua pergunta foi respondida',
    'A autora respondeu sua pergunta.',
    '/' || q.country_slug || '/' || q.city_slug || '#question-' || new.question_id
  );
  return new;
end;
$$;

create trigger on_city_answer_notify
  after insert on city_answers
  for each row execute function public.notify_city_question_answered();

create function public.notify_country_question_answered()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  q record;
begin
  select cq.user_id as asker_id, co.slug as country_slug
  into q
  from country_questions cq
  join countries co on co.id = cq.country_id
  where cq.id = new.question_id;

  insert into public.notifications (user_id, type, title, message, link)
  values (
    q.asker_id,
    'pergunta_respondida',
    'Sua pergunta foi respondida',
    'A autora respondeu sua pergunta.',
    '/' || q.country_slug || '#question-' || new.question_id
  );
  return new;
end;
$$;

create trigger on_country_answer_notify
  after insert on country_answers
  for each row execute function public.notify_country_question_answered();

-- Novo destino: dispara para todo mundo (user_id nulo) quando um país ou
-- cidade é cadastrado.
create function public.notify_new_country()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, type, title, message, link)
  values (
    null,
    'novo_destino',
    'Novo destino no site',
    new.name || ' foi adicionado ao Por Aqui Pelo Mundo.',
    '/' || new.slug
  );
  return new;
end;
$$;

create trigger on_country_created_notify
  after insert on countries
  for each row execute function public.notify_new_country();

create function public.notify_new_city()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  country_slug text;
begin
  select slug into country_slug from countries where id = new.country_id;

  insert into public.notifications (user_id, type, title, message, link)
  values (
    null,
    'novo_destino',
    'Novo destino no site',
    new.name || ' foi adicionado ao Por Aqui Pelo Mundo.',
    '/' || country_slug || '/' || new.slug
  );
  return new;
end;
$$;

create trigger on_city_created_notify
  after insert on cities
  for each row execute function public.notify_new_city();
