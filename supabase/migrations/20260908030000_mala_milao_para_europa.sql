-- Move o card "Onde deixar a mala em Milão?" da categoria "Bagagem" para
-- "Europa". A categoria "Bagagem" deixa de existir (é só o texto da coluna,
-- sem outros cards nela). Título ganha negrito nas palavras principais.
update travel_tips
set category = 'Europa',
    "order" = 14,
    title = 'Onde deixar a **mala** em **Milão**?'
where id = 'bb390155-ec48-45be-8a59-e154c1cd3d87';
