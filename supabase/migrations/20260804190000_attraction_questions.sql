-- Perguntas públicas sobre atrações. Qualquer usuário autenticado pode perguntar;
-- só quem tem profiles.role = 'author' pode responder, editar resposta ou
-- ocultar uma pergunta.

create type question_status as enum ('pendente', 'respondida', 'oculta');

create table attraction_questions (
  id uuid primary key default gen_random_uuid(),
  attraction_id uuid not null references attractions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  status question_status not null default 'pendente',
  created_at timestamptz not null default now()
);

create index attraction_questions_attraction_id_idx on attraction_questions (attraction_id);
create index attraction_questions_status_idx on attraction_questions (status);

create table attraction_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null unique references attraction_questions(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  answer text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table attraction_questions enable row level security;
alter table attraction_answers enable row level security;

-- Perguntas ocultas (moderadas) somem para todo mundo, inclusive a autora —
-- "ocultar" aqui é tratado como definitivo, sem tela de revisão nesta v1.
create policy "Questions are publicly viewable when not hidden"
  on attraction_questions for select
  using (status in ('pendente', 'respondida'));

create policy "Authenticated users can ask questions"
  on attraction_questions for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Authors can moderate questions"
  on attraction_questions for update
  using (public.is_author())
  with check (public.is_author());

-- Necessária mesmo com "ocultar" sendo definitivo (ninguém volta a ver a
-- pergunta pela UI): o PostgREST sempre faz um RETURNING internamente após
-- o UPDATE, e o Postgres exige que a linha resultante satisfaça alguma
-- policy de SELECT — sem isso, o próprio UPDATE que oculta a pergunta é
-- rejeitado por violar a RLS. O app nunca usa esse acesso para reexibir a
-- pergunta (a query da página sempre filtra por pendente/respondida).
create policy "Authors can see rows they just hid"
  on attraction_questions for select
  to authenticated
  using (status = 'oculta' and public.is_author());

create policy "Answers are publicly viewable"
  on attraction_answers for select
  using (
    exists (
      select 1 from attraction_questions q
      where q.id = attraction_answers.question_id
        and q.status = 'respondida'
    )
  );

create policy "Authors can answer questions"
  on attraction_answers for insert
  to authenticated
  with check (public.is_author() and author_id = auth.uid());

create policy "Authors can edit their own answers"
  on attraction_answers for update
  using (public.is_author() and author_id = auth.uid())
  with check (public.is_author() and author_id = auth.uid());

-- Responder uma pergunta marca ela como respondida automaticamente, num único
-- passo (o app só precisa inserir a resposta).
create function public.mark_question_answered()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update attraction_questions
  set status = 'respondida'
  where id = new.question_id;
  return new;
end;
$$;

create trigger on_attraction_answer_created
  after insert on attraction_answers
  for each row execute function public.mark_question_answered();

-- View pública só com os campos não sensíveis do perfil (nome, foto, papel),
-- usada para mostrar quem perguntou e o selo "Resposta da autora". Sem
-- security_invoker, a view roda com o dono da tabela profiles; como esse dono
-- não sofre a RLS da própria tabela, a view enxerga todas as linhas — mas só
-- expõe as colunas listadas aqui, nunca bio/preferences.
create view public.public_profiles as
  select id, username, display_name, avatar_url, role
  from public.profiles;

grant select on public.public_profiles to anon, authenticated;
