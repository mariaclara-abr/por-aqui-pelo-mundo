-- Curadoria: Estados Unidos > Orlando, atrações fora do circuito Disney/
-- Universal/NASA, a partir dos roteiros de planejamento da viagem de julho
-- de 2024. Nota de curadoria em branco de propósito, para a autora avaliar
-- depois pelo painel /admin/atracoes.

insert into attractions (
  city_id, name, slug, categories, description, important_tips,
  average_visit_time, best_time_of_day, recommended_audience
)
select
  cities.id,
  attraction.name,
  attraction.slug,
  attraction.categories,
  attraction.description,
  attraction.important_tips,
  attraction.average_visit_time,
  attraction.best_time_of_day,
  attraction.recommended_audience
from cities
cross join (
  values
    (
      'ICON Park', 'icon-park-orlando',
      array['ponto_turistico', 'passeio']::attraction_category[],
      'Complexo de entretenimento na região mais central de Orlando, na '
      || 'International Drive. O principal ícone é a The Wheel, uma roda '
      || 'gigante de mais de 120 metros de altura com cápsulas '
      || 'climatizadas, cada uma com tablets que trazem informações '
      || 'turísticas em português; a volta completa dura 20 minutos. O '
      || 'complexo reúne ainda o Sea Life Orlando Aquarium, com túneis '
      || 'debaixo d''água, e uma unidade do museu de cera Madame '
      || 'Tussauds.',
      'Vale ir perto do pôr do sol, sempre bonito na Flórida, para pegar a '
      || 'vista da The Wheel com a luz baixa. O estacionamento é '
      || 'gratuito.',
      'Meio período',
      'Fim de tarde, perto do pôr do sol',
      'Famílias e casais'
    ),
    (
      'Old Town Kissimmee', 'old-town-kissimmee',
      array['ponto_turistico', 'passeio']::attraction_category[],
      'Considerada a melhor atração gratuita da região de Orlando, é uma '
      || 'rua com lojas, restaurantes, música ao vivo, exposições de '
      || 'carros antigos e parques de diversão que remetem aos anos 1950 e '
      || '1960, como se estivesse parada no tempo. Um destaque é o Old '
      || 'Town Portrait Gallery, onde dá pra fazer um retrato à moda '
      || 'antiga, com roupas e acessórios de época. Funciona todos os dias '
      || 'das 11h às 23h.',
      'Entrada e estacionamento são gratuitos, o que faz dele um bom '
      || 'programa de fim de tarde entre um parque e outro.',
      'Meio período',
      'Fim de tarde e noite',
      'Famílias e casais'
    )
) as attraction(
  name, slug, categories, description, important_tips, average_visit_time,
  best_time_of_day, recommended_audience
)
where cities.slug = 'orlando'
on conflict (slug) do nothing;
