-- Florianópolis: cadastro de praias e natureza (todas como rascunho, sem fotos).
-- Praia da Joaquina não entra: já existe como "Praia e Dunas da Joaquina".
-- A experiência pessoal (personal_experience) fica em branco de propósito.
insert into attractions (city_id, name, slug, categories, description, important_tips, average_visit_time, best_time_of_day, best_season, recommended_audience, weather_sensitive, has_air_conditioning, intense_physical_effort, requires_advance_purchase, requires_reservation, latitude, longitude, status)
select c.id, v.name, v.slug, v.cats, v.d, v.tips, v.visit, v.best, v.season, v.aud, v.ws, v.ac, v.eff, v.adv, v.res, v.la, v.lo, v.st::country_status
from cities c cross join (values
($$Praia do Campeche$$, $$praia-do-campeche$$, array['ponto_turistico','natureza','passeio']::attraction_category[], $$A **Praia do Campeche** fica no extremo sul da Ilha de Santa Catarina, a cerca de 15 km do Centro, e tem a **melhor estrutura de apoio da região sul**, com **quiosques e restaurantes** na orla e comércio no bairro. Há trechos movimentados e trechos mais selvagens, de modo que dá para escolher o clima do dia.

Em frente à praia fica a **Ilha do Campeche**, o grande passeio de barco da região. O mar da praia exige atenção de quem vai nadar, e para um banho mais calmo e de águas cristalinas a dica é fazer a travessia até a ilha.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ O estacionamento perto da praia é pago, e os valores variam conforme a temporada: em reportagem sobre o verão de 2026, ficavam entre R$ 50 e R$ 60.
✓ De carro ou de ônibus, o acesso é simples. A corrida de aplicativo do Centro até lá foi estimada entre R$ 30 e R$ 50 na mesma reportagem.
✓ O mar pede atenção para quem vai nadar: observe as condições do dia e a sinalização dos guarda-vidas.
✓ A Ilha do Campeche fica em frente, mas o acesso exige ingresso antecipado e embarcações autorizadas.
✓ Leve protetor solar, água e boné: a orla tem quiosques, mas o sol é forte.$$, $$2 a 4 horas$$, $$Manhã e tarde$$, $$Verão para banho de mar; o ano todo para caminhar$$, $$Famílias, casais e grupos de amigos$$, true, false, false, false, false, -27.685929::numeric, -48.480497::numeric, 'draft'),
($$Ilha do Campeche$$, $$ilha-do-campeche$$, array['ponto_turistico','natureza','passeio']::attraction_category[], $$A **Ilha do Campeche**, em frente à Praia do Campeche, é conhecida como o **Caribe catarinense** pelas águas cristalinas. Além da beleza natural, guarda uma das maiores concentrações de **gravuras rupestres** do litoral brasileiro, com milhares de anos, e por isso é protegida: a visitação é controlada pelo IPHAN, pela Portaria nº 691/2009, e a ilha foi reconhecida como Monumento Natural Municipal em 2025.

O passeio inclui a **travessia de barco**, o **tempo livre na praia da ilha** e as **trilhas guiadas por monitores credenciados**, que contam a história e mostram as inscrições rupestres e a vegetação.

Verifique as informações atualizadas, as regras de visitação e os horários no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ A visitação é limitada por dia (as fontes citam um teto entre 700 e 800 pessoas, conforme a época), então reserve com antecedência.
✓ Segundo a Prefeitura, é preciso um ingresso individual, solicitado antes no site da Prefeitura, sem cobrança, e apresentado com documento de identidade antes da travessia.
✓ Os barcos saem do trapiche da Praia da Armação, com embarque em geral entre 9h e 13h e retorno até por volta das 15h. A travessia leva cerca de 30 minutos.
✓ A travessia custava cerca de R$ 150 por pessoa, ida e volta, em reportagem recente. Confirme o valor atual com a embarcação.
✓ As trilhas são acompanhadas por monitores e pagas à parte, e a situação de cada trilha pode mudar: a Trilha Norte chegou a ser fechada para conservação.
✓ Leve água, protetor solar, boné e lanche, e não deixe lixo na ilha.$$, $$Meio período$$, $$Manhã$$, $$Verão, com mar calmo e dias de sol$$, $$Famílias, casais e grupos de amigos$$, true, false, false, true, true, -27.750961::numeric, -48.502158::numeric, 'draft'),
($$Praia Mole$$, $$praia-mole$$, array['ponto_turistico','natureza','passeio']::attraction_category[], $$A **Praia Mole** é uma das mais conhecidas da ilha e um dos **melhores pontos de surf do Brasil**, que já recebeu etapas de campeonatos mundiais. A faixa de areia é larga, o mar é de ondas, e a orla é mais rústica, com **poucos quiosques**, o que mantém o clima natural.

No costão sul, em dias de vento favorável, é possível ver **parapentes** decolando. Da Mole parte também a trilha curta até a Praia da Galheta, de cerca de 400 metros.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ Há estacionamento pago ao longo da areia e vagas gratuitas nas ruas próximas, segundo guias de viagem.
✓ A orla tem poucos quiosques, então leve água e algo para comer se for ficar muitas horas.
✓ O mar é de ondas, e vale observar a sinalização dos guarda-vidas antes de nadar.
✓ Os voos de parapente dependem do vento, e não há garantia de ver decolagens em qualquer dia.
✓ A trilha para a Praia da Galheta sai da Mole e leva menos de 15 minutos.$$, $$2 a 4 horas$$, $$Manhã e tarde$$, $$Verão para praia; inverno para surf$$, $$Jovens, casais e quem gosta de surf$$, true, false, false, false, false, -27.603433::numeric, -48.437007::numeric, 'draft'),
($$Praia da Galheta$$, $$praia-da-galheta$$, array['ponto_turistico','natureza','passeio']::attraction_category[], $$A **Praia da Galheta** é uma praia pequena e preservada, escondida entre a Praia Mole e a Barra da Lagoa, e só pode ser alcançada **a pé**. Fica dentro do **Parque Municipal da Galheta**, criado em 1990 para proteger a área.

O acesso mais comum é a **trilha curta e fácil a partir da Praia Mole**, de cerca de 400 metros e menos de 15 minutos. Também há trilha a partir da Barra da Lagoa. Como o acesso é a pé, a estrutura é mínima, e a visita é de natureza e silêncio.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ O acesso é só a pé: pela Praia Mole (cerca de 400 metros) ou pela Barra da Lagoa.
✓ Leve água, lanche e protetor solar, e traga o lixo de volta.
✓ A praia ficou conhecida pelo naturismo, mas, segundo informações da Câmara de Vereadores divulgadas em 2024, a prática não é permitida. Confirme a situação antes de ir.
✓ Por ser um parque municipal, vale respeitar a sinalização e a vegetação do entorno.$$, $$2 a 3 horas$$, $$Manhã$$, $$Verão, em dia de sol$$, $$Casais e quem gosta de natureza$$, true, false, false, false, false, -27.593527::numeric, -48.426915::numeric, 'draft'),
($$Barra da Lagoa$$, $$barra-da-lagoa$$, array['ponto_turistico','natureza','passeio']::attraction_category[], $$A **Barra da Lagoa** é uma antiga vila de pescadores construída em torno do **canal que liga a Lagoa da Conceição ao mar**, onde barcos de pesca dividem o espaço com lanchas de passeio. A faixa de praia tem bares e restaurantes, e uma **passarela sobre o canal** leva à Prainha.

Entre os pontos de parada estão o **deck de restaurantes à beira do canal**, com peixes, frutos do mar e moquecas, o **Projeto Tamar**, a poucos passos da praia, e as **trilhas** que saem da vila até a Praia da Galheta e a Praia Mole. Há ainda passeios de barco até a Costa da Lagoa e panorâmicos em direção à Ilha do Campeche.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ Os barcos fazem a ligação com a Costa da Lagoa e com a Lagoa da Conceição, mas confirme horários e valores com os operadores antes de contar com eles.
✓ A passarela sobre o canal leva à Prainha, de onde saem trilhas para a Galheta e a Mole.
✓ O Projeto Tamar fica perto da praia e funciona de quarta a segunda, segundo o site oficial.
✓ Na alta temporada o movimento cresce muito: chegue cedo para estacionar.
✓ Experimente uma refeição à beira do canal, onde ficam restaurantes de peixes e frutos do mar.$$, $$Meio período a dia inteiro$$, $$Manhã e fim de tarde$$, $$Verão e o ano todo$$, $$Famílias, casais e grupos de amigos$$, true, false, false, false, false, -27.574778::numeric, -48.425835::numeric, 'draft'),
($$Praia dos Ingleses$$, $$praia-dos-ingleses$$, array['ponto_turistico','natureza','passeio']::attraction_category[], $$A **Praia dos Ingleses** fica no norte da ilha e tem cerca de 5 km de extensão, com **mar calmo, águas mornas e poucas ondas** em um trecho protegido por uma enseada e pequenas ilhas. O bairro tem **infraestrutura completa**, com supermercados, restaurantes, lojas e muitas opções de hospedagem, e é um dos preferidos dos turistas argentinos.

Além de banho de mar, as **dunas** permitem sandboard e há aluguel de caiaques. Na alta temporada a praia fica bem movimentada.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ Na alta temporada o espaço na areia é disputado: chegue cedo para garantir lugar.
✓ O bairro tem supermercados, restaurantes e lojas, o que facilita para quem fica hospedado por perto.
✓ Há aluguel de caiaques e prática de sandboard nas dunas.
✓ O Água Show Park, parque aquático, fica na SC-403, na região dos Ingleses.
✓ Observe a sinalização dos guarda-vidas e as condições do mar do dia.$$, $$2 a 4 horas$$, $$Manhã e tarde$$, $$Verão$$, $$Famílias e casais$$, true, false, false, false, false, -27.429447::numeric, -48.396534::numeric, 'draft'),
($$Canasvieiras$$, $$canasvieiras$$, array['ponto_turistico','natureza','passeio']::attraction_category[], $$**Canasvieiras** é um dos balneários mais movimentados do norte da ilha, a cerca de 26 km do Centro. A praia tem **mar protegido pela baía, de águas mornas, calmas e rasas**, com temperatura entre 23 e 26 °C no verão, o que agrada às famílias com crianças.

O bairro funciona como uma pequena cidade, com **hospedagem, comércio e serviços** completos e **restaurantes na orla**, de frutos do mar a buffets e lanches, concentrados na parte central. É frequentado por turistas latino-americanos, e muitos estabelecimentos têm atendimento em mais de um idioma. De lá também saem **passeios de escuna**.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ A faixa de areia é curta e fica ainda menor na maré alta, então chegue cedo na alta temporada.
✓ Há posto de guarda-vidas no meio da praia.
✓ Os restaurantes se concentram na parte central da orla, e há muitos ambulantes no verão.
✓ Fica perto de Jurerê Tradicional e da Cachoeira do Bom Jesus, o que ajuda a montar um roteiro pelo norte.
✓ Há passeios de escuna saindo da própria praia.$$, $$2 a 4 horas$$, $$Manhã e tarde$$, $$Verão$$, $$Famílias com crianças$$, true, false, false, false, false, -27.426813::numeric, -48.454791::numeric, 'draft'),
($$Praia da Daniela$$, $$praia-da-daniela$$, array['ponto_turistico','natureza','passeio']::attraction_category[], $$A **Praia da Daniela** tem cerca de 3 km e fica no noroeste da ilha, protegida pela Baía Norte, com **águas limpas e calmas, poucas ondas** e uma faixa de areia com vegetação. É uma boa escolha para famílias com crianças e para quem procura uma praia mais tranquila.

Um trecho chamado **Pontal da Daniela** tem ondas mais fortes, então quem busca mar calmo deve ficar longe dele. A praia também é conhecida como ponto de observação de **golfinhos**.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ De carro, o acesso mais comum é por Jurerê: saindo de Jurerê Internacional, são cerca de 3 km até a entrada do Balneário Daniela.
✓ A pé, dá para chegar pela Praia do Forte, em maré baixa, por um caminho entre as pedras.
✓ O Pontal da Daniela tem ondas mais fortes: prefira outro trecho se o objetivo for mar calmo.
✓ A Fortaleza de São José da Ponta Grossa fica na vizinha Praia do Forte e combina com o passeio.
✓ A estrutura de apoio é simples, então leve água, lanche e protetor solar.$$, $$2 a 4 horas$$, $$Manhã e tarde$$, $$Verão$$, $$Famílias com crianças e casais$$, true, false, false, false, false, -27.448874::numeric, -48.538376::numeric, 'draft'),
($$Praia Brava$$, $$praia-brava$$, array['ponto_turistico','natureza','passeio']::attraction_category[], $$A **Praia Brava** fica no extremo norte da Ilha de Santa Catarina, entre a Lagoinha do Norte e a Praia dos Ingleses, a cerca de 38 km do Centro. É conhecida pelo **mar de ondas** e pelos bancos de areia, que formam um **pico de surf muito consistente**.

As condições costumam ser melhores com ondulação de leste e vento fraco de oeste, e o inverno é a época mais indicada para o surf, enquanto no verão as ondas costumam ser menores. Por ser mais brava, é uma praia para olhar o mar com respeito.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ O mar tem ondas e correntes: observe as condições do dia e a sinalização dos guarda-vidas antes de entrar.
✓ O melhor momento para surfar costuma ser o inverno, com ondulação de leste e vento fraco de oeste.
✓ Confirme as opções de estacionamento e de apoio na chegada.
✓ Fica entre a Lagoinha do Norte e Ingleses, o que permite combinar com outras praias do norte.$$, $$2 a 3 horas$$, $$Manhã$$, $$Inverno para surf; verão para passear$$, $$Surfistas, jovens e casais$$, true, false, false, false, false, -27.397613::numeric, -48.415825::numeric, 'draft'),
($$Lagoinha do Norte$$, $$lagoinha-do-norte$$, array['ponto_turistico','natureza','passeio']::attraction_category[], $$A **Lagoinha do Norte** é uma das praias mais preservadas do norte da ilha, na região de Ponta das Canas, entre a praia de Ponta das Canas e a Praia Brava. A área é conhecida pela **natureza bem conservada** e pelo clima mais reservado, longe do movimento das praias urbanizadas.

É uma boa opção para quem quer passar um dia de praia e caminhada pelo extremo norte da ilha.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ As fontes divergem sobre o acesso (rota por terra ou combinação de trilha e barco), então confirme o caminho atual com um morador ou operador local antes de ir.
✓ A vizinha Ponta das Canas é conhecida pelo mar calmo, pela temperatura amena da água e pela areia branca.
✓ Leve água, lanche e protetor solar, e traga o lixo de volta.
✓ Combina com a Praia Brava e com Ponta das Canas em um roteiro pelo extremo norte.$$, $$Meio período$$, $$Manhã$$, $$Verão, em dia de sol$$, $$Famílias, casais e quem gosta de natureza$$, true, false, false, false, false, -27.390292::numeric, -48.425669::numeric, 'draft'),
($$Praia do Moçambique$$, $$praia-do-mocambique$$, array['ponto_turistico','natureza','passeio']::attraction_category[], $$A **Praia do Moçambique** é a **maior praia contínua da ilha**, com mais de 12 km de extensão segundo parte das fontes, e fica dentro do **Parque Estadual do Rio Vermelho**, em uma zona-núcleo de conservação da Reserva da Biosfera da Mata Atlântica. O cenário é de dunas, vegetação de restinga e areia sem fim.

A praia também recebeu o título de **Reserva Nacional de Surfe**, reconhecimento voltado à proteção das ondas e do ambiente. É um lugar de natureza preservada, para caminhar e olhar o mar.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ Por estar dentro de um parque estadual, a orla tem pouca estrutura: leve água, lanche e protetor solar.
✓ O mar é de ondas, e a praia é conhecida entre surfistas: observe as condições do dia.
✓ A extensão varia conforme a fonte (de 7,5 a 12,5 km), então não conte com um trecho exato para caminhar.
✓ Respeite a sinalização do parque e a vegetação de restinga.$$, $$2 a 4 horas$$, $$Manhã e fim de tarde$$, $$O ano todo$$, $$Casais, surfistas e quem gosta de natureza$$, true, false, false, false, false, -27.524143::numeric, -48.417212::numeric, 'draft'),
($$Praia da Armação$$, $$praia-da-armacao$$, array['ponto_turistico','natureza','passeio']::attraction_category[], $$A **Praia da Armação** é a base do sul da ilha para quem vai à **Ilha do Campeche**: o **trapiche**, administrado pela associação de pescadores locais, é o ponto de partida dos barcos, a cerca de 7 km da ilha. A travessia leva de 40 minutos a uma hora, conforme o barco.

O entorno tem **pousadas, casas de aluguel, bares, restaurantes, supermercados e padarias**. Pela direita da praia, atravessando a barreira de pedras do trapiche, sai o caminho a pé até a **Praia do Matadeiro**, de onde parte também a trilha até a Lagoinha do Leste.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ Os barcos para a Ilha do Campeche saem do trapiche daqui, e a visitação exige ingresso antecipado.
✓ Para ir a pé até o Matadeiro, a caminhada leva cerca de 20 minutos, passando pela barreira de pedras do trapiche.
✓ A região tem hospedagem e comércio, o que facilita para quem passa o dia por aqui.
✓ Observe as condições do mar e a sinalização antes de entrar na água.$$, $$2 a 3 horas$$, $$Manhã$$, $$Verão$$, $$Famílias e casais$$, true, false, false, false, false, -27.736035::numeric, -48.507903::numeric, 'draft'),
($$Praia do Matadeiro$$, $$praia-do-matadeiro$$, array['ponto_turistico','natureza','passeio']::attraction_category[], $$A **Praia do Matadeiro** é uma praia preservada no sul da ilha, **sem acesso por carro**: só se chega a pé, saindo da Praia da Armação. O trajeto atravessa a barreira de pedras do trapiche e segue por uma trilha fácil, em cerca de 20 minutos.

É um bom destino para quem quer **praia e natureza com pouca estrutura**, e também é o ponto de partida da trilha mais longa e panorâmica até a **Lagoinha do Leste**.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ Não há acesso para carros: o caminho é a pé, pela direita da Praia da Armação, em cerca de 20 minutos.
✓ A trilha começa na ponte de pedestres entre a Armação e o Matadeiro, e segue até a Lagoinha do Leste em cerca de 2 a 3 horas, conforme a fonte.
✓ Leve água, lanche e protetor solar, e traga o lixo de volta.
✓ A trilha é pouco usada e pode ficar difícil depois de chuva.$$, $$2 a 3 horas$$, $$Manhã$$, $$Verão, em dia de sol$$, $$Casais e quem gosta de natureza$$, true, false, false, false, false, -27.754367::numeric, -48.498982::numeric, 'draft'),
($$Lagoinha do Leste$$, $$lagoinha-do-leste$$, array['ponto_turistico','natureza','passeio']::attraction_category[], $$A **Lagoinha do Leste** é uma das praias mais selvagens da ilha: **sem estrada**, só se chega a pé ou de barco, o que mantém o cenário preservado, com dunas, uma lagoa de água doce e mar aberto.

O caminho mais usado é a **trilha curta pelo Pântano do Sul**, de cerca de 2,2 km e uma hora de caminhada, com uma subida íngreme de quase 1 km. A rota mais longa parte da Armação e do Matadeiro e leva de 2 a 3 horas. Algumas pessoas fazem o circuito completo, subindo o Morro da Coroa.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ Na praia não há estrutura: leve água e lanche, e traga todo o lixo de volta.
✓ A subida pelo Pântano do Sul é o trecho mais exigente, e a descida pode ficar escorregadia.
✓ Quem tem pouco preparo físico costuma preferir ir e voltar pelo Pântano do Sul.
✓ Na alta temporada, há barcos saindo do Pântano do Sul, mas o desembarque pode ser difícil por causa das ondas.
✓ Evite fazer a trilha completa sozinho e confira o tempo antes de sair.$$, $$Meio período a dia inteiro$$, $$Manhã$$, $$Verão e dias de sol$$, $$Quem gosta de trilha e natureza$$, true, false, true, false, false, -27.772453::numeric, -48.49089::numeric, 'draft'),
($$Praia de Naufragados$$, $$praia-de-naufragados$$, array['ponto_turistico','natureza','passeio']::attraction_category[], $$A **Praia de Naufragados** fica no extremo sul da ilha e só é alcançada por **trilha** ou por **barco**. A caminhada parte da Caieira da Barra do Sul, atravessa dois morros em cerca de 40 a 50 minutos e é bem sinalizada, usada desde a inauguração do **Farol de Naufragados**, em 1861.

Da praia saem trilhas até o farol e as antigas baterias de canhões, e há ainda um caminho menos conhecido em direção à Ponta do Pasto e ao Saquinho. Também é possível voltar de barco até a Caieira, se a volta a pé parecer longa.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ A trilha parte da Caieira da Barra do Sul, e as fontes divergem sobre a extensão (de 2,3 a 4 km), mas todas falam em 40 a 50 minutos.
✓ Um visitante relatou que o farol estava fechado ao público: confirme o acesso antes de ir.
✓ Há barcos saindo da Caieira, e é possível combinar a ida a pé com a volta de barco.
✓ Leve água, lanche e protetor solar: a estrutura na praia é simples.
✓ Use calçado fechado e confirme as condições do tempo antes de sair.$$, $$Meio período$$, $$Manhã$$, $$Verão e dias de sol$$, $$Famílias com crianças maiores, casais e quem gosta de trilha$$, true, false, false, false, false, -27.82813::numeric, -48.56582::numeric, 'draft'),
($$Ribeirão da Ilha$$, $$ribeirao-da-ilha$$, array['ponto_turistico','passeio']::attraction_category[], $$O **Ribeirão da Ilha** é o **segundo distrito mais antigo de Florianópolis**, depois de Santo Antônio de Lisboa, e guarda um **casario açoriano preservado** ao longo do mar. É o grande polo de **ostras** da ilha, com fazendas de cultivo na baía e restaurantes à beira-mar.

Entre as casas citadas estão o **Ostradamus**, em uma plataforma construída sobre o mar, o **Porto do Contrato**, que resgata a arquitetura do antigo porto, o **Rancho Açoriano**, amplo e familiar, com deck para o mar, além de Muqueca da Ilha e Umas & Ostras.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ Alguns restaurantes fecham às segundas ou terças: confirme os dias antes de ir.
✓ O outono e o inverno são épocas boas para visitar o distrito e provar ostras.
✓ Os endereços variam entre as fontes (o Rancho Açoriano aparece em mais de um bairro), então confira no mapa antes de sair.
✓ O passeio combina bem com uma tarde de caminhada pelo casario e pela orla.$$, $$Meio período$$, $$Almoço e tarde$$, $$Outono e inverno; o ano todo$$, $$Famílias, casais e quem gosta de gastronomia$$, false, false, false, false, false, -27.709003::numeric, -48.558608::numeric, 'draft'),
($$Lagoa do Peri$$, $$lagoa-do-peri$$, array['ponto_turistico','natureza','passeio']::attraction_category[], $$A **Lagoa do Peri** é a maior lagoa de água doce da ilha e fica dentro do **Parque Municipal da Lagoa do Peri**, uma área de cerca de 20 km² de Mata Atlântica, no sul de Florianópolis, com acesso fácil pela Avenida Campeche.

O parque tem **estacionamento, lanchonete, banheiros e posto de informações**, além de **áreas de recreação e churrasqueiras**, **trilhas ecológicas** e opções de **caiaque, stand-up paddle e banho na lagoa**. Uma trilha mais longa segue pela margem e entra na mata até o **Sertão do Peri**.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ O acesso é pela Avenida Campeche, e o parque tem estacionamento próprio: confirme se há cobrança.
✓ A trilha até o Sertão do Peri segue pela margem e entra na mata por cerca de uma hora, e visitas aos fins de semana podem exigir agendamento.
✓ É possível alugar caiaques e outros barcos sem motor, e fazer passeios guiados de caiaque.
✓ Leve água, protetor solar e repelente, e siga as regras do parque, que é uma área de proteção.$$, $$Meio período a dia inteiro$$, $$Manhã$$, $$Verão e dias de sol$$, $$Famílias, casais e quem gosta de natureza$$, true, false, false, false, false, -27.732595::numeric, -48.525744::numeric, 'draft')
) as v(name, slug, cats, d, tips, visit, best, season, aud, ws, ac, eff, adv, res, la, lo, st)
where c.slug='florianopolis'
  and not exists (select 1 from attractions x where x.city_id=c.id and (x.slug=v.slug or lower(x.name)=lower(v.name)));
