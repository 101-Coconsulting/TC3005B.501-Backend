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
    ('Abierto'),
    ('Primera Revisión'),
    ('Segunda Revisión'),
    ('Atención Agencia de Viajes'),
    ('Cotización del Viaje'),
    ('Comprobación gastos del viaje'),
    ('Validación de comprobantes'),
    ('Finalizado'),
    ('Cancelado'),
    ('Rechazado');
