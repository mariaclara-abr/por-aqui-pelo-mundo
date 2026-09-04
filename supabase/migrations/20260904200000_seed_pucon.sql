-- Curadoria: Chile > Pucón, a partir do roteiro de planejamento da viagem
-- de julho de 2025. País Chile já existia (rascunho). Nota de curadoria em
-- branco de propósito, para a autora avaliar depois pelo painel
-- /admin/atracoes.

insert into cities (country_id, name, slug, description)
select
  countries.id,
  'Pucón',
  'pucon',
  'Localizada no sul do Chile, às margens do Lago Villarrica, é uma das '
  || 'regiões mais deslumbrantes do país, rodeada por vulcões, lagos, rios '
  || 'e florestas. Tem raízes profundas na cultura mapuche, sendo um '
  || 'ponto de encontro entre a tradição ancestral e o turismo moderno. É '
  || 'a principal porta de entrada para a Patagônia chilena, no começo da '
  || 'região dos Lagos, cerca de 800 km ao sul de Santiago. A forma mais '
  || 'prática de chegar é voando de Santiago até Temuco (Aeroporto '
  || 'Internacional La Araucanía, cerca de 1h de voo) e seguindo de carro '
  || 'por mais 90 km, cerca de 1h30, até Pucón. A cidade é compacta, com '
  || 'várias atrações a uma caminhada de distância: às margens do lago há '
  || 'praias e áreas recreativas, e a Avenida O''Higgins concentra '
  || 'agências de turismo, restaurantes, lojas e boutiques de souvenirs.'
from countries
where countries.slug = 'chile'
on conflict (slug) do nothing;

insert into attractions (
  city_id, name, slug, categories, description, important_tips
)
select
  cities.id, item.name, item.slug, item.categories, item.description,
  item.important_tips
from cities
cross join (
  values
    (
      'Vulcão Villarrica', 'vulcao-villarrica',
      array['natureza', 'passeio']::attraction_category[],
      'Com mais de 2.847 metros de altura, é a principal atração de '
      || 'Pucón. Mantém neve na parte alta o ano todo, em maior '
      || 'quantidade no inverno, quando funciona também como estação de '
      || 'esqui. É possível observar o interior da cratera vulcânica, com '
      || 'atividade fumarólica e presença de lava em movimento '
      || 'constante.',
      'A subida ao topo só pode ser feita com agências, em condições '
      || 'climáticas favoráveis (tempo aberto e pouco vento), já que a '
      || 'subida é bastante íngreme; pode ser feita durante todo o ano, '
      || 'mas não é nada fácil. No inverno também é possível descer o '
      || 'vulcão esquiando, andando de snowboard ou deslizando pelas '
      || 'encostas nevadas com pranchas ou trenós, com aluguel de '
      || 'equipamento e aulas para todos os níveis; muitas agências '
      || 'oferecem transporte até a base. O vento Puelche pode interditar '
      || 'o esqui por segurança. Outra opção mais leve é o trekking com '
      || 'raquetes de neve, subindo só um trecho: leve uma mochila para '
      || 'guardar luvas, toucas e corta-vento quando a caminhada '
      || 'esquentar.'
    ),
    (
      'Parque Nacional Huerquehue', 'parque-nacional-huerquehue',
      array['natureza']::attraction_category[],
      'Área de aproximadamente 12.500 hectares, conhecida por suas '
      || 'florestas exuberantes, lagos cristalinos e formações rochosas '
      || 'impressionantes, incluindo o Lago Tinquilco e o Lago Verde.',
      null
    ),
    (
      'Lago Caburgua', 'lago-caburgua', array['natureza']::attraction_category[],
      'A cerca de 23 km da cidade, com águas cristalinas cercadas por '
      || 'densas florestas, montanhas e praias pitorescas.',
      null
    ),
    (
      'Ojos del Caburgua', 'ojos-del-caburgua',
      array['natureza']::attraction_category[],
      'Conjunto de piscinas naturais formadas pelas quedas d''água do '
      || 'Rio Caburgua.',
      'Lugar ideal para passar o dia, explorar as trilhas ao redor e '
      || 'fazer um piquenique.'
    ),
    (
      'Termas Geométricas', 'termas-geometricas',
      array['natureza', 'passeio']::attraction_category[],
      'Série de piscinas termais naturais interligadas por passarelas de '
      || 'madeira, com temperaturas entre 35°C e 45°C, projetadas pelo '
      || 'arquiteto Germán del Sol. Água rica em minerais, conhecida por '
      || 'propriedades curativas e terapêuticas. O complexo tem '
      || 'vestiários, banheiros e um restaurante.',
      'Chegue cedo: depois das 13h enche muito.'
    ),
    (
      'Los Pozones', 'los-pozones', array['natureza']::attraction_category[],
      'Outro conjunto de termas da região.',
      'Boa pedida para um passeio noturno.'
    ),
    (
      'Salto El León', 'salto-el-leon', array['natureza']::attraction_category[],
      'Cascata de águas cristalinas formada pelo rio de mesmo nome, com '
      || 'mais de 90 metros de queda, em meio à vegetação verdejante.',
      null
    ),
    (
      'Salto El Claro', 'salto-el-claro', array['natureza']::attraction_category[],
      'Queda d''água de cerca de 80 metros.',
      'Trilha mais leve que a do Salto El León.'
    ),
    (
      'Avenida Bernardo O''Higgins', 'avenida-bernardo-ohiggins',
      array['ponto_turistico', 'compras']::attraction_category[],
      'Uma das principais ruas de Pucón, conhecida como o coração do '
      || 'centro urbano, com agências de turismo, restaurantes, lojas e '
      || 'boutiques de souvenirs. Concentra também os bares da cidade (a '
      || 'vida noturna não é muito animada), enquanto os melhores '
      || 'restaurantes ficam na Calle Fresia.',
      null
    ),
    (
      'Playa Grande', 'playa-grande-pucon', array['natureza']::attraction_category[],
      'Praia de água doce e areia negra às margens do Lago Villarrica.',
      'Fica lotada de pessoas no verão.'
    ),
    (
      'Viña Pinwine', 'vina-pinwine',
      array['passeio', 'restaurante']::attraction_category[],
      'Primeira vinícola de Pucón, aos pés do vulcão Villarrica, com '
      || 'degustação de vinhos.',
      null
    ),
    (
      'Egon', 'egon-pucon', array['compras']::attraction_category[],
      'Artesão em destaque internacional em Pucón, especialmente por seus '
      || 'funguis (cogumelos).',
      null
    ),
    (
      'Excursão a San Martín de los Andes (Argentina)', 'excursao-san-martin-de-los-andes',
      array['passeio']::attraction_category[],
      'San Martín de los Andes fica a 180 km de Pucón, do outro lado da '
      || 'Cordilheira dos Andes, e compartilha características '
      || 'geográficas parecidas: também às margens de um lago, próxima a '
      || 'vulcões imponentes e dentro de reservas da Biosfera Unesco. A '
      || 'visita ao Parque Nacional Lanín é obrigatória, com o Lago '
      || 'Huechulafquen, o Vulcão Lanín, o Bosque de Bonsai e a comunidade '
      || 'Mapuche. A cidade também é conhecida pela estação de esqui de '
      || 'Chapelco, pelas Cachoeiras Chachín e Ñivinco, e pela Villa '
      || 'Quila Quina, às margens do Lago Lácar. A partir de San Martín, '
      || 'é possível ainda seguir pelo Caminho dos 7 Lagos até Villa La '
      || 'Angostura, para estender ainda mais a viagem.',
      null
    )
) as item(name, slug, categories, description, important_tips)
where cities.slug = 'pucon'
on conflict (slug) do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'imperdivel'
where attractions.slug in ('vulcao-villarrica', 'termas-geometricas')
on conflict do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'vale_acordar_cedo'
where attractions.slug = 'termas-geometricas'
on conflict do nothing;

