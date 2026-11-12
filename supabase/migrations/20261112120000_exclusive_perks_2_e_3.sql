-- Até três parcerias independentes por atração. A primeira continua nas
-- colunas exclusive_perk_*; a segunda e a terceira ganham colunas próprias.
-- Cada uma só aparece na página se tiver descrição preenchida.

alter table attractions
  add column exclusive_perk_2_description text,
  add column exclusive_perk_2_url text,
  add column exclusive_perk_2_cta_label text,
  add column exclusive_perk_3_description text,
  add column exclusive_perk_3_url text,
  add column exclusive_perk_3_cta_label text;
