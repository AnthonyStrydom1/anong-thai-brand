
-- Clean up all records for mariobad002@gmail.com
-- First, get the user_id from auth.users to use for cleanup
DO $$
DECLARE
    target_email TEXT := 'mariobad002@gmail.com';
    user_uuid UUID;
    customer_record_id INTEGER;
BEGIN
    -- Get the user ID from auth.users
    SELECT id INTO user_uuid FROM auth.users WHERE email = target_email;
    
    IF user_uuid IS NOT NULL THEN
        RAISE NOTICE 'Found user with ID: %', user_uuid;
        
        -- Get customer ID if exists
        SELECT id INTO customer_record_id FROM customers WHERE email = target_email OR user_id = user_uuid;
        
        -- Clean up order-related data first (due to foreign key constraints)
        IF customer_record_id IS NOT NULL THEN
            -- Delete order items for orders belonging to this customer
            DELETE FROM order_items WHERE order_id IN (
                SELECT id FROM orders WHERE customer_id = customer_record_id
            );
            
            -- Delete orders
            DELETE FROM orders WHERE customer_id = customer_record_id;
            
            -- Delete customer addresses
            DELETE FROM customer_addresses WHERE customer_id = customer_record_id;
            
            -- Delete product reviews
            DELETE FROM product_reviews WHERE customer_id = customer_record_id;
            
            -- Delete wishlists
            DELETE FROM wishlists WHERE customer_id = customer_record_id;
        END IF;
        
        -- Delete from customers table
        DELETE FROM customers WHERE email = target_email OR user_id = user_uuid;
        
        -- Delete from user_roles
        DELETE FROM user_roles WHERE user_id = user_uuid;
        
        -- Delete from profiles
        DELETE FROM profiles WHERE id = user_uuid OR email = target_email;
        
        -- Delete from users table
        DELETE FROM users WHERE email = target_email OR auth_user_id = user_uuid;
        
        -- Delete MFA challenges
        DELETE FROM mfa_challenges WHERE user_id = user_uuid;
        
        -- Clean up any security audit logs
        DELETE FROM security_audit_log WHERE user_id = user_uuid;
        
        -- Finally, delete from auth.users (this should be done last)
        DELETE FROM auth.users WHERE email = target_email;
        
        RAISE NOTICE 'Cleanup completed for email: %', target_email;
    ELSE
        RAISE NOTICE 'No user found with email: %', target_email;
        
        -- Still clean up any orphaned records by email
        DELETE FROM customers WHERE email = target_email;
        DELETE FROM profiles WHERE email = target_email;
        DELETE FROM users WHERE email = target_email;
        DELETE FROM newsletter_subscriptions WHERE email = target_email;
        
        RAISE NOTICE 'Cleaned up any orphaned records for email: %', target_email;
    END IF;
END $$;
