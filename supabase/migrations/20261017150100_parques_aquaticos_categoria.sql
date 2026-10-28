-- Blizzard Beach, Typhoon Lagoon e Volcano Bay deixam de ser "parque temático" e
-- passam a ser "parque aquático".
update attractions
set categories = array_append(array_remove(categories, 'parque_tematico'::attraction_category), 'parque_aquatico'::attraction_category)
where name in ('Disney’s Blizzard Beach', 'Disney’s Typhoon Lagoon', 'Universal Volcano Bay')
  and not ('parque_aquatico' = any(categories));
