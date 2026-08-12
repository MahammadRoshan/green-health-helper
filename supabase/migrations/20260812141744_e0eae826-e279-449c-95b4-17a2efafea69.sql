-- 1. Restrict client-side column writes on profiles
REVOKE UPDATE ON public.profiles FROM authenticated;
REVOKE UPDATE ON public.profiles FROM anon;
GRANT UPDATE (full_name, email) ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- 2. Remove client EXECUTE on all SECURITY DEFINER functions
REVOKE ALL ON FUNCTION public.deduct_credits(integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.increment_login_count() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.refresh_monthly_credits() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prevent_subscription_self_grant() FROM PUBLIC, anon, authenticated;

-- 3. Server-only execution
GRANT EXECUTE ON FUNCTION public.deduct_credits(integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_login_count() TO service_role;
GRANT EXECUTE ON FUNCTION public.refresh_monthly_credits() TO service_role;

-- 4. Make the credit/login helpers work when invoked server-side for a given user
CREATE OR REPLACE FUNCTION public.refresh_monthly_credits(target_user uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_credits INTEGER;
BEGIN
  IF target_user IS NULL THEN RETURN NULL; END IF;
  UPDATE public.profiles
    SET credits = GREATEST(credits, 100),
        credits_refreshed_at = now(),
        updated_at = now()
    WHERE id = target_user
      AND is_subscribed = false
      AND credits_refreshed_at < (now() - interval '30 days')
    RETURNING credits INTO new_credits;
  RETURN new_credits;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_login_count(target_user uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_count INTEGER;
BEGIN
  IF target_user IS NULL THEN RAISE EXCEPTION 'Missing user'; END IF;
  INSERT INTO public.profiles (id, login_count)
  VALUES (target_user, 1)
  ON CONFLICT (id) DO UPDATE SET login_count = public.profiles.login_count + 1, updated_at = now()
  RETURNING login_count INTO new_count;
  PERFORM public.refresh_monthly_credits(target_user);
  RETURN new_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.deduct_credits(target_user uuid, amount integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_balance INTEGER;
  current_balance INTEGER;
BEGIN
  IF target_user IS NULL THEN RAISE EXCEPTION 'Missing user'; END IF;
  IF amount <= 0 THEN RAISE EXCEPTION 'Amount must be positive'; END IF;

  SELECT credits INTO current_balance FROM public.profiles WHERE id = target_user;
  IF current_balance IS NULL THEN RAISE EXCEPTION 'Profile not found'; END IF;
  IF current_balance < amount THEN RAISE EXCEPTION 'Insufficient credits'; END IF;

  UPDATE public.profiles
    SET credits = credits - amount, updated_at = now()
    WHERE id = target_user
    RETURNING credits INTO new_balance;

  RETURN new_balance;
END;
$function$;

REVOKE ALL ON FUNCTION public.refresh_monthly_credits(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.increment_login_count(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.deduct_credits(uuid, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_monthly_credits(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_login_count(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.deduct_credits(uuid, integer) TO service_role;

-- 5. Drop the old client-callable signatures
DROP FUNCTION IF EXISTS public.deduct_credits(integer);
DROP FUNCTION IF EXISTS public.increment_login_count();
DROP FUNCTION IF EXISTS public.refresh_monthly_credits();

-- 6. Remove the duplicate self-grant trigger (keep one)
DROP TRIGGER IF EXISTS prevent_subscription_self_grant_trigger ON public.profiles;