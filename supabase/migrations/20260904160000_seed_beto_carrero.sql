-- Curadoria: Brasil > Penha (SC), Beto Carrero World, a partir do roteiro de
-- planejamento da visita de agosto de 2025. Segue o mesmo padrão já usado
-- para os parques temáticos de Orlando: descrição geral do parque, cobrindo
-- suas áreas temáticas, mais os detalhes práticos em important_tips.
-- Nota de curadoria em branco de propósito, para a autora avaliar depois
-- pelo painel /admin/atracoes. País Brasil já existia (rascunho).

insert into cities (country_id, name, slug)
select countries.id, 'Penha', 'penha'
from countries
where countries.slug = 'brasil'
on conflict (slug) do nothing;

insert into attractions (
  city_id, name, slug, categories, description, important_tips,
  average_visit_time, best_time_of_day, recommended_audience
)
select
  cities.id,
  'Beto Carrero World',
  'beto-carrero-world',
  array['ponto_turistico', 'parque_tematico']::attraction_category[],
  'Maior parque temático da América Latina, dividido em áreas com '
  || 'temáticas próprias. A Aventura Radical reúne os brinquedos mais '
  || 'radicais: Star Mountain (montanha-russa com looping), Tchibum '
  || '(montanha-russa aquática), FireWhip (montanha-russa invertida com '
  || 'looping) e o Portal da Escuridão, uma experiência de sustos a pé com '
  || 'maquiagem de terror. A área Hot Wheels tem o Big Tower, torre que '
  || 'despenca, e o show Hot Wheels Epic Show. A Nerf Mania é a área mais '
  || 'nova do parque, com o Spin Blast e o Super Soaker Splash. Em '
  || 'Madagascar fica o Crazy River, passeio de bote pelo rio, além do '
  || 'show Madagascar Circus Show. O Cowboyland tem temática de Velho '
  || 'Oeste, com o Memorial Beto Carrero, a montanha-russa infantil Dum '
  || 'Dum e os shows Acqua (aventura marinha) e Sonho do Cowboy '
  || '(homenagem a Beto Carrero). A Triplikland é a área mais infantil, '
  || 'com roda-gigante e xícaras malucas. A Ilha dos Piratas, acessada '
  || 'pela Ponte Pencil, tem o barco pirata Vai e Vem e o Projeto Tamar. '
  || 'Já a Vila Germânica reúne o show medieval Excalibur, o carrossel '
  || 'veneziano e fotos com personagens como Bob Esponja e Shrek. A Terra '
  || 'da Fantasia tem a Ferrovia DinoMagic, que sai da Estação João Alves '
  || 'de Queiroz.',
  'Bilheterias abrem às 07h30 e as catracas às 09h; a recepção comercial '
  || 'funciona das 08h às 17h. A maioria das atrações funciona das 10h às '
  || '18h, mas algumas têm horário próprio: Portal da Escuridão e '
  || 'Maquiagem do Terror das 12h30 às 17h30/17h, e Ferrovia DinoMagic das '
  || '10h às 17h30. As filas fecham às 18h, mas quem já está nelas anda '
  || 'até o fim. O Big Tower é gratuito, mas recomenda-se chegar com pelo '
  || 'menos 60 minutos de antecedência, pois os lugares esgotam rápido '
  || '(ou comprar a área vip, que garante lugar reservado sem precisar '
  || 'chegar tão cedo). Pague o estacionamento com antecedência. O parque '
  || 'não tem bebedouro de água, leve garrafa ou compre no local. Na '
  || 'Praça de Eventos (Avenida das Nações) acontece o show de fogos '
  || 'Ritmo de Trolls às 19h, e a saída do parque é permitida por 20 '
  || 'minutos mediante QR Code gerado no totem de autoatendimento.',
  'Dia inteiro',
  'Chegue na abertura, principalmente para garantir lugar no Big Tower',
  'Famílias com crianças de todas as idades'
from cities
where cities.slug = 'penha'
on conflict (slug) do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug in ('ideal_para_familias', 'dia_inteiro')
where attractions.slug = 'beto-carrero-world'
on conflict do nothing;
