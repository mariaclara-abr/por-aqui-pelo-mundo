-- Acrescenta a dica de altura minima logo apos a dica "Reserve, sempre que possivel, um dia inteiro" nos 4 parques Disney.
update attractions
set important_tips = replace(
  important_tips,
  'por isso é importante reservar tempo suficiente para aproveitar o que cada um tem de melhor.',
  'por isso é importante reservar tempo suficiente para aproveitar o que cada um tem de melhor.' || E'\n' ||
  '✓ Se estiver com crianças, vale conferir a altura mínima exigida antes de entrar nas filas. Há réguas de medição nas entradas das atrações para ajudar nessa conferência, e os funcionários podem orientar em caso de dúvida.'
)
where name in ('Magic Kingdom', 'EPCOT', 'Animal Kingdom', 'Hollywood Studios')
  and important_tips like '%um dia inteiro para o parque%'
  and important_tips not like '%altura mínima exigida%';
