-- Coordenadas obtidas por geocoding (OpenStreetMap/Nominatim), validadas contra a cidade.
update attractions a set latitude = v.lat, longitude = v.lng
from (values
  ('e5dd97c9-03d4-4b33-acdb-6d7c180e2df4'::uuid, -22.941269, -43.349184),
  ('a7057f62-b05b-4840-955c-32007e378f2a'::uuid, -27.975718, -49.648294),
  ('9551ad20-bab1-4817-9853-0370bb6994b7'::uuid, -28.282229, -49.961421),
  ('6f502ff9-167e-40fb-94a7-b6e17f65c13a'::uuid, 28.4614, -81.47309),
  ('8f056831-28d4-42ba-a4b9-2b6b3ba8aa88'::uuid, 28.460433, -81.472994),
  ('f09ec830-90bb-4006-861b-a6ab428f3d2e'::uuid, 28.460752, -81.473726),
  ('aab0ac88-049c-41ea-9227-f79f88d1666d'::uuid, 28.462678, -81.30914),
  ('4dfea216-1f47-46b7-972d-2be347f54567'::uuid, 28.483367, -81.45729),
  ('9df141c1-d4fe-4e92-b263-a1b7ee8901b9'::uuid, 28.553646, -81.346876),
  ('48dd7aa8-38c3-4ded-a044-01447b0d2373'::uuid, -28.047939, -49.61666),
  ('a153390e-f16b-4f79-9f8b-6572ec822432'::uuid, 28.460793, -81.309227),
  ('dee1c62c-9103-4fb7-8b15-a38702460714'::uuid, -29.395422, -50.833442),
  ('744ce49c-5593-464c-9c9a-ae89479fc8b6'::uuid, -28.045494, -49.612641)
) as v(id, lat, lng)
where a.id = v.id and (a.latitude is null or a.longitude is null);
