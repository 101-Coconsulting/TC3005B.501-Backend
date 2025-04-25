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

INSERT INTO `User` (role_id, department_id, user_name, password, workstation, email, phone_number, active) VALUES
(1, 1, 'andres.gomez', 'andres123', 'WS101', 'andres.gomez@empresa.com', '555-1001', TRUE),
(2, 2, 'paula.martinez', 'paula456', 'WS102', 'paula.martinez@empresa.com', '555-1002', TRUE),
(3, 3, 'carlos.ramos', 'carlos789', 'WS103', 'carlos.ramos@empresa.com', '555-1003', TRUE),
(4, 4, 'laura.flores', 'laura321', 'WS104', 'laura.flores@empresa.com', '555-1004', TRUE),
(5, 5, 'diego.hernandez', 'diego654', 'WS105', 'diego.hernandez@empresa.com', '555-1005', TRUE),
(6, 2, 'adminX_special', 'sup3rS3cret!', 'HACK001', 'adminx@empresaxd.com', '000-0000', TRUE),
(2, 1, 'xx_m4nu_xx', 'qwerty123', 'WS???', 'manuel@empresa.com', '1234567890', TRUE),
(3, 3, 'el_ch4p0', 'p4sSw0rd', NULL, 'chapo@correo.com', NULL, TRUE),
(4, 4, 'sofia_r', 'm1cor4zon', 'SOFIA-PC', 'sofia_random@mail.com', '555-ABCD', TRUE),
(1, 5, 'miguel.de.cervantes', 'donquixote2023', 'DON-QUI', 'miguel@delamancha.com', '555-0000', FALSE);

