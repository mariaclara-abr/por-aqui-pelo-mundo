-- Marca etiquetas só quando o próprio cadastro da atração já comprova (nada é inventado).
-- Só adiciona; nunca remove etiqueta que já estava marcada.
insert into attraction_tags (attraction_id, tag_id)
select a.id, t.id
from attractions a
join tags t on
  (t.slug = 'reserva_necessaria' and (a.requires_reservation or a.requires_advance_purchase))
  or (t.slug = 'meio_periodo' and a.average_visit_time ~* '^meio per[ií]odo\s*$')
  or (t.slug = 'dia_inteiro' and a.average_visit_time ~* '^(1 )?dia( inteiro)?\s*$|^dia inteiro;')
  or (t.slug = 'ideal_para_familias' and a.recommended_audience ~* 'fam[ií]li')
  or (t.slug = 'casais' and a.recommended_audience ~* 'casais')
  or (t.slug = 'adolescentes' and a.recommended_audience ~* 'adolescente')
  or (t.slug = 'vale_acordar_cedo' and a.best_time_of_day ~* 'abertura|in[ií]cio da manh[ãa]')
  or (t.slug = 'melhor_dias_sol' and (a.weather_sensitive or a.best_season ~* 'dias? de sol|boa visibilidade' or a.best_time_of_day ~* 'c[ée]u aberto'))
on conflict do nothing;
