-- Curadoria: Estados Unidos > Orlando, a partir dos roteiros de planejamento
-- dos quatro parques da Walt Disney World e do Kennedy Space Center.
-- Por enquanto entram só com uma descrição geral de cada parque (sem o
-- detalhamento por brinquedo/atração interna, que fica para uma etapa
-- futura). Nota de curadoria fica em branco de propósito, para a autora
-- avaliar depois pelo painel /admin/atracoes.

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
      'Magic Kingdom', 'magic-kingdom', array['ponto_turistico']::attraction_category[],
      'O parque mais clássico da Walt Disney World, dividido em seis terras '
      || 'temáticas ao redor do Castelo da Cinderela: Main Street U.S.A., '
      || 'Frontierland, Liberty Square, Adventureland, Fantasyland e '
      || 'Tomorrowland. Reúne montanhas-russas família como Space Mountain e '
      || 'Seven Dwarfs Mine Train, passeios tranquilos como Jungle Cruise e '
      || 'Haunted Mansion, além de desfiles e do show noturno de fogos '
      || 'Happily Ever After em frente ao castelo. É o parque mais '
      || 'reconhecível da Disney, com os cenários e personagens mais '
      || 'clássicos.',
      'Chegue cedo, de preferência antes do horário oficial de abertura: as '
      || 'filas das atrações mais concorridas enchem rápido e os portões '
      || 'costumam abrir um pouco antes do horário anunciado.',
      'Dia inteiro',
      'Logo na abertura, para aproveitar as atrações mais concorridas com '
      || 'fila menor',
      'Famílias com crianças de todas as idades e fãs de Disney'
    ),
    (
      'EPCOT', 'epcot', array['ponto_turistico']::attraction_category[],
      'Dividido em quatro áreas (World Celebration, World Discovery, World '
      || 'Nature e World Showcase), o EPCOT combina atrações com temática de '
      || 'ciência e futuro, como Guardians of the Galaxy: Cosmic Rewind e '
      || 'Test Track, com o World Showcase, uma volta por pavilhões que '
      || 'representam 11 países diferentes, com arquitetura, comidas e lojas '
      || 'típicas de cada nação. O parque também recebe festivais temáticos '
      || 'ao longo do ano (artes, flores e jardins, comida e vinho e fim de '
      || 'ano), quase sempre incluídos no ingresso. À noite, o show '
      || 'Luminous: The Symphony of Us fecha o dia com fogos sobre o lago do '
      || 'World Showcase.',
      'Pegue o Passaporte da Disney nas lojas do parque para carimbar cada '
      || 'país do World Showcase, uma boa forma de engajar as crianças na '
      || 'caminhada pelos pavilhões.',
      'Dia inteiro',
      'Fim de tarde para o World Showcase, com a luz do pôr do sol sobre os '
      || 'pavilhões',
      'Casais, famílias com crianças maiores e apaixonados por gastronomia '
      || 'e cultura'
    ),
    (
      'Hollywood Studios', 'hollywood-studios', array['ponto_turistico']::attraction_category[],
      'Parque dedicado ao cinema e à Disney mais recente, tem como destaque '
      || 'a área imersiva Star Wars: Galaxy''s Edge, réplica do planeta '
      || 'Batuu, com a Millennium Falcon e o bar temático Oga''s Cantina, e '
      || 'a Toy Story Land, cenográfica em escala de brinquedo. Reúne também '
      || 'atrações como Rock''n Roller Coaster e The Twilight Zone Tower of '
      || 'Terror, além de shows como Beauty and the Beast: Live on Stage e o '
      || 'espetáculo noturno Fantasmic!, no Sunset Blvd. É o parque com a '
      || 'maior concentração de shows ao vivo da Disney, então vale planejar '
      || 'o dia consultando os horários pelo app.',
      'Assim que entrar no parque, já acesse o app da Disney para a fila '
      || 'virtual da Star Wars: Rise of the Resistance, ela costuma esgotar '
      || 'minutos depois da abertura.',
      'Dia inteiro',
      'Logo na abertura para Star Wars: Galaxy''s Edge, e fim de tarde ou '
      || 'noite para os shows do Sunset Blvd',
      'Famílias com crianças, fãs de Star Wars e de cinema'
    ),
    (
      'Animal Kingdom', 'animal-kingdom', array['ponto_turistico', 'natureza']::attraction_category[],
      'O maior parque temático da Disney em área, e o único com um foco '
      || 'genuíno em natureza e vida selvagem. Pandora, The World of Avatar '
      || 'reproduz a floresta bioluminescente do filme, com a atração Avatar '
      || 'Flight of Passage; a área da África reúne o safári Kilimanjaro '
      || 'Safaris, com mais de 30 espécies de animais soltas, e o show '
      || 'Festival of the Lion King. Há ainda trilhas de observação de '
      || 'animais na Ásia e na Discovery Island, ao redor da árvore '
      || 'centenária Tree of Life.',
      'O parque costuma fechar mais cedo que os outros três (por volta das '
      || '18h) e vale ir para o Kilimanjaro Safaris logo pela manhã, quando '
      || 'os animais estão mais ativos.',
      'Dia inteiro',
      'Pela manhã, especialmente para o safári Kilimanjaro Safaris',
      'Famílias com crianças, apaixonados por natureza e vida selvagem'
    ),
    (
      'Kennedy Space Center', 'kennedy-space-center', array['museu', 'ponto_turistico']::attraction_category[],
      'Também chamado de "parque da NASA", fica a cerca de 1 hora de '
      || 'Orlando pela SR 528, com pedágios na ida e na volta, e reúne a '
      || 'história da exploração espacial americana em pavilhões '
      || 'interativos. Os destaques são o Atlantis: Space Shuttle, com o '
      || 'ônibus espacial real exposto no centro de um hangar, o simulador '
      || 'Shuttle Launch Experience, e o Kennedy Space Center Bus Tour, que '
      || 'leva até o Apollo/Saturn V Center, onde fica o foguete Saturn V e '
      || 'é possível tocar em uma rocha lunar. Há também encontros diários '
      || 'com astronautas veteranos da NASA e sessões de cinema IMAX em '
      || 'tela gigante.',
      'Reserve o Bus Tour para o Apollo/Saturn V Center como primeira ou '
      || 'última atração do dia, os últimos ônibus saem antes das 14h, e vá '
      || 'cedo para o Shuttle Launch Experience, que forma filas grandes ao '
      || 'longo do dia.',
      'Dia inteiro',
      'Logo na abertura, para o Shuttle Launch Experience',
      'Famílias com crianças maiores, adolescentes e apaixonados por '
      || 'espaço e ciência'
    )
) as attraction(
  name, slug, categories, description, important_tips, average_visit_time,
  best_time_of_day, recommended_audience
)
where cities.slug = 'orlando'
on conflict (slug) do nothing;

-- Etiquetas.
insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'ideal_para_familias'
where attractions.slug in (
  'magic-kingdom', 'epcot', 'hollywood-studios', 'animal-kingdom',
  'kennedy-space-center'
)
on conflict do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'criancas_pequenas'
where attractions.slug in ('magic-kingdom', 'animal-kingdom')
on conflict do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'adolescentes'
where attractions.slug in ('hollywood-studios', 'kennedy-space-center')
on conflict do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'casais'
where attractions.slug = 'epcot'
on conflict do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'imperdivel'
where attractions.slug in (
  'magic-kingdom', 'epcot', 'hollywood-studios', 'animal-kingdom'
)
on conflict do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'dia_inteiro'
where attractions.slug in (
  'magic-kingdom', 'epcot', 'hollywood-studios', 'kennedy-space-center'
)
on conflict do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'vale_acordar_cedo'
where attractions.slug in (
  'magic-kingdom', 'hollywood-studios', 'animal-kingdom',
  'kennedy-space-center'
)
on conflict do nothing;
