-- Qual roteiro está selecionado em /meu-roteiro — sem isso, o app não tem
-- como saber qual dos roteiros "planejando" do usuário mostrar quando ele
-- tem mais de um.

alter table profiles
  add column current_itinerary_id uuid references itineraries(id) on delete set null;

-- A policy de update de profiles (definida em 20260803140000_profiles.sql)
-- já restringe a linha ao próprio dono; só falta liberar esta coluna, do
-- mesmo jeito que aquela migration já faz por coluna.
grant update (current_itinerary_id) on profiles to authenticated;
