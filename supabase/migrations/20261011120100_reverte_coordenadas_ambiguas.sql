-- Reverte coordenadas do geocoding que casaram com lugar errado ou filial arbitraria de rede.
update attractions set latitude = null, longitude = null
where name in ('Rock in Rio','Morro do Campestre','Mirante dos Pinheiros','Chili''s','Carrabba''s Italian Grill','Chipotle','Denny’s','Pedra Furada','Rota 370','Parques da Serra: Bondinho Aéreo e Cascata do Caracol');
