-- Perguntas públicas sobre países, espelhando city_questions / city_answers
-- (20260813150000): qualquer usuário autenticado pode perguntar; só quem tem
-- profiles.role = 'author' pode responder, editar resposta ou ocultar uma
-- pergunta.

create table country_questions (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references countries(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  status question_status not null default 'pendente',
  created_at timestamptz not null default now()
);

create index country_questions_country_id_idx on country_questions (country_id);
create index country_questions_status_idx on country_questions (status);

create table country_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null unique references country_questions(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  answer text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table country_questions enable row level security;
alter table country_answers enable row level security;

create policy "Country questions are publicly viewable when not hidden"
  on country_questions for select
  using (status in ('pendente', 'respondida'));

create policy "Authenticated users can ask country questions"
  on country_questions for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Authors can moderate country questions"
  on country_questions for update
  using (public.is_author())
  with check (public.is_author());

-- Mesmo motivo da policy equivalente em city_questions: o PostgREST exige
-- que a linha resultante do UPDATE que oculta a pergunta satisfaça alguma
-- policy de SELECT.
create policy "Authors can see country question rows they just hid"
  on country_questions for select
  to authenticated
  using (status = 'oculta' and public.is_author());

create policy "Country answers are publicly viewable"
  on country_answers for select
  using (
    exists (
      select 1 from country_questions q
      where q.id = country_answers.question_id
        and q.status = 'respondida'
    )
  );

create policy "Authors can answer country questions"
  on country_answers for insert
  to authenticated
  with check (public.is_author() and author_id = auth.uid());

create policy "Authors can edit their own country answers"
  on country_answers for update
  using (public.is_author() and author_id = auth.uid())
  with check (public.is_author() and author_id = auth.uid());

create function public.mark_country_question_answered()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update country_questions
  set status = 'respondida'
  where id = new.question_id;
  return new;
end;
$$;

create trigger on_country_answer_created
  after insert on country_answers
  for each row execute function public.mark_country_question_answered();
