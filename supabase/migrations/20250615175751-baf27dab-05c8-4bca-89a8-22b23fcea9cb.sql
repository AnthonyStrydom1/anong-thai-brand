
-- Create a comprehensive user deletion function for admins
CREATE OR REPLACE FUNCTION public.admin_delete_user_complete(
  _user_id uuid,
  _delete_from_auth boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  customer_record RECORD;
  order_record RECORD;
  result jsonb := '{"success": true, "deleted": []}'::jsonb;
  deleted_items jsonb := '[]'::jsonb;
BEGIN
  -- Check if the current user is an admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN '{"success": false, "error": "Only admins can delete users"}'::jsonb;
  END IF;

  -- Get customer record if exists
  SELECT * INTO customer_record FROM public.customers WHERE user_id = _user_id;
  
  -- If customer exists, handle order cleanup
  IF customer_record.id IS NOT NULL THEN
    -- Restore stock for all non-cancelled orders and delete order items
    FOR order_record IN 
      SELECT id, status FROM public.orders WHERE customer_id = customer_record.id
    LOOP
      -- Only restore stock if order was not already cancelled
      IF order_record.status != 'cancelled' THEN
        -- Restore stock for each order item
        INSERT INTO public.inventory_movements (
          product_id, 
          movement_type, 
          quantity, 
          reference_type, 
          reference_id,
          notes
        )
        SELECT 
          oi.product_id,
          'in',
          oi.quantity,
          'return',
          order_record.id,
          'Stock restored due to user deletion'
        FROM public.order_items oi 
        WHERE oi.order_id = order_record.id;
        
        -- Update product stock
        UPDATE public.products 
        SET stock_quantity = stock_quantity + (
          SELECT COALESCE(SUM(oi.quantity), 0) 
          FROM public.order_items oi 
          WHERE oi.order_id = order_record.id AND oi.product_id = public.products.id
        )
        WHERE id IN (
          SELECT DISTINCT product_id 
          FROM public.order_items 
          WHERE order_id = order_record.id
        );
      END IF;
      
      -- Delete order items
      DELETE FROM public.order_items WHERE order_id = order_record.id;
      deleted_items := deleted_items || jsonb_build_object('type', 'order_items', 'order_id', order_record.id);
    END LOOP;
    
    -- Delete orders
    DELETE FROM public.orders WHERE customer_id = customer_record.id;
    deleted_items := deleted_items || jsonb_build_object('type', 'orders', 'customer_id', customer_record.id);
    
    -- Delete customer addresses
    DELETE FROM public.customer_addresses WHERE customer_id = customer_record.id;
    deleted_items := deleted_items || jsonb_build_object('type', 'customer_addresses', 'customer_id', customer_record.id);
    
    -- Delete wishlists
    DELETE FROM public.wishlists WHERE customer_id = customer_record.id;
    deleted_items := deleted_items || jsonb_build_object('type', 'wishlists', 'customer_id', customer_record.id);
    
    -- Delete product reviews
    DELETE FROM public.product_reviews WHERE customer_id = customer_record.id;
    deleted_items := deleted_items || jsonb_build_object('type', 'product_reviews', 'customer_id', customer_record.id);
  END IF;
  
  -- Delete from user_roles
  DELETE FROM public.user_roles WHERE user_id = _user_id;
  deleted_items := deleted_items || jsonb_build_object('type', 'user_roles', 'user_id', _user_id);
  
  -- Delete from profiles
  DELETE FROM public.profiles WHERE id = _user_id;
  deleted_items := deleted_items || jsonb_build_object('type', 'profiles', 'user_id', _user_id);
  
  -- Delete from customers (this should be last due to foreign key constraints)
  DELETE FROM public.customers WHERE user_id = _user_id;
  deleted_items := deleted_items || jsonb_build_object('type', 'customers', 'user_id', _user_id);
  
  -- Delete from users table
  DELETE FROM public.users WHERE id = _user_id OR auth_user_id = _user_id;
  deleted_items := deleted_items || jsonb_build_object('type', 'users', 'user_id', _user_id);
  
  -- Delete MFA challenges
  DELETE FROM public.mfa_challenges WHERE user_id = _user_id;
  deleted_items := deleted_items || jsonb_build_object('type', 'mfa_challenges', 'user_id', _user_id);
  
  -- Log the deletion action
  INSERT INTO public.security_audit_log (
    action,
    resource_type,
    resource_id,
    details,
    success
  ) VALUES (
    'admin_delete_user_complete',
    'user',
    _user_id::text,
    jsonb_build_object(
      'deleted_by', auth.uid(),
      'delete_from_auth', _delete_from_auth,
      'deleted_items', deleted_items,
      'timestamp', now()
    ),
    true
  );
  
  result := jsonb_set(result, '{deleted}', deleted_items);
  result := jsonb_set(result, '{user_id}', to_jsonb(_user_id::text));
  result := jsonb_set(result, '{auth_deletion_required}', to_jsonb(_delete_from_auth));
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error
    INSERT INTO public.security_audit_log (
      action,
      resource_type,
      resource_id,
      details,
      success
    ) VALUES (
      'admin_delete_user_complete_error',
      'user',
      _user_id::text,
      jsonb_build_object(
        'error', SQLERRM,
        'deleted_by', auth.uid(),
        'timestamp', now()
      ),
      false
    );
    
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'user_id', _user_id::text
    );
