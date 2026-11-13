-- Florianópolis: cadastro de trilhas (todas como rascunho, sem fotos).
-- A experiência pessoal (personal_experience) fica em branco de propósito.
insert into attractions (city_id, name, slug, categories, description, important_tips, average_visit_time, best_time_of_day, best_season, recommended_audience, weather_sensitive, has_air_conditioning, intense_physical_effort, requires_advance_purchase, requires_reservation, latitude, longitude, status)
select c.id, v.name, v.slug, v.cats, v.d, v.tips, v.visit, v.best, v.season, v.aud, v.ws, v.ac, v.eff, v.adv, v.res, v.la, v.lo, v.st::country_status
from cities c cross join (values
($$Morro da Coroa$$, $$morro-da-coroa$$, array['natureza','passeio']::attraction_category[], $$O **Morro da Coroa** é o mirante mais famoso da trilha da Lagoinha do Leste, no sul da ilha, a partir do Pântano do Sul. Do topo está a **vista mais conhecida da Lagoinha do Leste**, e dali também se avistam as **Ilhas Três Irmãs**, os **Moleques do Sul**, a Praia dos Açores, o Pântano do Sul, a Praia da Solidão e o Saquinho.

A subida é **íngreme e exige cuidado nos trechos de rocha**. Há quem faça o **circuito completo**: sai da Praia da Armação, passa pelo Matadeiro e pela Lagoinha do Leste, sobe o Morro da Coroa e volta pelo Pântano do Sul.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ A subida ao morro leva cerca de 40 minutos segundo um guia de trilhas, e pelo menos 1h30 para subir e descer a partir da praia segundo outro relato.
✓ O circuito completo (Armação, Matadeiro, Lagoinha, Morro da Coroa e Pântano do Sul) leva de 4 a 6 horas, e passeios guiados somam cerca de 6 horas.
✓ Quem não quer descer pela parte mais perigosa pode usar o atalho pelo Matadeiro.
✓ Use calçado fechado e de boa aderência, leve água e lanche e confira o tempo: a rocha molhada fica escorregadia.
✓ Evite fazer a trilha completa sozinho e saia cedo, para voltar com luz do dia.$$, $$4 a 6 horas$$, $$Manhã$$, $$O ano todo, em dias de sol e sem chuva$$, $$Quem gosta de trilha, com bom preparo físico$$, true, false, true, false, false, -27.781871::numeric, -48.49248::numeric, 'draft'),
($$Morro das Aranhas$$, $$morro-das-aranhas$$, array['natureza','passeio']::attraction_category[], $$A trilha do **Morro das Aranhas** começa na Praia do Santinho, no norte da ilha, e sobe até um **mirante a cerca de 246 metros de altitude**, com vista para o Santinho, os Ingleses e parte de Canasvieiras. É lembrada principalmente pelo **pôr do sol** e também pelo nascer do sol.

O caminho passa por trechos de mata, que ajudam a proteger do sol, e tem **inscrições rupestres** pelo percurso. O trajeto segue até a Praia do Moçambique, em cerca de 2,2 km e uma hora, segundo um relato. A dificuldade varia conforme a fonte, de fácil a moderada, por causa de subidas fortes.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ A trilha sai da Praia do Santinho, é bem sinalizada e de fácil acesso, segundo guias.
✓ O trecho até o topo tem cerca de 1,95 km, segundo um guia, e a subida é intensa em boa parte do trecho.
✓ Para ver o pôr do sol, confira o horário do dia e saia com folga, para descer ainda com luz.
✓ Use calçado fechado, leve água e boné e observe a sinalização da trilha.
✓ Em dia de chuva ou vento forte, deixe a trilha para outro dia.$$, $$1h30 a 2 horas$$, $$Fim de tarde$$, $$O ano todo, em dias de sol e sem chuva$$, $$Casais, amigos e quem gosta de trilha$$, true, false, false, false, false, -27.472228::numeric, -48.380067::numeric, 'draft'),
($$Trilha do Gravatá$$, $$trilha-do-gravata$$, array['natureza','passeio']::attraction_category[], $$A **Trilha do Gravatá** leva a uma **pequena praia isolada**, com apenas 75 metros de extensão, na região da Barra da Lagoa. O início da trilha fica junto à rodovia SC-406, a cerca de 550 metros do canto da lagoa, e o percurso é curto, de cerca de 1,3 km.

É uma caminhada considerada **fácil** e rápida, de 35 a 50 minutos na ida, e que combina mirantes e mata com uma praia de acesso discreto. Também existe a variante pelo **Caminho dos Pescadores**, que liga a Joaquina e a Praia Mole em cerca de 1h10.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ O início da trilha fica junto à rodovia SC-406.
✓ A ida leva de 35 a 50 minutos, e o tempo total depende do ritmo e das paradas nos mirantes.
✓ A praia é pequena e sem estrutura: leve água, lanche e protetor solar, e traga o lixo de volta.
✓ Use calçado fechado e confira o tempo antes de sair.$$, $$2 a 3 horas$$, $$Manhã$$, $$O ano todo, em dias de sol$$, $$Famílias com crianças maiores e casais$$, true, false, false, false, false, -27.613422::numeric, -48.433538::numeric, 'draft'),
($$Trilha da Boa Vista$$, $$trilha-da-boa-vista$$, array['natureza','passeio']::attraction_category[], $$A **Trilha da Boa Vista** começa perto da Barra da Lagoa e atravessa o **canal da Boa Vista por uma ponte suspensa**. Sobe até o **Mirante da Boa Vista**, com vista panorâmica da **Lagoa da Conceição**, de parte da Barra da Lagoa e das **dunas da Joaquina**, e desce até a **Praia da Galheta**, podendo seguir até a Praia Mole.

O mirante faz parte do **Circuito dos Mirantes**. Por unir vista, mata e praia no mesmo caminho, é uma trilha boa para uma manhã inteira. O esforço é moderado e exige algum condicionamento.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ A extensão varia conforme a fonte (de cerca de 2,6 km a cerca de 8 km, dependendo do trecho considerado), então planeje meio período.
✓ A trilha começa perto da Barra da Lagoa e cruza uma ponte suspensa sobre o canal da Boa Vista.
✓ É possível continuar até a Praia da Galheta e a Praia Mole.
✓ Use calçado fechado, leve água e lanche e confira o tempo antes de sair.$$, $$Meio período$$, $$Manhã$$, $$O ano todo, em dias de sol$$, $$Casais, amigos e quem gosta de trilha$$, true, false, false, false, false, -27.584703::numeric, -48.424825::numeric, 'draft'),
($$Costa da Lagoa$$, $$costa-da-lagoa$$, array['natureza','passeio','restaurante']::attraction_category[], $$A **Costa da Lagoa** é uma vila de pescadores na margem da Lagoa da Conceição que **não tem acesso por carro**: chega-se por **trilha** a partir da Lagoa da Conceição ou de **barco**. A caminhada tem cerca de 7 a 7,5 km, e a dificuldade varia nas fontes entre baixa e intermediária.

A vila é famosa pelos cerca de **14 restaurantes à beira da água**, concentrados principalmente perto do **Posto 16** e da **cachoeira da Costa da Lagoa**. Muita gente faz a ida a pé e volta de barco, em uma linha que chega ao porto perto da ponte Aderbal Ramos da Silva.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ O início da trilha fica no ponto final do ônibus, na Rua João Henrique Gonçalves, na Lagoa da Conceição.
✓ A volta de barco é uma boa alternativa para quem não quer repetir a caminhada: confirme horários e valores com o operador.
✓ A maior parte dos restaurantes fica perto do Posto 16, onde também está a cachoeira.
✓ Há notícias de um projeto de revitalização da trilha, então confira as condições atuais antes de ir.
✓ Use calçado fechado, leve água e protetor solar e saia cedo, para almoçar na vila e voltar com folga.$$, $$Meio período a dia inteiro$$, $$Manhã$$, $$O ano todo, em dias de sol e sem chuva$$, $$Famílias com crianças maiores, casais e amigos$$, true, false, false, false, false, -27.543146::numeric, -48.460978::numeric, 'draft'),
($$Morro do Lampião$$, $$morro-do-lampiao$$, array['natureza','passeio']::attraction_category[], $$O **Morro do Lampião**, no Campeche, é uma das trilhas mais curtas da ilha, com cerca de **20 a 30 minutos de subida** até o topo. De lá a **vista é de 360 graus**, do Pântano do Sul à Barra da Lagoa, com a Lagoa da Conceição ao fundo.

É lembrado como um dos melhores lugares da ilha para ver o **pôr do sol**. A trilha tem de 1,5 a 2,3 km, conforme a fonte, e cerca de 160 metros de subida. Alguns guias a descrevem como leve e adequada a iniciantes e famílias, outros como íngreme e exigindo bom condicionamento.

Verifique as informações atualizadas no guia de turismo da cidade: https://visitefloripa.com.br$$, $$✓ A subida leva de 20 a 30 minutos, segundo os guias, mas até 50 minutos em ritmo tranquilo.
✓ Para ver o pôr do sol, confira o horário do dia e saia com folga para descer ainda com luz.
✓ Use calçado fechado, leve água e uma lanterna ou o celular carregado, se a descida for no fim do dia.
✓ A vista é aberta, com pouca sombra no topo: leve boné e protetor solar.$$, $$1 a 2 horas$$, $$Fim de tarde$$, $$O ano todo, em dias de sol$$, $$Casais, amigos e famílias com crianças maiores$$, true, false, false, false, false, -27.670301::numeric, -48.492765::numeric, 'draft')
) as v(name, slug, cats, d, tips, visit, best, season, aud, ws, ac, eff, adv, res, la, lo, st)
where c.slug='florianopolis'
  and not exists (select 1 from attractions x where x.city_id=c.id and (x.slug=v.slug or lower(x.name)=lower(v.name)));
