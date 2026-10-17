-- Os restaurantes citados em "Sugestões para uma pausa saborosa" agora são atrações filhas
-- de cada parque; o bloco sai das dicas importantes.
update attractions
set important_tips = rtrim(regexp_replace(important_tips, E'\\n?\\*\\*Sugestões para uma pausa saborosa.*$', ''), E'\n')
where important_tips like '%pausa saborosa%';
