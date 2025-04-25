USE CocoScheme;

INSERT INTO Department (department_name, costs_center, active) VALUES
  ('Finanzas', 'CC001', TRUE),
  ('Recursos Humanos', 'CC002', TRUE),
  ('IT', 'CC003', TRUE),
  ('Marketing', 'CC004', TRUE),
  ('Operaciones', 'CC005', TRUE),
  ('Servicios Generales', 'CC006', TRUE),
  ('Administración ', 'CC007', TRUE),  
  ('Sistemas Avanzadosna', 'CC008', FALSE), 
  ('Desarrollo y Calidad', 'CC009', TRUE),  
  ('Recursos No Humanos', 'CC010', TRUE);

INSERT INTO Route (
    id_origin_country,
    id_origin_city,
    id_destination_country,
    id_destination_city,
    router_index,
    plane_needed,
    hotel_needed,
    beginning_date,
    beginning_time,
    ending_date,
    ending_time
) VALUES
    (1, 5, 2, 10, 1, TRUE, FALSE, '2025-05-01', '08:30:00', '2025-05-01', '12:45:00'),
    (2, 10, 4, 9, 2, TRUE, TRUE, '2025-05-01', '01:00:00', '2025-05-03', '12:45:00'),
    (4, 9, 1, 5, 3, TRUE, FALSE, '2025-05-03', '18:59:59', '2025-05-03', '19:00:00'),
    (2, 10, 2, 8, 1, FALSE, TRUE, '2025-04-22', '01:00:00', '2025-05-03', '23:45:00'),
    (2, 8, 2, 10, 2, FALSE, FALSE, '2025-05-03', '00:00:00', '2025-05-04', '02:00:00'),
    (3, 1, 5, 2, 1, TRUE, FALSE, '2025-06-01', '09:00:00', '2025-06-01', '11:30:00'),
    (6, 3, 7, 4, 1, FALSE, TRUE, '2025-06-02', '14:00:00', '2025-06-02', '18:00:00'),
    (8, 5, 9, 6, 1, TRUE, TRUE, '2025-06-03', '07:15:00', '2025-06-03', '10:45:00'),
    (10, 7, 3, 1, 1, FALSE, FALSE, '2025-06-04', '12:00:00', '2025-06-04', '15:00:00'),
    (5, 4, 6, 3, 1, TRUE, FALSE, '2025-06-05', '16:30:00', '2025-06-05', '20:00:00');


INSERT INTO Country (country_name) VALUES
    ('España'),
    ('México'),
    ('Estados Unidos'),
    ('Alemania'),
    ('Italia'),
    ('Francia'),
    ('Madagascar'),
    ('El reino de nunca jamás de la estrella más alta a la derecha'),
    ('El país de las maravillas'),
    ('Skibidi Island Tralalero Tralala');


INSERT INTO City (city_name) VALUES
    ('CDMX'),
    ('Guadalajara'),
    ('Madrid'),
    ('Barceloa'),
    ('Tokyo'),
    ('Kyoto'),
    ('Nuke Town'),
    ('Reino de Simba'),
    ('Pisos Picados'),
    ('Bombardino Cocodrilo');

INSERT INTO Request (
    user_id,
    request_status_id,
    notes,
    requested_fee,
    imposed_fee,
    request_days,
    active
) VALUES
  (1, 1, 'Solicito viáticos para viaje a conferencia en Barcelona.', 1500.00, 1200.00, 3.0, TRUE),
  (2, 2, 'Reembolso por gastos médicos durante viaje.', 800.00, 750.00, 1.0, TRUE),
  (3, 1, 'Solicitud de apoyo económico para capacitación online.', 500.00, 500.00, 0.0, TRUE),
  (1, 3, 'Viáticos para taller de liderazgo en Madrid.', 1200.00, 1000.00, 2.0, TRUE),
  (2, 1, 'Reembolso de transporte.', 300.00, 250.00, 0.5, TRUE),
  (3, 2, 'Apoyo para participación en congreso internacional.', 2000.00, 1800.00, 4.0, TRUE),
  (1, 2, 'Gastos operativos extraordinarios.', 650.00, 600.00, 0.0, TRUE),
  (2, 3, 'Viaje urgente por representación institucional.', 1750.00, 1500.00, 3.5, TRUE),
  (3, 1, 'Solicito anticipo para misión técnica en el extranjero.', 2200.00, 2000.00, 5.0, TRUE),
  (1, 2, 'Solicitud de viáticos por gira de supervisión.', 1300.00, 1200.00, 2.5, TRUE);
 
 INSERT INTO Route_Request (request_id, route_id) VALUES
    (1, 1),
    (1, 2),
    (2, 3),
    (3, 4),
    (4, 5),
    (5, 6),
    (6, 7),
    (7, 8),
    (8, 9),
    (9, 10);
