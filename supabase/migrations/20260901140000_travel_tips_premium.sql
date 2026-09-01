-- Marca cards de dicas de viagem como conteúdo Premium: ao clicar, quem não
-- é assinante vê o pop-up de upgrade em vez do conteúdo da dica.

alter table travel_tips
  add column is_premium boolean not null default false;
