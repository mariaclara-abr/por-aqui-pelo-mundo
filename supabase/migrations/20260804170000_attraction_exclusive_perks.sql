-- Parcerias exclusivas do Por Aqui Pelo Mundo: campos opcionais para exibir
-- um quadrante de vantagem exclusiva (ex: desconto de parceiro) na página da
-- atração. Nem toda atração vai ter parceria, então os três campos ficam
-- nulos por padrão e o quadrante só aparece quando há descrição preenchida.

alter table attractions
  add column exclusive_perk_description text,
  add column exclusive_perk_url text,
  add column exclusive_perk_cta_label text;
