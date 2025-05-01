USE CocoScheme;

INSERT INTO Department (department_name, costs_center, active) VALUES
  ('Finanzas', 'CC001', TRUE),
  ('Recursos Humanos', 'CC002', TRUE),
  ('IT', 'CC003', TRUE),
  ('Marketing', 'CC004', FALSE),
  ('Operaciones', 'CC005', TRUE),
  ('Servicios Generales', 'CC006', TRUE),
  ('Administración ', 'CC007', TRUE),
  ('Sistemas Avanzadosna', 'CC008', FALSE), 
  ('Desarrollo y Calidad', 'CC009', TRUE),  
  ('Recursos No Humanos', 'CC010', TRUE);


INSERT INTO `User` (role_id, department_id, user_name, password, workstation, email, phone_number, active) VALUES
  (1, 1, 'andres.gomez', 'andres123', 'WS101', 'andres.gomez@empresa.com', '555-1001', FALSE),
  (2, 2, 'paula.martinez', 'paula456', 'WS102', 'paula.martinez@empresa.com', '555-1002', TRUE),
  (3, 3, 'carlos.ramos', 'carlos789', 'WS103', 'carlos.ramos@empresa.com', '555-1003', TRUE),
  (4, 4, 'laura.flores', 'laura321', 'WS104', 'laura.flores@empresa.com', '555-1004', TRUE),
  (5, 5, 'diego.hernandez', 'diego654', 'WS105', 'diego.hernandez@empresa.com', '555-1005', FALSE),
  (6, 2, 'adminX_special', 'sup3rS3cret!', 'HACK001', 'adminx@empresaxd.com', '000-0000', TRUE),
  (2, 1, 'xx_m4nu_xx', 'qwerty123', 'WS???', 'manuel@empresa.com', '1234567890', TRUE),
  (3, 3, 'el_ch4p0', 'p4sSw0rd', 'SOFIA-PC', 'chapo@correo.com', NULL, TRUE),
  (4, 4, 'sofia_r', 'm1cor4zon', 'SOFIA-PC', 'sofia_random@mail.com', '555-ABCD', TRUE),
  (1, 5, 'miguel.de.cervantes', 'donquixote2023', 'DON-QUI', 'miguel@delamancha.com', '555-0000', FALSE);


INSERT INTO Alert (user_id, alert_text) VALUES
  (1, 'Your password will expire in 3 days.'),
  (2, 'XXXXXXXXXXXXXXXXXXX'),
  (3, 'XXXXXXXXXXXXXXXXXXXX'),
  (4, 'New login from an unknown device detected.'),
  (5, ''),
  (5, 'Lorem ipsumjjj.'),
  (7, 'A very long alert message.  11?'),
  (1, 'System maintenance scheduled at midnight. ffff'),
  (9, 'Error processing your last request, please try again.'),
  (10, 'Backup completed successfully.');


INSERT INTO Request (user_id, request_status_id, notes, requested_fee, imposed_fee, request_days, active) VALUES
  (1, 1, 'Solicito viáticos para viaje a conferencia en Barcelona.', 1500.00, 1200.00, 3.0, FALSE),
  (2, 2, 'Reembolso por gastos médicos durante viaje.', 800.00, 750.00, 1.0, TRUE),
  (3, 1, 'Solicitud de apoyo económico para capacitación online.', 500.00, 500.00, 0.0, FALSE),
  (1, 3, 'Viáticos para taller de liderazgo en Madrid.', 1200.00, 1000.00, 2.0, TRUE),
  (2, 9, 'Reembolso de transporte.', 300.00, 250.00, 0.5, TRUE),
  (3, 10, 'Apoyo para participación en congreso internacional.', 2000.00, 1800.00, 4.0, FALSE),
  (1, 8, 'Gastos operativos extraordinarios.', 650.00, 600.00, 0.0, TRUE),
  (2, 7, 'Viaje urgente por representación institucional.', 1750.00, 1500.00, 3.5, TRUE),
  (3, 6, 'Solicito anticipo para misión técnica en el extranjero.', 2200.00, 2000.00, 5.0, TRUE),
  (1, 7, 'Solicitud de viáticos por gira de supervisión.', 1300.00, 1200.00, 2.5, FALSE),
  (6, 4, 'Quiero ir a brr brr patapin por favor', 90.00, 80.00, 9, TRUE),
  (8, 10, 'Yo como cuando 🌴🥥', 9999999.00, 10000, 100, 10.2, TRUE),
  (5, 5, 'Solicito algo para que me den algo porque quiero algo y por eso solicito las cosas, porque el que quiere puede', 10.00, 8000.00, 3, FALSE),
  (4, 8, 'Momento gastar cuando gastas mucho', 999999999999999999999999999999999999.9999999999999999999, 1.00, 33, TRUE);


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


INSERT INTO Route (id_origin_country, id_origin_city, id_destination_country, id_destination_city, router_index,
                   plane_needed, hotel_needed, beginning_date, beginning_time, ending_date, ending_time) VALUES
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


INSERT INTO Receipt (receipt_type_id, request_id, validation, validation_date) VALUES
  (4, 1, 'Pendiente', NULL),
  (2, 2, 'Aprobado', '2025-04-19 09:00:00'),
  (3, 3, 'Rechazado', '2025-04-19 18:00:00'),
  (7, 4, 'Pendiente', '2037-04-19 18:00:59'),
  (2, 5, 'Aprobado', '2025-03-21 10:00:00'),
  (3, 6, 'Rechazado', '2025-04-22 12:00:00'),
  (6, 7, 'Pendiente', '2003-04-19 10:06:43'),
  (2, 8, 'Aprobado', '2025-02-23 16:00:00'),
  (5, 9, 'Rechazado', '2025-04-23 18:30:00'),
  (1, 10, 'Pendiente', '2025-06-19 20:17:24');
