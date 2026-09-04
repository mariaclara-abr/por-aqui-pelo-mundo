-- Curadoria: Itália (Roma), Alemanha (Berlim), Holanda (Amsterdã), Bélgica
-- (Bruxelas) e Inglaterra (Londres), a partir do roteiro de planejamento da
-- viagem de julho de 2019. Roma já existia como cidade vazia (Itália
-- publicada); Alemanha, Holanda, Bélgica e Inglaterra já existiam como
-- países (rascunho), sem cidades ainda. Nota de curadoria em branco de
-- propósito, para a autora avaliar depois pelo painel /admin/atracoes.

update cities set description =
  'A opção mais confortável para ir do aeroporto Fiumicino ao centro de '
  || 'Roma é com um traslado particular, principalmente em família, com '
  || 'preço a partir de 50 euros. A Ponte Palatino atravessa da região da '
  || 'Roma Imperial (Coliseu, Fórum Romano) para Trastevere, o bairro mais '
  || 'boêmio da cidade e onde estão os melhores happy hours. São '
  || 'consideradas "centro histórico" as regiões da Fonte de Trevi, '
  || 'Coliseu, Fórum Romano, Fórum Imperial, Villa Borghese, Piazza di '
  || 'Spagna e Piazza Navona: áreas mais caras, porém próximas de tudo.'
where slug = 'roma' and description is null;

insert into cities (country_id, name, slug)
select countries.id, 'Berlim', 'berlim'
from countries where countries.slug = 'alemanha'
on conflict (slug) do nothing;

insert into cities (country_id, name, slug)
select countries.id, 'Amsterdã', 'amsterda'
from countries where countries.slug = 'holanda'
on conflict (slug) do nothing;

insert into cities (country_id, name, slug)
select countries.id, 'Bruxelas', 'bruxelas'
from countries where countries.slug = 'belgica'
on conflict (slug) do nothing;

insert into cities (country_id, name, slug)
select countries.id, 'Londres', 'londres'
from countries where countries.slug = 'inglaterra'
on conflict (slug) do nothing;

