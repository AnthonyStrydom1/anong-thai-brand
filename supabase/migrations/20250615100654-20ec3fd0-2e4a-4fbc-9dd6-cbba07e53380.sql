
-- Check if mariobad002@gmail.com exists in auth.users and user_roles, then add to users table
DO $$
DECLARE
    target_email TEXT := 'mariobad002@gmail.com';
    user_uuid UUID;
    has_admin_role BOOLEAN := FALSE;
BEGIN
    -- Get the user ID from auth.users
    SELECT id INTO user_uuid FROM auth.users WHERE email = target_email;
    
    IF user_uuid IS NOT NULL THEN
        RAISE NOTICE 'Found user % with ID: %', target_email, user_uuid;
        
        -- Check if user has admin role
        SELECT EXISTS(
            SELECT 1 FROM user_roles 
            WHERE user_id = user_uuid AND role = 'admin'
        ) INTO has_admin_role;
        
        IF has_admin_role THEN
            RAISE NOTICE 'User has admin role, adding to users table';
            
            -- Insert into users table if not exists
            INSERT INTO public.users (
                id,
                email,
                first_name,
                last_name,
                auth_user_id,
                created_at,
                updated_at
            )
            SELECT 
                user_uuid,
                target_email,
                au.raw_user_meta_data ->> 'first_name',
                au.raw_user_meta_data ->> 'last_name',
                user_uuid,
                au.created_at,
                NOW()
            FROM auth.users au
            WHERE au.id = user_uuid
            ON CONFLICT (id) DO UPDATE SET
                email = EXCLUDED.email,
                first_name = EXCLUDED.first_name,
                last_name = EXCLUDED.last_name,
                auth_user_id = EXCLUDED.auth_user_id,
                updated_at = NOW();
                
            RAISE NOTICE 'Successfully added/updated user in users table';
        ELSE
            RAISE NOTICE 'User does not have admin role';
        END IF;
    ELSE
        RAISE NOTICE 'User % not found in auth.users', target_email;
    END IF;
END $$;
