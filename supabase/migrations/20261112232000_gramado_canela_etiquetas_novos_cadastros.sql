-- Gramado e Canela: etiquetas dos novos cadastros (rascunhos). Só marca o que o próprio cadastro comprova.
-- Só adiciona; nunca remove etiqueta que já estava marcada. Não mexe nas atrações que já existiam.
insert into attraction_tags (attraction_id, tag_id)
select a.id, t.id
from attractions a
join cities c on c.id = a.city_id and c.slug in ('gramado','canela')
join tags t on
  (t.slug = 'reserva_necessaria' and (a.requires_reservation or a.requires_advance_purchase))
  or (t.slug = 'ideal_para_familias' and a.recommended_audience ~* 'fam[ií]li')
  or (t.slug = 'casais' and a.recommended_audience ~* 'casais')
  or (t.slug = 'adolescentes' and a.recommended_audience ~* 'adolescente')
  or (t.slug = 'melhor_dias_sol' and a.weather_sensitive)
where a.slug in (
  'rua-coberta-gramado',
  'rua-torta-gramado',
  'igreja-matriz-sao-pedro-gramado',
  'fonte-do-amor-eterno-gramado',
  'palacio-dos-festivais-gramado',
  'estatua-do-kikito-rotula-das-bandeiras',
  'praca-das-etnias-gramado',
  'praca-major-nicoletti-gramado',
  'avenida-borges-de-medeiros-gramado',
  'porticos-de-gramado',
  'mirante-do-vale-do-quilombo',
  'mini-mundo-gramado',
  'snowland-gramado',
  'le-jardin-parque-de-lavanda',
  'olivas-de-gramado',
  'aldeia-do-papai-noel-gramado',
  'acquamotion-gramado',
  'gramadozoo',
  'parque-lumni-gramado',
  'dreamland-museu-de-cera-gramado',
  'hollywood-dream-cars-gramado',
  'super-carros-gramado',
  'mundo-de-chocolate-lugano',
  'bustour-gramado-e-canela',
  'festival-de-cinema-de-gramado',
  'alice-e-o-chapeleiro-gramado',
  'hector-dragao-gramado',
  'nativitaten-gramado',
  'o-grande-desfile-de-natal-gramado',
  'space-adventure-canela',
  'parque-do-caracol-canela',
  'skyglass-canela',
  'mundo-a-vapor-canela',
  'alpen-park-canela',
  'parque-terra-magica-florybal-canela',
  'castelinho-caracol-canela',
  'estacao-campos-de-canella',
  'sonho-de-natal-de-canela'
)
on conflict do nothing;

-- Acesso livre e gratuito (praças, ruas, pórticos, mirante) e programação gratuita do Sonho de Natal.
insert into attraction_tags (attraction_id, tag_id)
select a.id, t.id
from attractions a
join cities c on c.id = a.city_id and c.slug in ('gramado','canela')
join tags t on t.slug = 'gratuito'
where a.slug in ('rua-coberta-gramado','rua-torta-gramado','igreja-matriz-sao-pedro-gramado','fonte-do-amor-eterno-gramado','estatua-do-kikito-rotula-das-bandeiras','praca-das-etnias-gramado','praca-major-nicoletti-gramado','avenida-borges-de-medeiros-gramado','porticos-de-gramado','mirante-do-vale-do-quilombo','sonho-de-natal-de-canela')
on conflict do nothing;

-- Espaços cobertos, que funcionam bem com chuva.
insert into attraction_tags (attraction_id, tag_id)
select a.id, t.id
from attractions a
join cities c on c.id = a.city_id and c.slug in ('gramado','canela')
join tags t on t.slug = 'melhor_dias_chuva'
where a.slug in ('rua-coberta-gramado','dreamland-museu-de-cera-gramado','hollywood-dream-cars-gramado','space-adventure-canela','o-grande-desfile-de-natal-gramado')
on conflict do nothing;
