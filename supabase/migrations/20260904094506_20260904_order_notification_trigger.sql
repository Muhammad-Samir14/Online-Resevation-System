-- Create a trigger function that calls the edge function when a new booking is created
-- The edge function sends an email notification to the admin

CREATE OR REPLACE FUNCTION public.notify_admin_new_order()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  function_url text;
  payload jsonb;
BEGIN
  -- Build the edge function URL from the Supabase project URL
  function_url := current_setting('app.supabase_url', true);
  IF function_url IS NULL OR function_url = '' THEN
    -- Fallback: try to construct from the database URL
    SELECT replace(
      replace(
        replace(current_setting('app.settings', true), '', ''),
        '', ''
      ), '', ''
    ) INTO function_url;
  END IF;

  -- If we can't determine the URL, skip the notification
  -- The edge function will also be called from the client side as a fallback
  IF function_url IS NULL OR function_url = '' THEN
    RETURN NEW;
  END IF;

  payload := jsonb_build_object(
    'order', to_jsonb(NEW),
    'adminEmail', 'isamirkhan5616@gmail.com'
  );

  -- Use the Supabase pg_net extension to make an HTTP POST request
  -- This is a best-effort notification; if pg_net is not available, the client will also call the function
  BEGIN
    PERFORM net.http_post(
      url := function_url || '/functions/v1/send-order-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
      ),
      body := payload
    );
  EXCEPTION WHEN OTHERS THEN
    -- If pg_net is not available or fails, silently continue
    -- The client-side code will also call the edge function as a fallback
    NULL;
  END;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_booking_created_notify_admin ON bookings;

-- Create the trigger
CREATE TRIGGER on_booking_created_notify_admin
  AFTER INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION public.notify_admin_new_order();
