-- GatekeeperSystem Database Schema

-- Tabla para almacenar folios de pago válidos (fuente de verdad)
CREATE TABLE IF NOT EXISTS pagos_referencia (
    id SERIAL PRIMARY KEY,
    folio VARCHAR(50) UNIQUE NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para gestionar el ciclo de vida de las solicitudes de acceso
CREATE TABLE IF NOT EXISTS solicitudes (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    folio VARCHAR(50) NOT NULL REFERENCES pagos_referencia(folio) ON DELETE RESTRICT,
    estatus VARCHAR(20) NOT NULL DEFAULT 'Procesando', -- Posibles valores: 'Procesando', 'Aceptado', 'Rechazado'
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos de prueba para validar el flujo
INSERT INTO pagos_referencia (folio, monto) VALUES 
('FOLIO-12345', 500.00),
('FOLIO-ABCDE', 500.00),
('FOLIO-VALIDO-777', 500.00)
ON CONFLICT (folio) DO NOTHING;
