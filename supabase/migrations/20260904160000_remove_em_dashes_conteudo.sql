-- Remove travessões ("—") do conteúdo de curadoria já cadastrado que não
-- tinha sido coberto pela limpeza anterior (20260806140000_remove_em_dashes.sql),
-- reescrevendo as frases com pontuação comum (dois-pontos, vírgula ou ponto
-- final) para seguir a regra do projeto de nunca usar esse caractere.

-- Créditos de foto (padrão "... — CC BY..." vira "..., CC BY...")
update attraction_photos
set caption = replace(caption, ' — CC', ', CC')
where caption like '% — CC%';

-- Casos com travessão também antes de "Foto:"
update attraction_photos
set caption = replace(caption, ' — Foto:', '. Foto:')
where id in ('d2549c82-be5a-4ed0-a45b-e6d5ee9aac20', '9e175b3a-70d2-427a-9f23-541c47f1f100');

-- Traço curto (–) usado como separador antes de "CC" em uma legenda
update attraction_photos
set caption = replace(caption, ' – CC', ', CC')
where id = '9e175b3a-70d2-427a-9f23-541c47f1f100';

update attraction_photos
set caption = replace(
  caption,
  'Justine ou Isis — escultura',
  'Justine ou Isis: escultura'
)
where id = 'c3037f34-6686-41d6-a003-81b720fab45e';

update attractions
set description = replace(
  description,
  'guarda-sóis — ótima opção',
  'guarda-sóis: ótima opção'
)
where id = '9e591fe1-1f5a-47de-a4eb-4e2eccec0bff';

update attractions
set description = replace(
  description,
  'igrejas barrocas — a principal é a Catedral Sainte-Réparate, do século XVII — e proximidade',
  'igrejas barrocas, sendo a principal a Catedral Sainte-Réparate, do século XVII, e a proximidade'
)
where id = '5269bb46-40b4-4d75-8281-e00509a8df73';

update attractions
set important_tips = replace(
  important_tips,
  'Gostamos muito dos dois — as carnes',
  'Gostamos muito dos dois: as carnes'
)
where id = '21137f80-fe16-4b18-8aae-fdf4c635c8d0';

update attractions
set important_tips = replace(
  important_tips,
  'topless — cuidado',
  'topless: cuidado'
)
where id = '6cd58d2c-83ae-410d-bb9b-b226fd0e1b7e';

update cities
set description = replace(description, E'Saint-Tropez — Descrição\n\n', '')
where id = '2986db2a-145c-4a18-8260-f61661b4722f';

update countries
set description = replace(
  description,
  'idiomas oficiais — neerlandês, francês e alemão — e Bruxelas',
  'idiomas oficiais, o neerlandês, o francês e o alemão, e Bruxelas'
)
where id = '98d6027d-0cb0-4793-b122-ff0537673eb0';

update countries
set description = replace(
  description,
  'sede do governo — uma curiosidade interessante',
  'sede do governo, uma curiosidade interessante'
)
where id = 'a262d115-8c97-4b57-b3d9-6c21c3e77634';
