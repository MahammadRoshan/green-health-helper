
CREATE OR REPLACE FUNCTION public.refresh_monthly_credits()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  new_credits INTEGER;
BEGIN
  IF auth.uid() IS NULL THEN RETURN NULL; END IF;
  UPDATE public.profiles
    SET credits = GREATEST(credits, 100),
        credits_refreshed_at = now(),
        updated_at = now()
    WHERE id = auth.uid()
      AND is_subscribed = false
      AND credits_refreshed_at < (now() - interval '30 days')
    RETURNING credits INTO new_credits;
  RETURN new_credits;
END;
$$;
