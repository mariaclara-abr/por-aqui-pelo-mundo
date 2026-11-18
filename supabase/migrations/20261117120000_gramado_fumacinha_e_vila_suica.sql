-- Gramado: dois cadastros que faltavam na lista de 17/11/2026 (todo o resto da lista já existia como rascunho desde 12/11).
-- Ambos entram como rascunho e sem fotos (a autora usa o acervo pessoal depois). personal_experience e price_range ficam em branco.
-- 1. Passeio Fumacinha: o "passeio de trenzinho turístico" de Gramado. Dados do site oficial (fumacinhaturismo.com.br), lidos em 17/11/2026.
--    Coordenada: ponto de embarque, em frente à Igreja Matriz São Pedro (Nominatim, a 20 m da Fonte do Amor Eterno).
-- 2. Restaurante Vila Suíça Gramado: só o essencial. O site antigo (vilasuicagramado.com.br) não resolve mais (NXDOMAIN) e não há
--    fonte oficial sobre funcionamento atual, cardápio, horários ou ceia de Natal 2026. Endereço e cozinha vêm do Duo Gourmet e do Tripadvisor.
insert into attractions (city_id, name, slug, categories, description, important_tips, average_visit_time, best_time_of_day, best_season, recommended_audience, weather_sensitive, has_air_conditioning, intense_physical_effort, requires_advance_purchase, requires_reservation, latitude, longitude, status)
select c.id, v.name, v.slug, v.cats, v.d, v.tips, v.visit, v.best, v.season, v.aud, v.ws, v.ac, v.eff, v.adv, v.res, v.la, v.lo, v.st::country_status
from cities c cross join (values
($$Passeio Fumacinha$$, $$passeio-fumacinha-gramado$$, array['passeio']::attraction_category[], $$O **passeio Fumacinha**, operado pela Fumacinha Turismo, é o passeio panorâmico e guiado de **trenzinho turístico** de Gramado. Dura cerca de **1h10**, com um guia contando histórias, curiosidades e a arquitetura da cidade ao longo do trajeto. O roteiro começa no centro, segue pela Avenida das Hortênsias, passa por regiões tradicionais e chega ao **Lago Negro**, onde há uma **parada de cerca de 20 minutos** para fotos.

O embarque é na Avenida Borges de Medeiros, 2659, em frente à Igreja São Pedro, e as saídas são em horários fixos, **todos os dias**: 9h45, 11h, 12h30, 14h e 15h15. É um passeio leve, sem esforço físico, bom para quem visita Gramado pela primeira vez e quer se situar, para quem está sem carro e para famílias.

Verifique as informações atualizadas, os horários e os ingressos no site oficial: https://fumacinhaturismo.com.br$$, $$✓ Passeio pago. Em consulta ao site oficial em 17/11/2026: adulto R$ 50,00; criança de 2 a 10 anos, idoso (60+) e PCD R$ 25,00. Confirme os valores antes de ir.
✓ As saídas são às 9h45, 11h, 12h30, 14h e 15h15. Chegue 10 minutos antes do horário.
✓ A compra é online, com voucher digital. No dia do passeio, chame no WhatsApp (54) 99982-0079 a partir das 9h para confirmar e reservar o seu horário.
✓ Em caso de chuva o passeio não opera, e o valor pode ser devolvido integralmente se houver cancelamento pelo clima.
✓ Não haverá passeio em 1º de janeiro de 2027.
✓ Reservas com mais de 10 adultos pagantes devem consultar as condições especiais pelo WhatsApp.
✓ O embarque fica a poucos passos da [Fonte do Amor Eterno](https://www.poraquipelomundo.com/brasil/gramado/fonte-do-amor-eterno-gramado) e da [Igreja Matriz São Pedro](https://www.poraquipelomundo.com/brasil/gramado/igreja-matriz-sao-pedro-gramado), e a parada é no [Lago Negro](https://www.poraquipelomundo.com/brasil/gramado/lago-negro-gramado).
✓ Se o que você procura é um ônibus que liga Gramado e Canela com várias paradas, veja o [Bustour Gramado e Canela](https://www.poraquipelomundo.com/brasil/gramado/bustour-gramado-e-canela).
✓ Site oficial: https://fumacinhaturismo.com.br$$, $$1h10 (mais 10 minutos de antecedência no embarque)$$, $$Ao longo do dia (saídas das 9h45 às 15h15)$$, $$O ano todo$$, $$Famílias, casais e quem visita Gramado pela primeira vez$$, true, false, false, false, true, -29.3794571::numeric, -50.8741225::numeric, 'draft'),
($$Restaurante Vila Suíça Gramado$$, $$restaurante-vila-suica-gramado$$, array['restaurante']::attraction_category[], $$O **Restaurante Vila Suíça Gramado** fica na Avenida das Hortênsias, 2770, na região da Vila Suíça (Jardim Bela Vista), em Gramado. As listagens de terceiros o apresentam como restaurante de **cozinha suíça**, com almoço e **fondue** à noite.

O restaurante não tem hoje um site oficial no ar. Confirme diretamente com a casa o funcionamento, os horários, o cardápio e a reserva antes de ir.$$, $$✓ O restaurante não tem site oficial ativo: confirme horários, cardápio e reserva diretamente com a casa antes de ir.
✓ Ceia de Natal 2026: não encontramos divulgação oficial. Se esse é o seu plano, confirme com o restaurante com antecedência.
✓ Fica na Avenida das Hortênsias, no caminho entre o centro de Gramado e Canela.$$, null, null, null, null, false, false, false, false, false, null::numeric, null::numeric, 'draft')
) as v(name, slug, cats, d, tips, visit, best, season, aud, ws, ac, eff, adv, res, la, lo, st)
where c.slug='gramado'
  and not exists (select 1 from attractions x where x.city_id=c.id and (x.slug=v.slug or lower(x.name)=lower(v.name)));

-- Etiquetas, só do que o próprio cadastro comprova (mesmo critério do cadastro de 12/11): Fumacinha é passeio para famílias e casais,
-- com reserva do horário (ver requires_reservation) e sensível à chuva (não opera com chuva).
insert into attraction_tags (attraction_id, tag_id)
select a.id, t.id
from attractions a
join cities c on c.id = a.city_id and c.slug = 'gramado'
join tags t on
  (t.slug = 'reserva_necessaria' and (a.requires_reservation or a.requires_advance_purchase))
  or (t.slug = 'ideal_para_familias' and a.recommended_audience ~* 'fam[ií]li')
  or (t.slug = 'casais' and a.recommended_audience ~* 'casais')
  or (t.slug = 'melhor_dias_sol' and a.weather_sensitive)
where a.slug = 'passeio-fumacinha-gramado'
on conflict do nothing;
