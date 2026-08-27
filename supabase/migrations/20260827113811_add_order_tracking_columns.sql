/*
# Add order tracking columns to the orders table

1. Modified Tables
- `orders`:
  - `estimated_delivery_minutes` (int, nullable) — admin-set ETA in minutes (e.g. 30, 45, 60)
  - `eta_set_at` (timestamptz, nullable) — timestamp when the ETA was last set/updated; the customer-facing countdown is computed as estimated_delivery_minutes minus elapsed time since this timestamp
  - `user_email` (text, nullable) — email of the logged-in customer the order belongs to, used by the Track Order page to find the user's most recent order

2. Security
- No new tables. Existing RLS policies on `orders` already allow anon + authenticated CRUD, so the new columns inherit those policies automatically.

3. Notes
- All three columns are nullable so existing order rows are unaffected.
- When the admin updates the ETA, the application sets both `estimated_delivery_minutes` and `eta_set_at = now()` so the countdown restarts from the new value.
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'estimated_delivery_minutes'
  ) THEN
    ALTER TABLE orders ADD COLUMN estimated_delivery_minutes int;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'eta_set_at'
  ) THEN
    ALTER TABLE orders ADD COLUMN eta_set_at timestamptz;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'user_email'
  ) THEN
    ALTER TABLE orders ADD COLUMN user_email text;
  END IF;
END $$;
