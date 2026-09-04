-- Revoke EXECUTE from PUBLIC (PostgreSQL grants EXECUTE to PUBLIC by default)
-- Also explicitly revoke from anon and authenticated again to be thorough

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.notify_admin_new_order() FROM PUBLIC;

-- Re-grant EXECUTE only to the service_role (for internal/trigger use)
-- Note: SECURITY DEFINER functions run with the owner's privileges,
-- and triggers fire with the table owner's privileges, so no explicit
-- grant is needed for trigger-based execution.
-- The service_role bypasses RLS and has full access regardless.
