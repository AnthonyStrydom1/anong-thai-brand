
-- Create the cleanup_user_data function that we're trying to call
CREATE OR REPLACE FUNCTION public.cleanup_user_data(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Clean up user-related data from public schema tables
  -- Delete from user_roles
  DELETE FROM public.user_roles WHERE user_id = _user_id;
  
  -- Delete from profiles
  DELETE FROM public.profiles WHERE id = _user_id;
  
  -- Delete from customers (this will cascade to related tables)
  DELETE FROM public.customers WHERE user_id = _user_id;
  
  -- Delete from users table
  DELETE FROM public.users WHERE id = _user_id OR auth_user_id = _user_id;
  
  -- Log the cleanup action
  INSERT INTO public.security_audit_log (
    action,
    resource_type,
    resource_id,
    details,
    success
  ) VALUES (
    'cleanup',
    'user_data',
    _user_id::text,
    jsonb_build_object(
      'cleaned_by', auth.uid(),
      'timestamp', now()
    ),
    true
  );
END;
$$;
