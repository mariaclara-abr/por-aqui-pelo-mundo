-- Permite à autora ajustar o enquadramento (posição e zoom) de cada imagem
-- ao cadastrar, sem precisar recortar e reenviar o arquivo. Guardado como
-- jsonb no formato {"x": 0-100, "y": 0-100, "zoom": number}, aplicado no
-- front via object-position + transform: scale(). Nulo = padrão (centro,
-- sem zoom).
alter table countries add column cover_image_position jsonb;
alter table states add column cover_image_position jsonb;
alter table cities add column cover_image_position jsonb;
alter table attraction_photos add column position jsonb;

alter table about_page_content
  add column author_photo_position jsonb,
  add column travel_photo_1_position jsonb,
  add column travel_photo_2_position jsonb;
