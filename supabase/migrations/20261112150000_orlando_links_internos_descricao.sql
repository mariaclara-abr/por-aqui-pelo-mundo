-- Orlando: links externos da descrição da cidade viram links internos (atrações publicadas)
-- ou texto simples (rascunhos e lugares não cadastrados).
update cities set description =
  replace(replace(replace(replace(replace(replace(replace(replace(replace(
  description,
  '[Aquatica Orlando](https://aquatica.com/orlando/)', '[Aquatica Orlando](https://www.poraquipelomundo.com/estados-unidos/orlando/aquatica-orlando)'),
  '[Discovery Cove](https://discoverycove.com/orlando/)', '[Discovery Cove](https://www.poraquipelomundo.com/estados-unidos/orlando/discovery-cove)'),
  '[Busch Gardens Tampa Bay](https://buschgardens.com/tampa/)', '[Busch Gardens Tampa Bay](https://www.poraquipelomundo.com/estados-unidos/orlando/busch-gardens-tampa-bay)'),
  '[Adventure Island](https://adventureisland.com/)', 'Adventure Island'),
  '[LEGOLAND Florida Resort](https://www.legoland.com/florida/)', '[LEGOLAND Florida Resort](https://www.poraquipelomundo.com/estados-unidos/orlando/legoland-florida)'),
  '[Lake Buena Vista Factory Stores](https://lbvfs.com/)', 'Lake Buena Vista Factory Stores'),
  '[The LOOP](https://www.experiencetheloop.com/)', 'The LOOP'),
  '[Anthropologie](https://www.anthropologie.com/)', '[Anthropologie](https://www.poraquipelomundo.com/estados-unidos/orlando/anthropologie)'),
  ', enquanto a [Le Creuset](https://www.lecreuset.com/stores) é uma opção para quem procura panelas e utensílios de cozinha', '')
where slug='orlando';
