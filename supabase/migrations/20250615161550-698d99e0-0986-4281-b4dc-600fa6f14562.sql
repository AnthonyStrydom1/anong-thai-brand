
-- Fix the find_orphaned_auth_users function to return the correct structure
CREATE OR REPLACE FUNCTION public.find_orphaned_auth_users()
RETURNS TABLE(
  id uuid, 
  email text, 
  created_at timestamp with time zone, 
  raw_user_meta_data jsonb, 
  has_profile boolean, 
  has_customer boolean, 
  has_user_record boolean, 
  user_roles text[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.created_at,
    au.raw_user_meta_data,
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = au.id) as has_profile,
    EXISTS(SELECT 1 FROM public.customers c WHERE c.user_id = au.id) as has_customer,
    EXISTS(SELECT 1 FROM public.users u WHERE u.id = au.id OR u.auth_user_id = au.id) as has_user_record,
    COALESCE(
      ARRAY(SELECT ur.role::text FROM public.user_roles ur WHERE ur.user_id = au.id),
      '{}'::text[]
    ) as user_roles
  FROM auth.users au
  ORDER BY au.created_at DESC;
END;
$function$