-- Roma

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
      'Hotel Hiberia', 'hotel-hiberia-roma', array['hotel']::attraction_category[],
      'Hospedagem em Roma.', null
    ),
    (
      'Vaticano', 'vaticano', array['ponto_turistico']::attraction_category[],
      'Cidade-Estado independente e o menor país do mundo, com cerca de '
      || 'mil habitantes, sede da Igreja Católica.',
      null
    ),
    (
      'Museus Vaticanos', 'museus-vaticanos', array['museu']::attraction_category[],
      'Uma das coleções de arte e antiguidades mais importantes do '
      || 'mundo, com dois trajetos possíveis (um mais curto e um mais '
      || 'longo), ambos terminando na Capela Sistina. As obras mais '
      || 'importantes do acervo têm uma plaquinha vermelha "100". Na '
      || 'Pinacoteca, não perca a Virgem de Foligno, de Rafael, e a '
      || 'Deposição da Cruz, de Caravaggio. Na saída, fotografe a '
      || 'Escadaria de Giuseppe Momo, criada em 1932, com duas rampas em '
      || 'espiral que se enroscam sem se cruzar.',
      'No balcão do áudio-guia dá pra pegar o mapinha dos museus, '
      || 'gratuito.'
    ),
    (
      'Capela Sistina', 'capela-sistina', array['museu']::attraction_category[],
      'Construída entre 1473 e 1481, é famosa pela decoração em '
      || 'afrescos pintados pelos maiores artistas do Renascimento, '
      || 'incluindo Michelangelo, que dedicou quase 10 anos ao teto e à '
      || 'parede do altar, com obras como a Criação de Adão e o Juízo '
      || 'Final. É o local oficial do Conclave, onde os cardeais se '
      || 'reúnem para escolher o papa.',
      'Uma porta na saída da capela comunica direto com a Basílica de '
      || 'São Pedro, evitando enfrentar fila de novo: confira se seu '
      || 'ingresso permite esse acesso.'
    ),
    (
      'Praça de São Pedro', 'praca-de-sao-pedro',
      array['ponto_turistico']::attraction_category[],
      'Desenhada no século XVII em estilo clássico e barroco, tem ao '
      || 'centro um obelisco do Antigo Egito de 40 metros de altura, o '
      || 'maior de Roma, erguido no local em 1585 por ordem do Papa '
      || 'Sisto V.',
      'A audiência papal (Missa do Papa) é pública, geralmente às '
      || 'quartas-feiras às 10h, e dura cerca de 2h: chegue com pelo '
      || 'menos 2h de antecedência para garantir lugar.'
    ),
    (
      'Basílica de São Pedro', 'basilica-de-sao-pedro',
      array['ponto_turistico']::attraction_category[],
      'A maior igreja do mundo, com 23.000m² e capacidade para 60.000 '
      || 'pessoas, construída entre 1506 e 1626 no local onde São Pedro '
      || 'foi crucificado, em 64 d.C.; seu túmulo fica na cripta, embaixo '
      || 'do altar principal. Na primeira capela à direita do altar está '
      || 'A Pietà, de Michelangelo, esculpida no século XV. João Paulo II '
      || 'está sepultado na Capela de São Sebastião, segunda à direita '
      || 'da entrada.',
      'A entrada é gratuita, mas precisa agendar com antecedência, e é '
      || 'preciso passar por inspeção de segurança antes de entrar. Vale '
      || 'subir à Cúpula, com 133 metros de altura: são 551 degraus '
      || '(referência: €8) ou 320 degraus pegando o elevador até certo '
      || 'ponto (referência: €10, a melhor opção). Os ingressos da '
      || 'cúpula só são vendidos na hora, sem venda online, na entrada '
      || 'do lado direito da Basílica.'
    ),
    (
      'Jardins do Vaticano', 'jardins-do-vaticano',
      array['natureza']::attraction_category[],
      '32 hectares que ocupam a maior parte da Colina do Vaticano.',
      'A visita é sempre guiada, com 2h de duração. Referência: €32.'
    ),
    (
      'Castelo de Santo Ângelo', 'castelo-de-santo-angelo',
      array['museu', 'ponto_turistico']::attraction_category[],
      'Também conhecido como Mausoléu de Adriano, sua construção '
      || 'começou em 135 e terminou em 139. Ganhou o nome depois que o '
      || 'Papa Gregório I afirmou ter visto um anjo no topo em 590, '
      || 'durante uma epidemia em Roma. Serviu como mausoléu, fortaleza '
      || 'papal e prisão ao longo dos séculos; hoje é um museu com 58 '
      || 'salas. Ficou mundialmente conhecido pelo livro Anjos e '
      || 'Demônios, de Dan Brown. Não deixe de ver o Passetto di Borgo, a '
      || 'passagem elevada de cerca de 800 metros que liga o Vaticano ao '
      || 'castelo, construída em 1277 e usada várias vezes como rota de '
      || 'fuga pelos papas.',
      'Aberto diariamente das 9h às 19h30. Referência: €20,5 adulto, €6 '
      || 'de 0 a 17 anos.'
    ),
    (
      'Coliseu', 'coliseu',
      array['ponto_turistico']::attraction_category[],
      'O maior anfiteatro já construído no mundo, com construção '
      || 'iniciada em 72 d.C. e concluída em 80, com capacidade estimada '
      || 'de 70 mil espectadores. Sediou batalhas de gladiadores, '
      || 'exposições e lutas com animais exóticos, e até batalhas '
      || 'navais, já que os subterrâneos podiam ser cobertos de água. As '
      || 'atividades públicas foram encerradas em 523 d.C. Ao lado fica o '
      || 'Arco de Constantino, que inspirou o Arco do Triunfo de Paris, '
      || 'construído por ordem do Senado Romano para celebrar a vitória '
      || 'do imperador Constantino em 312 e inaugurado em 315.',
      'O ingresso é com hora marcada e dá direito também ao Monte '
      || 'Palatino e ao Fórum Romano (mesma entrada). O ingresso geral '
      || 'inclui a arena principal e o segundo anel; para os andares '
      || 'subterrâneos e o terceiro anel, é preciso comprar um tour '
      || 'guiado à parte. Funciona diariamente das 8h30 até uma hora '
      || 'antes do pôr do sol (em julho, 19h15). Referência: €18 adulto, '
      || '€6,5 criança.'
    ),
    (
      'Fórum Romano e Monte Palatino', 'forum-romano-e-monte-palatino',
      array['ponto_turistico']::attraction_category[],
      'O Palatino é uma das sete colinas de Roma, onde a cidade nasceu: '
      || 'diz a lenda que foi ali que os gêmeos Rômulo e Remo foram '
      || 'amamentados pela loba, e onde os imperadores construíram suas '
      || 'casas. Ao lado, o Fórum Romano era o centro político e '
      || 'comercial da cidade antiga, com a Via Sacra, principal rua onde '
      || 'aconteciam festivais religiosos e desfiles de vitória, '
      || 'passando pelo Arco de Tito, erguido para celebrar a vitória '
      || 'romana sobre os judeus em Jerusalém, em 81 d.C.',
      'Ingresso combinado com o Coliseu (mesma entrada).'
    ),
    (
      'Piazza Venezia', 'piazza-venezia',
      array['ponto_turistico']::attraction_category[],
      'A poucos metros do Coliseu, reúne o Palácio Veneza (que já foi '
      || 'residência papal e hoje é museu) e o imponente Monumento '
      || 'Nazionale a Vittorio Emanuele II, inaugurado em 1911 em '
      || 'homenagem ao rei da Itália unificada.',
      null
    ),
    (
      'Quirinale', 'quirinale',
      array['ponto_turistico']::attraction_category[],
      'Um dos menores bairros do centro de Roma, com a Fontana '
      || 'dell''Acqua Felice (Fonte de Moisés), construída entre 1585 e '
      || '1588 para marcar o fim de um aqueduto romano, e o Palácio do '
      || 'Quirinale, residência oficial do presidente da Itália.',
      null
    ),
    (
      'Piazza Barberini', 'piazza-barberini',
      array['ponto_turistico']::attraction_category[],
      'No meio da praça está a Fontana del Tritone, construída em 1643 '
      || 'em homenagem a Tritão, filho de Netuno na mitologia grega, com '
      || 'tronco de homem e cauda de peixe.',
      null
    ),
    (
      'Fontana di Trevi', 'fontana-di-trevi',
      array['ponto_turistico']::attraction_category[],
      'A maior fonte barroca da Itália, com 26 metros de altura e 20 de '
      || 'largura, começou a ser construída em 1732 e só ficou pronta 30 '
      || 'anos depois, em 1762. Linda de dia e à noite, quando fica '
      || 'iluminada. Ao lado, a pequena La Fontanina degli Innamorati '
      || '(fonte dos namorados) tem água fresca e potável: a lenda diz '
      || 'que casais que bebem juntos dali permanecem sempre fiéis e '
      || 'unidos.',
      'A tradição manda virar de costas para a fonte e jogar uma moeda '
      || 'com a mão direita por cima do ombro esquerdo: diz que dá sorte '
      || 'e garante volta a Roma.'
    ),
    (
      'Piazza Colonna', 'piazza-colonna',
      array['ponto_turistico']::attraction_category[],
      'Rodeada por edifícios imponentes, entre eles o Palácio Chigi '
      || '(sede do governo italiano). No centro está a Coluna de Marco '
      || 'Aurélio, erguida em 193 para celebrar suas vitórias nas '
      || 'Guerras Marcomanas, com uma estátua de bronze de São Paulo no '
      || 'topo desde 1589.',
      null
    ),
    (
      'Piazza Navona', 'piazza-navona',
      array['ponto_turistico']::attraction_category[],
      'Reúne obras barrocas maravilhosas: a Fontana del Moro de um '
      || 'lado, a Fontana del Nettuno do outro, e ao centro a Fontana '
      || 'dei Quattro Fiumi, uma das obras mais belas de Bernini, '
      || 'inaugurada em 1651. O Obelisco Agonale, com 16 metros, é '
      || 'cercado por quatro estátuas que representam os rios Nilo, '
      || 'Ganges, Danúbio e Rio da Prata, símbolos dos quatro '
      || 'continentes conhecidos na época. Em frente fica a igreja de S. '
      || 'Agnese in Agone, exemplo de arquitetura barroca romana.',
      null
    ),
    (
      'Piazza del Popolo', 'piazza-del-popolo',
      array['ponto_turistico']::attraction_category[],
      'Uma das praças mais famosas de Roma, com as igrejas gêmeas de '
      || 'Santa Maria in Montesanto e Santa Maria dei Miracoli, a '
      || 'Basílica de Santa Maria del Popolo (com obras de Caravaggio, '
      || 'como a Crucificação de São Pedro, de 1600), e o Obelisco '
      || 'Flaminio, o mais antigo e o segundo maior da cidade.',
      null
    ),
    (
      'Piazza di Spagna', 'piazza-di-spagna',
      array['ponto_turistico']::attraction_category[],
      'Um dos lugares mais visitados de Roma, com o nome vindo da '
      || 'embaixada da Espanha, que ficava por ali no século XVII. A '
      || 'escadaria monumental, com 135 degraus, dá acesso à Igreja de '
      || 'Trinità dei Monti e é palco do desfile de moda Donne Sotto le '
      || 'Stelle, em meados de julho. No centro da praça está a Fontana '
      || 'della Barcaccia, de Pietro Bernini, concluída em 1627.',
      null
    ),
    (
      'Piazza della Repubblica', 'piazza-della-repubblica',
      array['ponto_turistico']::attraction_category[],
      'Construída durante o desenvolvimento urbanístico depois que Roma '
      || 'virou capital da Itália, é uma das praças mais bonitas da '
      || 'cidade, com a Fonte de Náiades no centro, construída entre '
      || '1870 e 1888. Perto dali fica a Basílica de Santa Maria degli '
      || 'Angeli, desenhada por Michelangelo, a única igreja renascentista '
      || 'de Roma.',
      null
    ),
    (
      'Jardins da Villa Borghese', 'jardins-da-villa-borghese',
      array['natureza']::attraction_category[],
      'Parque cheio de verde, com fontes, estátuas e até um zoológico, '
      || 'ótimo para crianças. Abriga a Galleria Borghese, um dos museus '
      || 'de arte mais importantes da Itália, num pequeno palacete de '
      || 'dois andares que pertenceu à família Borghese.',
      'Para percorrer toda a extensão do parque, vale alugar bicicletas '
      || 'motorizadas.'
    )
) as item(name, slug, categories, description, important_tips)
where cities.slug = 'roma'
on conflict (slug) do nothing;

