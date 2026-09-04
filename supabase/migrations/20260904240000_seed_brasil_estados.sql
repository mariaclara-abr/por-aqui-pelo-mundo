-- Agrupa as cidades já cadastradas do Brasil em seus estados: Santa
-- Catarina (Penha, Bom Retiro, Alfredo Wagner, São Joaquim) e Rio de
-- Janeiro (Mangaratiba, Angra dos Reis, Visconde de Mauá).

insert into states (country_id, name, slug)
select countries.id, state.name, state.slug
from countries
cross join (
  values
    ('Santa Catarina', 'santa-catarina'),
    ('Rio de Janeiro', 'rio-de-janeiro')
) as state(name, slug)
where countries.slug = 'brasil'
on conflict (slug) do nothing;

update cities
set state_id = (select id from states where slug = 'santa-catarina')
where slug in ('penha', 'bom-retiro', 'alfredo-wagner', 'sao-joaquim');

update cities
set state_id = (select id from states where slug = 'rio-de-janeiro')
where slug in ('mangaratiba', 'angra-dos-reis', 'visconde-de-maua');
