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


INSERT INTO Alert (user_id, alert_text, alert_date) VALUES
    (1, 'Your password will expire in 3 days.', '2025-04-20 08:00:00'),
    (2, 'XXXXXXXXXXXXXXXXXXX', '2025-04-20 09:00:00'),
    (3, 'XXXXXXXXXXXXXXXXXXXX', '1850-04-15 10:00:00'),
    (4, 'New login from an unknown device detected.', '1993-04-21 11:15:00'),
    (5, '', '2025-04-21 12:00:000'),
    (5, 'Lorem ipsumjjj.', '2025-04-18 11:33:27'),
    (7, 'A very long alert message.  11?', '2025-04-22 08:45:00'),
    (1, 'System maintenance scheduled at midnight. ffff', '2025-09-23 18:00:00'),
    (9, 'Error processing your last request, please try again.', '2025-04-23 19:20:00'),
    (10, 'Backup completed successfully.', '2020-18-24 06:10:00');
