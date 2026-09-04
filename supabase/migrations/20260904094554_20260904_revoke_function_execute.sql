-- Revoke EXECUTE on SECURITY DEFINER functions from public roles
-- These functions are only meant to be called internally (by triggers) or by the database

-- handle_new_user: only called by the auth.users trigger, never by API clients
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- is_admin: used in RLS policies, called by the database during policy evaluation
-- It reads from auth.jwt() so it's safe if called, but no need for direct API access
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, authenticated;

-- notify_admin_new_order: only called by the bookings trigger, never by API clients
REVOKE EXECUTE ON FUNCTION public.notify_admin_new_order() FROM anon, authenticated;
