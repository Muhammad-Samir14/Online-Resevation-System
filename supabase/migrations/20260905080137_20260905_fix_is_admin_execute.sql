-- Fix: is_admin() is used in RLS policies. When a user queries a table whose
-- policy references is_admin(), PostgreSQL evaluates the function as the
-- current user. If the user lacks EXECUTE on is_admin(), the query fails with
-- "Database error querying schema".
--
-- Re-grant EXECUTE on is_admin() to authenticated (and anon) so RLS policies
-- that call it can evaluate. The function is safe: it only reads the JWT's
-- app_metadata role claim and returns a boolean — no side effects, no
-- privileged data exposure.
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- handle_new_user and notify_admin_new_order remain restricted:
-- they are only called by triggers (which run as the table owner), not by
-- API clients. No grant needed for those.