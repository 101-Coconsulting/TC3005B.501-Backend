-- #############################################################################--
-- Scheme --
-- #############################################################################--

DROP DATABASE IF EXISTS CocoScheme;
CREATE DATABASE CocoScheme CHARACTER SET utf8 COLLATE utf8_general_ci;
USE CocoScheme;

CREATE TABLE IF NOT EXISTS `Role` (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Department (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(20) UNIQUE NOT NULL,
    costs_center VARCHAR(20),
    active BOOL NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS AlertMessage (
    message_id INT PRIMARY KEY AUTO_INCREMENT,

    message_text VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS `User`(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT,
    department_id INT,

    user_name VARCHAR(60) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL,
    workstation VARCHAR(20) NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    phone_number VARCHAR(254),
    wallet FLOAT DEFAULT 0.00,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_mod_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active BOOL NOT NULL DEFAULT TRUE,
  
    FOREIGN KEY (role_id) REFERENCES `Role`(role_id),
    FOREIGN KEY (department_id) REFERENCES Department(department_id)
);

CREATE TABLE IF NOT EXISTS Request_status (
    request_status_id INT PRIMARY KEY AUTO_INCREMENT,
    status VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Request (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    request_status_id INT DEFAULT 1,

    notes LONGTEXT,
    requested_fee FLOAT,
    imposed_fee FLOAT,
    request_days FLOAT,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_mod_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active BOOL NOT NULL DEFAULT TRUE,

    FOREIGN KEY (user_id) REFERENCES `User`(user_id),
    FOREIGN KEY (request_status_id) REFERENCES Request_status(request_status_id)
);

CREATE TABLE IF NOT EXISTS Alert (
    alert_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT,
    message_id INT,

    alert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (request_id) REFERENCES Request(request_id),
    FOREIGN KEY (message_id) REFERENCES AlertMessage(message_id)
);

CREATE TABLE IF NOT EXISTS Country (
    country_id INT PRIMARY KEY AUTO_INCREMENT,
    country_name VARCHAR(60) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS City (
    city_id INT PRIMARY KEY AUTO_INCREMENT,
    city_name VARCHAR(200) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS `Route` (
    route_id INT PRIMARY KEY AUTO_INCREMENT,
    id_origin_country INT,
    id_origin_city INT,
    id_destination_country INT,
    id_destination_city INT,

    router_index INT,
    plane_needed BOOL NOT NULL DEFAULT FALSE,
    hotel_needed BOOL NOT NULL DEFAULT FALSE,
    beginning_date DATE,
    beginning_time TIME,
    ending_date DATE,
    ending_time TIME,

    FOREIGN KEY (id_origin_country) REFERENCES Country(country_id),
    FOREIGN KEY (id_origin_city) REFERENCES City(city_id),
    FOREIGN KEY (id_destination_country) REFERENCES Country(country_id),
    FOREIGN KEY (id_destination_city) REFERENCES City(city_id)
);

CREATE TABLE IF NOT EXISTS Route_Request (
    route_request_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT,
    route_id INT,

    FOREIGN KEY (request_id) REFERENCES Request(request_id),
    FOREIGN KEY (route_id) REFERENCES `Route`(route_id)
);

CREATE TABLE IF NOT EXISTS Receipt_Type (
    receipt_type_id INT PRIMARY KEY AUTO_INCREMENT,
    receipt_type_name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Receipt (
    receipt_id INT PRIMARY KEY AUTO_INCREMENT,
    receipt_type_id INT,
    request_id INT,

    validation ENUM('Pendiente', 'Aprobado', 'Rechazado') DEFAULT 'Pendiente',
    amount FLOAT NOT NULL,
    refund BOOL DEFAULT TRUE,

    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validation_date TIMESTAMP,

    FOREIGN KEY (receipt_type_id) REFERENCES Receipt_Type(receipt_type_id),
    FOREIGN KEY (request_id) REFERENCES Request(request_id)
);

-- #############################################################################--
-- Prepopulate --
-- #############################################################################--

USE CocoScheme;

INSERT INTO `Role` (role_name) VALUES
    ('Solicitante'),
    ('Agencia de viajes'),
    ('Cuentas por pagar'),
    ('N1'),
    ('N2'),
    ('Administrador');

INSERT INTO AlertMessage (message_text) VALUES
    ('Se ha abierto una solicitud.'),
    ('Se requiere tu revisión para Primera Revisión.'),
    ('Se requiere tu revisión para Segunda Revisión.'),
    ('La solicitud está lista para generar su cotización de viaje.'),
    ('Se deben asignar los servicios del viaje para la solicitud.'),
    ('Se requiere validar comprobantes de los gastos del viaje.'),
    ('Los comprobantes están listos para validación.');

INSERT INTO Request_status (status) VALUES
    ('Borrador'),
    ('Primera Revisión'),
    ('Segunda Revisión'),
    ('Cotización del Viaje'),
    ('Atención Agencia de Viajes'),
    ('Comprobación gastos del viaje'),
    ('Validación de comprobantes'),
    ('Finalizado'),
    ('Cancelado'),
    ('Rechazado');

INSERT INTO Receipt_Type (receipt_type_name) VALUES
    ('Hospedaje'),
    ('Comida'),
    ('Transporte'),
    ('Caseta'),
    ('Autobús'),
    ('Vuelo'),
    ('Otro');

-- #############################################################################--
-- Triggers --
-- #############################################################################--

USE CocoScheme;

DELIMITER $$

CREATE OR REPLACE TRIGGER DeactivateRequest
BEFORE UPDATE ON Request
FOR EACH ROW
BEGIN
    IF NEW.request_status_id IN (9, 10) THEN
        SET NEW.active = FALSE;
    END IF;
END$$

CREATE OR REPLACE TRIGGER CreateAlert
AFTER INSERT ON Request
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM AlertMessage WHERE message_id = NEW.request_status_id) THEN
        INSERT INTO Alert (request_id, message_id) VALUES
            (NEW.request_id, NEW.request_status_id);
    END IF;
END$$

CREATE OR REPLACE TRIGGER ManageAlertAfterRequestUpdate
AFTER UPDATE ON Request
FOR EACH ROW
BEGIN
    IF NEW.request_status_id IN (8, 9, 10) THEN
        DELETE FROM Alert
        WHERE request_id = NEW.request_id;
    ELSEIF OLD.request_status_id <> NEW.request_status_id THEN
        UPDATE Alert
        SET message_id = NEW.request_status_id
        WHERE request_id = NEW.request_id;
    END IF;
END$$

CREATE OR REPLACE TRIGGER DeductFromWalletOnFeeImposed
AFTER UPDATE ON Request
FOR EACH ROW
BEGIN
    IF NEW.imposed_fee IS NOT NULL AND (OLD.imposed_fee IS NULL OR NEW.imposed_fee != OLD.imposed_fee) THEN
        UPDATE `User`
        SET wallet = wallet - (NEW.imposed_fee - IFNULL(OLD.imposed_fee, 0))
        WHERE user_id = NEW.user_id;
    END IF;
END$$

CREATE OR REPLACE TRIGGER AddToWalletOnReceiptApproved
AFTER UPDATE ON Receipt
FOR EACH ROW
BEGIN
    IF NEW.validation = 'Aprobado' AND OLD.validation != 'Aprobado' THEN
        UPDATE `User` u
        JOIN Request r ON r.request_id = NEW.request_id
        SET u.wallet = u.wallet + NEW.amount
        WHERE u.user_id = r.user_id;
    END IF;
END$$

CREATE OR REPLACE TRIGGER ResetRejectedReceipts
AFTER UPDATE ON Request
FOR EACH ROW
BEGIN
    IF OLD.request_status_id = 7 AND NEW.request_status_id = 6 THEN
        UPDATE Receipt
        SET validation = 'Pendiente'
        WHERE request_id = NEW.request_id
        AND validation = 'Rechazado';
    END IF;
END$$

DELIMITER ;

-- #############################################################################--
-- Views --
-- #############################################################################--

USE CocoScheme;

CREATE OR REPLACE VIEW UserRequestHistory AS
    SELECT
        Request.request_id,
        Request.user_id,
        Request.creation_date,
        Request_status.status,

        GROUP_CONCAT(DISTINCT Country_origin.country_name ORDER BY Route.router_index SEPARATOR ', ') AS trip_origins,
        GROUP_CONCAT(DISTINCT Country_destination.country_name ORDER BY Route.router_index SEPARATOR ', ') AS trip_destinations
    FROM
        Request
        INNER JOIN Request_status
            ON Request.request_status_id = Request_status.request_status_id
        LEFT JOIN Route_Request
            ON Request.request_id = Route_Request.request_id
        LEFT JOIN Route
            ON Route_Request.route_id = Route.route_id
        LEFT JOIN Country AS Country_origin
            ON Route.id_origin_country = Country_origin.country_id
        LEFT JOIN Country AS Country_destination
            ON Route.id_destination_country = Country_destination.country_id
    GROUP BY
        Request.request_id,
        Request.user_id,
        Request.last_mod_date,
        Request_status.status;




CREATE OR REPLACE VIEW RequestWithRouteDetails AS
    SELECT
        Request.request_id,
        Request.user_id,
        Request.request_status_id,
        Request.notes,
        Request.requested_fee,
        Request.imposed_fee,
        Request.request_days,
        Request.creation_date,
        Request.last_mod_date,
        Request.active,

        `User`.user_name,
        `User`.email AS user_email,
        `User`.phone_number AS user_phone_number,

        Request_status.status,

        Department.department_name,
        Department.department_id,

        GROUP_CONCAT(DISTINCT Country_origin.country_name ORDER BY Route.router_index SEPARATOR ', ') AS origin_countries,
        GROUP_CONCAT(DISTINCT City_origin.city_name ORDER BY Route.router_index SEPARATOR ', ') AS origin_cities,
        GROUP_CONCAT(DISTINCT Country_destination.country_name ORDER BY Route.router_index SEPARATOR ', ') AS destination_countries,
        GROUP_CONCAT(DISTINCT City_destination.city_name ORDER BY Route.router_index SEPARATOR ', ') AS destination_cities,
        GROUP_CONCAT(DISTINCT Route.beginning_date ORDER BY Route.router_index SEPARATOR ', ') AS beginning_dates,
        GROUP_CONCAT(DISTINCT Route.beginning_time ORDER BY Route.router_index SEPARATOR ', ') AS beginning_times,
        GROUP_CONCAT(DISTINCT Route.ending_date ORDER BY Route.router_index SEPARATOR ', ') AS ending_dates,
        GROUP_CONCAT(DISTINCT Route.ending_time ORDER BY Route.router_index SEPARATOR ', ') AS ending_times,
        GROUP_CONCAT(DISTINCT Route.hotel_needed ORDER BY Route.router_index SEPARATOR ', ') AS hotel_needed_list,
        GROUP_CONCAT(DISTINCT Route.plane_needed ORDER BY Route.router_index SEPARATOR ', ') AS plane_needed_list
    FROM
        Request
        LEFT JOIN `User`
            ON Request.user_id = `User`.user_id
        LEFT JOIN Request_status
            ON Request.request_status_id = Request_status.request_status_id
        LEFT JOIN Department
            ON `User`.department_id = Department.department_id
        LEFT JOIN Route_Request
            ON Request.request_id = Route_Request.request_id
        LEFT JOIN Route
            ON Route_Request.route_id = Route.route_id
        LEFT JOIN Country AS Country_origin
            ON Route.id_origin_country = Country_origin.country_id
        LEFT JOIN City AS City_origin
            ON Route.id_origin_city = City_origin.city_id
        LEFT JOIN Country AS Country_destination
            ON Route.id_destination_country = Country_destination.country_id
        LEFT JOIN City AS City_destination
            ON Route.id_destination_city = City_destination.city_id
    GROUP BY
        Request.request_id,
        Request.user_id,
        Request.request_status_id,
        Request.notes,
        Request.requested_fee,
        Request.imposed_fee,
        Request.request_days,
        Request.creation_date,
        Request.last_mod_date,
        Request.active,

        `User`.user_name,
        `User`.email,
        `User`.phone_number,

        Request_status.status,
        
        Department.department_name,
        Department.department_id;




CREATE OR REPLACE VIEW UserFullInfo AS
    SELECT
        u.user_id,
        u.user_name,
        u.email,
        u.active,
        r.role_name,
        d.department_name,
        d.department_id
    FROM
        `User` u
        LEFT JOIN `Role` r ON u.role_id = r.role_id
        LEFT JOIN Department d ON u.department_id = d.department_id;

-- #############################################################################--
-- Dummy Data --
-- #############################################################################--

USE CocoScheme;

INSERT INTO Department (department_name, costs_center, active) VALUES
  ('Finanzas', 'CC001', TRUE),
  ('Recursos Humanos', 'CC002', TRUE),
  ('IT', 'CC003', TRUE),
  ('Marketing', 'CC004', TRUE),
  ('Operaciones', 'CC005', FALSE);


INSERT INTO `User` (role_id, department_id, user_name, password, workstation, email, phone_number, active) VALUES
  (1, 1, 'andres.gomez', 'andres123', 'WS101', 'andres.gomez@empresa.com', '555-1001', TRUE),
  (2, 1, 'paula.martinez', 'paula456', 'WS102', 'paula.martinez@empresa.com', '555-1002', TRUE),
  (3, 1, 'carlos.ramos', 'carlos789', 'WS103', 'carlos.ramos@empresa.com', '555-1003', TRUE),
  (4, 1, 'laura.flores', 'laura321', 'WS104', 'laura.flores@empresa.com', '555-1004', TRUE),
  (5, 1, 'diego.hernandez', 'diego654', 'WS105', 'diego.hernandez@empresa.com', '555-1005', TRUE),
  (1, 2, 'adminX_special', 'sup3rS3cret!', 'HACK001', 'adminx@empresaxd.com', '000-0000', TRUE),
  (2, 2, 'xx_m4nu_xx', 'qwerty123', 'WS???', 'manuel@empresa.com', '1234567890', TRUE),
  (3, 2, 'el_ch4p0', 'p4sSw0rd', 'SOFIA-PC', 'chapo@correo.com', NULL, TRUE),
  (4, 2, 'sofia_r', 'm1cor4zon', 'SOFIA-PC', 'sofia_random@mail.com', '555-ABCD', TRUE),
  (5, 2, 'miguel.de.cervantes', 'donquixote2023', 'DON-QUI', 'miguel@delamancha.com', '555-0000', TRUE),
  (1, 3, 'jose.perez', 'jose123', 'WS106', 'jose.perez@empresa.com', '555-1006', TRUE),
  (2, 3, 'lucia.garcia', 'lucia456', 'WS107', 'lucia.garcia@empresa.com', '555-1007', TRUE),
  (3, 3, 'pedro.sanchez', 'pedro789', 'WS108', 'pedro.sanchez@empresa.com', '555-1008', TRUE),
  (4, 3, 'marta.lopez', 'marta321', 'WS109', 'marta.lopez@empresa.com', '555-1009', TRUE),
  (5, 3, 'rafael.morales', 'rafael654', 'WS110', 'rafael.morales@empresa.com', '555-1010', TRUE),
  (1, 4, 'clara.silva', 'claraS3cret!', 'WS111', 'clara.silva@empresa.com', '555-1011', TRUE),
  (2, 4, 'luis.palomino', 'luisqwerty123', 'WS112', 'luis.palomino@empresa.com', '1234567891', TRUE),
  (3, 4, 'sandra.martinez', 'sandraP4ssw0rd', 'SOFIA-PC2', 'sandra.martinez@empresa.com', '555-1012', TRUE),
  (4, 4, 'juan.gonzalez', 'juan_m1cor4zon', 'SOFIA-PC3', 'juan.gonzalez@empresa.com', '555-1013', TRUE),
  (5, 4, 'laura.cortes', 'lauraDonquixote2023', 'DON-QUI2', 'laura.cortes@empresa.com', '555-1014', TRUE),
  (6, NULL, 'admin', 'admin123', 'ADMIN-WS', 'ksjdjsk@sjkdjsk', '555', TRUE);


INSERT INTO Request (user_id, request_status_id, notes, requested_fee, imposed_fee, request_days, active) VALUES
  (1, 1, 'Solicito viáticos para viaje a conferencia en Barcelona.', 1500.00, NULL, 3.0, TRUE),
  (1, 2, 'Reembolso por gastos médicos durante viaje.', 800.00, NULL, 1.0, TRUE),
  (1, 3, 'Solicitud de apoyo económico para capacitación online.', 500.00, NULL, 0.0, TRUE),
  (1, 4, 'Viáticos para taller de liderazgo en Madrid.', 1200.00, NULL, 2.0, TRUE),
  (1, 5, 'Reembolso de transporte.', 300.00, 250.00, 0.5, TRUE),
  (1, 6, 'Apoyo para participación en congreso internacional.', 2000.00, 1800.00, 4.0, TRUE),
  (1, 7, 'Gastos operativos extraordinarios.', 650.00, 600.00, 0.0, TRUE),
  (1, 8, 'Viaje urgente por representación institucional.', 1750.00, 1500.00, 3.5, TRUE),
  (1, 9, 'Solicito anticipo para misión técnica en el extranjero.', 2200.00, 2000.00, 5.0, TRUE),
  (1, 10, 'Solicitud de viáticos por gira de supervisión.', 1300.00, 1200.00, 2.5, TRUE),
  (4, 1, 'Quiero ir a brr brr patapin por favor', 90.00, NULL, 9.0, TRUE),
  (4, 2, 'Yo como cuando', 9999999.00, 10000.0, NULL, TRUE),
  (4, 3, 'Solicito algo para que me den algo porque quiero algo y por eso solicito las cosas, porque el que quiere puede', 10.00, NULL, 3, TRUE),
  (4, 4, 'Momento gastar cuando gastas mucho', 999999999999999999999999999999999999.9999999999999999999, NULL, 33, TRUE),
  (4, 5, 'Cambio de registro para cambiar lo registrado porque se requere cambiar por el nuevo cambio', 80, 0.001, 0.5, TRUE),
  (4, 6, 'anotando anotando anotando anotando anotando anotando anotando', 333333333, 11111111, 80, TRUE),
  (4, 7, 'Llendo al evento de fantasias épicas mayo 2030', 878723, 9823982, 932, TRUE),
  (4, 8, '¿Por qué te vas? Me olvidarás Me olvidarás', 99.99, 88, 3.5, TRUE),
  (4, 9, 'que lento el trafico, ¿por qué no pasa el camion :(?', 100, 100, 100, TRUE),
  (4, 10, 'con el te duele el corazon, conmigo te duelen los pies', 9823, 893, 10, TRUE),
  (5, 1, 'a caminar en el solazo a 40 grados', 3, NULL, 0.8, TRUE),
  (5, 2, '', 32, NULL, 10, TRUE),
  (5, 3, 'imagina hacerte 2 horas en viaje al trabajo, no podria ser yo', 34, NULL, 9, TRUE),
  (5, 4, 'Motivo de solicitud número 43', 93, NULL, 3, TRUE),
  (5, 5, 'Razones: No tengo ninguna razón para estarlo', 3, 93, 01, TRUE),
  (5, 6, 'Evento Vínculo 2025', 2025, 5, 1, TRUE),
  (5, 7, 'Primera línea de notas.\nSegunda línea de notas.', 3, 4, 9, TRUE),
  (5, 8, 'Mensaje: Mensaje', 92, 38, 10, TRUE),
  (5, 9, 'Solicitando para el evento', 9239, 9823, 2, TRUE),
  (5, 10, 'Llenando espacio', 38, 93, 2, TRUE),
  (6, 1, 'Solicitud de ejemplo 1', 100.00, NULL, 5, TRUE),
  (6, 2, 'Solicitud de ejemplo 2', 150.00, NULL, 7, TRUE),
  (6, 3, 'Solicitud de ejemplo 3', 200.00, NULL, 10, TRUE),
  (6, 4, 'Solicitud de ejemplo 4', 50.00, NULL, 3, TRUE),
  (6, 5, 'Solicitud de ejemplo 5', 300.00, 280.00, 15, TRUE),
  (6, 6, 'Solicitud de ejemplo 6', 120.00, 110.00, 6, TRUE),
  (6, 7, 'Solicitud de ejemplo 7', 180.00, 160.00, 8, TRUE),
  (6, 8, 'Solicitud de ejemplo 8', 250.00, 230.00, 12, TRUE),
  (6, 9, 'Solicitud de ejemplo 9', 75.00, 70.00, 4, TRUE),
  (6, 10, 'Solicitud de ejemplo 10', 400.00, 380.00, 20, TRUE),
  (9, 1, 'Hola muy buenas', 423.55, NULL, 12.0, TRUE),
  (9, 2, 'Me voy de aca', 312.40, NULL, 25.0, TRUE),
  (9, 3, 'Ayuda', 267.10, NULL, 9.0, TRUE),
  (9, 4, 'soy', 115.00, NULL, 3.0, TRUE),
  (9, 5, 'mauri', 496.80, 39.99, 15.0, TRUE),
  (9, 6, 'me', 130.75, 25.00, 20.0, TRUE),
  (9, 7, 'estoy', 221.00, 18.30, 7.0, TRUE),
  (9, 8, 'volviendo', 300.00, 95.00, 30.0, TRUE),
  (9, 9, 'locooooooo', 401.25, 10.10, 22.0, TRUE),
  (9, 10, 'hola', 159.99, 0.00, 1.0, TRUE),
  (9, 1, 'E', 450.50, NULL, 18.0, TRUE),
  (10, 1, 'A', 110.20, NULL, 4.0, TRUE),
  (10, 1, 'S', 340.00, NULL, 27.0, TRUE),
  (10, 1, 'T', 205.90, NULL, 13.0, TRUE),
  (10, 1, 'E', 500.00, NULL, 29.0, TRUE),
  (10, 1, 'R', 87.60, NULL, 2.0, TRUE),
  (10, 1, '_', 375.00, NULL, 26.0, TRUE),
  (10, 1, 'E', 285.40, NULL, 8.0, TRUE),
  (10, 1, 'G', 330.00, NULL, 16.0, TRUE),
  (10, 1, 'G', 165.75, NULL, 6.0, TRUE),
  (10, 1, '_', 91.00, NULL, 5.0, TRUE);


INSERT INTO Country (country_name) VALUES
  ('México'),
  ('Estados Unidos'),
  ('Canadá'),
  ('Brásil'),
  ('Argentina'),
  ('Chile'),
  ('Colombia'),
  ('España'),
  ('Francia'),
  ('Reino Unido'),
  ('Alemania'),
  ('Italia'),  
  ('Japón'),
  ('China'),
  ('India');


INSERT INTO City (city_name) VALUES
-- Mexican Cities
  ('CDMX'),
  ('Guadalajara'),
  ('Monterrey'),
  ('Cancún'),
  ('Mérida'),
-- US Cities
  ('Nueva York'),
  ('Los Ángeles'),
  ('San Francisco'),
  ('Chicago'),
  ('Las Vegas'),
-- Canadian Cities
  ('Toronto'),
  ('Vancouver'),
-- Brazilian Cities
  ('Rio de Janeiro'),
  ('Sao Paulo'),
-- Argentine Cities
  ('Buenos Aires'),
  ('Cordoba'),
-- Chilean Cities
  ('Santiago'),
  ('Valparaíso'),
-- Colombian Cities
  ('Bogotá'),
  ('Barranquilla'),
-- Spanish Cities
  ('Madrid'),
  ('Barcelona'),
-- French Cities
  ('Paris'),
  ('Lyon'),
-- UK Cities
  ('Londres'),
  ('Manchester'),
-- German Cities
  ('Berlín'),
  ('Munich'),
-- Italian Cities
  ('Roma'),
  ('Venecia'),
-- Japanese Cities
  ('Tokyo'),
  ('Kyoto'),
-- Chinese Cities
  ('Pekín'),
  ('Hong Kong'),
-- Indian Cities
  ('Bombay'),
  ('Nueva Delhi');


INSERT INTO `Route` (id_origin_country, id_origin_city, id_destination_country, id_destination_city, router_index,
                     plane_needed, hotel_needed, beginning_date, beginning_time, ending_date, ending_time) VALUES
  (1, 1, 1, 2, 0, TRUE, FALSE, '2025-05-01', '08:00:00', '2025-05-01', '11:00:00'),
  (1, 3, 1, 5, 0, TRUE, TRUE,  '2025-05-02', '10:30:00', '2025-05-02', '14:30:00'),
  (1, 2, 1, 1, 0, FALSE, TRUE, '2025-05-03', '12:00:00', '2025-05-03', '15:00:00'),
  (1, 3, 1, 2, 0, TRUE, FALSE, '2025-05-04', '06:00:00', '2025-05-04', '09:00:00'),
  (1, 1, 2, 1, 0, TRUE, TRUE, '2025-05-05', '14:00:00', '2025-05-05', '18:00:00'),
  (2, 1, 1, 1, 0, FALSE, FALSE, '2025-05-06', '11:00:00', '2025-05-06', '13:00:00'),
  (1, 1, 8, 31, 0, TRUE, FALSE, '2025-05-07', '09:30:00', '2025-05-07', '12:30:00'),
  (10, 36, 2, 7, 0, TRUE, TRUE, '2025-05-08', '15:00:00', '2025-05-08', '18:30:00'),
  (1, 1, 8, 31, 0, TRUE, TRUE, '2025-05-09', '08:00:00', '2025-05-09', '11:15:00'),
  (10, 25, 7, 29, 0, TRUE, FALSE, '2025-05-10', '07:00:00', '2025-05-10', '09:00:00'),
  (11, 27, 12, 29, 0, TRUE, FALSE, '2025-05-11', '12:00:00', '2025-05-11', '15:00:00'),
  (12, 29, 11, 27, 0, TRUE, TRUE, '2025-05-12', '13:00:00', '2025-05-12', '17:00:00'),
  (13, 31, 14, 33, 0, TRUE, FALSE, '2025-05-13', '06:00:00', '2025-05-13', '08:30:00'),
  (14, 33, 13, 31, 0, TRUE, TRUE, '2025-05-14', '14:00:00', '2025-05-14', '17:00:00'),
  (15, 35, 1, 1, 0, TRUE, TRUE, '2025-05-15', '10:00:00', '2025-05-15', '13:00:00'),
  (1, 2, 2, 6, 0, TRUE, FALSE, '2025-05-16', '11:00:00', '2025-05-16', '13:45:00'),
  (2, 6, 3, 11, 0, TRUE, FALSE, '2025-05-17', '07:15:00', '2025-05-17', '09:45:00'),
  (3, 11, 4, 13, 0, TRUE, TRUE, '2025-05-18', '16:00:00', '2025-05-18', '19:00:00'),
  (4, 13, 5, 15, 0, TRUE, TRUE, '2025-05-19', '12:30:00', '2025-05-19', '16:00:00'),
  (5, 15, 6, 17, 0, TRUE, FALSE, '2025-05-20', '06:00:00', '2025-05-20', '08:00:00'),
  (6, 17, 7, 19, 0, TRUE, TRUE, '2025-05-21', '13:30:00', '2025-05-21', '15:30:00'),
  (7, 19, 8, 21, 0, TRUE, TRUE, '2025-05-22', '09:00:00', '2025-05-22', '11:45:00'),
  (8, 21, 9, 23, 0, TRUE, FALSE, '2025-05-23', '10:00:00', '2025-05-23', '13:00:00'),
  (9, 23, 10, 25, 0, TRUE, TRUE, '2025-05-24', '11:00:00', '2025-05-24', '13:30:00'),
  (10, 25, 15, 35, 0, TRUE, FALSE, '2025-05-25', '12:00:00', '2025-05-25', '14:30:00'),
  (1, 1, 15, 35, 0, TRUE, TRUE, '2025-05-26', '13:00:00', '2025-05-26', '15:30:00'),
  (2, 6, 14, 33, 0, TRUE, FALSE, '2025-05-27', '14:00:00', '2025-05-27', '16:30:00'),
  (3, 11, 13, 31, 0, TRUE, FALSE, '2025-05-28', '15:00:00', '2025-05-28', '17:30:00'),
  (4, 13, 12, 29, 0, TRUE, TRUE, '2025-05-29', '16:00:00', '2025-05-29', '18:30:00'),
  (5, 15, 11, 27, 0, TRUE, TRUE, '2025-05-30', '17:00:00', '2025-05-30', '19:30:00'),
  (6, 17, 10, 25, 0, TRUE, FALSE, '2025-05-31', '18:00:00', '2025-05-31', '20:30:00'),
  (7, 19, 9, 23, 0, TRUE, TRUE, '2025-06-01', '08:00:00', '2025-06-01', '10:30:00'),
  (8, 21, 8, 21, 0, FALSE, FALSE, '2025-06-02', '09:00:00', '2025-06-02', '11:30:00'),
  (9, 23, 7, 19, 0, TRUE, TRUE, '2025-06-03', '10:00:00', '2025-06-03', '12:30:00'),
  (10, 25, 6, 17, 0, TRUE, TRUE, '2025-06-04', '11:00:00', '2025-06-04', '13:30:00'),
  (11, 27, 5, 15, 0, TRUE, FALSE, '2025-06-05', '12:00:00', '2025-06-05', '14:30:00'),
  (12, 29, 4, 13, 0, TRUE, TRUE, '2025-06-06', '13:00:00', '2025-06-06', '15:30:00'),
  (13, 31, 3, 11, 0, TRUE, FALSE, '2025-06-07', '14:00:00', '2025-06-07', '16:30:00'),
  (14, 33, 2, 6, 0, TRUE, TRUE, '2025-06-08', '15:00:00', '2025-06-08', '17:30:00'),
  (15, 35, 1, 1, 0, FALSE, TRUE, '2025-06-09', '16:00:00', '2025-06-09', '18:30:00'),
  (1, 1, 1, 2, 0, FALSE, TRUE, '2024-03-18', '10:23:41', '2024-03-22', '18:05:19'),
  (2, 6, 2, 9, 0, TRUE, TRUE, '2024-11-10', '06:19:07', '2024-11-13', '14:47:55'),
  (3, 11, 3, 12, 0, FALSE, FALSE, '2024-07-05', '09:55:11', '2024-07-07', '11:41:06'),
  (4, 13, 4, 14, 0, TRUE, FALSE, '2024-06-28', '13:15:44', '2024-07-01', '10:13:32'),
  (5, 15, 5, 16, 0, TRUE, FALSE, '2024-01-12', '17:36:48', '2024-01-14', '23:21:49'),
  (6, 17, 6, 18, 0, FALSE, TRUE, '2024-09-02', '00:34:27', '2024-09-05', '16:57:15'),
  (7, 19, 7, 20, 0, TRUE, FALSE, '2024-05-20', '08:09:03', '2024-05-23', '12:03:27'),
  (8, 21, 8, 22, 0, FALSE, FALSE, '2024-04-08', '21:51:36', '2024-04-11', '07:20:59'),
  (9, 23, 9, 24, 0, TRUE, TRUE, '2024-08-30', '11:18:23', '2024-09-01', '13:22:45'),
  (10, 25, 10, 26, 0, FALSE, TRUE, '2024-10-15', '03:26:02', '2024-10-18', '20:12:38'),
  (11, 27, 11, 28, 0, TRUE, FALSE, '2024-02-06', '14:07:12', '2024-02-08', '22:31:04'),
  (12, 29, 12, 30, 0, FALSE, FALSE, '2024-12-01', '09:46:59', '2024-12-03', '17:40:20'),
  (13, 31, 13, 32, 0, TRUE, TRUE, '2024-03-25', '05:59:35', '2024-03-27', '18:19:02'),
  (14, 33, 14, 34, 0, TRUE, FALSE, '2024-07-17', '16:13:08', '2024-07-20', '12:44:10'),
  (15, 35, 15, 36, 0, FALSE, TRUE, '2024-06-03', '11:24:56', '2024-06-06', '14:12:17'),
  (1, 3, 1, 4, 0, TRUE, TRUE, '2024-09-10', '23:30:14', '2024-09-12', '08:55:22'),
  (2, 7, 2, 10, 0, FALSE, FALSE, '2024-11-23', '10:05:30', '2024-11-26', '21:39:07'),
  (3, 11, 3, 12, 0, TRUE, FALSE, '2024-05-09', '06:44:48', '2024-05-11', '15:28:55'),
  (4, 14, 4, 13, 0, FALSE, TRUE, '2024-10-01', '15:02:19', '2024-10-03', '12:38:55'),
  (5, 15, 5, 16, 0, TRUE, FALSE, '2024-06-12', '07:30:00', '2024-06-14', '17:15:20'),
  (6, 17, 6, 18, 0, FALSE, TRUE, '2024-03-03', '12:45:50', '2024-03-06', '09:05:43'),
  (5, 1, 1, 3, 1, TRUE, TRUE, '2025-05-02', '14:30:00', '2025-05-10', '12:00:33'),
  (1, 1, 3, 11, 1, TRUE, TRUE, '2025-05-03', '15:00:00', '2025-05-13', '14:35:00'),
  (3, 11, 3, 12, 2, TRUE, TRUE, '2025-05-13', '14:35:00', '2025-05-23', '12:45:00');


INSERT INTO Route_Request (request_id, route_id) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5),
  (6, 6),
  (7, 7),
  (8, 8),
  (9, 9),
  (10, 10),
  (11, 11),
  (12, 12),
  (13, 13),
  (14, 14),
  (15, 15),
  (16, 16),
  (17, 17),
  (18, 18),
  (19, 19),
  (20, 20),
  (21, 21),
  (22, 22),
  (23, 23),
  (24, 24),
  (25, 25),
  (26, 26),
  (27, 27),
  (28, 28),
  (29, 29),
  (30, 30),
  (31, 31),
  (32, 32),
  (33, 33),
  (34, 34),
  (35, 35),
  (36, 36),
  (37, 37),
  (38, 38),
  (39, 39),
  (40, 40),
  (41, 41),
  (42, 42),
  (43, 43),
  (44, 44),
  (45, 45),
  (46, 46),
  (47, 47),
  (48, 48),
  (49, 49),
  (50, 50), 
  (51, 51),
  (52, 52),
  (53, 53),
  (54, 54),
  (55, 55),
  (56, 56),
  (57, 57),
  (58, 58),
  (59, 59),
  (60, 60),
  (61, 61),
  (2, 62),
  (3, 63),
  (3, 64);


INSERT INTO Receipt (receipt_type_id, request_id, validation, amount, validation_date) VALUES
  (4, 7, 'Pendiente', 300.00, '2025-04-19 09:00:00'),
  (2, 7, 'Aprobado', 300.00, '2025-04-19 09:03:00'),
  (3, 8, 'Rechazado', 1000.00, '2025-04-19 18:00:00'),
  (7, 8, 'Pendiente', 600.00, '2025-04-19 18:00:59'),
  (2, 17, 'Aprobado', 4550.25, '2025-03-21 10:00:00'),
  (3, 17, 'Rechazado', 1905.30, '2025-04-22 12:00:00'),
  (6, 18, 'Pendiente', 2290.55, '2003-04-19 10:06:43'),
  (2, 18, 'Aprobado', 3035.10, '2025-02-23 16:00:00'),
  (5, 27, 'Rechazado', 498.75, '2025-04-23 18:30:00'),
  (1, 27, 'Pendiente', 4100.00, '2025-06-19 20:17:24'),
  (3, 28, 'Aprobado', 1722.80, NULL),
  (6, 28, 'Pendiente', 2788.65, '2003-07-31 06:35:24'),
  (5, 37, 'Rechazado', 3940.99, '2006-02-08 15:59:45'),
  (7, 37, 'Aprobado', 2165.44, '2036-07-17 16:50:33'),
  (1, 38, 'Pendiente', 1560.10, '2036-08-31 23:59:59'),
  (2, 38, 'Rechazado', 3312.77, NULL),
  (6, 47, 'Pendiente', 420.89, '2025-05-02 14:15:48'),
  (4, 47, 'Rechazado', 1801.23, '2020-03-18 16:15:24'),
  (3, 48, 'Pendiente', 2475.00, NULL),
  (5, 48, 'Aprobado', 3500.60, '2024-09-15 11:42:31');
