-- Remove os travessões restantes do conteúdo cadastrado. Créditos de foto
-- ("... — CC BY", "... — domínio público") viram vírgula; o resto vira
-- dois-pontos.

update attractions
set description = replace(replace(replace(description, ' — CC', ', CC'), ' — domínio', ', domínio'), ' — ', ': ')
where description like '%—%';

update attractions
set important_tips = replace(important_tips, ' — ', ': ')
where important_tips like '%—%';

update travel_tips
set content = replace(content, ' — ', ': ')
where content like '%—%';
