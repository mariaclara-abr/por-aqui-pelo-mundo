-- Remove a funcionalidade de notificações in-app (página /notificacoes, sino
-- no header, links no rodapé e no menu foram removidos do front-end). O envio
-- de email quando uma pergunta é respondida (send_question_answered_email,
-- de 20260904310000) continua funcionando: os triggers só deixam de inserir
-- em public.notifications antes de chamar a função de email. O aviso de
-- "novo destino" e a notificação de boas-vindas não tinham nenhum outro
-- consumidor além da página removida, então seus triggers somem também.

drop trigger on_country_created_notify on countries;
drop trigger on_city_created_notify on cities;
drop function public.notify_new_country();
drop function public.notify_new_city();

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

  return new;
end;
$$;

create or replace function public.notify_attraction_question_answered()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  q record;
  page_link text;
begin
  select
    aq.user_id as asker_id,
    co.slug as country_slug,
    c.slug as city_slug,
    a.slug as attraction_slug,
    a.name as attraction_name,
    u.email as asker_email,
    coalesce(p.display_name, p.username) as asker_name
  into q
  from attraction_questions aq
  join attractions a on a.id = aq.attraction_id
  join cities c on c.id = a.city_id
  join countries co on co.id = c.country_id
  join auth.users u on u.id = aq.user_id
  left join public.profiles p on p.id = aq.user_id
  where aq.id = new.question_id;

  page_link := '/' || q.country_slug || '/' || q.city_slug || '/' || q.attraction_slug || '#question-' || new.question_id;

  perform public.send_question_answered_email(
    q.asker_email,
    q.asker_name,
    q.attraction_name,
    'https://www.poraquipelomundo.com' || page_link
  );

  return new;
end;
$$;

create or replace function public.notify_city_question_answered()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  q record;
  page_link text;
begin
  select
    cq.user_id as asker_id,
    co.slug as country_slug,
    c.slug as city_slug,
    c.name as city_name,
    u.email as asker_email,
    coalesce(p.display_name, p.username) as asker_name
  into q
  from city_questions cq
  join cities c on c.id = cq.city_id
  join countries co on co.id = c.country_id
  join auth.users u on u.id = cq.user_id
  left join public.profiles p on p.id = cq.user_id
  where cq.id = new.question_id;

  page_link := '/' || q.country_slug || '/' || q.city_slug || '#question-' || new.question_id;

  perform public.send_question_answered_email(
    q.asker_email,
    q.asker_name,
    q.city_name,
    'https://www.poraquipelomundo.com' || page_link
  );

  return new;
end;
$$;

create or replace function public.notify_country_question_answered()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  q record;
  page_link text;
begin
  select
    cq.user_id as asker_id,
    co.slug as country_slug,
    co.name as country_name,
    u.email as asker_email,
    coalesce(p.display_name, p.username) as asker_name
  into q
  from country_questions cq
  join countries co on co.id = cq.country_id
  join auth.users u on u.id = cq.user_id
  left join public.profiles p on p.id = cq.user_id
  where cq.id = new.question_id;

  page_link := '/' || q.country_slug || '#question-' || new.question_id;

  perform public.send_question_answered_email(
    q.asker_email,
    q.asker_name,
    q.country_name,
    'https://www.poraquipelomundo.com' || page_link
  );

  return new;
end;
$$;

drop table notification_reads;
drop table notifications;
drop type notification_type;
