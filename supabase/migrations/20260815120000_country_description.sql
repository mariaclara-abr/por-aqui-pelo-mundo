-- Descrição opcional do país, exibida na página do país (com "ver mais"
-- para textos longos), no mesmo padrão já usado por cities.description.

alter table countries add column description text;