END;
$$;

-- Create a function to get user deletion preview (what will be deleted)
CREATE OR REPLACE FUNCTION public.admin_get_user_deletion_preview(_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  customer_record RECORD;
  preview jsonb := '{"user_id": "", "items_to_delete": []}'::jsonb;
  items_array jsonb := '[]'::jsonb;
  order_count integer := 0;
  order_items_count integer := 0;
BEGIN
  -- Check if the current user is an admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN '{"success": false, "error": "Only admins can preview user deletions"}'::jsonb;
  END IF;

  preview := jsonb_set(preview, '{user_id}', to_jsonb(_user_id::text));
  
  -- Check customer record
  SELECT * INTO customer_record FROM public.customers WHERE user_id = _user_id;
  
  IF customer_record.id IS NOT NULL THEN
    items_array := items_array || jsonb_build_object(
      'type', 'customer',
      'count', 1,
      'details', jsonb_build_object('id', customer_record.id, 'email', customer_record.email)
    );
    
    -- Count orders
    SELECT COUNT(*) INTO order_count FROM public.orders WHERE customer_id = customer_record.id;
    IF order_count > 0 THEN
      items_array := items_array || jsonb_build_object('type', 'orders', 'count', order_count);
    END IF;
    
    -- Count order items
    SELECT COUNT(*) INTO order_items_count 
    FROM public.order_items oi 
    JOIN public.orders o ON oi.order_id = o.id 
    WHERE o.customer_id = customer_record.id;
    IF order_items_count > 0 THEN
      items_array := items_array || jsonb_build_object('type', 'order_items', 'count', order_items_count);
    END IF;
    
    -- Count addresses
    SELECT COUNT(*) INTO order_count FROM public.customer_addresses WHERE customer_id = customer_record.id;
    IF order_count > 0 THEN
      items_array := items_array || jsonb_build_object('type', 'addresses', 'count', order_count);
    END IF;
    
    -- Count wishlists
    SELECT COUNT(*) INTO order_count FROM public.wishlists WHERE customer_id = customer_record.id;
    IF order_count > 0 THEN
      items_array := items_array || jsonb_build_object('type', 'wishlists', 'count', order_count);
    END IF;
    
    -- Count reviews
    SELECT COUNT(*) INTO order_count FROM public.product_reviews WHERE customer_id = customer_record.id;
    IF order_count > 0 THEN
      items_array := items_array || jsonb_build_object('type', 'reviews', 'count', order_count);
    END IF;
  END IF;
  
  -- Check profiles
  IF EXISTS(SELECT 1 FROM public.profiles WHERE id = _user_id) THEN
    items_array := items_array || jsonb_build_object('type', 'profile', 'count', 1);
  END IF;
  
  -- Check user roles
  SELECT COUNT(*) INTO order_count FROM public.user_roles WHERE user_id = _user_id;
  IF order_count > 0 THEN
    items_array := items_array || jsonb_build_object('type', 'user_roles', 'count', order_count);
  END IF;
  
  -- Check users table
  IF EXISTS(SELECT 1 FROM public.users WHERE id = _user_id OR auth_user_id = _user_id) THEN
    items_array := items_array || jsonb_build_object('type', 'user_record', 'count', 1);
  END IF;
  
  -- Check MFA challenges
  SELECT COUNT(*) INTO order_count FROM public.mfa_challenges WHERE user_id = _user_id;
  IF order_count > 0 THEN
    items_array := items_array || jsonb_build_object('type', 'mfa_challenges', 'count', order_count);
  END IF;
  
  preview := jsonb_set(preview, '{items_to_delete}', items_array);
  
  RETURN preview;
END;
$$;
