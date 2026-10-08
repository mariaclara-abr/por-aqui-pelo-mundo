-- Remove as etiquetas "Econômico" e "Luxo": a faixa de preço da atração
-- passa a ser mostrada pela classificação em $ no card, não por etiqueta.
-- Os vínculos em attraction_tags saem por cascade.
delete from tags where slug in ('economico', 'luxo');
