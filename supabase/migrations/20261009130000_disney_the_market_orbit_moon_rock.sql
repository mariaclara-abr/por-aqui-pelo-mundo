-- Completa com o que está nos roteiros dos parques: The Market (Hollywood
-- Studios, em breve) e o texto de Orbit Café e Moon Rock Café (Kennedy Space
-- Center), que existiam como rascunho vazio. Só preenche campos em branco.
insert into attractions (
  city_id, parent_attraction_id, name, slug, categories, description,
  important_tips, status
)
select
  parent.city_id, parent.id, 'The Market', 'the-market-hollywood-studios',
  array['cafe']::attraction_category[],
  'Em Pixar Place, entre o Animation Courtyard e a Toy Story Land, é onde se encontra o Jack-Jack Cookie Num Nums, um cookie com gotinhas de chocolate superfamoso do parque.',
  null, 'draft'
from attractions parent
where parent.slug = 'hollywood-studios'
  and not exists (
    select 1 from attractions x where x.slug = 'the-market-hollywood-studios'
  );

update attractions
set description = 'Deve ser a maior lanchonete do Kennedy Space Center. Tem opções tradicionais, como cheeseburger e hotdog, e alternativas como sanduíches mais saudáveis e um cardápio bem completo de saladas, que dá até para montar a sua própria.',
    important_tips = 'O parque é pequeno e tem poucas opções de comida, a maior parte com gosto de comida semipronta ou congelada. O Orbit Café foi um lugar que provamos e gostamos.'
where slug = 'orbit-cafe'
  and coalesce(description, '') = '' and coalesce(important_tips, '') = '';

update attractions
set description = 'Lanchonete no Apollo/Saturn V Center, para comer depois do Kennedy Space Center Bus Tour. Tem sanduíches mais saudáveis, hambúrgueres e pizza. Não é nada de diferente, e o maior diferencial é a vista: dá para comer vendo a espaçonave Apollo.',
    important_tips = 'O parque tem poucas opções de comida. O Apollo/Saturn V Center é alcançado pelo Bus Tour, que leva cerca de 45 minutos.'
where slug = 'moon-rock-cafe'
  and coalesce(description, '') = '' and coalesce(important_tips, '') = '';
