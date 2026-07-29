CREATE OR REPLACE FUNCTION public.prevent_subscription_self_grant()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only restrict updates coming from end-user (client) roles.
  IF current_user IN ('authenticated', 'anon') THEN
    IF NEW.is_subscribed IS DISTINCT FROM OLD.is_subscribed THEN
      RAISE EXCEPTION 'Subscription status can only be updated by the payment system';
    END IF;
    IF NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier THEN
      RAISE EXCEPTION 'Subscription tier can only be updated by the payment system';
    END IF;
    IF NEW.credits IS DISTINCT FROM OLD.credits THEN
      RAISE EXCEPTION 'Credits can only be updated by the system';
    END IF;
    IF NEW.credits_refreshed_at IS DISTINCT FROM OLD.credits_refreshed_at THEN
      RAISE EXCEPTION 'Credit refresh timestamp can only be updated by the system';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS prevent_subscription_self_grant_trg ON public.profiles;
CREATE TRIGGER prevent_subscription_self_grant_trg
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_subscription_self_grant();

-- Credit functions must run with elevated rights so the trigger's client-role
-- check does not block legitimate system-driven credit changes.
CREATE OR REPLACE FUNCTION public.deduct_credits(amount integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_balance INTEGER;
  current_balance INTEGER;
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  SELECT credits INTO current_balance FROM public.profiles WHERE id = uid;
  IF current_balance IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;
  IF current_balance < amount THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  UPDATE public.profiles
    SET credits = credits - amount, updated_at = now()
    WHERE id = uid
    RETURNING credits INTO new_balance;

  RETURN new_balance;
END;
$function$;

CREATE OR REPLACE FUNCTION public.refresh_monthly_credits()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_credits INTEGER;
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RETURN NULL; END IF;
  UPDATE public.profiles
    SET credits = GREATEST(credits, 100),
        credits_refreshed_at = now(),
        updated_at = now()
    WHERE id = uid
      AND is_subscribed = false
      AND credits_refreshed_at < (now() - interval '30 days')
    RETURNING credits INTO new_credits;
  RETURN new_credits;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_login_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_count INTEGER;
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  INSERT INTO public.profiles (id, login_count)
  VALUES (uid, 1)
  ON CONFLICT (id) DO UPDATE SET login_count = public.profiles.login_count + 1, updated_at = now()
  RETURNING login_count INTO new_count;
  PERFORM public.refresh_monthly_credits();
  RETURN new_count;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.prevent_subscription_self_grant() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.deduct_credits(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_monthly_credits() TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_login_count() TO authenticated;