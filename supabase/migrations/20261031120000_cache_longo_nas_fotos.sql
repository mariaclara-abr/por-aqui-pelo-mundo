-- Fotos tinham Cache-Control de 1 hora; os caminhos levam UUID, entao podem ficar 1 ano no cache.
update storage.objects
set metadata = jsonb_set(metadata, '{cacheControl}', '"max-age=31536000"')
where bucket_id in ('media', 'avatars');
