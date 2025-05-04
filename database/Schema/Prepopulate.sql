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

INSERT INTO AlertMessage (message_text) VALUES
    ('Se ha abierto una solicitud.'),
    ('Se requiere tu revisión para Primera Revisión.'),
    ('Se requiere tu revisión para Segunda Revisión.'),
    ('La solicitud está lista para generar su cotización de viaje.'),
    ('Se deben asignar los servicios del viaje para la solicitud.'),
    ('Se requiere validar comprobantes de los gastos del viaje.'),
    ('Los comprobantes están listos para validación.');

INSERT INTO Request_status (status) VALUES
    ('Abierto'),
    ('Primera Revisión'),
    ('Segunda Revisión'),
    ('Cotización del Viaje'),
    ('Atención Agencia de Viajes'),
    ('Comprobación gastos del viaje'),
    ('Validación de comprobantes'),
    ('Finalizado'),
    ('Cancelado'),
    ('Rechazado');
