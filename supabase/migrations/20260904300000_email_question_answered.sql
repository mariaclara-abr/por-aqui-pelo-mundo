-- Envia um email (via Resend) para quem perguntou, no momento em que a
-- autora responde uma pergunta de atração/cidade/país. Reaproveita os
-- triggers notify_*_question_answered de 20260817120000 (que já criam a
-- notificação in-app): cada um passa a chamar send_question_answered_email
-- logo depois de inserir a notificação.
--
-- A chave da API do Resend fica no Vault do Supabase (nome 'resend_api_key'),
-- nunca em texto no código ou em migrations: ver scripts/set-resend-secret.mjs.
-- O envio é assíncrono via pg_net (net.http_post enfileira a chamada), então
-- responder uma pergunta não fica mais lento esperando o Resend.

create extension if not exists pg_net;

create function public.send_question_answered_email(
  to_email text,
  to_name text,
  answer_link text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  resend_key text;
  greeting text;
begin
  select decrypted_secret into resend_key
  from vault.decrypted_secrets
  where name = 'resend_api_key';

  if resend_key is null or to_email is null then
    raise warning 'send_question_answered_email: resend_api_key ou to_email ausente, email não enviado.';
    return;
  end if;

  greeting := coalesce(to_name, 'Olá');

  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'Por Aqui Pelo Mundo <naoresponda@poraquipelomundo.com>',
      'to', jsonb_build_array(to_email),
      'subject', 'Sua pergunta foi respondida',
      'html',
        '<p>Oi, ' || greeting || '!</p>'
        || '<p>A autora do Por Aqui Pelo Mundo respondeu sua pergunta.</p>'
        || '<p><a href="' || answer_link || '">Ver a resposta</a></p>'
    )
  );
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

  insert into public.notifications (user_id, type, title, message, link)
  values (
    q.asker_id,
    'pergunta_respondida',
    'Sua pergunta foi respondida',
    'A autora respondeu sua pergunta.',
    page_link
  );

  perform public.send_question_answered_email(
    q.asker_email,
    q.asker_name,
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

  insert into public.notifications (user_id, type, title, message, link)
  values (
    q.asker_id,
    'pergunta_respondida',
    'Sua pergunta foi respondida',
    'A autora respondeu sua pergunta.',
    page_link
  );

  perform public.send_question_answered_email(
    q.asker_email,
    q.asker_name,
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
    u.email as asker_email,
    coalesce(p.display_name, p.username) as asker_name
  into q
  from country_questions cq
  join countries co on co.id = cq.country_id
  join auth.users u on u.id = cq.user_id
  left join public.profiles p on p.id = cq.user_id
  where cq.id = new.question_id;

  page_link := '/' || q.country_slug || '#question-' || new.question_id;

  insert into public.notifications (user_id, type, title, message, link)
  values (
    q.asker_id,
    'pergunta_respondida',
    'Sua pergunta foi respondida',
    'A autora respondeu sua pergunta.',
    page_link
  );

  perform public.send_question_answered_email(
    q.asker_email,
    q.asker_name,
    'https://www.poraquipelomundo.com' || page_link
  );

  return new;
end;
$$;
