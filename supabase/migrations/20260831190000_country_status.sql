-- Permite marcar um país como "em breve" (rascunho): a autora pode cadastrar
-- o país e preparar seu conteúdo (cidades, atrações) antes de publicá-lo.
-- Enquanto rascunho, ele aparece na home em preto e branco, sem link para a
-- própria página, e pode receber sinais de interesse de visitantes
-- (country_interest, ver migration seguinte).

create type country_status as enum ('draft', 'published');

alter table countries
  add column status country_status not null default 'published';
