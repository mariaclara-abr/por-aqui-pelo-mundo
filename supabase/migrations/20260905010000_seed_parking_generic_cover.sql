-- Capa genérica para todas as atrações de estacionamento do site: símbolo
-- circular vermelho com "E", já que não existem fotos reais e livres de
-- direitos de estacionamentos específicos. Vale pra todas as cidades, não
-- só Saint-Tropez.
insert into attraction_photos (attraction_id, url, "order", caption)
select attractions.id,
  'https://xzsgbwrfsjfdutyfklto.supabase.co/storage/v1/object/public/media/attractions/8ddc1f3e-007c-4892-bd99-737b10e68e29-simbolo-estacionamento.png',
  0,
  null
from attractions
where 'estacionamentos' = any(attractions.categories)
  and not exists (
    select 1 from attraction_photos existing
    where existing.attraction_id = attractions.id
      and existing.url = 'https://xzsgbwrfsjfdutyfklto.supabase.co/storage/v1/object/public/media/attractions/8ddc1f3e-007c-4892-bd99-737b10e68e29-simbolo-estacionamento.png'
  );