-- Berlim

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
      'Ap do Eduardo', 'ap-do-eduardo-berlim', array['hotel']::attraction_category[],
      'Hospedagem no bairro Prenzlauer Berg (Pappelallee 58, Attic in '
      || 'the Middle), perto do antigo aeroporto de Tegel.',
      null
    ),
    (
      'Palácio do Reichstag', 'palacio-do-reichstag',
      array['ponto_turistico']::attraction_category[],
      'Sede do parlamento alemão, com dimensões monumentais e rica '
      || 'história: em 1918, o político Philipp Scheidemann proclamou a '
      || 'República da Alemanha de uma de suas janelas, e em 1933 um '
      || 'incêndio no prédio foi usado como pretexto pelos nazistas para '
      || 'perseguir opositores.',
      'A cúpula e o terraço são abertos à visitação, com áudio guia '
      || 'disponível em português, mas é preciso agendar com '
      || 'antecedência pelo site do Bundestag.'
    ),
    (
      'Portão de Brandemburgo', 'portao-de-brandemburgo',
      array['ponto_turistico']::attraction_category[],
      'Um dos cartões-postais mais famosos de Berlim, dava acesso à '
      || 'cidade quando ela ainda era cercada por muralhas. Inaugurado '
      || 'em 1791, é um símbolo do triunfo da paz sobre as armas: uma '
      || 'construção neoclássica de 26 metros de altura que lembra a '
      || 'Acrópole de Atenas.',
      null
    ),
    (
      'Holocaust-Denkmal (Memorial aos Judeus Mortos na Europa)', 'holocaust-denkmal',
      array['ponto_turistico']::attraction_category[],
      'Área com 2.711 blocos de concreto em homenagem aos mais de seis '
      || 'milhões de judeus exterminados pelos nazistas na Segunda '
      || 'Guerra Mundial.',
      'Embaixo do memorial fica o "Local da Informação", um museu sobre '
      || 'a história do Holocausto, com visita gratuita.'
    ),
    (
      'Gendarmenmarkt', 'gendarmenmarkt',
      array['ponto_turistico']::attraction_category[],
      'Considerada por muitos a praça mais bonita de Berlim, reúne a '
      || 'Casa de Concertos no centro e as Catedrais Francesa (1705) e '
      || 'Alemã (1708), praticamente idênticas, uma de cada lado. No '
      || 'centro há uma estátua do poeta Friedrich Schiller, inaugurada '
      || 'em 1871.',
      null
    ),
    (
      'Berliner Dom', 'berliner-dom',
      array['ponto_turistico']::attraction_category[],
      'A imponente Catedral de Berlim, construída entre 1895 e 1905, '
      || 'uma das construções mais fotografadas da cidade.',
      'A cúpula pode ser visitada: são 270 degraus até o topo, '
      || 'recompensados com uma vista deslumbrante. Referência: €7 '
      || 'adulto.'
    ),
    (
      'Berliner Fernsehturm (Torre de TV)', 'berliner-fernsehturm',
      array['ponto_turistico']::attraction_category[],
      'Com 368 metros de altura, é a construção mais alta da Alemanha e '
      || 'se destaca no horizonte de Berlim. A esfera abriga uma '
      || 'plataforma panorâmica a 203 metros de altura, com vista de 360 '
      || 'graus, e o restaurante Telecafé.',
      'Referência: €24 adulto, €16 criança.'
    ),
    (
      'Rotes Rathaus (Prefeitura Vermelha)', 'rotes-rathaus',
      array['ponto_turistico']::attraction_category[],
      'Um dos cartões-postais de Berlim, sede da prefeitura e da câmara '
      || 'de vereadores. Em frente fica a Neptunbrunnen, uma das fontes '
      || 'mais antigas da cidade, inaugurada em 1891, com o deus romano '
      || 'Netuno no centro cercado por quatro mulheres que representam '
      || 'os rios Reno, Elba, Vístula e Oder.',
      null
    ),
    (
      'Muro de Berlim', 'muro-de-berlim',
      array['ponto_turistico']::attraction_category[],
      'Construído em 1961 pela Alemanha Oriental para separar Berlim '
      || 'Ocidental da Oriental, tinha 66,5 km de extensão e separou '
      || 'famílias e amigos por quase três décadas. Foi derrubado pela '
      || 'própria população em 1989, mas só começou a ser oficialmente '
      || 'demolido em 1990.',
      'Dois trechos remanescentes podem ser visitados: a East Side '
      || 'Gallery, maior seção preservada, com cerca de 2km '
      || 'transformados em galeria de arte a céu aberto, e a Topografia '
      || 'do Terror, com 200m de muro no formato mais original, ao lado '
      || 'de um museu sobre os horrores praticados pela Gestapo, que '
      || 'tinha sede ali.'
    ),
    (
      'Checkpoint Charlie', 'checkpoint-charlie',
      array['ponto_turistico']::attraction_category[],
      'Antigo posto militar na fronteira entre Berlim Ocidental e '
      || 'Oriental durante a Guerra Fria, usado para controlar a '
      || 'passagem de membros das Forças Aliadas e diplomatas '
      || 'estrangeiros. Removido em 1990 com a reunificação alemã, a '
      || 'cabine original está hoje no Museu dos Aliados, em '
      || 'Zehlendorf; uma reprodução foi colocada no local original em '
      || '2000.',
      null
    ),
    (
      'Potsdamer Platz', 'potsdamer-platz',
      array['ponto_turistico']::attraction_category[],
      'Praça com prédios supermodernos construídos após a queda do '
      || 'Muro de Berlim, em 1989, com trechos do muro ainda de pé e a '
      || 'marca no chão de onde ele passava pela cidade.',
      null
    ),
    (
      'Gedächtniskirche', 'gedachtniskirche',
      array['ponto_turistico']::attraction_category[],
      'Conhecida como "a igreja quebrada", é uma das atrações mais '
      || 'famosas de Berlim: sua torre, muito danificada por '
      || 'bombardeios na Segunda Guerra, nunca foi restaurada, e virou '
      || 'um símbolo da destruição causada pela guerra.',
      null
    )
) as item(name, slug, categories, description, important_tips)
where cities.slug = 'berlim'
on conflict (slug) do nothing;

