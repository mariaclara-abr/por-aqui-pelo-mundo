-- Reescreve títulos de dicas que estavam sem gancho (sempre citando país ou
-- cidade, com uma ou duas palavras em negrito) e garante ao menos 1 card
-- premium por categoria. Só os títulos mudam: o conteúdo continua o da curadoria.

-- Dubai e Abu Dhabi
update travel_tips set title = 'Quanto vale o **dirham** e o que esperar do calor em Dubai e Abu Dhabi' where id = '62d7936f-1716-42f3-b2d3-c39148beb1f7';
update travel_tips set title = 'A regra de vestimenta em **Dubai** que pega turistas de surpresa' where id = '3760780e-cac7-404b-80f9-11ea5384d51a';
update travel_tips set title = 'Álcool em Dubai e Abu Dhabi: **onde pode**, quem pode e o que evitar em público' where id = '84d351f3-f789-47fe-8049-a97625db5264';
update travel_tips set title = 'Alugar carro em **Dubai**? Sua CNH brasileira sozinha **não vale**', is_premium = true where id = '829dc1c3-8c52-4cbf-9d81-f37cd821f152';

-- Europa
update travel_tips set title = 'A **Europa** tem fusos diferentes: Londres é a exceção que confunde' where id = '7dc8619a-3f17-481a-9567-6ca4699a4c25';
update travel_tips set title = 'Quanto vale o **euro** e o que esperar do clima em Milão' where id = 'c1454d1b-17dd-43f8-8d0b-acdd044780e7';
update travel_tips set title = 'As **comidas típicas** de Milão que você precisa provar' where id = 'd44dc583-1a49-4c02-9cbc-e8e30c5af160';
update travel_tips set title = '**Suíça**: franco ou euro? Idioma, clima e o que saber antes de ir' where id = 'eb781b41-f032-44a3-9a9d-5c708bf8aec8';
update travel_tips set title = 'Moeda e clima em **Paris**: o que esperar do verão' where id = 'e481e226-b2ba-4cac-97af-8c8f1e240f8c';
update travel_tips set title = '**Água grátis** em Paris: mais de 1.200 bebedouros espalhados pela cidade' where id = 'cabc1e94-cd59-4bec-860e-72279b1b534c';
update travel_tips set title = 'Onde deixar a **mala** em **Milão** e passear o dia todo sem peso' where id = 'bb390155-ec48-45be-8a59-e154c1cd3d87';

-- Florianópolis
update travel_tips set title = 'Florianópolis por região: o jeito de escolher a **praia certa** e não perder o dia' where id = '081fb5d8-5541-46e1-a2f9-34e29592a583';
update travel_tips set title = 'O que fazer em **Florianópolis** quando cansar da areia (tem até **barco pirata**)', is_premium = true where id = 'd6327e8b-46f0-43f3-9193-e2459939a1f0';

-- Planejamento de viagem
update travel_tips set title = 'Como eu planejo **minhas viagens**, do destino até a mala' where id = 'a8245598-efa3-41b6-b932-febda77a72af';

-- Pucón, Chile
update travel_tips set title = 'Quando ir a **Pucón**: a época que muda toda a viagem' where id = '8c9fa5de-2ffd-40db-af6c-d23371b8cee6';
update travel_tips set title = 'Os **7 passeios** de Pucón que todo turista quer fazer (com preço e duração)', is_premium = true where id = 'bd4123fd-6f7f-4171-ba50-932f584838db';
update travel_tips set title = 'As **agências** de Pucón indicadas para passeios e trilhas' where id = '38f5ed3e-94f7-4fb4-b5eb-5f756e58c5b9';
update travel_tips set title = 'Em Pucón você **monta a sua própria latinha** de cerveja artesanal' where id = 'f35ac6d2-aced-43b6-a29c-d8d341749f20';
