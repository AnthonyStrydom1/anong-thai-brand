
-- Remove regular customers from the users table, keeping only admin users
DELETE FROM public.users 
WHERE id NOT IN (
  SELECT DISTINCT ur.user_id 
  FROM public.user_roles ur 
  WHERE ur.role = 'admin'
);

-- Update the link_auth_user function to only create users records for admin users
CREATE OR REPLACE FUNCTION public.link_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only update users table if this user has admin role
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = NEW.id AND role = 'admin') THEN
    UPDATE public.users 
    SET auth_user_id = NEW.id,
        updated_at = now()
    WHERE email = NEW.email 
      AND auth_user_id IS NULL;
  END IF;
  
  RETURN NEW;
END;
$$;
