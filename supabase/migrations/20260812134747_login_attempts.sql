-- Registra cada tentativa de login (sucesso ou falha) por e-mail e por IP,
-- usada pela rota app/api/auth/login para bloquear força bruta de senha.
-- Sem policies: só acessível via service role (admin client), no servidor.

create table login_attempts (
  id bigint generated always as identity primary key,
  identifier text not null,
  ip text not null,
  success boolean not null,
  created_at timestamptz not null default now()
);

create index login_attempts_identifier_idx on login_attempts (identifier, created_at desc);
create index login_attempts_ip_idx on login_attempts (ip, created_at desc);

alter table login_attempts enable row level security;
