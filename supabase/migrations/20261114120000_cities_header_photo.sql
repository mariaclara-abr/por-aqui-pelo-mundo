-- Segunda foto do cabeçalho da cidade (colagem ao lado da capa).
alter table cities add column if not exists header_photo_url text;

update cities
set header_photo_url = 'https://xzsgbwrfsjfdutyfklto.supabase.co/storage/v1/object/public/media/attractions/dd920db6-aecc-4512-a1fa-bb082945c65f-castelo.jpg'
where slug = 'orlando';
