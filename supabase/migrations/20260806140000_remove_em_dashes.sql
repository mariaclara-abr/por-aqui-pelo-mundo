-- Remove travessões ("—") do conteúdo de curadoria já cadastrado, reescrevendo
-- as frases com pontuação comum (vírgula, ponto ou dois-pontos) para não
-- parecer texto gerado por IA.

update attractions
set description = 'Bons preços, aproveite para comprar chocolates, vinhos e água.'
where id = 'c100583c-8112-4d95-a690-9cf590f53303';

update attractions
set description = 'Templo neoclássico construído entre 1764 e 1778, com interior barroco charmoso e acolhedor, situado próximo ao Jardim Exótico da cidade. Substituiu uma igreja anterior que estava em ruínas, dedicada à padroeira Nossa Senhora da Assunção.'
where id = 'c7936544-3141-438e-bf67-4e1ce9545bb2';

update attractions
set description = 'Fábrica de perfumes inaugurada em 1968, com localização privilegiada ao pé da rocha e vista para o mar. O design moderno contrasta com o cenário da vila medieval.'
where id = '69aad05b-539e-4e91-a0d8-0adb34a0f1fd';

update attractions
set exclusive_perk_description = 'Reserve sua mesa na Trattoria da Nonna com 10% de desconto exclusivo para quem chega pelo Por Aqui Pelo Mundo, é só usar o link abaixo na hora de reservar.'
where id = 'fe94b0c0-36d1-4a08-a195-e0afead938fc';

update attractions
set important_tips = 'Leve água: tem pouca sombra em alguns trechos.'
where id = '42342633-b058-47fd-b06f-81b80d84609e';

update attractions
set name = 'Estacionamento gratuito: Fábrica de Perfumes Fragonard'
where id = 'e5c3efd2-b3f4-4cbd-a63b-b44f01d50ecb';

update attractions
set personal_experience = 'Atravessamos ao pôr do sol e foi mágico. O reflexo no rio Arno é incrível.'
where id = 'eddc2169-7d0c-4c57-a10e-65c68e691c2f';

update attractions
set personal_experience = 'Fila enorme sem reserva, compramos ingresso online e entramos direto.'
where id = '2d6fb015-e1b0-41c7-889e-9c0b23f3d529';

update attractions
set personal_experience = 'O sorvete de pistache é surreal, voltamos três vezes na mesma semana.'
where id = 'ebe11a3d-60b6-47cc-a2ff-cf7d45862b7b';

update attractions
set personal_experience = 'Peixe assado, comida deliciosa e fresca: preço mais em conta que nos restaurantes mais altos em Oia, inclusive nos drinks.'
where id = '04cbdb96-00b2-4f45-8ac1-6ad5f7d98322';
