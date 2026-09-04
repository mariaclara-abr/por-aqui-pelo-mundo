-- Curadoria: Brasil > Bom Retiro, Alfredo Wagner e São Joaquim (Serra
-- Catarinense), a partir do roteiro de planejamento da viagem de setembro
-- de 2026. País Brasil já existia (rascunho). Nota de curadoria em branco
-- de propósito, para a autora avaliar depois pelo painel /admin/atracoes.

insert into cities (country_id, name, slug)
select countries.id, city.name, city.slug
from countries
cross join (
  values
    ('Bom Retiro', 'bom-retiro'),
    ('Alfredo Wagner', 'alfredo-wagner'),
    ('São Joaquim', 'sao-joaquim')
) as city(name, slug)
where countries.slug = 'brasil'
on conflict (slug) do nothing;

insert into attractions (
  city_id, name, slug, categories, description
)
select
  cities.id,
  'Caminho das Nuvens – Cabanas de Montanha',
  'caminho-das-nuvens-cabanas-de-montanha',
  array['hotel']::attraction_category[],
  'Cabanas de montanha em Bom Retiro, com café da manhã incluído na '
  || 'reserva, lareira e roda de fogo externa. Ótimo ponto para ver o '
  || 'nascer do sol direto do deck/varanda (por volta das 6h25-6h30, o '
  || 'ideal é estar lá desde as 6h para pegar a mudança de cores no céu) '
  || 'e o pôr do sol (por volta das 18h05-18h10, o ideal é estar lá desde '
  || 'as 17h40-17h45).'
from cities
where cities.slug = 'bom-retiro'
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
      'Eco Parque Soldados Sebold', 'eco-parque-soldados-sebold',
      array['natureza', 'passeio']::attraction_category[],
      'Quatro grandes formações rochosas de arenito, esculpidas pela '
      || 'erosão ao longo de milhões de anos, que vistas à distância '
      || 'lembram soldados enfileirados, o que deu origem ao nome '
      || '"Soldados Sebold", em homenagem ao Sr. Sebold, um dos primeiros '
      || 'moradores da região.',
      'Do centro de Alfredo Wagner até o ponto de apoio/estacionamento '
      || 'do Sr. Claudir são cerca de 17 km. Dali em diante, carros '
      || 'comuns não seguem: com 4x4 próprio são mais 11 km de estrada '
      || 'off-road até a Recepção/Camping/Refúgio (só Day Use, R$40, '
      || 'isento até 12 e acima de 60 anos); com carro comum, são cerca '
      || 'de 6 km de caminhada (2h30 a 3h de subida), pagando '
      || 'estacionamento R$10 + Day Use R$40, ou contratando transfer 4x4 '
      || 'previamente. De qualquer forma, chegando à Recepção/Refúgio '
      || 'ainda falta 1,5 km de trilha interna, com subida forte e '
      || 'trechos de escalaminhada, até a Base dos Soldados. Use roupas '
      || 'e calçados confortáveis, leve água, lanche e uma sacola para '
      || 'recolher o lixo.'
    ),
    (
      'Gruta do Poço Certo', 'gruta-do-poco-certo',
      array['natureza']::attraction_category[],
      'Gruta e cachoeira de visita curta e leve, com pequena trilha de '
      || 'acesso.',
      'A cerca de 33 km e 1h10-1h20 dos Soldados Sebold, por rota '
      || 'rural/off-road.'
    ),
    (
      'Cânion Arroio do Leão', 'canion-arroio-do-leao',
      array['natureza']::attraction_category[],
      'Cânion que pode ser apenas contemplado pela entrada, ou explorado '
      || 'de forma mais aventureira, caminhando pelo leito do arroio.',
      'A cerca de 20-25 km e 44 minutos dos Soldados Sebold.'
    )
) as item(name, slug, categories, description, important_tips)
where cities.slug = 'alfredo-wagner'
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
      'Vinícola Leone di Venezia', 'vinicola-leone-di-venezia',
      array['passeio', 'restaurante']::attraction_category[],
      'Tour "Apreciar - Uma Jornada pela Arte do Vinho", com 1 hora de '
      || 'duração e degustação guiada de 5 vinhos, incluindo visita ao '
      || 'jardim e aos vinhedos, apresentação da história do projeto da '
      || 'vinícola, área de produção, explicações sobre fermentação e '
      || 'maturação, e 1 taça de cristal personalizada para levar. '
      || 'Também é possível permanecer para o almoço no local, logo '
      || 'depois do tour.',
      'Valor de referência: R$128 por pessoa (R$45 de 7 a 18 anos, com '
      || 'suco de maçã).'
    ),
    (
      'Villa Francioni', 'villa-francioni',
      array['passeio']::attraction_category[],
      'Tour "Taças na Mão", com 1h15 de duração, com visita guiada pelos '
      || '5 andares de produção e degustação de 4 rótulos (VF Sauvignon '
      || 'Blanc, VF Rosé, VF Francesco e VF Villa Francioni) em 4 espaços '
      || 'diferentes da vinícola, além de 1 taça de cristal personalizada '
      || 'para levar. O VF Rosé, um blend de oito variedades de uvas '
      || 'tintas, ficou conhecido como o "vinho da Madonna": durante uma '
      || 'passagem pelo Brasil, a cantora provou o rótulo em um '
      || 'restaurante de São Paulo, gostou tanto que teria comprado '
      || 'todas as garrafas disponíveis no local.',
      'Pagamento no local. Valor de referência: R$150 por pessoa (R$99 '
      || 'sem degustação alcoólica, isento até 12 anos).'
    ),
    (
      'Restaurante 1948 Carne & Fogo', 'restaurante-1948-carne-e-fogo',
      array['restaurante']::attraction_category[],
      'No centro de São Joaquim, a 6 km e 15 minutos da Vinícola Leone '
      || 'di Venezia.',
      null
    ),
    (
      'Praça João Ribeiro e Igreja Matriz', 'praca-joao-ribeiro-e-igreja-matriz',
      array['ponto_turistico']::attraction_category[],
      'Praça central de São Joaquim, com a Igreja Matriz.',
      'Parada rápida, de aproximadamente 20 a 30 minutos.'
    ),
    (
      'Mirante dos Pinheiros', 'mirante-dos-pinheiros',
      array['natureza']::attraction_category[],
      'Mirante a cerca de 3 km do centro de São Joaquim.',
      null
    )
) as item(name, slug, categories, description, important_tips)
where cities.slug = 'sao-joaquim'
on conflict (slug) do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'reserva_necessaria'
where attractions.slug in ('vinicola-leone-di-venezia', 'villa-francioni')
on conflict do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'gratuito'
where attractions.slug in ('canion-arroio-do-leao', 'mirante-dos-pinheiros')
on conflict do nothing;
