INSERT INTO suppliers (id_type, id_number, name, address, phone, email, contact_person, economic_activity) VALUES
('NIT', '900123456-1', 'Laboratorios Farmacéuticos ABC S.A.S.', 'Calle 123 #45-67, Bogotá', '+57 1 234-5678', 'contacto@lababc.com', 'María González', 'Fabricación de productos farmacéuticos'),
('NIT', '800987654-2', 'Distribuidora Médica XYZ Ltda.', 'Carrera 78 #90-12, Medellín', '+57 4 987-6543', 'ventas@distxyz.com', 'Carlos Rodríguez', 'Comercio al por mayor de productos farmacéuticos'),
('CC', '12345678', 'Droguería El Bienestar', 'Avenida 45 #23-89, Cali', '+57 2 345-6789', 'info@elbienestar.com', 'Ana Martínez', 'Comercio al por menor de productos farmacéuticos');

INSERT INTO products (code, name, description, laboratory) VALUES
('MED001', 'Acetaminofén 500mg', 'Analgésico y antipirético en tabletas', 'Laboratorios ABC'),
('MED002', 'Ibuprofeno 400mg', 'Antiinflamatorio no esteroideo', 'Laboratorios ABC'),
('MED003', 'Amoxicilina 500mg', 'Antibiótico betalactámico', 'Distribuidora XYZ'),
('MED004', 'Omeprazol 20mg', 'Inhibidor de la bomba de protones', 'Laboratorios ABC'),
('MED005', 'Loratadina 10mg', 'Antihistamínico de segunda generación', 'Distribuidora XYZ');

INSERT INTO product_receptions (product_id, supplier_id, invoice_number, quantity, batch_number, invima_registration, expiration_date, presentation_state, notes)
SELECT 
  p.id,
  s.id,
  'FAC-' || LPAD((ROW_NUMBER() OVER())::text, 6, '0'),
  (RANDOM() * 500 + 50)::INTEGER,
  'LOTE-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD((ROW_NUMBER() OVER())::text, 3, '0'),
  'INVIMA-' || LPAD((RANDOM() * 999999 + 100000)::INTEGER::text, 6, '0'),
  NOW() + INTERVAL '2 years' + (RANDOM() * INTERVAL '1 year'),
  CASE 
    WHEN RANDOM() < 0.8 THEN 'bueno'
    WHEN RANDOM() < 0.95 THEN 'regular'
    ELSE 'malo'
  END,
  'Recepción de productos en condiciones normales'
FROM products p
CROSS JOIN suppliers s
WHERE s.id_type = 'NIT'
LIMIT 10;
