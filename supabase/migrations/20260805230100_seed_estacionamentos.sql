-- Reclassifica os estacionamentos já cadastrados como "outro" para a nova
-- categoria "estacionamentos", e cadastra os demais parkings citados no
-- roteiro de Èze que ainda não tinham entrado como atração própria.
--
-- Rode isso só depois que 20260805230000_add_estacionamentos_category.sql
-- já tiver sido aplicado (não dá pra rodar os dois juntos na mesma
-- transação).

update attractions
set category = 'estacionamentos'
where slug in ('parking-notre-dame-nice', 'parking-nice-etoile');

insert into attractions (
  city_id, name, slug, category, description, important_tips, curation_rating
)
select cities.id, attraction.name, attraction.slug, attraction.category::attraction_category,
  attraction.description, attraction.important_tips, attraction.curation_rating
from cities
cross join (
  values
    (
      'Parking Èze Village', 'parking-eze-village', 'estacionamentos',
      'Estacionamento na entrada da Vila Medieval de Èze.',
      null, 5
    ),
    (
      'Estacionamento gratuito: Fábrica de Perfumes Fragonard', 'estacionamento-fragonard-eze', 'estacionamentos',
      'Estacionamento na Fragonard L''Usine Laboratoire d''Èze.',
      'É possível estacionar gratuitamente durante a visita à fábrica.', 5
    )
) as attraction(name, slug, category, description, important_tips, curation_rating)
where cities.slug = 'eze'
on conflict (slug) do nothing;
