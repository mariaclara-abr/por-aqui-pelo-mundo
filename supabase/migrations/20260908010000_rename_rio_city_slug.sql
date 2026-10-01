-- Estado e cidade do Rio de Janeiro tinham o mesmo slug; a cidade escondia a página do estado.
update cities set slug = 'rio-de-janeiro-cidade'
where slug = 'rio-de-janeiro' and state_id is not null;
