
CREATE OR REPLACE FUNCTION public.deduct_credits(amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $$
DECLARE
  new_balance INTEGER;
  current_balance INTEGER;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  SELECT credits INTO current_balance FROM public.profiles WHERE id = auth.uid();
  IF current_balance IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;
  IF current_balance < amount THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  UPDATE public.profiles
    SET credits = credits - amount, updated_at = now()
    WHERE id = auth.uid()
    RETURNING credits INTO new_balance;

  RETURN new_balance;
END;
$$;
