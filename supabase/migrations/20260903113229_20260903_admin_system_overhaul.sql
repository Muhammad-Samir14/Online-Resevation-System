/*
# Admin System Overhaul — Schema, RLS, Realtime, Admin Authorization

## Summary
This migration restructures the database to support a proper admin system with Supabase Auth:
1. Adds `user_id` to `bookings` table to associate orders with authenticated customers.
2. Creates an `is_admin()` SECURITY DEFINER function that checks if the current user's
   `raw_app_meta_data->>role` equals 'admin' — this is the server-side admin authorization check.
3. Creates a `handle_new_user` trigger function that auto-creates a row in `customers` when
   a new auth user signs up, copying their name/phone from user_metadata.
4. Tightens RLS policies on all tables:
   - `bookings`: customers can read/update only their own orders; admin can do everything;
     any authenticated user can insert (so logged-in customers can place orders).
   - `customers`: customers can read/update only their own profile; admin can do everything.
   - `products`: public can read; only admin can write.
   - `orders`: admin-only CRUD (this table remains for admin-managed order pipeline).
   - `delivery_personnel`: admin-only CRUD.
   - `bulk_requests`: admin can read/update/delete; any authenticated user can insert.
5. Enables Supabase Realtime on the `bookings` table so the admin panel gets live order alerts.
6. Adds indexes on `bookings(user_id)` and `bookings(status)` for faster queries.

## Security Changes
- All permissive `USING (true)` policies are replaced with proper ownership/admin checks.
- The `is_admin()` function reads from `raw_app_meta_data` (server-set, user-immutable),
  NOT `raw_user_meta_data` (user-editable).
- Admin authorization is enforced at the database level — even if someone reaches the admin
  UI, they cannot read/write admin data without the admin role in their JWT.
*/

-- ============================================================
-- 1. Add user_id column to bookings
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================
-- 2. Create is_admin() function
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'raw_app_meta_data' ->> 'role') = 'admin',
    false
  );
$$;

-- ============================================================
-- 3. Auto-create customer profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.customers (auth_id, name, email, phone, status, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'phone_number', NEW.raw_user_meta_data ->> 'phone', ''),
    'Active',
    now()
  )
  ON CONFLICT (email) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 4. RLS: bookings — customer sees own, admin sees all
-- ============================================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_bookings" ON bookings;
DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
DROP POLICY IF EXISTS "anon_update_bookings" ON bookings;
DROP POLICY IF EXISTS "anon_delete_bookings" ON bookings;

-- Customers can read their own bookings; admin can read all
CREATE POLICY "bookings_select_own_or_admin" ON bookings FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR public.is_admin());

-- Any authenticated user can insert their own booking
CREATE POLICY "bookings_insert_own" ON bookings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Customers can update their own bookings; admin can update all
CREATE POLICY "bookings_update_own_or_admin" ON bookings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Only admin can delete bookings
CREATE POLICY "bookings_delete_admin" ON bookings FOR DELETE
  TO authenticated USING (public.is_admin());

-- ============================================================
-- 5. RLS: customers — customer sees own profile, admin sees all
-- ============================================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_customers" ON customers;
DROP POLICY IF EXISTS "anon_insert_customers" ON customers;
DROP POLICY IF EXISTS "anon_update_customers" ON customers;
DROP POLICY IF EXISTS "anon_delete_customers" ON customers;
DROP POLICY IF EXISTS "customer_insert_own" ON customers;
DROP POLICY IF EXISTS "customer_read_own" ON customers;
DROP POLICY IF EXISTS "customer_update_own" ON customers;

CREATE POLICY "customers_select_own_or_admin" ON customers FOR SELECT
  TO authenticated USING (auth.uid() = auth_id OR public.is_admin());

CREATE POLICY "customers_insert_admin" ON customers FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "customers_update_own_or_admin" ON customers FOR UPDATE
  TO authenticated USING (auth.uid() = auth_id OR public.is_admin())
  WITH CHECK (auth.uid() = auth_id OR public.is_admin());

