-- Curadoria: França > Nice e Èze, e Mônaco (país próprio, não é território
-- francês) > Mônaco, a partir do roteiro do Dia 08 da viagem da família.
-- Nota de curadoria: o roteiro não trazia nota explícita para nenhum lugar,
-- então todos entram com 5 estrelas como valor temporário — ajustar depois
-- pelo painel /admin/atracoes, lugar por lugar.
-- Mônaco entra só com país e cidade: o roteiro fornecido corta antes das
-- atividades de Mônaco em si, só menciona o trajeto até lá a partir de Èze.

insert into countries (name, slug) values
  ('França', 'franca'),
  ('Mônaco', 'monaco')
on conflict (slug) do nothing;

insert into cities (country_id, name, slug, description)
select
  countries.id,
  'Nice',
  'nice',
  'Nice fica no sul da França, próxima à fronteira com a Itália. É a '
  || 'capital da Côte d''Azur, região à beira do Mar Mediterrâneo, também '
  || 'conhecida como Riviera Francesa. O Aeroporto Internacional de Nice '
  || 'está a apenas 15 minutos do centro da cidade — o deslocamento entre '
  || 'os terminais e a área mais turística pode ser feito pela linha de '
  || 'bonde Tram 2. Voo de julho: sol nasce por volta das 06:00 e se põe '
  || 'próximo das 21:10, com temperaturas médias em torno de 29°C durante '
  || 'o dia e 22°C à noite. Se o trajeto para Saint-Tropez ultrapassar 2 '
  || 'horas, opte pelo plano B. Reserve estacionamentos e restaurantes com '
  || 'antecedência durante o verão europeu, e leve água, protetor solar e '
  || 'roupas leves para maior conforto. Na retirada do carro alugado '
  || '(Hertz) no aeroporto, tire fotos e vídeos de todos os ângulos do '
  || 'carro, incluindo rodas e para-choques.'
from countries
where countries.slug = 'franca'
on conflict (slug) do nothing;

insert into cities (country_id, name, slug, description)
select
  countries.id,
  'Èze',
  'eze',
  'Vilarejo medieval na Riviera Francesa, entre Nice e Mônaco. O hotel em '
  || 'Nice fica a uns 12 km de Èze, em média 30 minutos de trajeto, e Èze '
  || 'fica a uns 10 km de Mônaco, em média 20 minutos de trajeto.'
from countries
where countries.slug = 'franca'
on conflict (slug) do nothing;

insert into cities (country_id, name, slug, description)
select
  countries.id,
  'Mônaco',
  'monaco',
  'Èze fica a uns 10 km de Mônaco, em média 20 minutos de trajeto. '
  || 'Roteiro completo do que fazer em Mônaco ainda não cadastrado.'
from countries
where countries.slug = 'monaco'
on conflict (slug) do nothing;

insert into attractions (
  city_id, name, slug, category, description, important_tips, curation_rating
)
select cities.id, attraction.name, attraction.slug, attraction.category::attraction_category,
  attraction.description, attraction.important_tips, attraction.curation_rating
from cities
cross join (
  values
    (
      'Hôtel Byakko Nice', 'hotel-byakko-nice', 'hotel',
      'Hotel com 3 diárias, 1 quarto, café da manhã incluso. Check-in às '
      || '15:00, check-out às 12:00.',
      null, 5
    ),
    (
      'Parking Notre-Dame', 'parking-notre-dame-nice', 'outro',
      'Estacionamento na 28 Avenue Notre Dame, 06000 Nice, França, a cerca '
      || 'de 5 minutos a pé do hotel.',
      'Seguro e funciona 24 horas por dia.', 5
    ),
    (
      'Parking Nice Étoile', 'parking-nice-etoile', 'outro',
      'Estacionamento a cerca de 10 minutos a pé do hotel.',
      'Seguro e funciona 24 horas por dia.', 5
    )
) as attraction(name, slug, category, description, important_tips, curation_rating)
where cities.slug = 'nice'
on conflict (slug) do nothing;

insert into attractions (
  city_id, name, slug, category, description, important_tips, curation_rating
)
select cities.id, attraction.name, attraction.slug, attraction.category::attraction_category,
  attraction.description, attraction.important_tips, attraction.curation_rating
from cities
cross join (
  values
    (
      'Moyenne Corniche', 'moyenne-corniche', 'passeio',
      'Estrada cênica na Riviera Francesa que conecta Nice a Mônaco, '
      || 'situada entre o mar e a montanha, com vistas espetaculares da '
      || 'Costa Azul.',
      null, 5
    ),
    (
      'Vila Medieval de Èze', 'vila-medieval-de-eze', 'ponto_turistico',
      'Charmoso vilarejo de pedra no topo de uma falésia na Riviera '
      || 'Francesa, conhecido como "aldeia ninho de águia", a 429 metros '
      || 'acima do Mediterrâneo.',
      'Estacionamento no Parking Èze Village, na entrada da vila. É '
      || 'possível estacionar gratuitamente na Fábrica de Perfumes '
      || 'durante a visita à fábrica.',
      5
    ),
    (
      'Jardim Exotique d''Èze', 'jardim-exotique-d-eze', 'natureza',
      'Localizado no ponto mais alto de Èze, com vistas deslumbrantes da '
      || 'Côte d''Azur.',
      'Ingresso: 10,00 € e 6,00 €.', 5
    ),
    (
      'Église Notre-Dame-de-l''Assomption d''Èze', 'eglise-notre-dame-de-lassomption-d-eze', 'ponto_turistico',
      'Templo neoclássico construído entre 1764 e 1778, com interior '
      || 'barroco charmoso e acolhedor, situado próximo ao Jardim Exótico '
      || 'da cidade. Substituiu uma igreja anterior que estava em ruínas '
      || '— padroeira Nossa Senhora da Assunção.',
      null, 5
    ),
    (
      'Fragonard L''Usine Laboratoire d''Èze', 'fragonard-usine-laboratoire-d-eze', 'passeio',
      'Fábrica de perfumes inaugurada em 1968, com localização '
      || 'privilegiada ao pé da rocha e vista para o mar — o design '
      || 'moderno contrasta com o cenário da vila medieval.',
      'Oferece tours guiados gratuitos sobre a produção de perfumes, '
      || 'cosméticos e sabonetes. As visitas acontecem a cada 30 minutos '
      || 'ao longo do dia e têm duração aproximada de 30 minutos.',
      5
    )
) as attraction(name, slug, category, description, important_tips, curation_rating)
where cities.slug = 'eze'
on conflict (slug) do nothing;

-- Etiqueta: gratuito para o tour guiado da fábrica de perfumes Fragonard.
insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'gratuito'
where attractions.slug = 'fragonard-usine-laboratoire-d-eze'
on conflict do nothing;
