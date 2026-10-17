-- Etiqueta "Reserva necessária" vira "Reserva recomendada" (mantém slug e id, preservando as seleções).
update tags set name = 'Reserva recomendada' where name = 'Reserva necessária';
