-- Nova etiqueta para marcar atrações que também estarão disponíveis em breve.
insert into tags (name, slug) values
  ('Em breve também', 'em_breve_tambem')
on conflict (slug) do nothing;
