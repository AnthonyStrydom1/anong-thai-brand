
-- Fixed diagnostic query to check the status of mariobad002@gmail.com
DO $$
DECLARE
    target_email TEXT := 'mariobad002@gmail.com';
    user_uuid UUID;
    role_count INTEGER;
    user_exists_in_users BOOLEAN;
    role_record RECORD;
    email_record RECORD;
BEGIN
    RAISE NOTICE '=== DIAGNOSTIC REPORT FOR % ===', target_email;
    
    -- Check if user exists in auth.users
    SELECT id INTO user_uuid FROM auth.users WHERE email = target_email;
    
    IF user_uuid IS NOT NULL THEN
        RAISE NOTICE '✅ User found in auth.users with ID: %', user_uuid;
        
        -- Check roles
        SELECT COUNT(*) INTO role_count FROM user_roles WHERE user_id = user_uuid;
        RAISE NOTICE 'User has % role(s) assigned', role_count;
        
        -- List all roles
        FOR role_record IN 
            SELECT role FROM user_roles WHERE user_id = user_uuid
        LOOP
            RAISE NOTICE '  - Role: %', role_record.role;
        END LOOP;
        
        -- Check if user exists in public.users
        SELECT EXISTS(SELECT 1 FROM public.users WHERE id = user_uuid OR email = target_email) INTO user_exists_in_users;
        
        IF user_exists_in_users THEN
            RAISE NOTICE '✅ User exists in public.users table';
        ELSE
            RAISE NOTICE '❌ User does NOT exist in public.users table';
            
            -- Try to insert them now with more detailed error handling
            BEGIN
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
                    COALESCE(au.raw_user_meta_data ->> 'first_name', ''),
                    COALESCE(au.raw_user_meta_data ->> 'last_name', ''),
                    user_uuid,
                    au.created_at,
                    NOW()
                FROM auth.users au
                WHERE au.id = user_uuid;
                
                RAISE NOTICE '✅ Successfully inserted user into public.users table';
            EXCEPTION
                WHEN OTHERS THEN
                    RAISE NOTICE '❌ Error inserting user: %', SQLERRM;
            END;
        END IF;
        
    ELSE
        RAISE NOTICE '❌ User % not found in auth.users', target_email;
        
        -- Check if there are any similar emails
        FOR email_record IN 
            SELECT email FROM auth.users WHERE email ILIKE '%mario%' OR email ILIKE '%bad%'
        LOOP
            RAISE NOTICE 'Similar email found: %', email_record.email;
        END LOOP;
    END IF;
    
    RAISE NOTICE '=== END DIAGNOSTIC REPORT ===';
END $$;
