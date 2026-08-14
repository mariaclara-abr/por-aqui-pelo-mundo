-- Perguntas públicas sobre cidades, espelhando attraction_questions /
-- attraction_answers (20260804190000): qualquer usuário autenticado pode
-- perguntar; só quem tem profiles.role = 'author' pode responder, editar
-- resposta ou ocultar uma pergunta.

create table city_questions (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references cities(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  status question_status not null default 'pendente',
  created_at timestamptz not null default now()
);

create index city_questions_city_id_idx on city_questions (city_id);
create index city_questions_status_idx on city_questions (status);

create table city_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null unique references city_questions(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  answer text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table city_questions enable row level security;
alter table city_answers enable row level security;

create policy "City questions are publicly viewable when not hidden"
  on city_questions for select
  using (status in ('pendente', 'respondida'));

create policy "Authenticated users can ask city questions"
  on city_questions for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Authors can moderate city questions"
  on city_questions for update
  using (public.is_author())
  with check (public.is_author());

-- Mesmo motivo da policy equivalente em attraction_questions: o PostgREST
-- exige que a linha resultante do UPDATE que oculta a pergunta satisfaça
-- alguma policy de SELECT.
create policy "Authors can see city question rows they just hid"
  on city_questions for select
  to authenticated
  using (status = 'oculta' and public.is_author());

create policy "City answers are publicly viewable"
  on city_answers for select
  using (
    exists (
      select 1 from city_questions q
      where q.id = city_answers.question_id
        and q.status = 'respondida'
    )
  );

create policy "Authors can answer city questions"
  on city_answers for insert
  to authenticated
  with check (public.is_author() and author_id = auth.uid());

create policy "Authors can edit their own city answers"
  on city_answers for update
  using (public.is_author() and author_id = auth.uid())
  with check (public.is_author() and author_id = auth.uid());

create function public.mark_city_question_answered()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update city_questions
  set status = 'respondida'
  where id = new.question_id;
  return new;
end;
$$;

create trigger on_city_answer_created
  after insert on city_answers
  for each row execute function public.mark_city_question_answered();
