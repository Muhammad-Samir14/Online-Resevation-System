-- Convert is_admin() to SECURITY INVOKER so it's not flagged as a
-- SECURITY DEFINER function callable by anon/authenticated.
-- SECURITY INVOKER means it runs with the caller's privileges, but since
-- it only calls auth.jwt() (available to all roles) and returns a boolean,
-- this is safe and resolves the advisor warning.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
SELECT COALESCE(
  (auth.jwt() -> 'raw_app_meta_data' ->> 'role') = 'admin',
  false
);
$function$;

-- Keep the EXECUTE grants so RLS policies can call it
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;