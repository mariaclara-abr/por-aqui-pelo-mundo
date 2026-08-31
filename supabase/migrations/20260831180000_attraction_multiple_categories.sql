-- Permite marcar mais de uma categoria por atração (ex: um lugar que é
-- restaurante e também café). Substitui a coluna "category" única por
-- "categories", um array da mesma enum, sempre com pelo menos uma categoria.

alter table attractions add column categories attraction_category[];
update attractions set categories = array[category];
alter table attractions alter column categories set not null;
alter table attractions add constraint attractions_categories_not_empty
  check (array_length(categories, 1) >= 1);

drop index attractions_category_idx;
alter table attractions drop column category;

create index attractions_categories_idx on attractions using gin (categories);
