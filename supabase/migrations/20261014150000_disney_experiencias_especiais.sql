-- Experiências especiais nos quatro parques da Disney em Orlando, dentro de
-- PRINCIPAIS ATRAÇÕES (antes da frase "A programação pode mudar"). Cada bloco
-- só entra se ainda não existir, para não duplicar. Disponibilidade conferida
-- nos sites oficiais da Disney em 14/10/2026. Bibbidi Bobbidi Boutique,
-- Cinderella's Royal Table, Akershus e Kidcot já estavam citados nas dicas
-- (reservas e World Showcase Passport), então as dicas só ganham o que faltava:
-- Princess Fairytale Hall (Magic Kingdom) e reservas de Savi's Workshop e
-- Droid Depot (Hollywood Studios).

update attractions
set description = replace(
  description,
  E'\n\nA programação pode mudar.',
  E'\n\n' || $$👑 **Bibbidi Bobbidi Boutique** - transformação das crianças em princesas ou cavaleiros, em um salão logo atrás do castelo. Reserva antecipada pelo My Disney Experience.
👑 **Cinderella's Royal Table** - refeição dentro do Castelo da Cinderela, com encontros com princesas à mesa. Reserva antecipada pelo My Disney Experience.
🪄 **Enchanted Tales with Belle** - experiência interativa em Fantasyland: você entra na casa de Bela e Maurice e alguns voluntários participam da história ao lado da princesa.$$ || E'\n\nA programação pode mudar.')
where slug = 'magic-kingdom'
  and description not like '%Bibbidi Bobbidi Boutique**%';

update attractions
set description = replace(
  description,
  E'\n\nA programação pode mudar.',
  E'\n\n' || $$👑 **Akershus Royal Banquet Hall** - refeição com princesas Disney no pavilhão da Noruega, em um cenário que lembra um castelo medieval. Reserva antecipada pelo My Disney Experience.
🗺️ **Kidcot Fun Stops** - paradas nos 11 pavilhões do World Showcase, onde as crianças recebem atividades e lembrancinhas sobre a cultura de cada país.
🗺️ **Remy's Ratatouille Hide & Squeak** - caça ao tesouro com mapa e adesivos para encontrar estátuas escondidas do Remy pelo World Showcase. É uma experiência sazonal, ligada ao Food & Wine Festival; confirme a disponibilidade na data da visita.$$ || E'\n\nA programação pode mudar.')
where slug = 'epcot'
  and description not like '%Akershus Royal Banquet Hall**%';

update attractions
set description = replace(
  description,
  E'\n\nA programação pode mudar.',
  E'\n\n' || $$🪄 **Savi's Workshop** - construção de um sabre de luz personalizado em Star Wars: Galaxy's Edge, escolhendo o cabo e a cor do cristal kyber. Reserva antecipada recomendada.
🪄 **Droid Depot** - montagem de um droide personalizado, escolhendo o modelo e as peças, também em Galaxy's Edge. Reserva antecipada recomendada.$$ || E'\n\nA programação pode mudar.')
where slug = 'hollywood-studios'
  and description not like '%Savi''s Workshop**%';

update attractions
set description = replace(
  description,
  E'\n\nA programação pode mudar.',
  E'\n\n' || $$🗺️ **Wilderness Explorers** - missões educativas inspiradas em Up: Altas Aventuras, com desafios sobre animais, ecossistemas e conservação para ganhar emblemas. O caderno de atividades é retirado na sede, na ponte entre Oasis e Discovery Island.$$ || E'\n\nA programação pode mudar.')
where slug = 'animal-kingdom'
  and description not like '%Wilderness Explorers**%';

-- Dicas
update attractions
set important_tips = replace(
  important_tips,
  'é uma experiência paga, concorrida e com reserva antecipada recomendada; o ingresso do parque é separado.',
  'é uma experiência paga, concorrida e com reserva antecipada recomendada; o ingresso do parque é separado.' ||
  E'\n✓ ' || 'No Princess Fairytale Hall, em Fantasyland, é possível encontrar a Cinderela e a Tiana; a princesa convidada pode variar. Confira local e horários no My Disney Experience.')
where slug = 'magic-kingdom'
  and important_tips not like '%Princess Fairytale Hall%';

update attractions
set important_tips = replace(
  important_tips,
  'deve ser reservado com antecedência.',
  'deve ser reservado com antecedência.' ||
  E'\n✓ ' || 'Savi''s Workshop e Droid Depot funcionam com reserva antecipada, feita pelo My Disney Experience ou pelo site oficial, com pagamento no ato da reserva. Podem surgir vagas no mesmo dia, mas não conte com isso. O ingresso do parque é separado.')
where slug = 'hollywood-studios'
  and important_tips not like '%Droid Depot%';
