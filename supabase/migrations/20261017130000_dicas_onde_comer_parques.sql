-- Sugestões de onde comer nos parques aquáticos Disney/Universal, parques Universal e SeaWorld.
update attractions set important_tips = regexp_replace(important_tips, E'✓ \\*\\*Onde comer:\\*\\*[^\n]*\n?', '') where name = 'Disney’s Typhoon Lagoon';
update attractions set important_tips = rtrim(important_tips, E'\n') || E'\n' || $b$**Sugestões para uma pausa saborosa 🍕🍔🌭🥗**
🍴 **Leaning Palms:** hambúrgueres, pizzas e sanduíches, a opção mais completa do parque.
🍴 **Typhoon Tilly’s:** cestas de peixe, saladas e wraps de frango, com cenário de naufrágio.
🍴 **Lowtide Lou’s:** lanchonete com sanduíches, wraps e petiscos para uma pausa rápida.
🍴 **Happy Landings Ice Cream:** sundaes, milk-shakes e root beer float para refrescar.$b$ where name = 'Disney’s Typhoon Lagoon' and important_tips not like '%pausa saborosa%';
update attractions set important_tips = regexp_replace(important_tips, E'✓ \\*\\*Onde comer:\\*\\*[^\n]*\n?', '') where name = 'Disney’s Blizzard Beach';
update attractions set important_tips = rtrim(important_tips, E'\n') || E'\n' || $b$**Sugestões para uma pausa saborosa 🍕🍔🌭🥗**
🍴 **Lottawatta Lodge:** refeições rápidas de serviço no balcão, com pedido pelo aplicativo.
🍴 **Avalunch:** lanches rápidos, com pedido pelo aplicativo.
🍴 **I.C. Expeditions:** paradinha para sorvetes e lanches leves.
🍴 **Mini Donuts by Joffrey’s Coffee:** minidonuts quentinhos, uma opção doce.$b$ where name = 'Disney’s Blizzard Beach' and important_tips not like '%pausa saborosa%';
update attractions set important_tips = regexp_replace(important_tips, E'✓ \\*\\*Onde comer:\\*\\*[^\n]*\n?', '') where name = 'Universal Volcano Bay';
update attractions set important_tips = rtrim(important_tips, E'\n') || E'\n' || $b$**Sugestões para uma pausa saborosa 🍕🍔🌭🥗**
🍴 **Kohola Reef Restaurant & Social Club:** restaurante de serviço completo, com sanduíches e opções vegetarianas.
🍴 **Bambu:** hambúrgueres, tiras de frango e sanduíches de peixe ou frango.
🍴 **Whakawaiwai Eats:** pizzas, cachorros-quentes e macarrão com queijo.
🍴 **The Feasting Frog:** tacos, nachos e poke bowls, em Rainforest Village.$b$ where name = 'Universal Volcano Bay' and important_tips not like '%pausa saborosa%';
update attractions set important_tips = regexp_replace(important_tips, E'✓ \\*\\*Onde comer:\\*\\*[^\n]*\n?', '') where name = 'Universal Studios';
update attractions set important_tips = rtrim(important_tips, E'\n') || E'\n' || $b$**Sugestões para uma pausa saborosa 🍕🍔🌭🥗**
🍴 **The Leaky Cauldron:** pub britânico no Beco Diagonal, com café da manhã inglês e pratos típicos.
🍴 **Mel’s Drive-In:** hambúrgueres, tiras de frango e batata frita em clima de anos 1950.
🍴 **Louie’s Italian Restaurant:** pizzas, sanduíches de almôndega e espaguete.
🍴 **Krusty Burger:** hambúrgueres na área de Springfield, no cenário de Os Simpsons.$b$ where name = 'Universal Studios' and important_tips not like '%pausa saborosa%';
update attractions set important_tips = regexp_replace(important_tips, E'✓ \\*\\*Onde comer:\\*\\*[^\n]*\n?', '') where name = 'Islands of Adventure';
update attractions set important_tips = rtrim(important_tips, E'\n') || E'\n' || $b$**Sugestões para uma pausa saborosa 🍕🍔🌭🥗**
🍴 **Three Broomsticks:** refeições bem servidas em Hogsmeade, no clima de Harry Potter.
🍴 **Thunder Falls Terrace:** frango assado, costelas e sopas, perto das cachoeiras de Jurassic Park.
🍴 **Mythos Restaurant:** restaurante de serviço completo, com vista para o lago e cenário premiado.
🍴 **Blondie’s:** cachorros-quentes, sanduíches e subs no balcão, em Toon Lagoon.$b$ where name = 'Islands of Adventure' and important_tips not like '%pausa saborosa%';
update attractions set important_tips = regexp_replace(important_tips, E'✓ \\*\\*Onde comer:\\*\\*[^\n]*\n?', '') where name = 'SeaWorld Orlando';
update attractions set important_tips = rtrim(important_tips, E'\n') || E'\n' || $b$**Sugestões para uma pausa saborosa 🍕🍔🌭🥗**
🍴 **Voyager’s Smokehouse:** carnes defumadas na lenha de nogueira, como costela e carne de porco desfiada.
🍴 **Seafire Grill:** frango empanado à mão ou grelhado, em sanduíches, tiras e wraps.
🍴 **Dockside Pizza Co.:** pizzas artesanais em porções individuais ou inteiras.
🍴 **Expedition Café:** menus de comida americana, asiática e italiana, em ambiente temático da Antártida.$b$ where name = 'SeaWorld Orlando' and important_tips not like '%pausa saborosa%';
update attractions set important_tips = regexp_replace(important_tips, E'✓ \\*\\*Onde comer:\\*\\*[^\n]*\n?', '') where name = 'Universal Studios Hollywood';
update attractions set important_tips = rtrim(important_tips, E'\n') || E'\n' || $b$**Sugestões para uma pausa saborosa 🍕🍔🌭🥗**
🍴 **Mel’s Diner:** hambúrgueres, sanduíches de frango, milk-shakes e funnel cake, em clima de anos 1950.
🍴 **Krusty Burger:** hambúrgueres em Springfield, no cenário de Os Simpsons.
🍴 **Jurassic Cafe:** lanchonete estilo refeitório com frango assado, hambúrgueres e saladas.
🍴 **Duff Brewery Beer Garden:** cervejas, vinhos e coquetéis em Springfield; venda de álcool apenas para maiores de 21 anos.$b$ where name = 'Universal Studios Hollywood' and important_tips not like '%pausa saborosa%';
