-- Ensure client roles cannot modify profile rows at all; only the server (service_role) can.
REVOKE UPDATE ON public.profiles FROM anon, authenticated;
REVOKE INSERT, DELETE ON public.profiles FROM anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Replace the permissive self-update policy with an explicitly role-scoped one
-- that can never permit changes to billing-controlled columns.
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

-- Keep the defense-in-depth trigger, and also block the service-bypass gap
-- by guarding every non-service role, not just anon/authenticated.
CREATE OR REPLACE FUNCTION public.prevent_subscription_self_grant()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF current_user NOT IN ('service_role', 'postgres', 'supabase_admin') THEN
    IF NEW.is_subscribed IS DISTINCT FROM OLD.is_subscribed
       OR NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier
       OR NEW.credits IS DISTINCT FROM OLD.credits
       OR NEW.credits_refreshed_at IS DISTINCT FROM OLD.credits_refreshed_at THEN
      RAISE EXCEPTION 'Subscription and credit fields can only be changed by the payment system';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;