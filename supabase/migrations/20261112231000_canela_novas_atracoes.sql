-- Canela: novas atrações, todas como rascunho e sem fotos (a autora envia as fotos pessoais depois).
-- A experiência pessoal (personal_experience) fica em branco de propósito.
-- Já existiam e NÃO são recriados: Igreja Matriz de Nossa Senhora de Lourdes (Catedral de Pedra), Vinícola Jolimont e
-- "Parques da Serra: Bondinho Aéreo e Cascata do Caracol" (os Bondinhos Aéreos). O Parque do Caracol é um parque separado
-- (ingresso e entrada próprios, uns 500 m antes dos Parques da Serra), por isso entra como atração nova.
insert into attractions (city_id, name, slug, categories, description, important_tips, average_visit_time, best_time_of_day, best_season, recommended_audience, weather_sensitive, has_air_conditioning, intense_physical_effort, requires_advance_purchase, requires_reservation, latitude, longitude, status)
select c.id, v.name, v.slug, v.cats, v.d, v.tips, v.visit, v.best, v.season, v.aud, v.ws, v.ac, v.eff, v.adv, v.res, v.la, v.lo, v.st::country_status
from cities c cross join (values
($$Space Adventure$$, $$space-adventure-canela$$, array['museu','parque_tematico']::attraction_category[], $$O **Space Adventure** é um parque temático sobre a conquista espacial, com **mais de 270 itens originais** das missões Mercury, Gemini e Apollo, segundo as fontes consultadas. A maioria dos guias indica o endereço na Avenida Ernani Kroeff Fleck, 960, na Vila Suíça, em Canela. O site oficial apresenta o parque como uma atração fixa em dois destinos: Canela (RS) e Balneário Camboriú (SC).

O visitante encontra simuladores, como o do elevador de lançamento e o da decolagem lunar, salas de comando e um planetário (incluído só em alguns tipos de ingresso).

Verifique as informações atualizadas, os horários e os preços no site oficial: https://spaceadventure.com.br$$, $$✓ Os horários divergem entre as fontes (por exemplo, de segunda a quinta das 9h às 18h e de sexta a domingo até as 19h): confirme antes de ir.
✓ Segundo um canal de vendas, os ingressos são válidos por 12 meses e permitem remarcação. Confirme a regra do ingresso que você comprar.
✓ O planetário só entra em alguns tipos de ingresso: veja o que está incluso na compra.
✓ Os preços variam por revendedor e por época: consulte o valor atual no site oficial.
✓ Uma visita leva em média de 1h30 a 2 horas, e o espaço é coberto, então funciona em dias de chuva.
✓ Site oficial: https://spaceadventure.com.br$$, $$1h30 a 2 horas$$, $$Tarde$$, $$O ano todo$$, $$Famílias, adolescentes e quem gosta de ciência$$, false, true, false, false, false, null::numeric, null::numeric, 'draft'),
($$Parque do Caracol$$, $$parque-do-caracol-canela$$, array['natureza','ponto_turistico']::attraction_category[], $$O **Parque do Caracol** é o Parque Estadual do Caracol, em Canela, onde o arroio Caracol despenca em queda livre por **131 metros** pelas rochas basálticas da Serra Geral. Dos cerca de 100 hectares da área, só 25 são abertos ao turismo, e o restante é preservado.

O ingresso dá acesso ao **Mirante da Cascata**, que o site oficial define como a melhor vista da Cascata do Caracol, ao Observatório Torre Araucária, às trilhas entre as araucárias e à programação cultural e musical dos fins de semana. A Estação Sonho Vivo é paga à parte.

O parque é diferente dos **Parques da Serra**, que ficam logo adiante, na mesma estrada, e têm entrada e ingresso próprios.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://parquecaracol.com.br$$, $$✓ O site oficial informa funcionamento das 9h às 19h, com entrada até as 18h, de segunda a sexta e nos fins de semana e feriados.
✓ Os valores mudam por época e por forma de compra, e as fontes consultadas divergem: consulte o preço atual no site oficial. Há descontos para moradores, mas as regras precisam ser confirmadas.
✓ A programação do Sunset no Parque, com música no mirante, está marcada para 14, 21 e 28 de novembro, das 17h às 19h, e é sujeita a alterações.
✓ Leve calçado confortável e agasalho: o parque tem trilhas e o tempo muda rápido na serra.
✓ Se quiser ver a cascata também de cima, veja os [Parques da Serra: Bondinho Aéreo e Cascata do Caracol](https://www.poraquipelomundo.com/brasil/canela/parques-da-serra-canela), que ficam perto, com ingresso separado.
✓ Site oficial: https://parquecaracol.com.br$$, $$2 a 3 horas$$, $$Manhã$$, $$O ano todo, em dias de céu aberto$$, $$Famílias, casais e quem gosta de natureza$$, true, false, true, false, false, null::numeric, null::numeric, 'draft'),
($$Skyglass Canela$$, $$skyglass-canela$$, array['natureza','passeio']::attraction_category[], $$O **Skyglass Canela** é a primeira **plataforma de vidro da América Latina**, no Vale da Ferradura, na Rua Constante Félix Orsolin, 9800, no bairro Caracol, a cerca de 14 km do centro de Canela, em estrada asfaltada. A plataforma fica a **360 metros** do leito do Rio Caí, com vista panorâmica do vale.

O parque também tem o **Abusado**, um passeio que desliza sobre trilhos abaixo da plataforma, o **Memorial do Ferro de Passar**, o Deck Pôr do Sol e uma praça de alimentação. O fim de tarde é um dos momentos mais procurados.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://skyglasscanela.com.br$$, $$✓ O parque abre todos os dias, das 9h30 às 18h, segundo o site oficial. O telefone é (54) 3699-9200.
✓ Pela segurança do vidro, não use botas, saltos finos nem calçados com adornos de metal ou zíperes laterais: prefira tênis ou sandália baixa sem metal.
✓ Chaves, carteiras, bolsas e objetos pontiagudos não podem ir para a plataforma. Há cofres eletrônicos gratuitos, e o regulamento completo está no site.
✓ O acesso é fácil de carro, moto, táxi, aplicativo ou pelo [Bustour Gramado e Canela](https://www.poraquipelomundo.com/brasil/gramado/bustour-gramado-e-canela), e há wi-fi gratuito no parque.
✓ Quem tem medo de altura deve saber que o vidro é transparente: dá para conhecer o parque sem fazer todas as atividades.
✓ Site oficial: https://skyglasscanela.com.br$$, $$1h30 a 2 horas$$, $$Fim de tarde$$, $$O ano todo, em dias de céu aberto$$, $$Casais, famílias e quem gosta de paisagem$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Mundo a Vapor$$, $$mundo-a-vapor-canela$$, array['museu','parque_tematico']::attraction_category[], $$O **Mundo a Vapor** é o parque do sonho dos irmãos Urbani, naturais de Canela, na Avenida Don Luiz Guanella, 1247. Há 35 anos é um cartão-postal da Serra Gaúcha, com **miniaturas a vapor** criadas por Benito e Omar, apresentadas em 10 salas temáticas.

O passaporte inclui a **visita guiada às 10 salas**, um **passeio de trem** no bosque e uma volta na **roda-gigante de 52 metros**, com vista para a serra. A versão VIP inclui a roda-gigante em cabine temática e uma bebida por pessoa.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://mundoavapor.com.br$$, $$✓ O site oficial informa atendimento das 9h às 18h30, e o parque fecha às quartas-feiras.
✓ O passaporte adulto (de 13 a 59 anos) aparece no site oficial a R$ 129, e o especial (crianças de 4 a 12 anos, professores, estudantes, seniores, PCDs e doadores de sangue) a R$ 109. Há ainda o passaporte VIP, e os valores podem mudar: confirme na compra.
✓ A visita é guiada, então chegue no horário e programe de 2 a 3 horas.
✓ O parque fica numa parada do [Bustour Gramado e Canela](https://www.poraquipelomundo.com/brasil/gramado/bustour-gramado-e-canela).
✓ Site oficial: https://mundoavapor.com.br$$, $$2 a 3 horas$$, $$Tarde$$, $$O ano todo$$, $$Famílias com crianças e quem gosta de história$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Alpen Park$$, $$alpen-park-canela$$, array['parque_tematico','passeio']::attraction_category[], $$O **Alpen Park** é um parque de aventura e diversão na Rodovia Arnaldo Opptiz, 901, em Canela. O site oficial divide o ingresso em dois passaportes: o **Passaporte Alpen Park**, com 7 atrações para quem tem a partir de 1,30 m, e o **Passaporte Alpen Kids**, com 5 atrações para crianças de 0,80 m a 1,29 m, com uso ilimitado.

Entre as atrações do parque estão o **Trenó**, o Turbo Drop, o Cine 4D, o Xerife 5D, o bate-bate, o arvorismo, as tirolesas, os quadriciclos, a Torre, o Castelo Kids e o Fogo do Dragão. O site avisa que um trenó monotrilho está em breve.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://alpenpark.com.br$$, $$✓ O parque abre diariamente, das 9h às 17h, segundo o site oficial. O estacionamento custa R$ 30,00.
✓ A altura mínima define qual passaporte vale para cada pessoa: meça as crianças antes de comprar (1,30 m para o Alpen Park, de 0,80 m a 1,29 m para o Alpen Kids).
✓ A compra antecipada pelo site costuma ser mais barata: consulte os valores atuais.
✓ Para o arvorismo, as tirolesas e os quadriciclos, use roupa e calçado fechado confortáveis.
✓ O parque fica numa parada do [Bustour Gramado e Canela](https://www.poraquipelomundo.com/brasil/gramado/bustour-gramado-e-canela).
✓ Site oficial: https://alpenpark.com.br$$, $$Meio período a dia inteiro$$, $$Manhã$$, $$O ano todo$$, $$Famílias com crianças e adolescentes$$, true, false, true, false, false, null::numeric, null::numeric, 'draft'),
($$Parque Terra Mágica Florybal$$, $$parque-terra-magica-florybal-canela$$, array['parque_tematico']::attraction_category[], $$O **Parque Terra Mágica Florybal** fica na RS-466, km 5, no Caracol, em Canela, na estrada para a Cascata do Caracol. Apesar de muita gente chamar de "Florybal de Gramado", ele é de Canela. O parque abriu em 2011, tem cerca de 43 atrações e é o primeiro parque temático de chocolate do Brasil, segundo o próprio site.

Entre as atrações há o **Dinomóvel**, o **Território dos Dinossauros**, a **Mini Fazenda de Cacau**, o Parquinho Up (com bate-bate e mini roda-gigante), o playground, cenários, espetáculos e restaurante com buffet livre. O Cinema 7D, o Voo do Pterodáctilo e o Velociraptor são vendidos à parte no local.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://parqueflorybal.com.br$$, $$✓ O site oficial informa que o parque abre todos os dias do ano, das 9h30 às 16h30, é ao ar livre e tem estacionamento gratuito.
✓ O ingresso pode ser comprado pelo site, na bilheteria, em agências credenciadas e em hotéis parceiros. Algumas atrações não estão no ingresso: veja o que está incluso.
✓ Crianças até 3 anos e 11 meses não pagam, segundo revendedores. Confirme a regra no site.
✓ O espetáculo de Natal "Magicamente Natal" está anunciado de 31 de outubro de 2026 a 20 de janeiro de 2027, no Teatro dos Sonhos (apresentações às 11h30, 14h30 e 15h30, com cerca de 20 minutos). A programação é sazonal: confirme no site.
✓ O site informa transporte gratuito por van mediante solicitação: telefone (54) 3905-3600 ou WhatsApp (54) 8439-1892.
✓ Site oficial: https://parqueflorybal.com.br$$, $$3 a 4 horas$$, $$Manhã$$, $$O ano todo$$, $$Famílias com crianças$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Castelinho Caracol$$, $$castelinho-caracol-canela$$, array['museu','ponto_turistico']::attraction_category[], $$O **Castelinho Caracol** é um museu em uma das primeiras residências de Canela, construída no início do século XX por uma família de descendentes de imigrantes alemães. A casa foi transformada em museu e é mantida pelos descendentes dos moradores que a idealizaram, cercada por um parque onde a natureza envolve o passeio.

A visita é uma viagem no tempo pela história da família e da cidade. O espaço também tem cardápio com receitas tradicionais da família, passadas entre as gerações.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://castelinhocaracol.com.br$$, $$✓ O site oficial informa funcionamento diário, de 9h30 às 13h e de 14h20 às 17h40, com último acesso ao parque às 17h30.
✓ O ingresso pode ser comprado na bilheteria do parque ou online.
✓ O contato é pelo WhatsApp (54) 99999-3208 e pelo e-mail museu@castelinhocaracol.com. A programação é divulgada no Instagram @castelinhocaracoloficial.
✓ Site oficial: https://castelinhocaracol.com.br$$, $$1 a 2 horas$$, $$Tarde$$, $$O ano todo$$, $$Famílias, casais e quem gosta de história$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Estação Campos de Canella$$, $$estacao-campos-de-canella$$, array['ponto_turistico','compras']::attraction_category[], $$A **Estação Campos de Canella** é um complexo turístico no centro de Canela, na Rua Largo Benito Urbani, 77, que revitaliza a antiga estação férrea da cidade. Reúne espaços de cultura e entretenimento, quiosques comerciais, lojas e um centro de gastronomia com pubs, cervejaria e restaurantes.

É um dos lugares mais agradáveis para um passeio a pé no centro, e a entrada é livre. Em alguns domingos do mês, a estação recebe o **Domingo na Estação**, uma feira ao ar livre para artistas e produtores locais.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://www.estacaocanella.com.br$$, $$✓ O site oficial informa funcionamento todos os dias, das 10h às 22h, mas cada loja e restaurante tem horário próprio: confirme antes de ir.
✓ O acesso ao espaço é livre. Nenhuma fonte consultada cita cobrança de ingresso, mas confirme se há atrações pagas no dia.
✓ O contato é o telefone (51) 3376-5155, e há estacionamento, segundo o perfil da cidade.
✓ É uma parada do [Bustour Gramado e Canela](https://www.poraquipelomundo.com/brasil/gramado/bustour-gramado-e-canela) e combina com a [Igreja Matriz de Nossa Senhora de Lourdes (Catedral de Pedra)](https://www.poraquipelomundo.com/brasil/canela/catedral-de-pedra-canela).
✓ Site oficial: https://www.estacaocanella.com.br$$, $$1 a 2 horas$$, $$Fim de tarde e noite$$, $$O ano todo$$, $$Famílias, casais e grupos de amigos$$, true, false, false, false, false, null::numeric, null::numeric, 'draft'),
($$Sonho de Natal de Canela$$, $$sonho-de-natal-de-canela$$, array['passeio','ponto_turistico']::attraction_category[], $$O **Sonho de Natal de Canela** é a festa de fim de ano da cidade, com programação **gratuita e ao ar livre** e mais de 300 apresentações. A **39ª edição** vai de 30 de outubro de 2026 a 10 de janeiro de 2027, e a cerimônia oficial de abertura foi em 7 de novembro, às 20h, em frente à Igreja de Pedra.

O destaque é o espetáculo **Contos da Catedral: O Segredo do Velho Noel**, com a **descida do Papai Noel pelas torres** da Catedral de Pedra, em datas e horários definidos na programação. Também há o Presépio Vivo, o espetáculo itinerante Jingle Melody, a Casa do Papai Noel na Praça João Corrêa, a Aldeia do Sonho (Rua Serafim Dias, atrás da Casa de Pedra), com feira de artesanato, e outras atrações.

O evento é **sazonal**: a programação muda a cada edição e deve ser conferida no site oficial. É realizado pelo Ministério da Cultura e pela Prefeitura Municipal de Canela.

Verifique as informações atualizadas e a programação completa no site oficial: https://sonhodenatal.com.br$$, $$✓ As atrações são gratuitas, mas a programação é sazonal e sujeita a alterações sem aviso: consulte o site oficial e o Instagram @sonhodenataloficial.
✓ O espetáculo na Catedral acontece às 20h30 em datas marcadas (como 7 e 8 de novembro e em fins de semana): confira o calendário. Há versão alternativa, sem alpinistas, em caso de chuva.
✓ Chegue cedo para o espetáculo da Catedral: a praça fica cheia e o estacionamento no centro é difícil.
✓ Leve agasalho: as noites de espetáculo são ao ar livre.
✓ Veja também a [Igreja Matriz de Nossa Senhora de Lourdes (Catedral de Pedra)](https://www.poraquipelomundo.com/brasil/canela/catedral-de-pedra-canela) e o [Natal Luz de Gramado](https://www.poraquipelomundo.com/brasil/gramado/natal-luz-de-gramado), que acontecem na mesma época.
✓ Site oficial: https://sonhodenatal.com.br$$, $$1 a 2 horas por espetáculo$$, $$Noite$$, $$Sonho de Natal (30 de outubro a 10 de janeiro, a cada edição)$$, $$Famílias e casais$$, true, false, false, false, false, null::numeric, null::numeric, 'draft')
) as v(name, slug, cats, d, tips, visit, best, season, aud, ws, ac, eff, adv, res, la, lo, st)
where c.slug='canela'
  and not exists (select 1 from attractions x where x.city_id=c.id and (x.slug=v.slug or lower(x.name)=lower(v.name)));
