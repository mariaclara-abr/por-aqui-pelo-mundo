-- Coordenadas do centro geográfico de Atenas e Santorini (Fira), para permitir
-- calcular a distância entre as duas cidades como "cidades próximas" no roteiro.
update cities set latitude = 37.983810, longitude = 23.727539 where slug = 'atenas';
update cities set latitude = 36.393154, longitude = 25.461550 where slug = 'santorini';
