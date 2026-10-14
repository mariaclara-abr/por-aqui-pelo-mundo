-- Ajustes da migration anterior: a dica do Princess Fairytale Hall não entrou
-- (âncora com "é" minúsculo, o texto tem "É"), e as apóstrofes dos nomes novos
-- passam a ser curvas (’), como no restante do texto dos parques.
update attractions
set important_tips = replace(
  important_tips,
  'É uma experiência paga, concorrida e com reserva antecipada recomendada; o ingresso do parque é separado.',
  'É uma experiência paga, concorrida e com reserva antecipada recomendada; o ingresso do parque é separado.' ||
  E'\n✓ ' || 'No Princess Fairytale Hall, em Fantasyland, é possível encontrar a Cinderela e a Tiana; a princesa convidada pode variar. Confira local e horários no My Disney Experience.')
where slug = 'magic-kingdom'
  and important_tips not like '%Princess Fairytale Hall%';

update attractions
set description = replace(replace(replace(replace(description,
  $$**Cinderella's Royal Table**$$, $$**Cinderella’s Royal Table**$$),
  $$**Remy's Ratatouille Hide & Squeak**$$, $$**Remy’s Ratatouille Hide & Squeak**$$),
  $$**Savi's Workshop**$$, $$**Savi’s Workshop**$$),
  $$Galaxy's Edge, escolhendo$$, $$Galaxy’s Edge, escolhendo$$)
where slug in ('magic-kingdom', 'epcot', 'hollywood-studios');

update attractions
set description = replace(description, $$também em Galaxy's Edge$$, $$também em Galaxy’s Edge$$)
where slug = 'hollywood-studios';

update attractions
set important_tips = replace(important_tips,
  $$Savi's Workshop e Droid Depot$$, $$Savi’s Workshop e Droid Depot$$)
where slug = 'hollywood-studios';
