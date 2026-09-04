-- Curadoria: Brasil > Visconde de Mauá (RJ), a partir do roteiro de
-- planejamento da viagem de 2020. País Brasil já existia (rascunho).
-- Nota de curadoria em branco de propósito, para a autora avaliar depois
-- pelo painel /admin/atracoes.

insert into cities (country_id, name, slug, description)
select
  countries.id,
  'Visconde de Mauá',
  'visconde-de-maua',
  'Pequeno distrito de Resende, localizado entre os estados do Rio de '
  || 'Janeiro e Minas Gerais, com menos de 10.000 habitantes, a 1.200 '
  || 'metros de altitude. Formado por três vilarejos: Visconde de Mauá '
  || '(mais próximo), Maringá (mais turístico, com maior infraestrutura, a '
  || '7 km de Mauá) e Maromba (mais distante e alto, a 3 km de Maringá). '
  || 'Clima tropical de altitude, com verão chuvoso e temperatura amena '
  || '(média de 15-25°C) e inverno frio e seco (média de 5-16°C). '
  || 'Partindo do Rio de Janeiro são 200 km pela Via Dutra, partindo de '
  || 'São Paulo, 294 km, também pela Via Dutra: abasteça ainda na Dutra '
  || 'para fugir de preços abusivos na região. A viagem começa já na '
  || 'subida da serra, logo após Penedo, com belas paisagens à esquerda, '
  || 'cerca de 45 minutos depois chega-se à pequena Vila de Visconde de '
  || 'Mauá. A maior parte dos estabelecimentos aceita cartão, mas vale '
  || 'levar dinheiro, já que não há onde sacar na região.'
from countries
where countries.slug = 'brasil'
on conflict (slug) do nothing;

insert into attractions (
  city_id, name, slug, categories, description, important_tips,
  personal_experience
)
select
  cities.id, item.name, item.slug, item.categories, item.description,
  item.important_tips, item.personal_experience
