
-- Fix the handle_new_user function to properly separate customers from admin users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  -- Insert into profiles table (for all users)
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Always create a customer record for regular signups
  -- Admin users will be created separately through the admin panel
  INSERT INTO public.customers (
    user_id,
    fullname,
    email,
    first_name,
    last_name,
    created_at
  )
  VALUES (
    NEW.id,
    COALESCE(
      TRIM(CONCAT(NEW.raw_user_meta_data ->> 'first_name', ' ', NEW.raw_user_meta_data ->> 'last_name')),
      NEW.email
    ),
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Do NOT create user roles here for regular signups
  -- Admin roles will be assigned through the admin user creation process
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE WARNING 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Update link_orphaned_user to respect the customer/admin separation
CREATE OR REPLACE FUNCTION public.link_orphaned_user(_user_id uuid, _create_profile boolean DEFAULT true, _create_customer boolean DEFAULT true, _create_admin_record boolean DEFAULT false)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_record RECORD;
  result jsonb := '{"success": true, "actions": []}'::jsonb;
  actions_array jsonb := '[]'::jsonb;
BEGIN
  -- Get the auth user data
  SELECT id, email, raw_user_meta_data, created_at
  INTO user_record
  FROM auth.users
  WHERE id = _user_id;
  
  IF user_record IS NULL THEN
    RETURN '{"success": false, "error": "Auth user not found"}'::jsonb;
  END IF;
  
  -- Create profile if requested and doesn't exist
  IF _create_profile AND NOT EXISTS(SELECT 1 FROM public.profiles WHERE id = _user_id) THEN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
      _user_id,
      user_record.email,
      user_record.raw_user_meta_data ->> 'first_name',
      user_record.raw_user_meta_data ->> 'last_name'
    );
    actions_array := actions_array || '{"action": "created_profile"}'::jsonb;
  END IF;
  
  -- Create customer if requested and doesn't exist
  IF _create_customer AND NOT EXISTS(SELECT 1 FROM public.customers WHERE user_id = _user_id) THEN
    INSERT INTO public.customers (
      user_id,
      fullname,
      email,
      first_name,
      last_name,
      created_at
    )
    VALUES (
      _user_id,
      COALESCE(
        TRIM(CONCAT(user_record.raw_user_meta_data ->> 'first_name', ' ', user_record.raw_user_meta_data ->> 'last_name')),
        user_record.email
      ),
      user_record.email,
      user_record.raw_user_meta_data ->> 'first_name',
      user_record.raw_user_meta_data ->> 'last_name',
      user_record.created_at
    );
    actions_array := actions_array || '{"action": "created_customer"}'::jsonb;
  END IF;
  
  -- Only create admin user record if explicitly requested (for admin users only)
  IF _create_admin_record THEN
    IF NOT EXISTS(SELECT 1 FROM public.users WHERE id = _user_id OR auth_user_id = _user_id) THEN
      INSERT INTO public.users (
        id,
        email,
        first_name,
        last_name,
        auth_user_id,
        created_at
      )
      VALUES (
        _user_id,
        user_record.email,
        user_record.raw_user_meta_data ->> 'first_name',
        user_record.raw_user_meta_data ->> 'last_name',
        _user_id,
        user_record.created_at
      );
      actions_array := actions_array || '{"action": "created_admin_record"}'::jsonb;
    END IF;
    
    -- Only assign admin role for admin users
    DECLARE
      target_user_id uuid;
    BEGIN
      SELECT id INTO target_user_id FROM public.users WHERE id = _user_id OR auth_user_id = _user_id LIMIT 1;
      
      IF target_user_id IS NOT NULL THEN
        -- Assign admin role if not exists
        IF NOT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = target_user_id AND role = 'admin') THEN
          INSERT INTO public.user_roles (user_id, role)
          VALUES (target_user_id, 'admin');
          actions_array := actions_array || '{"action": "assigned_admin_role"}'::jsonb;
        END IF;
      END IF;
    END;
  END IF;
  
  -- For regular customers, we don't create users table records or assign roles
  -- Customers exist only in the customers table
  
  result := jsonb_set(result, '{actions}', actions_array);
  RETURN result;
END;
$$;
