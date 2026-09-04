-- Curadoria: Grécia > Atenas, a partir do roteiro da viagem da família.
-- Nota de curadoria: nenhum lugar do roteiro trazia uma nota explícita, então
-- todos entram com 5 estrelas como valor temporário (a pedido da autora) —
-- ajustar depois pelo painel /admin/atracoes, lugar por lugar.

insert into countries (name, slug) values
  ('Grécia', 'grecia')
on conflict (slug) do nothing;

insert into cities (country_id, name, slug, description)
select
  countries.id,
  'Atenas',
  'atenas',
  'Voo de julho: sol nasce por volta das 06:00 e se põe por volta das 20:45. '
  || 'As temperaturas altas ficam em médias de 28-30°C, então sendo seco e '
  || 'com céu claro. O Uber não é regularizado, mas pode-se usar o aplicativo '
  || 'para chamar táxi. O aeroporto fica a uns 20/30 km do centro, com trajeto '
  || 'de 40/60 minutos. Troque dinheiro em euro localmente, não no aeroporto. '
  || 'Kalimera significa "bom dia" e etharisto significa "obrigado". '
  || 'Acrópole significa "cidade alta", fortificada, com templos para proteção '
  || 'e culto. Ágora significa "cidade baixa", a praça pública central, o '
  || 'coração da vida comercial, política e social.'
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
      'Athens Market Portrait', 'athens-market-portrait', 'hotel',
      'Hotel com 2 diárias, 2 quartos e café da manhã incluso.',
      null, null, null, 5
    ),
    (
      'Bairro Plaka', 'bairro-plaka', 'ponto_turistico',
      'O bairro mais antigo e charmoso de Atenas, com arquitetura neoclássica.',
      null, null, null, 5
    ),
    (
      'Bairro Monastiraki', 'bairro-monastiraki', 'ponto_turistico',
      'Conhecido pela feira de pulgas, comércio diversificado e praça agitada.',
      null, null, null, 5
    ),
    (
      'Bairro Koukaki', 'bairro-koukaki', 'ponto_turistico',
      'Situado ao sul da Acrópole e próximo à colina Filopappou. Área '
      || 'residencial de luxo, com edifícios neoclássicos, ruas charmosas, '
      || 'cafés modernos, tavernas tradicionais e vida noturna animada.',
      null, null, null, 5
    ),
    (
      'Mercado Central de Atenas', 'mercado-central-de-atenas', 'compras',
      'Bons preços, aproveite para comprar chocolates, vinhos e água.',
      null,
      'Experimente o Three Cents Pink Grapefruit Soda, um refrigerante '
      || 'artesanal premium originário da Grécia.',
      null, 5
    ),
    (
      'Designer Outlet Athens (McArthurGlen)', 'designer-outlet-athens-mcarthurglen', 'compras',
      'Um dos melhores outlets de Atenas, localizado em Spata, próximo ao '
      || 'aeroporto. Oferece descontos em marcas internacionais como Levi''s, '
      || 'Calvin Klein e Ralph Lauren.',
      null, null, null, 5
    ),
    (
      'Factory Outlet', 'factory-outlet', 'compras',
      'Outlet com unidades no centro de Atenas e perto do aeroporto. Oferece '
      || 'descontos em marcas internacionais como Levi''s, Calvin Klein e '
      || 'Ralph Lauren.',
      null, null, null, 5
    ),
    (
      'Anefani Atenas', 'anefani-atenas', 'restaurante',
      null, 'Experimente o queijo empanado com mel por cima.', null, null, 5
    ),
    (
      'Attic Urban Rooftop', 'attic-urban-rooftop', 'restaurante',
      'Rooftop com linda vista da Acrópole, inclusive para ver o pôr-do-sol.',
      null, null, 'Pôr-do-sol', 5
    ),
    (
      'Ermou 18 Rooftop', 'ermou-18-rooftop', 'restaurante',
      'Rooftop que também oferece linda vista da Acrópole e do pôr-do-sol, '
      || 'um pouco mais sofisticado que o Attic.',
      null, null, 'Pôr-do-sol', 5
    ),
    (
      'Klepsidra Café', 'klepsidra-cafe', 'cafe',
      'Café em Plaka. Experimente o tzatziki, patê de iogurte com pepino, e '
      || 'a salada grega.',
      'Comida muito boa com preço justo, ambiente e atendimento bem agradável.',
      null, null, 5
    ),
    (
      'Moby All Day Bar', 'moby-all-day-bar', 'restaurante',
      'Bar em frente à marina.',
      'Salada e hambúrguer deliciosos.', null, null, 5
    ),
    (
      'At MeattheGreek', 'at-meatthegreek', 'restaurante',
      'Casa de souvlaki, famosa pelo Gyro, um tipo de fast food comum na Grécia.',
      'Maravilhoso, não deixe de experimentar! Servido com batatinhas.',
      null, null, 5
    ),
    (
      'Monte Licabeto', 'monte-licabeto', 'natureza',
      'O ponto mais alto de Atenas, oferece uma vista panorâmica de 360 graus.',
      null,
      'Ideal para ver o sol se pôr atrás das montanhas enquanto a cidade se ilumina.',
      'Pôr-do-sol', 5
    ),
    (
      'Colina Areópago', 'colina-areopago', 'natureza',
      'Localizada logo abaixo da entrada da Acrópole. Vista panorâmica '
      || 'popular e de fácil acesso, com vista direta para o Partenon.',
      null, null, 'Pôr-do-sol', 5
    ),
    (
      'Colina Filopappou', 'colina-filopappou', 'natureza',
      'Oferece trilhas agradáveis e uma vista panorâmica inigualável do '
      || 'Partenon e do litoral.',
      null, null, 'Pôr-do-sol', 5
    ),
    (
      'Anafiotika', 'anafiotika', 'ponto_turistico',
      'Bairro pitoresco em Plaka que parece uma ilha grega, com ruas '
      || 'estreitas que oferecem vistas charmosas do pôr do sol sobre a cidade.',
      null, null, 'Pôr-do-sol', 5
    )
) as attraction(
  name, slug, category, description, personal_experience, important_tips,
  best_time_of_day, curation_rating
)
where cities.slug = 'atenas'
on conflict (slug) do nothing;

-- Etiquetas: gratuito para os pontos de pôr-do-sol (roteiro os lista como
-- "principais locais para o pôr-do-sol gratuito"), imperdível para o lugar
-- que o roteiro pede explicitamente para não deixar de experimentar.
insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'gratuito'
where attractions.slug in (
  'monte-licabeto', 'colina-areopago', 'colina-filopappou', 'anafiotika'
)
on conflict do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'imperdivel'
where attractions.slug = 'at-meatthegreek'
on conflict do nothing;
