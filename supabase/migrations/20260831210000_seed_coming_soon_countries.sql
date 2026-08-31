-- Primeiros países "em breve": marcados como rascunho para aparecer na home
-- em preto e branco. A autora completa foto de capa, descrição e conteúdo
-- pelo painel /admin/paises e publica quando estiver pronta.
--
-- Estados Unidos já existia cadastrado (com cidades, sem atrações ainda):
-- volta para rascunho em vez de duplicar. Os outros três são novos.

update countries set status = 'draft' where slug = 'estados-unidos';

insert into countries (name, slug, status) values
  ('Emirados Árabes', 'emirados-arabes', 'draft'),
  ('Espanha', 'espanha', 'draft'),
  ('Brasil', 'brasil', 'draft');