-- Amsterdã

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
      'Hotel Amsterdam Kattenburg', 'hotel-amsterdam-kattenburg',
      array['hotel']::attraction_category[],
      'Hospedagem em Amsterdã.', null
    ),
    (
      'Coffeeshops de Amsterdã', 'coffeeshops-de-amsterda',
      array['passeio']::attraction_category[],
      'A maconha é tolerada em Amsterdã, mas não é legalizada. Os '
      || 'coffeeshops são os lugares certos para fumar ou experimentar '
      || 'produtos feitos com maconha: entre os mais famosos estão o '
      || 'Greenhouse Coffeeshop (Oudezijds Voorburgwal 191), o The '
      || 'Grasshopper Coffeeshop (Oudebrugsteeg 16) e o Amnesia '
      || '(Herengracht 133).',
      'Cafés, na Holanda, são pubs e bares comuns; quem serve café e '
      || 'comida "sem tempero" (sem maconha) são os koffiehuis.'
    ),
    (
      'Estação Central de Amsterdã', 'estacao-central-de-amsterda',
      array['ponto_turistico']::attraction_category[],
      'Estação com mais de 120 anos e arquitetura linda, ótimo ponto de '
      || 'partida para caminhar pela cidade.',
      null
    ),
    (
      'Red Light District', 'red-light-district-amsterda',
      array['ponto_turistico']::attraction_category[],
      'Mesmo de dia dá pra conhecer o local e entender como funciona: '
      || 'apesar da fama, é cheio de turistas, famílias e casais de '
      || 'todas as idades. Fica bem perto da Estação Central, de onde '
      || 'chegam trens do aeroporto e de outros países, o que faz dele '
      || 'um dos primeiros pontos turísticos da viagem por Amsterdã. '
      || 'Muitos coffeeshops que vendem produtos com maconha (legalizada '
      || 'na Holanda) já estão abertos por ali durante o dia.',
      null
    ),
    (
      'Dam Square e Palácio Real', 'dam-square-e-palacio-real',
      array['ponto_turistico']::attraction_category[],
      'Praça com wi-fi grátis, cercada pelo Museu Madame Tussauds e '
      || 'pela De Bijenkorf, a maior loja de departamentos da Holanda, '
      || 'além de bares, restaurantes e cafés agradáveis ao redor.',
      'Da praça dá pra sair num passeio de barco para conhecer a '
      || 'cidade.'
    ),
    (
      'Mercado Albert Cuyp', 'mercado-albert-cuyp',
      array['compras']::attraction_category[],
      'O mercado de rua mais famoso de Amsterdã, no bairro De Pijp, um '
      || 'dos mais descolados da cidade, com de tudo, de alimentos a '
      || 'eletrônicos.',
      'Não abre aos domingos: se seu dia livre em Amsterdã cair num '
      || 'domingo, troque esse passeio por um museu.'
    ),
    (
      'Heineken Experience', 'heineken-experience',
      array['passeio']::attraction_category[],
      'Fábrica da marca de cervejas, com todo o processo de produção à '
      || 'mostra e degustação no fim do passeio, faz parte da cultura '
      || 'holandesa. Fica bem perto do Mercado Albert Cuyp.',
      'A experiência dura cerca de duas horas.'
    ),
    (
      'Anne Frank House', 'anne-frank-house',
      array['museu']::attraction_category[],
      'Museu biográfico fundado em 1960, no mesmo local onde Anneliese '
      || '"Anne" Frank viveu escondida do regime nazista por dois anos, '
      || 'junto com os pais, a irmã e mais quatro pessoas. Foi ali que '
      || 'Anne escreveu, a partir de 1942, o famoso diário relatando a '
      || 'vida escondida e os horrores da guerra. O esconderijo foi '
      || 'descoberto em 1944, e só o pai da menina, Otto Frank, '
      || 'sobreviveu aos campos de concentração.',
      null
    ),
    (
      'Vondelpark', 'vondelpark',
      array['natureza']::attraction_category[],
      'O maior e mais popular parque de Amsterdã, sempre cheio de '
      || 'turistas e moradores passeando com animais, praticando '
      || 'esportes, lendo ou tomando sol. No verão tem programação '
      || 'extensa de música e teatro.',
      'Com bom tempo, vale um piquenique num dos gramados ou uma '
      || 'cerveja holandesa num dos bares locais.'
    ),
    (
      'Letreiro I Amsterdam', 'letreiro-i-amsterdam',
      array['ponto_turistico']::attraction_category[],
      'O letreiro original foi retirado do Museumplein em dezembro de '
      || '2018, mas ainda dá pra tirar foto com ele em outros lugares: '
      || 'no Aeroporto Schiphol, logo na saída onde ficam táxis e '
      || 'ônibus, e no Lago Sloterplas, na zona oeste (onde, por ser uma '
      || 'pista externa de corrida e parkour, algumas letras ficam na '
      || 'vertical, dificultando a foto). Também existe uma versão '
      || 'itinerante, montada em diferentes pontos da cidade conforme o '
      || 'evento do momento.',
      null
    ),
    (
      'Museumplein', 'museumplein',
      array['museu']::attraction_category[],
      'A praça dos museus de Amsterdã, reunindo o Van Gogh Museum, o '
      || 'Stedelijk Museum, o Palácio Real e o Rijksmuseum.',
      null
    )
) as item(name, slug, categories, description, important_tips)
where cities.slug = 'amsterda'
on conflict (slug) do nothing;

