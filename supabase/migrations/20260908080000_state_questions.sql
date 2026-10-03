-- Perguntas públicas sobre estados, espelhando city_questions / city_answers
-- (20260813150000): qualquer usuário autenticado pode perguntar; só quem tem
-- profiles.role = 'author' pode responder, editar resposta ou ocultar uma
-- pergunta. Também espelha o email de "pergunta respondida" das cidades
-- (20260904320000).

create table state_questions (
  id uuid primary key default gen_random_uuid(),
  state_id uuid not null references states(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  status question_status not null default 'pendente',
  created_at timestamptz not null default now()
);

create index state_questions_state_id_idx on state_questions (state_id);
create index state_questions_status_idx on state_questions (status);

create table state_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null unique references state_questions(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  answer text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table state_questions enable row level security;
alter table state_answers enable row level security;

create policy "State questions are publicly viewable when not hidden"
  on state_questions for select
  using (status in ('pendente', 'respondida'));

create policy "Authenticated users can ask state questions"
  on state_questions for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Authors can moderate state questions"
  on state_questions for update
  using (public.is_author())
  with check (public.is_author());

-- Mesmo motivo da policy equivalente em city_questions: o PostgREST exige
-- que a linha resultante do UPDATE que oculta a pergunta satisfaça alguma
-- policy de SELECT.
create policy "Authors can see state question rows they just hid"
  on state_questions for select
  to authenticated
  using (status = 'oculta' and public.is_author());

create policy "State answers are publicly viewable"
  on state_answers for select
  using (
    exists (
      select 1 from state_questions q
      where q.id = state_answers.question_id
        and q.status = 'respondida'
    )
  );

create policy "Authors can answer state questions"
  on state_answers for insert
  to authenticated
  with check (public.is_author() and author_id = auth.uid());

create policy "Authors can edit their own state answers"
  on state_answers for update
  using (public.is_author() and author_id = auth.uid())
  with check (public.is_author() and author_id = auth.uid());

create function public.mark_state_question_answered()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update state_questions
  set status = 'respondida'
  where id = new.question_id;
  return new;
end;
$$;

create trigger on_state_answer_created
  after insert on state_answers
  for each row execute function public.mark_state_question_answered();

create function public.notify_state_question_answered()
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
    sq.user_id as asker_id,
    co.slug as country_slug,
    s.slug as state_slug,
    s.name as state_name,
    u.email as asker_email,
    coalesce(p.display_name, p.username) as asker_name
  into q
  from state_questions sq
  join states s on s.id = sq.state_id
  join countries co on co.id = s.country_id
  join auth.users u on u.id = sq.user_id
  left join public.profiles p on p.id = sq.user_id
  where sq.id = new.question_id;

  page_link := '/' || q.country_slug || '/' || q.state_slug || '#question-' || new.question_id;

  perform public.send_question_answered_email(
    q.asker_email,
    q.asker_name,
    q.state_name,
    'https://www.poraquipelomundo.com' || page_link
  );

  return new;
end;
$$;

create trigger on_state_answer_notify
  after insert on state_answers
  for each row execute function public.notify_state_question_answered();
