-- Marca como "em breve" (status draft) toda atração publicada sem nenhuma foto.
update attractions
  set status = 'draft'
  where status = 'published'
    and not exists (
      select 1 from attraction_photos where attraction_photos.attraction_id = attractions.id
    );
