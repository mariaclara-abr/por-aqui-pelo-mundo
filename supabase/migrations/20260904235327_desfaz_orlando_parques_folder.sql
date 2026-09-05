-- Desfaz a "pasta" Parques criada em 20260902150000: os parques temáticos
-- de Orlando (Disney e Universal) voltam a ser atrações normais da cidade,
-- em vez de sub-atrações de uma atração-pasta. Eles já carregam a categoria
-- 'parque_tematico' (ver 20260902140000), então basta soltar o vínculo de
-- parent_attraction_id e remover a pasta em si. As sub-atrações internas de
-- cada parque (restaurantes, lojas) continuam aninhadas no próprio parque,
-- só a camada extra "Parques" é removida.

update attractions
set parent_attraction_id = null
where slug in (
  'magic-kingdom', 'epcot', 'hollywood-studios', 'animal-kingdom',
  'universal-studios-orlando', 'islands-of-adventure'
);

delete from attractions where slug = 'parques';
