-- A geração do roteiro Premium roda em etapas (cada uma numa execução própria da
-- função, para respeitar o limite de tempo da Vercel) e a tela mostra o progresso.
-- `etapa` diz em que fase está; `pesquisa` guarda os fatos da etapa 1 para a etapa 2.

alter table premium_roteiros
  add column etapa text not null default 'preparando'
    check (etapa in ('preparando', 'pesquisando', 'compondo', 'finalizando', 'concluido')),
  add column pesquisa text;