from cities
cross join (
  values
    (
      'Shopping Aldeia dos Imigrantes', 'shopping-aldeia-dos-imigrantes',
      array['compras']::attraction_category[],
      'Shopping ao ar livre com lojinhas variadas, um dos pontos mais '
      || 'visitados da vila. Abriga o tradicional Café Pequeno, ideal '
      || 'para cafés e lanches.',
      null, null
    ),
    (
      'Hotel Büler', 'hotel-buler', array['hotel']::attraction_category[],
      'Hospedagem na Vila de Maringá.', null, 'Reservamos o Chalé 3.'
    ),
    (
      'Gosto com Gosto', 'gosto-com-gosto',
      array['restaurante']::attraction_category[], null, null,
      'Experimente o bolinho de mandioca e leve um azeite artesanal '
      || 'assinado pela chef Mônica Rangel.'
    ),
    (
      'Rosmarinus', 'rosmarinus', array['restaurante']::attraction_category[],
      'Um dos restaurantes mais badalados e caros da região.',
      'Reserve com 1 semana de antecedência.',
      'Sugestão de sobremesa: merengue italiano.'
    ),
    (
      'Bier Garten', 'bier-garten', array['restaurante']::attraction_category[],
      'Cervejaria com pratos alemães.', null,
      'Sugestão para cerveja importada e prato alemão.'
    ),
    (
      'Café Maringá', 'cafe-maringa',
      array['restaurante', 'cafe']::attraction_category[], null, null,
      'Sugestão para cerveja regional.'
    ),
    (
      'Casa di Pedra', 'casa-di-pedra', array['restaurante']::attraction_category[],
      null, null, 'Sugestão para jantar, massa e vinho.'
    ),
    (
      'Restaurante Borbulha', 'restaurante-borbulha',
      array['restaurante']::attraction_category[], 'Truta famosa.', null, null
    ),
    (
      'Restaurante Babel', 'restaurante-babel',
      array['restaurante']::attraction_category[],
      'Ótima opção para almoço.', 'Reserve com antecedência.', null
    ),
    (
      'Restaurante Yamazaki Sushi', 'restaurante-yamazaki-sushi',
      array['restaurante']::attraction_category[],
      'Culinária oriental, ambiente aconchegante com lareira.', null, null
    ),
    (
      'Cachoeira Véu da Noiva', 'cachoeira-veu-da-noiva',
      array['natureza']::attraction_category[],
      'Queda d''água de 30 metros.',
      'Fácil acesso, aproximadamente 1 km da Vila de Maromba.', null
    ),
    (
      'Poção da Maromba', 'pocao-da-maromba',
      array['natureza']::attraction_category[],
      'Poço ótimo para banho, com aproximadamente 5 metros de '
      || 'profundidade.',
      'Siga na estrada Maromba x Escorrega por 1 km, até chegar à trilha '
      || 'que leva ao poção.',
      null
    ),
    (
      'Cachoeira da Santa Clara', 'cachoeira-da-santa-clara',
      array['natureza']::attraction_category[],
      'Uma das mais famosas e belas da região, fica na mata, cercada de '
      || 'floresta, ao som de pássaros.',
      'Siga na estrada Maringá x Maromba. Você encontrará uma ponte à '
      || 'direita, sobre o Rio Preto: atravesse a ponte e siga por '
      || 'aproximadamente 500 metros, haverá uma bifurcação, siga à '
      || 'esquerda por mais 500 metros, encontrará uma trilha à direita, '
      || 'é só descer e chegará na cachoeira.',
      null
    ),
    (
      'Cachoeira do Escorrega', 'cachoeira-do-escorrega',
      array['natureza']::attraction_category[],
      'Muito famosa e visitada, seu nome vem da rocha lisa onde fica a '
      || 'queda d''água de 20 metros, que permite aos banhistas '
      || 'escorregarem por ela até o poço.',
      'Siga na estrada Maromba x Escorrega até o ponto final da estrada, '
      || 'aproximadamente 2,5 km.',
      null
    ),
    (
      'Cachoeira dos Macacos', 'cachoeira-dos-macacos',
      array['natureza']::attraction_category[],
      'Fica a 6 km da Vila de Maromba, acima da Cachoeira do Escorrega.',
      null, null
    ),
    (
      'Cachoeiras do Alcantilado', 'cachoeiras-do-alcantilado',
      array['natureza']::attraction_category[],
      'Um paraíso à parte: sequência de 9 quedas e poços ao longo de '
      || 'quase 3 km de caminhada ida e volta.',
      'Siga na estrada Maringá x Mauá até a entrada da Gávea, depois na '
      || 'estrada Maringá x Mirantão por aproximadamente 6,5 km, até uma '
      || 'entradinha à esquerda: entre e siga por mais 1 km até a estrada '
      || 'da fazenda para as cachoeiras. Fica em propriedade particular '
      || 'liberada para visitação, cobra-se taxa de manutenção e limpeza.',
      null
    ),
    (
      'Cachoeira da Saudade', 'cachoeira-da-saudade',
      array['natureza']::attraction_category[], null,
      'Na mesma estrada das Cachoeiras do Alcantilado, 5 km adiante está '
      || 'a entrada: siga por mais 6 km até a entrada e mais 2 km de '
      || 'trilha.',
      null
    ),
    (
      'Cachoeira da Fumaça', 'cachoeira-da-fumaca',
      array['natureza']::attraction_category[],
      'Formada pelo Rio Preto, é a maior cachoeira do estado do Rio, com '
      || '2 km de extensão e 200 metros de queda. Fica em área de '
      || 'proteção ambiental da Serra da Mantiqueira e é tombada como '
      || 'Patrimônio Natural.',
      'A partir da Vila de Mauá, siga pela estrada de Campo Alegre, '
      || 'cerca de 30 km sempre margeando o Rio Preto.',
      null
    ),
    (
      'Cachoeira do Marimbondo', 'cachoeira-do-marimbondo',
      array['natureza']::attraction_category[],
      'Paraíso em meio à mata, com vista magnífica de todo o vale de '
      || 'Visconde de Mauá.',
      'Siga na estrada Maringá x Mauá e entre na estrada do Vale do '
      || 'Pavão, por aproximadamente 7 km de subida, até uma barreira com '
      || 'dois troncos sinalizando o final. Desça pela trilha sinalizada '
      || 'por aproximadamente 10 minutos: o acesso é um pouco difícil, '
      || 'com trechos íngremes e escorregadios.',
      null
    ),
    (
      'Toca da Raposa', 'toca-da-raposa', array['natureza']::attraction_category[],
      'Bonito cenário, porém pouco visitado.', null, null
    ),
    (
      'Cachoeira do Santuário', 'cachoeira-do-santuario',
      array['natureza']::attraction_category[],
      'Situada em um Parque Ecológico, reúne mais de 20 cachoeiras em '
      || 'meio a mata nativa, com gruta e árvores centenárias.',
      'Acesso mediante taxa de preservação.', null
    ),
    (
      'Prainha', 'prainha-visconde-de-maua', array['natureza']::attraction_category[],
      'Praia de água doce e cristalina no centro da Vila de Visconde de '
      || 'Mauá, ideal para piquenique e para ir com crianças.',
      null, null
    ),
    (
      'Trilha da Pedra Selada', 'trilha-da-pedra-selada',
      array['passeio']::attraction_category[],
      'Caminhada de 4 horas, nível moderado.', null, null
    ),
    (
      'Trilha do Pico das Agulhas Negras', 'trilha-do-pico-das-agulhas-negras',
      array['passeio']::attraction_category[],
      'Caminhada de mais de um dia, nível difícil.',
      'Precisa de guia.', null
    ),
    (
      'Remorini Aventuras', 'remorini-aventuras',
      array['passeio']::attraction_category[],
      'Agência de turismo local com passeios de aventura: boia cross no '
      || 'Rio Preto (descida em botes individuais, em corredeiras leves, '
      || 'moderadas e radicais, restrito ao verão), cachoeirismo (escalada '
      || 'feita em água corrente das cachoeiras) e rapel.',
      null, null
    )
) as item(
  name, slug, categories, description, important_tips, personal_experience
)
where cities.slug = 'visconde-de-maua'
on conflict (slug) do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug in ('ideal_para_familias', 'criancas_pequenas')
where attractions.slug = 'prainha-visconde-de-maua'
on conflict do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'pouco_conhecido'
where attractions.slug in ('toca-da-raposa', 'cachoeira-da-saudade')
on conflict do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'reserva_necessaria'
where attractions.slug in ('rosmarinus', 'restaurante-babel')
on conflict do nothing;
