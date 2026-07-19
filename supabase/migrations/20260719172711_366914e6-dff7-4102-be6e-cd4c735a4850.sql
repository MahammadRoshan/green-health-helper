
-- Fix 1: prevent authenticated users from self-granting subscription
CREATE OR REPLACE FUNCTION public.prevent_subscription_self_grant()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_subscribed IS DISTINCT FROM OLD.is_subscribed
     AND current_setting('request.jwt.claim.role', true) = 'authenticated' THEN
    RAISE EXCEPTION 'Subscription status can only be updated by the payment system';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_subscription_self_grant_trigger ON public.profiles;
CREATE TRIGGER prevent_subscription_self_grant_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_subscription_self_grant();

-- Reset any self-granted subscriptions
UPDATE public.profiles SET is_subscribed = false WHERE is_subscribed = true;

-- Fix 2: SECURITY DEFINER function executable by authenticated users
-- Switch increment_login_count to SECURITY INVOKER (existing RLS lets user update own profile)
CREATE OR REPLACE FUNCTION public.increment_login_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  INSERT INTO public.profiles (id, login_count)
  VALUES (auth.uid(), 1)
  ON CONFLICT (id) DO UPDATE SET login_count = public.profiles.login_count + 1, updated_at = now()
  RETURNING login_count INTO new_count;
  RETURN new_count;
END;
$$;
