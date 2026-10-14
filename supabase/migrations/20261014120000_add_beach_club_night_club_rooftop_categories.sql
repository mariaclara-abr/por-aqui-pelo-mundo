-- Novas categorias de atração: beach club, night club e rooftop.
alter type attraction_category add value if not exists 'beach_club';
alter type attraction_category add value if not exists 'night_club';
alter type attraction_category add value if not exists 'rooftop';
