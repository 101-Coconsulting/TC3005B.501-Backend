USE CocoScheme;

INSERT INTO Receipt_Type (receipt_type_name) VALUES
    ('Hospedaje'),
    ('Comida'),
    ('Transporte'),
    ('Caseta'),
    ('Autobús'),
    ('Vuelo'),
    ('Otro');

INSERT INTO Role (role_name) VALUES
    ('Solicitante'),
    ('Agencia de viajes'),
    ('Cuentas por pagar'),
    ('N1'),
    ('N2'),
    ('Administrador');

INSERT INTO Request_status (status) VALUES
    (1),
    (2),
    (3),
    (4),
    (5),
    (6),
    (7),
    (8);
