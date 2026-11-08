-- Dicas reforçadas com regras oficiais: imposto de venda da Flórida (Florida Department of Revenue) e cota de isenção da Receita Federal. Cirque: local e estacionamento no Disney Springs.
update attractions a set important_tips = v.tips
from (values
($$walmart$$, $$✓ Confira no site ou no aplicativo qual unidade fica mais perto de onde você vai ficar.
✓ Muitas lojas têm farmácia, ótica e seção de eletrônicos, mas os serviços variam de unidade para unidade.
✓ Vale levar sacolas reutilizáveis para as compras de supermercado.
✓ Itens de uso nos parques, como poncho de chuva, garrafa e lanches, costumam ter preço menor aqui do que dentro dos parques.
✓ Em dias de fim de semana e à noite, o movimento aumenta. Para compras tranquilas, prefira a manhã.
✓ Na Flórida, alimentos para preparar em casa, como frutas, carnes e pães, não pagam imposto de venda. Comida pronta e bebidas alcoólicas pagam.
✓ O preço da etiqueta não inclui o imposto: na Flórida, o imposto de venda (6% estadual mais o adicional do condado) é somado só no caixa.
✓ Na volta ao Brasil, a cota de isenção da Receita Federal é de US$ 1.000 por pessoa em viagem aérea, e o excedente paga 50% de imposto. Guarde as notas fiscais.$$),
($$target$$, $$✓ Baixe o aplicativo da Target antes de ir: ele mostra ofertas, cupons e a disponibilidade dos produtos na unidade.
✓ Muitas lojas têm Starbucks dentro, uma boa pausa durante as compras.
✓ As promoções mudam com frequência, então vale conferir os cartazes no início dos corredores.
✓ Na Flórida, alimentos para preparar em casa, como frutas, carnes e pães, não pagam imposto de venda. Comida pronta e bebidas alcoólicas pagam.
✓ O preço da etiqueta não inclui o imposto: na Flórida, o imposto de venda (6% estadual mais o adicional do condado) é somado só no caixa.
✓ Na volta ao Brasil, a cota de isenção da Receita Federal é de US$ 1.000 por pessoa em viagem aérea, e o excedente paga 50% de imposto. Guarde as notas fiscais.$$),
($$publix$$, $$✓ Os sanduíches Pub Sub são feitos na hora e dá para escolher pão, recheio e molhos.
✓ As promoções de leve um e pague um mudam toda semana e podem ser vistas no site ou no aplicativo.
✓ Os preços costumam ser um pouco acima de redes como Walmart e ALDI, em troca de atendimento e variedade.
✓ Muitas unidades têm farmácia dentro da loja.
✓ Na Flórida, alimentos para preparar em casa, como frutas, carnes e pães, não pagam imposto de venda. Comida pronta e bebidas alcoólicas pagam.$$),
($$aldi$$, $$✓ Leve uma moeda de 25 centavos: os carrinhos são liberados com ela, e ela volta quando o carrinho é devolvido.
✓ Leve sacolas reutilizáveis, pois as sacolas são cobradas e você mesmo embala as compras.
✓ Os produtos são em maioria de marca própria, então nem sempre há as marcas conhecidas.
✓ As lojas são menores, com menos variedade que um Walmart ou uma Publix, mas com ótimo custo-benefício.
✓ Na Flórida, alimentos para preparar em casa, como frutas, carnes e pães, não pagam imposto de venda. Comida pronta e bebidas alcoólicas pagam.$$),
($$whole-foods-market$$, $$✓ Os preços costumam ser mais altos que os de supermercados tradicionais.
✓ Os balcões de comida pronta são uma alternativa prática ao fast food.
✓ Os rótulos indicam com clareza produtos sem glúten, veganos e orgânicos, o que ajuda quem tem restrições.
✓ Para economizar, vale comparar os itens da marca própria 365.
✓ Na Flórida, alimentos para preparar em casa, como frutas, carnes e pães, não pagam imposto de venda. Comida pronta e bebidas alcoólicas pagam.$$),
($$trader-joes$$, $$✓ As lojas são menores e podem ficar cheias nos fins de semana e no fim da tarde.
✓ Quase tudo é de marca própria, então não espere marcas conhecidas.
✓ Os produtos congelados e os snacks costumam ser os mais procurados.
✓ Leve uma sacola reutilizável para as compras.
✓ Na Flórida, alimentos para preparar em casa, como frutas, carnes e pães, não pagam imposto de venda. Comida pronta e bebidas alcoólicas pagam.$$),
($$sprouts-farmers-market$$, $$✓ Os produtos a granel permitem comprar só a quantidade necessária, ótimo para uma estadia curta.
✓ O hortifruti fica na entrada e costuma ter promoções semanais.
✓ Há boas opções de snacks naturais para levar aos parques.
✓ Confira as promoções da semana no site ou no aplicativo.
✓ Na Flórida, alimentos para preparar em casa, como frutas, carnes e pães, não pagam imposto de venda. Comida pronta e bebidas alcoólicas pagam.$$),
($$seabra-foods$$, $$✓ Os itens importados costumam ter preço acima do que se paga no Brasil.
✓ Os serviços e o mix de produtos variam de unidade para unidade, então confira a loja mais próxima.
✓ É uma boa opção para quem viaja com crianças que sentem falta de lanches brasileiros.
✓ Confirme os horários no site oficial antes de ir.
✓ Na Flórida, alimentos para preparar em casa, como frutas, carnes e pães, não pagam imposto de venda. Comida pronta e bebidas alcoólicas pagam.$$),
($$superbras$$, $$✓ Fica em uma região de fácil acesso para quem está hospedado perto da International Drive.
✓ A lanchonete é uma opção prática para um lanche rápido.
✓ Os horários podem variar nos domingos e feriados, então confirme antes de ir.
✓ Os produtos importados costumam ter preço acima do que se paga no Brasil.
✓ Na Flórida, alimentos para preparar em casa, como frutas, carnes e pães, não pagam imposto de venda. Comida pronta e bebidas alcoólicas pagam.$$),
($$rokkas-market$$, $$✓ Fica na região de Dr. Phillips, perto de restaurantes e opções de compras.
✓ Aproveite para almoçar no buffet durante a visita.
✓ Confira os horários e o cardápio do dia antes de ir, pois podem mudar.
✓ É uma boa alternativa para quem procura sabores brasileiros e italianos em um só lugar.
✓ Na Flórida, alimentos para preparar em casa, como frutas, carnes e pães, não pagam imposto de venda. Comida pronta e bebidas alcoólicas pagam.$$),
($$walgreens$$, $$✓ Muitas unidades têm atendimento até tarde e algumas funcionam por mais tempo, mas confira o horário da loja mais próxima.
✓ Protetor solar, repelente e remédios de uso comum costumam ter preço bem menor aqui do que nas lojas dos parques.
✓ Para medicamentos que exigem receita, consulte o atendimento da farmácia antes de ir.
✓ Há também cartões-postais, doces e lembrancinhas para quem busca algo simples.
✓ O preço da etiqueta não inclui o imposto: na Flórida, o imposto de venda (6% estadual mais o adicional do condado) é somado só no caixa.$$),
($$cvs-pharmacy$$, $$✓ Confira o horário da unidade mais próxima, pois alguns locais funcionam até mais tarde.
✓ Protetor solar, repelente e remédios de uso comum são os itens mais procurados por turistas.
✓ Para medicamentos que exigem receita, consulte o atendimento da farmácia.
✓ Em algumas lojas Target há uma CVS dentro da loja.
✓ O preço da etiqueta não inclui o imposto: na Flórida, o imposto de venda (6% estadual mais o adicional do condado) é somado só no caixa.$$),
($$ross-dress-for-less$$, $$✓ O estoque muda com frequência: se gostar de uma peça, vale levar na hora.
✓ Confira os tamanhos, que seguem o padrão americano.
✓ As filas nos caixas podem ser longas em horários de pico.
✓ Confira a política de troca antes de comprar.
✓ O preço da etiqueta não inclui o imposto: na Flórida, o imposto de venda (6% estadual mais o adicional do condado) é somado só no caixa.
✓ Na volta ao Brasil, a cota de isenção da Receita Federal é de US$ 1.000 por pessoa em viagem aérea, e o excedente paga 50% de imposto. Guarde as notas fiscais.$$),
($$marshalls$$, $$✓ O estoque muda com frequência, então não deixe para voltar depois.
✓ Confira os tamanhos, que seguem o padrão americano.
✓ Dê uma olhada com calma nas araras, pois as peças ficam misturadas.
✓ Confira a política de troca no caixa.
✓ O preço da etiqueta não inclui o imposto: na Flórida, o imposto de venda (6% estadual mais o adicional do condado) é somado só no caixa.
✓ Na volta ao Brasil, a cota de isenção da Receita Federal é de US$ 1.000 por pessoa em viagem aérea, e o excedente paga 50% de imposto. Guarde as notas fiscais.$$),
($$tj-maxx$$, $$✓ O estoque muda com frequência, então vale levar a peça quando encontrar algo de que gostou.
✓ Os tamanhos seguem o padrão americano.
✓ Confira com atenção as etiquetas de preço e a política de troca.
✓ Há uma seção de presentes e itens de decoração que pode render boas lembranças.
✓ O preço da etiqueta não inclui o imposto: na Flórida, o imposto de venda (6% estadual mais o adicional do condado) é somado só no caixa.
✓ Na volta ao Brasil, a cota de isenção da Receita Federal é de US$ 1.000 por pessoa em viagem aérea, e o excedente paga 50% de imposto. Guarde as notas fiscais.$$),
($$burlington$$, $$✓ O estoque muda com frequência: vale levar o que gostar na hora.
✓ Os tamanhos seguem o padrão americano.
✓ As lojas costumam ser grandes, então reserve tempo para percorrer com calma.
✓ Confira a política de troca no caixa.
✓ O preço da etiqueta não inclui o imposto: na Flórida, o imposto de venda (6% estadual mais o adicional do condado) é somado só no caixa.
✓ Na volta ao Brasil, a cota de isenção da Receita Federal é de US$ 1.000 por pessoa em viagem aérea, e o excedente paga 50% de imposto. Guarde as notas fiscais.$$),
($$dds-discounts$$, $$✓ O estoque muda com frequência, então não deixe a compra para depois.
✓ Os tamanhos seguem o padrão americano.
✓ As lojas costumam ser mais simples que as de outras redes, com foco no preço.
✓ Confira a política de troca antes de comprar.
✓ O preço da etiqueta não inclui o imposto: na Flórida, o imposto de venda (6% estadual mais o adicional do condado) é somado só no caixa.
✓ Na volta ao Brasil, a cota de isenção da Receita Federal é de US$ 1.000 por pessoa em viagem aérea, e o excedente paga 50% de imposto. Guarde as notas fiscais.$$),
($$five-below$$, $$✓ É uma boa alternativa para presentes e lembranças de baixo custo.
✓ As crianças costumam adorar, então combine antes quanto cada uma pode gastar.
✓ Os preços podem mudar, então confira as etiquetas.
✓ O preço da etiqueta não inclui o imposto: na Flórida, o imposto de venda (6% estadual mais o adicional do condado) é somado só no caixa.
✓ Na volta ao Brasil, a cota de isenção da Receita Federal é de US$ 1.000 por pessoa em viagem aérea, e o excedente paga 50% de imposto. Guarde as notas fiscais.$$),
($$dollar-tree$$, $$✓ Os preços são baixos, mas confira sempre a qualidade dos produtos.
✓ Os estoques variam bastante de loja para loja.
✓ É uma boa opção para artigos de festa e papelaria.
✓ Vale a pena para itens de uso curto durante a viagem.
✓ O preço da etiqueta não inclui o imposto: na Flórida, o imposto de venda (6% estadual mais o adicional do condado) é somado só no caixa.
✓ Na volta ao Brasil, a cota de isenção da Receita Federal é de US$ 1.000 por pessoa em viagem aérea, e o excedente paga 50% de imposto. Guarde as notas fiscais.$$),
($$dollar-general$$, $$✓ As lojas são menores, com menos variedade que um supermercado completo.
✓ É uma opção prática para itens básicos de higiene e limpeza.
✓ Os preços são acessíveis, mas o estoque varia de unidade para unidade.
✓ Confira o horário da loja mais próxima.
✓ O preço da etiqueta não inclui o imposto: na Flórida, o imposto de venda (6% estadual mais o adicional do condado) é somado só no caixa.
✓ Na volta ao Brasil, a cota de isenção da Receita Federal é de US$ 1.000 por pessoa em viagem aérea, e o excedente paga 50% de imposto. Guarde as notas fiscais.$$),
($$macys$$, $$✓ Confira as promoções no site ou no aplicativo antes de ir.
✓ Os tamanhos seguem o padrão americano.
✓ As lojas costumam ficar em shoppings, o que permite combinar a visita com outras compras.
✓ Guarde as notas fiscais para trocas e para a conferência na alfândega.
✓ O preço da etiqueta não inclui o imposto: na Flórida, o imposto de venda (6% estadual mais o adicional do condado) é somado só no caixa.
✓ Na volta ao Brasil, a cota de isenção da Receita Federal é de US$ 1.000 por pessoa em viagem aérea, e o excedente paga 50% de imposto. Guarde as notas fiscais.$$),
($$dillards$$, $$✓ Confira se há liquidação na época da sua viagem.
✓ Os tamanhos seguem o padrão americano.
✓ As lojas costumam ficar em shoppings, o que permite combinar a visita com outras compras.
✓ Guarde as notas fiscais para trocas.
✓ O preço da etiqueta não inclui o imposto: na Flórida, o imposto de venda (6% estadual mais o adicional do condado) é somado só no caixa.
✓ Na volta ao Brasil, a cota de isenção da Receita Federal é de US$ 1.000 por pessoa em viagem aérea, e o excedente paga 50% de imposto. Guarde as notas fiscais.$$),
($$nordstrom$$, $$✓ O atendimento costuma ser um diferencial, então peça ajuda aos vendedores.
✓ Os tamanhos seguem o padrão americano.
✓ Os preços tendem a ser mais altos que os de lojas de desconto.
✓ Existe também a Nordstrom Rack, versão de desconto da rede.
✓ O preço da etiqueta não inclui o imposto: na Flórida, o imposto de venda (6% estadual mais o adicional do condado) é somado só no caixa.
✓ Na volta ao Brasil, a cota de isenção da Receita Federal é de US$ 1.000 por pessoa em viagem aérea, e o excedente paga 50% de imposto. Guarde as notas fiscais.$$),
($$homegoods$$, $$✓ O estoque muda com frequência: se gostou, leve na hora.
✓ Confira o tamanho e o peso das peças antes de comprar, para levar na mala.
✓ Há uma boa seleção de itens para presente.
✓ Confira a política de troca no caixa.
✓ O preço da etiqueta não inclui o imposto: na Flórida, o imposto de venda (6% estadual mais o adicional do condado) é somado só no caixa.
✓ Na volta ao Brasil, a cota de isenção da Receita Federal é de US$ 1.000 por pessoa em viagem aérea, e o excedente paga 50% de imposto. Guarde as notas fiscais.$$),
($$williams-sonoma$$, $$✓ Os preços tendem a ser mais altos que os de lojas de desconto.
✓ Confira o peso e o tamanho das peças antes de comprar, para levar na mala.
✓ Eletrodomésticos podem ter voltagem diferente da do Brasil.
✓ A loja é ótima para presentes de cozinha.
✓ O preço da etiqueta não inclui o imposto: na Flórida, o imposto de venda (6% estadual mais o adicional do condado) é somado só no caixa.
✓ Na volta ao Brasil, a cota de isenção da Receita Federal é de US$ 1.000 por pessoa em viagem aérea, e o excedente paga 50% de imposto. Guarde as notas fiscais.$$),
($$the-container-store$$, $$✓ Os organizadores de mala ajudam a aproveitar o espaço na volta.
✓ Confira o tamanho dos produtos antes de comprar.
✓ Os preços tendem a ser mais altos que os de lojas de desconto.
✓ A loja costuma ter soluções para armários e cozinhas.
✓ O preço da etiqueta não inclui o imposto: na Flórida, o imposto de venda (6% estadual mais o adicional do condado) é somado só no caixa.
✓ Na volta ao Brasil, a cota de isenção da Receita Federal é de US$ 1.000 por pessoa em viagem aérea, e o excedente paga 50% de imposto. Guarde as notas fiscais.$$),
($$le-creuset$$, $$✓ As peças de ferro fundido são pesadas, então pense no peso da mala.
✓ Compare os preços com os do Brasil antes de comprar.
✓ Peças menores, como canecas e utensílios, são boas opções de presente.
✓ O preço da etiqueta não inclui o imposto: na Flórida, o imposto de venda (6% estadual mais o adicional do condado) é somado só no caixa.
✓ Na volta ao Brasil, a cota de isenção da Receita Federal é de US$ 1.000 por pessoa em viagem aérea, e o excedente paga 50% de imposto. Guarde as notas fiscais.$$),
($$best-buy$$, $$✓ Confira a voltagem e o padrão de tomada dos aparelhos antes de comprar.
✓ Consulte a garantia: a cobertura pode não valer fora dos Estados Unidos.
✓ Guarde as notas fiscais e as caixas dos produtos.
✓ O preço da etiqueta não inclui o imposto: na Flórida, o imposto de venda (6% estadual mais o adicional do condado) é somado só no caixa.
✓ Na volta ao Brasil, a cota de isenção da Receita Federal é de US$ 1.000 por pessoa em viagem aérea, e o excedente paga 50% de imposto. Guarde as notas fiscais.$$),
($$cirque-du-soleil-drawn-to-life$$, $$✓ O show dura cerca de 90 minutos. Confira no site os dias e horários das sessões.
✓ Chegue com antecedência para estacionar, caminhar até o teatro e passar pela entrada com calma.
✓ O estacionamento no Disney Springs é gratuito e há opções próximas ao teatro. Veja no site oficial a melhor para o dia.
✓ O uso de flash e celular durante o espetáculo não é permitido.
✓ O teatro é acessível para cadeirantes. Em caso de necessidades específicas, entre em contato com a organização antes.
✓ Reserve com antecedência, principalmente para fins de semana, feriados e alta temporada.
✓ O teatro fica no Disney Springs, na área West Side. Digite o nome do teatro do Cirque du Soleil no GPS: o estacionamento de superfície ao lado costuma ser o mais prático.
✓ O estacionamento do Disney Springs é gratuito, mas o valet no teatro é pago. Confira o valor atual antes de ir.$$)
) as v(slug, tips), cities c
where a.slug = v.slug and a.city_id = c.id and c.slug = 'orlando' and a.status = 'draft';