insert into travel_tips (category, title, content, "order")
values
  (
    'Pucón',
    'Melhor época para visitar',
    'No verão (dezembro a fevereiro), com temperaturas entre 20°C e '
    || '30°C, as praias do Lago Villarrica ficam cheias e é época ideal '
    || 'para canoagem, caiaque, stand-up paddle e trilhas. No inverno '
    || '(junho a agosto), a cidade se transforma num paraíso para os '
    || 'esportes de neve, com o vulcão Villarrica oferecendo condições '
    || 'para esqui e snowboard.',
    1
  ),
  (
    'Pucón',
    '7 passeios mais procurados pelos turistas',
    'Excursão às Termas Geométricas: 6 horas, R$507,22. Tour da cultura '
    || 'mapuche: 4 horas, R$338,15. Tour pela zona de fronteira com a '
    || 'Argentina. Tour panorâmico por Pucón. Trilha pelo vulcão '
    || 'Villarrica: 10 horas, R$1.352,60. Trilha pelas crateras '
    || 'parasitas: 5 horas, R$439,59. Valores de referência da época da '
    || 'pesquisa, sujeitos a alteração.',
    2
  ),
  (
    'Pucón',
    'Agências de turismo recomendadas',
    'Patagonia Experience e Aguaventura (aguaventura.com) são as '
    || 'agências indicadas pelo guia Melhores Destinos para os passeios '
    || 'e trilhas da região.',
    3
  ),
  (
    'Pucón',
    'Cerveja artesanal e chocolate quente',
    'Pucón tem uma cervejaria com mais de 60 variedades artesanais, onde '
    || 'dá pra preparar e personalizar sua própria latinha de cerveja. '
    || 'Também vale experimentar o clássico chocolate quente da cidade.',
    4
  )
on conflict do nothing;
