-- Remove os últimos travessões do conteúdo cadastrado. Créditos de licença
-- viram vírgula, "Licença:"/"Original:" começam nova frase, o resto vira
-- dois-pontos ou vírgula conforme o caso.

update attraction_photos
set caption = replace(replace(replace(replace(replace(caption,
  ' — Licença:', '. Licença:'),
  ' — Original:', '. Original:'),
  ' — CC', ', CC'),
  ' — domínio', ', domínio'),
  ' — ', ': ')
where caption like '%—%';

update attractions
set personal_experience = replace(personal_experience, ' — ', ', ')
where personal_experience like '%—%';

update attractions
set name = replace(name, ' — ', ': ')
where name like '%—%';

update attractions
set description = replace(description, ' — março', ', março')
where description like '%—%';
