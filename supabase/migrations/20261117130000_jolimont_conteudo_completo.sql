-- Vinícola Jolimont (Canela): conteúdo completo, com ênfase em visita em família e regras para crianças e adolescentes.
-- Fonte: site oficial vinicolajolimont.com.br (home, "Tour Jolimont" e FAQ), lido em 17/11/2026.
-- personal_experience é o texto exato enviado pela autora. Fotos, categorias e nota de curadoria não são tocadas (a autora classifica depois).
-- Removida a frase antiga "ingresso válido por 1 ano": o site oficial não confirma a validade.
update attractions set
  description = $$A **Vinícola Jolimont** fica na Estrada Morro Calçado, 1420, em Canela, a cerca de 25 minutos de carro do centro de Gramado, e é uma das experiências de enoturismo mais indicadas da Serra Gaúcha para fazer **em família, inclusive com crianças**. O passeio principal é o **Tour Jolimont**: uma visita guiada pela história da vinícola, pelas caves e pela produção de vinhos e espumantes, que termina com **degustação de vinhos, espumantes e sucos de uva**, harmonizados com queijos e salames, e uma taça de brinde.

Para as crianças, a regra no site oficial é clara: **crianças até 11 anos não pagam** e acompanham o tour degustando os **sucos de uva**; adolescentes de 12 a 17 anos pagam meia-entrada, assim como pessoas com 60 anos ou mais (estudantes também, com DNE válida). Quem não bebe álcool também tem opções: a vinícola oferece uma linha de espumantes 0% álcool e sucos de uva tinto, branco e rosé.

Além do tour, há outras modalidades de visitação: o **Piquenique** nos parreirais (cesta farta para duas pessoas, cerca de 3 horas, música ao vivo e espaço para as crianças brincarem), a **Pisa de Uvas** (para toda a família, ao som de música regional) e a **Experiência Premium**, com sommelier, rótulos Reserva e Gran Reserva e só 8 vagas por horário, **exclusiva para maiores de 18 anos** e com agendamento. A vinícola também tem mirante com vista para o Morro Calçado e loja com produtos que só se encontram ali ou nas lojas da marca em Gramado.

Verifique as informações atualizadas, os horários e os preços no site oficial: https://vinicolajolimont.com.br$$,
  important_tips = $$✓ Funciona todos os dias, das 9h às 16h30, inclusive aos domingos, feriados e em dias de chuva. O último grupo do dia é formado por ordem de chegada: chegue com folga.
✓ O Tour Jolimont não precisa de agendamento, o acesso é por ordem de chegada. Só a Experiência Premium exige agendamento (segunda a sábado, às 10h ou às 14h30).
✓ Atração paga. Em consulta ao site oficial em 17/11/2026, o Tour Jolimont custava R$ 189 na bilheteria e R$ 119 na compra antecipada pelo site. Confirme os valores antes de ir.
✓ Crianças até 11 anos não pagam. De 12 a 17 anos e a partir de 60 anos, meia-entrada. Estudantes também têm meia-entrada, com DNE válida.
✓ Na degustação, os adultos provam vinhos e espumantes e as crianças provam os sucos de uva. Há espumantes 0% álcool e sucos tinto, branco e rosé para quem não bebe álcool.
✓ Para ir com crianças, o Piquenique (a partir de R$ 129) e a Pisa de Uvas (R$ 89 na compra antecipada) são boas companhias do tour, também em consulta de 17/11/2026.
✓ O tour dura cerca de 1h30 e acontece normalmente com chuva.
✓ Animais de estimação não entram no tour, por regras sanitárias de indústria de alimentos (cão-guia, com documentação, é permitido). Nas áreas abertas, os pets são bem-vindos.
✓ Há estacionamento, sujeito à disponibilidade, e wi-fi para chamar o carro na volta se você for de Uber ou táxi.
✓ Site oficial: https://vinicolajolimont.com.br$$,
  personal_experience = $$Adoramos conhecer a Jolimont! É um passeio que recomendamos inclusive para famílias com crianças. Enquanto os adultos degustam os vinhos e espumantes, os pequenos também participam da experiência com sucos de uva e queijos. Nossos filhos adoraram! Os sucos são deliciosos e eu, particularmente, adorei o espumante. Vale muito a pena incluir essa visita no roteiro pela Serra Gaúcha!$$,
  average_visit_time = $$1h30 (tour); o Piquenique dura cerca de 3 horas$$,
  best_time_of_day = $$Ao longo do dia, das 9h às 16h30$$,
  best_season = $$O ano todo$$,
  recommended_audience = $$Famílias com crianças, casais e amigos$$,
  weather_sensitive = false,
  has_air_conditioning = false,
  intense_physical_effort = false,
  requires_advance_purchase = false,
  requires_reservation = false
where slug = 'vinicola-jolimont'
  and city_id = (select id from cities where slug = 'canela');

-- Etiquetas comprovadas pelo cadastro: público (famílias, casais) e funcionamento normal com chuva.
insert into attraction_tags (attraction_id, tag_id)
select a.id, t.id
from attractions a
join cities c on c.id = a.city_id and c.slug = 'canela'
join tags t on t.slug in ('ideal_para_familias', 'casais', 'melhor_dias_chuva')
where a.slug = 'vinicola-jolimont'
on conflict do nothing;