-- Bruxelas

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
      'Vatel Bakery', 'vatel-bakery',
      array['cafe']::attraction_category[],
      'Point de waffles, a atração mais famosa da cidade para o café '
      || 'da manhã: o que vendem ali é super famoso e uma delícia.',
      null
    ),
    (
      'Grand Place', 'grand-place',
      array['ponto_turistico']::attraction_category[],
      'Praça central de Bruxelas, cercada pela Prefeitura e pela '
      || 'Breadhouse (Casa Real), com edifícios públicos e privados que '
      || 'datam do final do século XVII. É Patrimônio Mundial da UNESCO '
      || 'desde 1998. Numa viela que sai dali, na esquina da rue de '
      || 'l''Étuve com a rue du Chêne, está o Manneken Pis, a estátua do '
      || 'menino fazendo xixi que virou o símbolo da cidade, '
      || 'representando o espírito rebelde e desafiador dos '
      || 'bruxelenses.',
      'A região ao redor do Manneken Pis reúne ótimas lojas de '
      || 'chocolate belga e de waffles.'
    ),
    (
      'Fritland', 'fritland',
      array['restaurante']::attraction_category[],
      'O point mais famoso para as batatinhas fritas belgas, servidas '
      || 'em cones.',
      null
    ),
    (
      'Delirium', 'delirium-bruxelas',
      array['restaurante']::attraction_category[],
      'O bar de cerveja mais famoso da Bélgica, perto da Grand Place, '
      || 'com 2.000 rótulos para escolher.',
      null
    ),
    (
      'Basílica Nacional do Sagrado Coração', 'basilica-nacional-do-sagrado-coracao',
      array['ponto_turistico']::attraction_category[],
      'A quinta maior basílica católica do mundo, em Koekelberg, '
      || 'dedicada ao Sagrado Coração e inspirada na Basilique du '
      || 'Sacré-Coeur de Paris.',
      null
    ),
    (
      'Mini Europa', 'mini-europa',
      array['passeio']::attraction_category[],
      'Parque com reproduções realistas de monumentos e símbolos '
      || 'espalhados pela Europa, como a Torre Eiffel, o Parthenon, o '
      || 'Palácio de Westminster, o Arco do Triunfo, a Torre de Pisa e o '
      || 'Coliseu.',
      null
    ),
    (
      'Atomium', 'atomium',
      array['ponto_turistico']::attraction_category[],
      'Criado em 1958 para a Feira Mundial de Bruxelas, é uma estrutura '
      || 'de 103 metros que representa uma molécula de ferro ampliada '
      || '165 milhões de vezes, um símbolo de Bruxelas assim como a '
      || 'Torre Eiffel é de Paris. Tem exposições temporárias e '
      || 'permanentes, loja de souvenirs, e o letreiro da cidade logo na '
      || 'frente.',
      null
    ),
    (
      'Torre Japonesa e Pavilhão Chinês', 'torre-japonesa-e-pavilhao-chines',
      array['museu']::attraction_category[],
      'Dois prédios erguidos no início do século XX, depois de o Rei '
      || 'Leopoldo II se encantar com a coleção oriental da World Fair '
      || 'de 1889 (a mesma exposição de Paris que exibiu a Torre '
      || 'Eiffel), abrigam importantes coleções de arte e porcelana dos '
      || 'séculos XVIII e XIX.',
      null
    ),
    (
      'Royal Castle of Laeken', 'royal-castle-of-laeken',
      array['ponto_turistico']::attraction_category[],
      'Residência oficial do Rei dos Belgas e da família real, cercada '
      || 'por um enorme jardim protegido por uma muralha de quilômetros '
      || 'de comprimento.',
      null
    ),
    (
      'Parque do Cinquentenário', 'parque-do-cinquentenario',
      array['natureza']::attraction_category[],
      'Encomendado em 1880 pelo Rei Leopoldo I para a Exposição '
      || 'Nacional em comemoração aos 50 anos da independência da '
      || 'Bélgica, reúne beleza, tranquilidade e vários museus.',
      null
    ),
    (
      'Palácio Real de Bruxelas', 'palacio-real-de-bruxelas',
      array['ponto_turistico']::attraction_category[],
      'Construído em 1780, é a sede oficial da monarquia belga.',
      'Em frente fica o Parque de Bruxelas, que vale a visita.'
    ),
    (
      'Igreja Notre Dame du Sablon', 'igreja-notre-dame-du-sablon',
      array['ponto_turistico']::attraction_category[],
      'Igreja do século XV em estilo gótico, chama atenção pela '
      || 'imponência e riqueza de detalhes, com destaque para os '
      || 'vitrais.',
      null
    )
) as item(name, slug, categories, description, important_tips)
where cities.slug = 'bruxelas'
on conflict (slug) do nothing;

