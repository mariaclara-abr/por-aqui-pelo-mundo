-- Ajusta o email de "pergunta respondida" (20260904300000): adiciona a logo
-- do site no topo e menciona no texto sobre qual atração/cidade/país era a
-- pergunta, já que o link sozinho não deixava isso óbvio antes de clicar.

create or replace function public.send_question_answered_email(
  to_email text,
  to_name text,
  context_label text,
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
  html_body text;
begin
  select decrypted_secret into resend_key
  from vault.decrypted_secrets
  where name = 'resend_api_key';

  if resend_key is null or to_email is null then
    raise warning 'send_question_answered_email: resend_api_key ou to_email ausente, email não enviado.';
    return;
  end if;

  greeting := coalesce(to_name, 'Olá');

  html_body :=
    '<table role="presentation" cellpadding="0" cellspacing="0" style="font-family: Georgia, ''Times New Roman'', serif; background-color:#F0E6D2; padding:24px; border-radius:12px;">'
    || '<tr><td style="padding-bottom:20px;">'
    || '<table role="presentation" cellpadding="0" cellspacing="0"><tr>'
    || '<td style="padding-right:8px;"><img src="https://www.poraquipelomundo.com/icon.svg" alt="Por Aqui Pelo Mundo" width="28" height="28" style="display:block; border-radius:50%;" /></td>'
    || '<td style="font-size:18px; color:#2B2620;">Por Aqui Pelo Mundo</td>'
    || '</tr></table>'
    || '</td></tr>'
    || '<tr><td style="color:#2B2620; font-size:15px; line-height:1.5;">'
    || '<p style="margin:0 0 12px;">Oi, ' || greeting || '!</p>'
    || '<p style="margin:0 0 16px;">A autora do Por Aqui Pelo Mundo respondeu sua pergunta sobre <strong>' || context_label || '</strong>. Clique no link para visualizar a resposta.</p>'
    || '<p style="margin:0;"><a href="' || answer_link || '" style="color:#C1653A; font-weight:bold;">Ver a resposta</a></p>'
    || '</td></tr>'
    || '</table>';

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
      'html', html_body
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
    q.country_name,
    'https://www.poraquipelomundo.com' || page_link
  );

  return new;
end;
$$;
