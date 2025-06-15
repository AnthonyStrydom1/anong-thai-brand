
-- Let's completely recreate the function with explicit column casting to match exactly
DROP FUNCTION IF EXISTS public.find_orphaned_auth_users();

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
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN 
    SELECT 
      au.id::uuid as id,
      COALESCE(au.email, '')::text as email,
      au.created_at::timestamp with time zone as created_at,
      COALESCE(au.raw_user_meta_data, '{}'::jsonb)::jsonb as raw_user_meta_data,
      EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = au.id)::boolean as has_profile,
      EXISTS(SELECT 1 FROM public.customers c WHERE c.user_id = au.id)::boolean as has_customer,
      EXISTS(SELECT 1 FROM public.users u WHERE u.id = au.id OR u.auth_user_id = au.id)::boolean as has_user_record,
      COALESCE(
        ARRAY(SELECT ur.role::text FROM public.user_roles ur WHERE ur.user_id = au.id),
        ARRAY[]::text[]
      )::text[] as user_roles
    FROM auth.users au
    ORDER BY au.created_at DESC
  LOOP
    id := rec.id;
    email := rec.email;
    created_at := rec.created_at;
    raw_user_meta_data := rec.raw_user_meta_data;
    has_profile := rec.has_profile;
    has_customer := rec.has_customer;
    has_user_record := rec.has_user_record;
    user_roles := rec.user_roles;
    RETURN NEXT;
  END LOOP;
  RETURN;
END;
$function$;
