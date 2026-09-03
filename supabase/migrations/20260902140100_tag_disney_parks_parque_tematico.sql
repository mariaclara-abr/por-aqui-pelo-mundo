-- Marca os 4 parques da Disney em Orlando com a nova categoria
-- "parque_tematico", agrupados na pasta "Parques" da aba Atrações do
-- admin junto com os futuros parques da Universal. O Kennedy Space Center
-- fica de fora: não é Disney nem Universal.
update attractions
set categories = array_append(categories, 'parque_tematico'::attraction_category)
where slug in ('magic-kingdom', 'epcot', 'hollywood-studios', 'animal-kingdom')
  and not ('parque_tematico' = any(categories));
