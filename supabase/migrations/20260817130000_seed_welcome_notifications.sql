-- Envia a notificação de boas-vindas para quem já tinha conta antes do
-- trigger on_auth_user_created passar a criá-la automaticamente. Idempotente:
-- pula quem já recebeu (contas criadas depois do trigger entrar em vigor).
insert into notifications (user_id, type, title, message, link)
select
  p.id,
  'bem_vindo',
  'Bem-vindo(a) ao Por Aqui Pelo Mundo!',
  'Explore destinos com curadoria de verdade, feita por quem já esteve lá.',
  null
from profiles p
where not exists (
  select 1 from notifications n
  where n.user_id = p.id and n.type = 'bem_vindo'
);