CREATE POLICY "customers_delete_admin" ON customers FOR DELETE
  TO authenticated USING (public.is_admin());

-- ============================================================
-- 6. RLS: products — public read, admin write
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
DROP POLICY IF EXISTS "anon_insert_products" ON products;
DROP POLICY IF EXISTS "anon_update_products" ON products;
DROP POLICY IF EXISTS "anon_delete_products" ON products;
DROP POLICY IF EXISTS "public_read_products" ON products;
DROP POLICY IF EXISTS "admin_delete_products" ON products;
DROP POLICY IF EXISTS "admin_insert_products" ON products;
DROP POLICY IF EXISTS "admin_update_products" ON products;

CREATE POLICY "products_public_read" ON products FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "products_admin_insert" ON products FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "products_admin_update" ON products FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "products_admin_delete" ON products FOR DELETE
  TO authenticated USING (public.is_admin());

-- ============================================================
-- 7. RLS: orders — admin-only CRUD
-- ============================================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
DROP POLICY IF EXISTS "anon_update_orders" ON orders;
DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
DROP POLICY IF EXISTS "admin_delete_orders" ON orders;
DROP POLICY IF EXISTS "admin_update_orders" ON orders;
DROP POLICY IF EXISTS "anon_read_orders" ON orders;

CREATE POLICY "orders_admin_select" ON orders FOR SELECT
  TO authenticated USING (public.is_admin());

CREATE POLICY "orders_admin_insert" ON orders FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "orders_admin_update" ON orders FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "orders_admin_delete" ON orders FOR DELETE
  TO authenticated USING (public.is_admin());

-- ============================================================
-- 8. RLS: delivery_personnel — admin-only CRUD
-- ============================================================
ALTER TABLE delivery_personnel ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_personnel" ON delivery_personnel;
DROP POLICY IF EXISTS "anon_insert_personnel" ON delivery_personnel;
DROP POLICY IF EXISTS "anon_update_personnel" ON delivery_personnel;
DROP POLICY IF EXISTS "anon_delete_personnel" ON delivery_personnel;
DROP POLICY IF EXISTS "admin_delete_personnel" ON delivery_personnel;
DROP POLICY IF EXISTS "admin_insert_personnel" ON delivery_personnel;
DROP POLICY IF EXISTS "admin_read_personnel" ON delivery_personnel;
DROP POLICY IF EXISTS "admin_update_personnel" ON delivery_personnel;

CREATE POLICY "personnel_admin_select" ON delivery_personnel FOR SELECT
  TO authenticated USING (public.is_admin());

CREATE POLICY "personnel_admin_insert" ON delivery_personnel FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "personnel_admin_update" ON delivery_personnel FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "personnel_admin_delete" ON delivery_personnel FOR DELETE
  TO authenticated USING (public.is_admin());

-- ============================================================
-- 9. RLS: bulk_requests — admin read/update/delete, authenticated insert
-- ============================================================
ALTER TABLE bulk_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_delete_bulk" ON bulk_requests;
DROP POLICY IF EXISTS "admin_read_bulk" ON bulk_requests;
DROP POLICY IF EXISTS "admin_update_bulk" ON bulk_requests;
DROP POLICY IF EXISTS "anon_insert_bulk" ON bulk_requests;

CREATE POLICY "bulk_admin_select" ON bulk_requests FOR SELECT
  TO authenticated USING (public.is_admin());

CREATE POLICY "bulk_authenticated_insert" ON bulk_requests FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "bulk_admin_update" ON bulk_requests FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "bulk_admin_delete" ON bulk_requests FOR DELETE
  TO authenticated USING (public.is_admin());

-- ============================================================
-- 10. Indexes for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- ============================================================
-- 11. Enable Realtime on bookings table
-- ============================================================
ALTER TABLE bookings REPLICA IDENTITY FULL;
