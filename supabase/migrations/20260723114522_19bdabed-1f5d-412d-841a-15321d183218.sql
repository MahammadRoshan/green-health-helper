
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS credits_refreshed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'free';

CREATE OR REPLACE FUNCTION public.refresh_monthly_credits()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
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

REVOKE ALL ON FUNCTION public.refresh_monthly_credits() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.refresh_monthly_credits() TO authenticated;

CREATE OR REPLACE FUNCTION public.increment_login_count()
RETURNS INTEGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  INSERT INTO public.profiles (id, login_count)
  VALUES (auth.uid(), 1)
  ON CONFLICT (id) DO UPDATE SET login_count = public.profiles.login_count + 1, updated_at = now()
  RETURNING login_count INTO new_count;
  PERFORM public.refresh_monthly_credits();
  RETURN new_count;
END;
$$;
