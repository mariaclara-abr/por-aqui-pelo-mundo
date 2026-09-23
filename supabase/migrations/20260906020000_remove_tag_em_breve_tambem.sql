-- Reverte a etiqueta "Em breve também": não era isso que era pra ser feito,
-- "em breve" para atrações deve seguir o mesmo padrão já usado em país/cidade
-- (ver coluna coming_soon), não um sistema de etiquetas.
delete from attraction_tags
where tag_id in (select id from tags where slug = 'em_breve_tambem');

delete from tags where slug = 'em_breve_tambem';
