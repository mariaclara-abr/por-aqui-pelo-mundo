-- Curadoria: Grécia > Santorini, a partir do roteiro da viagem da família.
-- Nota de curadoria: assim como em Atenas, o roteiro não trazia nota
-- explícita para nenhum lugar, então todos entram com 5 estrelas como valor
-- temporário — ajustar depois pelo painel /admin/atracoes, lugar por lugar.

insert into countries (name, slug) values
  ('Grécia', 'grecia')
on conflict (slug) do nothing;

insert into cities (country_id, name, slug, description)
select
  countries.id,
  'Santorini',
  'santorini',
  'Voo de julho: sol nasce por volta das 06:03 e se põe próximo às 20h40. '
  || 'As temperaturas são altas, com médias próximas a 29°C-30°C, sendo '
  || 'quente e seco. "Anedousa" é o fenômeno onde o ar mais frio encontra a '
  || 'água quente da boca do vulcão e forma uma neblina.'
from countries
where countries.slug = 'grecia'
on conflict (slug) do nothing;

insert into attractions (
  city_id, name, slug, category, description, personal_experience,
  important_tips, best_time_of_day, curation_rating
)
select cities.id, attraction.name, attraction.slug, attraction.category::attraction_category,
  attraction.description, attraction.personal_experience, attraction.important_tips,
  attraction.best_time_of_day, attraction.curation_rating
from cities
cross join (
  values
    (
      'Kastro Suites', 'kastro-suites', 'hotel',
      'Hotel com 3 diárias, quarto/sala de 52m² e café da manhã incluso. '
      || 'Check-in às 15:00, check-out às 11:00.',
      null, null, null, 5
    ),
    (
      'Rastoni Café Bar', 'rastoni-cafe-bar', 'restaurante',
      'Em Fira, outra opção para curtir o pôr-do-sol.',
      null, 'Ideal fazer reserva.', 'Pôr-do-sol', 5
    ),
    (
      'Dimitris Ammoudi Taverna', 'dimitris-ammoudi-taverna', 'restaurante',
      'Em Amoudi Bay.',
      'Peixe assado, comida deliciosa e fresca — preço mais em conta que '
      || 'nos restaurantes mais altos em Oia, inclusive nos drinks.',
      null, null, 5
    ),
    (
      'Aegean Restaurant', 'aegean-restaurant', 'restaurante',
      'Restaurante familiar em Imerovigli, comida bem saborosa.',
      null, null, null, 5
    ),
    (
      'Ohh Boy', 'ohh-boy', 'restaurante',
      'Em Fira, belíssima vista.',
      null, null, null, 5
    ),
    (
      'Franco''s Bar', 'francos-bar', 'restaurante',
      'Em Fira, um dos bares mais antigos e prestigiados da ilha, '
      || 'conhecido por tocar música clássica enquanto o sol se põe sobre '
      || 'a caldeira.',
      null,
      'Possui terraço com espreguiçadeiras e poltronas confortáveis '
      || 'voltadas para o mar. Serve coquetéis premium e vinhos locais.',
      'Pôr-do-sol', 5
    ),
    (
      'Franco''s Café', 'francos-cafe', 'cafe',
      'Situado no ponto mais alto de Pyrgos, com visão de 360 graus. '
      || 'Oferece uma experiência mais tranquila e panorâmica que a de '
      || 'Fira. Focado em petiscos gregos, saladas, tortas e sobremesas '
      || 'como fondue.',
      null, null, null, 5
    ),
    (
      'Naoussa Restaurante', 'naoussa-restaurante', 'restaurante',
      'Em Fira, comida saborosa e bons preços.',
      null, null, null, 5
    ),
    (
      'Taverna Romantica', 'taverna-romantica', 'restaurante',
      'Em Firostefani, comida fresca, bem servida e saborosa, ótimo '
      || 'serviço, excelentes pratos gregos.',
      null, null, null, 5
    ),
    (
      'Aktaion', 'aktaion', 'restaurante',
      'Em Firostefani, taverna tradicional em funcionamento desde 1922, '
      || 'oferece vista para o pôr-do-sol.',
      null, null, 'Pôr-do-sol', 5
    ),
    (
      'Mylos Restaurant', 'mylos-restaurant', 'restaurante',
      'Em Firostefani, uma das vistas mais privilegiadas do pôr do sol na '
      || 'caldeira, culinária sofisticada que mistura influências '
      || 'mediterrâneas e asiáticas.',
      null, null, 'Pôr-do-sol', 5
    ),
    (
      'Lucky''s Souvlakis', 'luckys-souvlakis', 'restaurante',
      'Pequena lanchonete em Fira, excelente para refeições rápidas sem '
      || 'gastar muito.',
      'Os pyta gyros são saborosos, preparados com ingredientes frescos, '
      || 'temperos na medida certa e quantidade generosa.',
      null, null, 5
    ),
    (
      'Triana Tavern', 'triana-tavern', 'restaurante',
      'Em Fira, visita obrigatória em Santorini.',
      'A comida é lindamente apresentada, fresca e repleta do autêntico '
      || 'sabor grego com um toque moderno. Serviço acolhedor, atencioso '
      || 'e com ótimas recomendações de vinhos. Uma experiência '
      || 'gastronômica inesquecível.',
      'Preços razoáveis.', null, 5
    ),
    (
      'Pelican Kipos', 'pelican-kipos', 'restaurante',
      'Em Fira, serve grande comida sem a etiqueta de preço pesado de '
      || 'outros restaurantes locais, em um lindo ambiente ao ar livre '
      || 'cercado por folhagem e com cavernas de vinho.',
      'Comida muito boa, serviço acolhedor.',
      'Mantêm a tradição grega de um pequeno prato de pós-almoço '
      || 'gratuito. Para os amantes de cerveja, uma fantástica seleção '
      || 'de cervejas locais e internacionais.',
      null, 5
    ),
    (
      'Fusionnelle', 'fusionnelle', 'restaurante',
      'Em Fira, um refúgio acolhedor, com alta avaliação por sua comida '
      || 'fresca, serviço atencioso e preços honestos.',
      null,
      'Conhecido por massas artesanais, opções saudáveis e comida grega '
      || 'clássica.',
      null, 5
    ),
    (
      'Ruínas do Castelo de Oia', 'ruinas-do-castelo-de-oia', 'ponto_turistico',
      'Ruínas de castelo em Oia, o ponto para pôr-do-sol gratuito mais '
      || 'icônico de Santorini.',
      null, 'É o ponto mais icônico e concorrido.', 'Pôr-do-sol', 5
    )
) as attraction(
  name, slug, category, description, personal_experience, important_tips,
  best_time_of_day, curation_rating
)
where cities.slug = 'santorini'
on conflict (slug) do nothing;

-- Etiquetas: gratuito para o mirante de pôr-do-sol listado como gratuito no
-- roteiro, imperdível para a taverna que o roteiro chama de "visita
-- obrigatória em Santorini".
insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'gratuito'
where attractions.slug = 'ruinas-do-castelo-de-oia'
on conflict do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'imperdivel'
where attractions.slug = 'triana-tavern'
on conflict do nothing;
