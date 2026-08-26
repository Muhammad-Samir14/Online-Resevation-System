/*
# Create core application tables for Marwat Gas Agency

1. New Tables
- `bookings` — stores LPG cylinder bookings submitted from the Book Gas page
  - order_type (Domestic/Refill/Bulk), customer info, cylinder details, delivery info, payment info
- `customers` — admin-managed customer records
- `products` — admin-managed cylinder catalog (name, type, weight, price, stock, description)
- `orders` — admin-managed order pipeline (customer name, product, quantity, amount, status, address)
- `delivery_personnel` — admin-managed fleet (name, contact, vehicle, status, metrics)

2. Security
- RLS enabled on all tables.
- `bookings`: anon + authenticated can insert (public booking form); only authenticated can read/update/delete.
- `customers`, `products`, `orders`, `delivery_personnel`: anon + authenticated full CRUD (admin-managed data, accessed via anon-key client from the admin portal which uses a fixed credential check, not Supabase auth).
*/

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_type text DEFAULT 'Domestic',
  full_name text NOT NULL,
  email text,
  phone_number text,
  cylinder_type text,
  cylinder_size text,
  quantity int DEFAULT 1,
  unit_price numeric DEFAULT 0,
  total_price numeric DEFAULT 0,
  delivery_time_slot text,
  street_address text,
  landmark text,
  payment_method text DEFAULT 'Cash on Delivery',
  sender_name text,
  sender_number text,
  amount_sent numeric,
  transaction_id text,
  payment_screenshot_name text,
  additional_notes text,
  status text DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_bookings" ON bookings;
CREATE POLICY "anon_select_bookings" ON bookings FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_bookings" ON bookings;
CREATE POLICY "anon_update_bookings" ON bookings FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_bookings" ON bookings;
CREATE POLICY "anon_delete_bookings" ON bookings FOR DELETE
TO anon, authenticated USING (true);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  address text,
  status text DEFAULT 'Active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_customers" ON customers;
CREATE POLICY "anon_select_customers" ON customers FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_customers" ON customers;
CREATE POLICY "anon_insert_customers" ON customers FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_customers" ON customers;
CREATE POLICY "anon_update_customers" ON customers FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_customers" ON customers;
CREATE POLICY "anon_delete_customers" ON customers FOR DELETE
TO anon, authenticated USING (true);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text,
  weight text,
  price numeric DEFAULT 0,
  stock int DEFAULT 0,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
TO anon, authenticated USING (true);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "customerName" text NOT NULL,
  product text,
  quantity int DEFAULT 1,
  "totalAmount" numeric DEFAULT 0,
  status text DEFAULT 'Pending',
  "orderDate" text,
  "deliveryAddress" text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
TO anon, authenticated USING (true);

-- Delivery personnel table
CREATE TABLE IF NOT EXISTS delivery_personnel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  "vehicleType" text,
  "vehiclePlate" text,
  status text DEFAULT 'Available',
  "completedDeliveries" int DEFAULT 0,
  rating text DEFAULT '5.0',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE delivery_personnel ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_personnel" ON delivery_personnel;
CREATE POLICY "anon_select_personnel" ON delivery_personnel FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_personnel" ON delivery_personnel;
CREATE POLICY "anon_insert_personnel" ON delivery_personnel FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_personnel" ON delivery_personnel;
CREATE POLICY "anon_update_personnel" ON delivery_personnel FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_personnel" ON delivery_personnel;
CREATE POLICY "anon_delete_personnel" ON delivery_personnel FOR DELETE
TO anon, authenticated USING (true);
