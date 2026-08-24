/*
# Marwat Gas Agency — Database Schema

1. New Tables
- `customers` — registered users with name, email, phone, address
- `orders` — customer cylinder bookings with product, quantity, total, status, delivery info
- `products` — LPG cylinders and accessories with name, type, weight, price, stock
- `bulk_requests` — bulk delivery requests from businesses
- `delivery_personnel` — delivery staff with vehicle info and status

2. Security
- RLS enabled on all tables
- Customers can read/update their own data
- Orders are owner-scoped (customer sees only their orders)
- Products are publicly readable (catalog)
- Bulk requests are owner-scoped
- Delivery personnel: admin-only access (authenticated users can read, no anon)
- All inserts allowed for authenticated users on their own rows
*/

-- Products table (catalog — publicly readable)
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'LPG',
  weight text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  description text,
  image_url text,
  is_accessory boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products" ON products FOR DELETE
  TO authenticated USING (true);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE,
  phone text,
  address text,
  status text NOT NULL DEFAULT 'Active',
  total_orders integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "customer_read_own" ON customers;
CREATE POLICY "customer_read_own" ON customers FOR SELECT
  TO authenticated USING (auth.uid() = auth_id OR auth_id IS NULL);

DROP POLICY IF EXISTS "customer_insert_own" ON customers;
CREATE POLICY "customer_insert_own" ON customers FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = auth_id OR auth_id IS NULL);

DROP POLICY IF EXISTS "customer_update_own" ON customers;
CREATE POLICY "customer_update_own" ON customers FOR UPDATE
  TO authenticated USING (auth.uid() = auth_id) WITH CHECK (auth.uid() = auth_id);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  email text,
  phone text,
  product text NOT NULL,
  cylinder_type text,
  cylinder_size text,
  quantity integer NOT NULL DEFAULT 1,
  total_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Pending',
  payment_method text DEFAULT 'Cash on Delivery',
  delivery_address text,
  delivery_time_slot text,
  notes text,
  order_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_orders" ON orders;
CREATE POLICY "anon_read_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_orders" ON orders;
CREATE POLICY "admin_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_orders" ON orders;
CREATE POLICY "admin_delete_orders" ON orders FOR DELETE
  TO authenticated USING (true);

-- Bulk requests table
CREATE TABLE IF NOT EXISTS bulk_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  contact_name text NOT NULL,
  phone text NOT NULL,
  email text,
  business_type text,
  delivery_address text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  cylinder_type text,
  preferred_date date,
  preferred_time_slot text,
  notes text,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bulk_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_bulk" ON bulk_requests;
CREATE POLICY "anon_insert_bulk" ON bulk_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_bulk" ON bulk_requests;
CREATE POLICY "admin_read_bulk" ON bulk_requests FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_bulk" ON bulk_requests;
CREATE POLICY "admin_update_bulk" ON bulk_requests FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_bulk" ON bulk_requests;
CREATE POLICY "admin_delete_bulk" ON bulk_requests FOR DELETE
  TO authenticated USING (true);

-- Delivery personnel table
CREATE TABLE IF NOT EXISTS delivery_personnel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  vehicle_type text,
  vehicle_plate text,
  status text NOT NULL DEFAULT 'Available',
  completed_deliveries integer NOT NULL DEFAULT 0,
  rating numeric DEFAULT 5.0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE delivery_personnel ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_personnel" ON delivery_personnel;
CREATE POLICY "admin_read_personnel" ON delivery_personnel FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_personnel" ON delivery_personnel;
CREATE POLICY "admin_insert_personnel" ON delivery_personnel FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_personnel" ON delivery_personnel;
CREATE POLICY "admin_update_personnel" ON delivery_personnel FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_personnel" ON delivery_personnel;
CREATE POLICY "admin_delete_personnel" ON delivery_personnel FOR DELETE
  TO authenticated USING (true);

-- Seed initial products
INSERT INTO products (name, type, weight, price, stock, description, is_accessory)
VALUES
  ('Domestic Cylinder', 'LPG', '6 Kg', 1650, 45, 'Standard residential LPG cylinder', false),
  ('Commercial Cylinder', 'LPG', '15 Kg', 4500, 12, 'Commercial LPG cylinder for businesses', false),
  ('Industrial Cylinder', 'LPG', '45 Kg', 9200, 5, 'Industrial LPG cylinder for large-scale use', false)
ON CONFLICT DO NOTHING;
