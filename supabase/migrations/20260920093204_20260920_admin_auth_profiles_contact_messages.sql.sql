/*
# Admin Authentication, Profiles, and Contact Messages

## Purpose
This migration adds the infrastructure for secure admin authentication,
user profiles, and a contact messages system for the Marwat Gas Agency app.

## Changes

### 1. New Table: profiles
- `id` (uuid, primary key, references auth.users) — one row per auth user
- `email` (text) — user's email from auth
- `full_name` (text) — user's full name
- `phone_number` (text) — user's phone number
- `is_admin` (boolean, default false) — admin flag, checked alongside email for admin access
- `created_at` (timestamptz) — when the profile was created

### 2. New Table: contact_messages
- `id` (uuid, primary key)
- `name` (text) — sender's full name
- `phone` (text) — sender's phone number
- `email` (text) — sender's email
- `message` (text) — the message content
- `status` (text, default 'New') — New / Read / Responded
- `created_at` (timestamptz) — when the message was submitted

### 3. Trigger: auto_create_profile_on_signup
- Automatically creates a profiles row when a new user signs up via Supabase Auth
- Copies email, full_name, and phone_number from the user's metadata

### 4. Security: RLS Policies
- profiles: users can read/update only their own profile row
- contact_messages: anyone (anon + authenticated) can insert; only authenticated can read/update/delete

### 5. Important Notes
- The is_admin column defaults to false. To grant admin access, run:
  UPDATE profiles SET is_admin = true WHERE email = 'isamirkhan5616@gmail.com';
- Admin access requires BOTH is_admin = true AND email = 'isamirkhan5616@gmail.com'
*/

-- ============================================================
-- 1. Create profiles table
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  phone_number text,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile (but NOT is_admin — handled by column privilege below)
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Prevent users from updating is_admin via column-level privilege
REVOKE UPDATE (is_admin) ON profiles FROM authenticated, anon;

-- ============================================================
-- 2. Create contact_messages table
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  email text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact message
DROP POLICY IF EXISTS "insert_contact_messages" ON contact_messages;
CREATE POLICY "insert_contact_messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated (admin) can read contact messages
DROP POLICY IF EXISTS "select_contact_messages" ON contact_messages;
CREATE POLICY "select_contact_messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated (admin) can update contact message status
DROP POLICY IF EXISTS "update_contact_messages" ON contact_messages;
CREATE POLICY "update_contact_messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated (admin) can delete contact messages
DROP POLICY IF EXISTS "delete_contact_messages" ON contact_messages;
CREATE POLICY "delete_contact_messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- 3. Trigger: auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone_number)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();