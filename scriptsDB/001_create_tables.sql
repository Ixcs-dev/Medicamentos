
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_type VARCHAR(20) NOT NULL CHECK (id_type IN ('CC', 'NIT', 'CE', 'PP')),
  id_number VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  contact_person VARCHAR(255),
  economic_activity VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  laboratory VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_receptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reception_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  invoice_number VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  batch_number VARCHAR(100),
  invima_registration VARCHAR(100),
  expiration_date DATE,
  presentation_state VARCHAR(50) NOT NULL CHECK (presentation_state IN ('bueno', 'regular', 'malo')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_suppliers_id_number ON suppliers(id_number);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_receptions_product_id ON product_receptions(product_id);
CREATE INDEX IF NOT EXISTS idx_receptions_supplier_id ON product_receptions(supplier_id);
CREATE INDEX IF NOT EXISTS idx_receptions_date ON product_receptions(reception_date);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_receptions ENABLE ROW LEVEL SECURITY;


CREATE POLICY "suppliers_select" ON suppliers FOR SELECT USING (true);
CREATE POLICY "suppliers_insert" ON suppliers FOR INSERT WITH CHECK (true);
CREATE POLICY "suppliers_update" ON suppliers FOR UPDATE USING (true);
CREATE POLICY "suppliers_delete" ON suppliers FOR DELETE USING (true);

CREATE POLICY "products_select" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_update" ON products FOR UPDATE USING (true);
CREATE POLICY "products_delete" ON products FOR DELETE USING (true);

CREATE POLICY "receptions_select" ON product_receptions FOR SELECT USING (true);
CREATE POLICY "receptions_insert" ON product_receptions FOR INSERT WITH CHECK (true);
CREATE POLICY "receptions_update" ON product_receptions FOR UPDATE USING (true);
CREATE POLICY "receptions_delete" ON product_receptions FOR DELETE USING (true);
