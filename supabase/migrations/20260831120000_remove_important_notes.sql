-- Remove o campo "Observações importantes" (important_notes). Todo conteúdo
-- salvo é migrado para o campo "Dicas importantes" (important_tips) antes da
-- coluna ser removida.

update attractions
set important_tips = case
  when important_tips is not null and important_tips <> '' then
    important_tips || E'\n\n' || important_notes
  else
    important_notes
end
where important_notes is not null and important_notes <> '';

alter table attractions drop column important_notes;
