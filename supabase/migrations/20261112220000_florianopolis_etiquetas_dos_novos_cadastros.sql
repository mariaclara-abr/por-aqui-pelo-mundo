-- Florianópolis: etiquetas dos novos cadastros (rascunhos). Só marca o que o próprio cadastro comprova, como na migration 20261028120000.
-- Só adiciona; nunca remove etiqueta que já estava marcada.
insert into attraction_tags (attraction_id, tag_id)
select a.id, t.id
from attractions a
join cities c on c.id = a.city_id and c.slug = 'florianopolis'
join tags t on
  (t.slug = 'reserva_necessaria' and (a.requires_reservation or a.requires_advance_purchase))
  or (t.slug = 'meio_periodo' and a.average_visit_time ~* '^meio per[ií]odo\s*$')
  or (t.slug = 'dia_inteiro' and a.average_visit_time ~* '^(1 )?dia( inteiro)?\s*$|^dia inteiro;')
  or (t.slug = 'ideal_para_familias' and a.recommended_audience ~* 'fam[ií]li')
  or (t.slug = 'casais' and a.recommended_audience ~* 'casais')
  or (t.slug = 'adolescentes' and a.recommended_audience ~* 'adolescente')
  or (t.slug = 'vale_acordar_cedo' and a.best_time_of_day ~* 'abertura|in[ií]cio da manh[ãa]')
  or (t.slug = 'melhor_dias_sol' and (a.weather_sensitive or a.best_season ~* 'dias? de sol|boa visibilidade' or a.best_time_of_day ~* 'c[ée]u aberto'))
where a.status = 'draft'
on conflict do nothing;

-- Praias são públicas: sem custo de entrada (estacionamento e quiosques à parte). A Ilha do Campeche tem ingresso e travessia pagos.
insert into attraction_tags (attraction_id, tag_id)
select a.id, t.id
from attractions a
join cities c on c.id = a.city_id and c.slug = 'florianopolis'
join tags t on t.slug = 'gratuito'
where a.slug in ('praia-do-campeche','praia-mole','praia-da-galheta','barra-da-lagoa','praia-dos-ingleses','canasvieiras','praia-da-daniela','praia-brava','lagoinha-do-norte','praia-do-mocambique','praia-da-armacao','praia-do-matadeiro','lagoinha-do-leste','praia-de-naufragados')
on conflict do nothing;

-- Shoppings fechados e o Projeto Tamar (visitável em dia de chuva, segundo o site oficial) funcionam bem com chuva.
insert into attraction_tags (attraction_id, tag_id)
select a.id, t.id
from attractions a
join cities c on c.id = a.city_id and c.slug = 'florianopolis'
join tags t on t.slug = 'melhor_dias_chuva'
where a.slug in ('villa-romana-shopping','beiramar-shopping','floripa-shopping','projeto-tamar-florianopolis')
on conflict do nothing;
