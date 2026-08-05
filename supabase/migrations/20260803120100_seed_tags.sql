-- Etiquetas iniciais disponíveis para atrações.
insert into tags (name, slug) values
  ('Ideal para famílias', 'ideal_para_familias'),
  ('Crianças pequenas', 'criancas_pequenas'),
  ('Adolescentes', 'adolescentes'),
  ('Casais', 'casais'),
  ('Alta temporada', 'alta_temporada'),
  ('Baixa temporada', 'baixa_temporada'),
  ('Melhor em dias de chuva', 'melhor_dias_chuva'),
  ('Melhor em dias de sol', 'melhor_dias_sol'),
  ('Gratuito', 'gratuito'),
  ('Econômico', 'economico'),
  ('Luxo', 'luxo'),
  ('Pouco conhecido', 'pouco_conhecido'),
  ('Turístico', 'turistico'),
  ('Meio período', 'meio_periodo'),
  ('Dia inteiro', 'dia_inteiro'),
  ('Imperdível', 'imperdivel'),
  ('Reserva necessária', 'reserva_necessaria'),
  ('Vale acordar cedo', 'vale_acordar_cedo')
on conflict (slug) do nothing;