-- Londres

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
      'Pullman London', 'pullman-london', array['hotel']::attraction_category[],
      'Hospedagem em Londres.', null
    ),
    (
      'British Museum', 'british-museum',
      array['museu']::attraction_category[],
      'Acervo com objetos de todo o mundo, separado por continentes.',
      'Entrada gratuita.'
    ),
    (
      'St. Paul''s Cathedral', 'st-pauls-cathedral',
      array['ponto_turistico']::attraction_category[],
      'Dedicada a São Paulo, está no mesmo lugar há mais de 1.400 anos, '
      || 'com a fachada atual datando da segunda metade do século XVII. '
      || 'Foi o local de casamento do Príncipe Charles com a Princesa '
      || 'Diana, tem a segunda maior cúpula do mundo e uma cripta '
      || 'extensa, onde está sepultado, entre outros, Alexander Fleming, '
      || 'ganhador do Nobel pela descoberta da penicilina.',
      'A visita é autoguiada, com mapinha fornecido na entrada. '
      || 'Fotografias não são permitidas dentro da igreja.'
    ),
    (
      'Torre de Londres', 'torre-de-londres',
      array['ponto_turistico']::attraction_category[],
      'Castelo histórico fundado por volta de 1066, após a conquista '
      || 'normanda da Inglaterra. Serviu inicialmente como residência '
      || 'real e depois como prisão, entre 1100 e 1952.',
      null
    ),
    (
      'Tower Bridge', 'tower-bridge',
      array['ponto_turistico']::attraction_category[],
      'Ponte-báscula sobre o rio Tâmisa, inaugurada em 1894, uma das '
      || 'pontes mais famosas e visitadas do mundo, ao lado da Torre de '
      || 'Londres.',
      null
    ),
    (
      'London Eye', 'london-eye',
      array['ponto_turistico']::attraction_category[],
      'A vista lá de cima é linda.',
      'Compre o ingresso com antecedência, pela internet, para evitar '
      || 'quase toda a fila, indo direto pela fila preferencial.'
    ),
    (
      'Big Ben (Elizabeth Tower)', 'big-ben-elizabeth-tower',
      array['ponto_turistico']::attraction_category[],
      'O sino que dá nome à torre do relógio do parlamento britânico, à '
      || 'beira do Tâmisa, uma das marcas registradas mais famosas de '
      || 'Londres, em estilo neogótico, com 96 metros de altura. '
      || 'Construído entre 1840 e 1860, tem o segundo maior relógio de '
      || 'quatro faces do mundo (o primeiro é o da prefeitura de '
      || 'Minneapolis, nos Estados Unidos).',
      null
    ),
    (
      'Piccadilly Circus', 'piccadilly-circus',
      array['ponto_turistico']::attraction_category[],
      'Praça charmosa, cruzamento de diversas ruas, uma das zonas mais '
      || 'movimentadas da capital britânica.',
      null
    ),
    (
      'Trafalgar Square', 'trafalgar-square',
      array['ponto_turistico']::attraction_category[],
      'O coração de Londres, palco de eventos, concertos e '
      || 'celebrações, como o Ano Novo Chinês, o dia de St. Patrick e a '
      || 'parada do orgulho gay, além de protestos e manifestações.',
      null
    ),
    (
      'Buckingham Palace', 'buckingham-palace',
      array['ponto_turistico']::attraction_category[],
      'A casa da rainha.',
      'A Troca da Guarda acontece às 11h, mas a movimentação dos '
      || 'guardas terminando o turno já começa por volta das 10h30. '
      || 'Todo verão o palácio abre os State Rooms para visitação, só '
      || 'com ingresso.'
    ),
    (
      'National Gallery', 'national-gallery',
      array['museu']::attraction_category[],
      'Museu espetacular na Trafalgar Square.',
      null
    ),
    (
      'M&M''s World', 'mms-world-londres',
      array['compras']::attraction_category[],
      'Loja com uma infinidade de tubos de confeitos separados por '
      || 'cores, visualmente chamativa e com cheiro maravilhoso.',
      'Os preços são bem salgados.'
    ),
    (
      'Science Museum', 'science-museum-londres',
      array['museu']::attraction_category[],
      'Várias exibições diferentes, incluindo a galeria Exploring '
      || 'Space, sobre a ida do homem à Lua e outras missões espaciais '
      || '(com um módulo da Apollo 10), e a Making the Modern World, com '
      || '250 anos de evolução da indústria através de objetos com '
      || 'impacto direto no dia a dia. Outras galerias cobrem '
      || 'Matemática, Medicina, Aviação, Genética e relógios.',
      'Entrada gratuita.'
    ),
    (
      'Natural History Museum', 'natural-history-museum-londres',
      array['museu']::attraction_category[],
      'Prédio maravilhoso, com três entradas (uma moderna e duas na '
      || 'parte mais antiga). Pela entrada moderna, uma escada rolante '
      || 'atravessa um planeta até a zona vermelha, sobre vulcões e '
      || 'terremotos, e a zona azul, com dinossauros e grandes '
      || 'mamíferos. O Hintze Hall é o lugar mais lindo do museu, com um '
      || 'esqueleto inteiro de baleia azul pendurado no teto.',
      'Entrada gratuita. Não há mapa grátis na entrada, mas dá pra '
      || 'baixar um online.'
    ),
    (
      'Westminster Abbey', 'westminster-abbey',
      array['ponto_turistico']::attraction_category[],
      'Grande abadia em estilo gótico, construída no século XI e '
      || 'reformada entre os séculos XIII e XIV, considerada a igreja '
      || 'mais importante de Londres. É o local tradicional de coroação '
      || 'e sepultamento dos monarcas britânicos, e já foi palco de 16 '
      || 'casamentos reais, incluindo o da Rainha Elizabeth com Philip '
      || 'Mountbatten em 1946 e o do Príncipe William com Kate '
      || 'Middleton em 2011.',
      null
    ),
    (
      'Palácio de Westminster', 'palacio-de-westminster',
      array['ponto_turistico']::attraction_category[],
      'Também conhecido como Casas do Parlamento, é um dos maiores '
      || 'parlamentos do mundo, na margem norte do Tâmisa, com mais de '
      || '1.000 salas, 100 escadarias e 5 km de corredores. A maior '
      || 'parte da construção atual data do século XIX.',
      null
    ),
    (
      'Caminhada pela margem do Rio Tâmisa', 'caminhada-margem-rio-tamisa',
      array['passeio']::attraction_category[],
      'Da London Eye, uma caminhada calma pela margem do Tâmisa passa '
      || 'pela linda Hay''s Galleria, com várias lanchonetes '
      || 'climatizadas, e mantém a Tower Bridge sempre na paisagem a '
      || 'partir de certo ponto. No caminho também dá pra ver o '
      || 'navio-museu HMS Belfast, um cruzador usado na Segunda Guerra '
      || 'Mundial, com prédios históricos e modernos se misturando na '
      || 'paisagem.',
      null
    ),
    (
      'Passeio Harry Potter (King''s Cross Station)', 'passeio-harry-potter-kings-cross',
      array['passeio']::attraction_category[],
      'A King''s Cross Station era só mais uma estação ferroviária de '
      || 'Londres até virar cenário da cena em que Harry Potter embarca '
      || 'para Hogwarts na lendária Plataforma 9¾. A administração da '
      || 'estação recriou a plataforma, com uma plaquinha indicativa e '
      || 'um carrinho de bagagem "entrando na parede", simulando o '
      || 'momento do filme.',
      null
    ),
    (
      'Hamleys Toy Shop', 'hamleys-toy-shop',
      array['compras']::attraction_category[],
      'Uma das maiores lojas de brinquedo do mundo, com 7 andares e '
      || '5.000 m², recebendo cerca de 5 milhões de visitantes por ano: '
      || 'uma das atrações turísticas mais conhecidas de Londres.',
      null
    ),
    (
      'Passeio de ônibus Hop-on-Hop-off', 'passeio-onibus-hop-on-hop-off-londres',
      array['passeio']::attraction_category[],
      'Veja as atrações de Londres confortavelmente sentado, '
      || 'aproveitando os marcos icônicos da cidade pelas ruas.',
      null
    ),
    (
      'Thames River Boat Cruise', 'thames-river-boat-cruise',
      array['passeio']::attraction_category[],
      'Cruzeiro pelo Tâmisa em barco moderno preparado para todos os '
      || 'climas, com convés superior aberto e salões inferiores '
      || 'espaçosos com janelas panorâmicas.',
      null
    ),
    (
      'Kensington Palace', 'kensington-palace',
      array['ponto_turistico']::attraction_category[],
      'Uma das residências reais da Inglaterra, usada pela família real '
      || 'desde o século XVII, construída em tijolo vermelho e '
      || 'reformada em 1689. Já abrigou diferentes gerações da realeza, '
      || 'de Guilherme III à Lady Diana, e hoje ainda é moradia de '
      || 'duques e duquesas, como William e Kate.',
      null
    ),
    (
      'Hampton Court Palace', 'hampton-court-palace',
      array['ponto_turistico']::attraction_category[],
      'Antigo lar do Rei Henrique VIII, que ampliou e desenvolveu o '
      || 'palácio depois de adquiri-lo nos anos 1520, mobiliado com '
      || 'tapeçarias e pinturas fabulosas ao longo de gerações reais. '
      || 'Espalhado por 60 acres de jardins formais, com um famoso '
      || 'labirinto e a Great Vine.',
      null
    ),
    (
      'Windsor Castle', 'windsor-castle',
      array['ponto_turistico']::attraction_category[],
      'O maior e mais antigo castelo ainda ocupado do mundo, construído '
      || 'há mais de 900 anos, com o piso cobrindo 44.593 m², cercado '
      || 'por lindos jardins. A Capela de St George, dentro do castelo, '
      || 'é um ótimo exemplo de arquitetura gótica, com destaque para a '
      || 'tumba de Henrique VIII.',
      null
    ),
    (
      'Estádio Wembley', 'estadio-wembley',
      array['ponto_turistico']::attraction_category[],
      'O estádio nacional da Inglaterra, no subúrbio de Wembley Park.',
      null
    ),
    (
      'Estádio Stamford Bridge', 'estadio-stamford-bridge',
      array['ponto_turistico']::attraction_category[],
      'No centro de Londres, é a sede do Chelsea Football Club.',
      null
    ),
    (
      'Estádio Emirates', 'estadio-emirates',
      array['ponto_turistico']::attraction_category[],
      'A atual casa do Arsenal.',
      null
    ),
    (
      'Greenwich', 'greenwich',
      array['ponto_turistico']::attraction_category[],
      'Um dos bairros preferidos em Londres, com atrações bacanas, '
      || 'excelentes restaurantes, cafés e pubs, um belíssimo mercado de '
      || 'rua, lojas originais bem legais, um parque maravilhoso e uma '
      || 'vista incrível da cidade.',
      null
    )
) as item(name, slug, categories, description, important_tips)
where cities.slug = 'londres'
on conflict (slug) do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'gratuito'
where attractions.slug in (
  'british-museum', 'science-museum-londres', 'natural-history-museum-londres'
)
on conflict do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'imperdivel'
where attractions.slug in (
  'coliseu', 'fontana-di-trevi', 'big-ben-elizabeth-tower'
)
on conflict do nothing;

insert into attraction_tags (attraction_id, tag_id)
select attractions.id, tags.id
from attractions
join tags on tags.slug = 'reserva_necessaria'
where attractions.slug in (
  'basilica-de-sao-pedro', 'palacio-do-reichstag', 'jardins-do-vaticano',
  'london-eye', 'buckingham-palace'
)
on conflict do nothing;

insert into travel_tips (category, title, content, "order")
values
  (
    'Europa',
    'Fuso horário nesta viagem',
    'Berlim, Amsterdã, Bruxelas e Roma ficam 5 horas à frente do '
    || 'horário de Brasília. Londres fica só 4 horas à frente.',
    1
  )
on conflict do nothing;
