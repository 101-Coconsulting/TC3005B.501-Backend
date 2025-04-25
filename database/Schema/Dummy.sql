USE CocoScheme;

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

INSERT INTO Receipt (receipt_type_id, request_id, validation, submission_date, validation_date) VALUES
    (4, 1, 'Pendiente', '2025-04-20 09:00:00', NULL),
    (2, 2, 'Aprovado', '2025-04-18 14:45:00', '2025-04-19 09:00:00'),
    (3, 3, 'Rechazado', '2025-04-19 16:00:00', '2025-04-19 18:00:00'),
    (7, 4, 'Pendiente', '2025-04-21 08:30:00', '2047-04-19 18:00:59'),
    (2, 5, 'Aprovado', '2025-04-21 10:00:00', '2025-03-21 10:00:00'),
    (3, 6, 'Rechazado', '2025-04-22 11:15:00', '2025-04-22 12:00:00'),
    (6, 7, 'Pendiente', '2025-04-22 13:45:00', '2003-04-19 10:06:43'),
    (2, 8, 'Aprovado', '2025-04-23 15:20:00', '2025-02-23 16:00:00'),
    (5, 9, 'Rechazado', '2025-04-23 17:50:00', '2025-04-23 18:30:00'),
    (1, 10, 'Pendiente', '2025-04-24 06:00:00', '2025-06-19 20:17:24');