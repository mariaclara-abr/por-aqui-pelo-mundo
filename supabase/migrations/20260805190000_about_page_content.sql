-- Conteúdo editável da página "Sobre a autora": texto e fotos, gerenciados
-- pelo painel de administração. Linha única (singleton); leitura pública,
-- escrita restrita a usuários com profiles.role = 'author' (mesma função
-- public.is_author() criada em 20260803140100_author_write_policies.sql).

create table about_page_content (
  id smallint primary key default 1 check (id = 1),
  author_name text not null default '',
  author_photo_url text,
  bio text not null default '',
  why_site_text text not null default '',
  quote_text text not null default '',
  travel_photo_1_url text,
  travel_photo_2_url text,
  updated_at timestamptz not null default now()
);

insert into about_page_content (id, author_name, bio, why_site_text, quote_text)
values (
  1,
  '[Nome da autora]',
  E'Sou mãe, avó e viajante desde muito antes de existir aplicativo de viagem. Ao longo de mais de vinte anos, viajei pelo Brasil e pelo exterior, quase sempre em família, com criança pequena no colo, mala de mão cheia de remédio e paciência para roteiro que precisa mudar em cima da hora.\n\nCada lugar que aparece aqui eu visitei de verdade, ou visitei junto com alguém da família em quem confio. Não é uma lista genérica: é o que eu realmente recomendaria para outra família que está planejando a próxima viagem.',
  'A maior parte do conteúdo de viagem por aí é feito para mochileiro sozinho ou casal sem filhos, e o que sobra costuma ser só uma nota média de milhares de estranhos, sem contexto nenhum sobre se aquele lugar faz sentido pra sua família. Esse site nasceu pra preencher esse espaço: transformar experiência real de viagem em planejamento fácil, pensado especialmente para famílias.',
  'A IA organiza a viagem. Quem escolhe os lugares é quem realmente esteve lá.'
);

alter table about_page_content enable row level security;

create policy "Public read access" on about_page_content for select using (true);
create policy "Authors can update about page" on about_page_content for update using (public.is_author()) with check (public.is_author());
