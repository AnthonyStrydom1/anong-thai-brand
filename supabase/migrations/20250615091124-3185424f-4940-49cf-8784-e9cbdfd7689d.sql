
-- Create a function to safely delete orders and restore stock
CREATE OR REPLACE FUNCTION public.delete_order(order_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  order_record RECORD;
  item_record RECORD;
BEGIN
  -- Get order details
  SELECT * INTO order_record FROM orders WHERE id = order_id_param;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;
  
  -- Only restore stock if order was not already cancelled
  IF order_record.status != 'cancelled' THEN
    -- Restore stock for each order item
    FOR item_record IN 
      SELECT product_id, quantity 
      FROM order_items 
      WHERE order_id = order_id_param
    LOOP
      -- Update product stock
      UPDATE products 
      SET stock_quantity = stock_quantity + item_record.quantity
      WHERE id = item_record.product_id;
      
      -- Create inventory movement record
      INSERT INTO inventory_movements (
        product_id, 
        movement_type, 
        quantity, 
        reference_type, 
        reference_id,
        notes
      ) VALUES (
        item_record.product_id, 
        'in', 
        item_record.quantity, 
        'return', 
        order_id_param,
        'Stock restored due to order deletion'
      );
    END LOOP;
  END IF;
  
  -- Update customer totals if the order was delivered
  IF order_record.status = 'delivered' THEN
    UPDATE customers 
    SET 
      total_spent = GREATEST(0, total_spent - order_record.total_amount),
      total_orders = GREATEST(0, total_orders - 1)
    WHERE id = order_record.customer_id;
  END IF;
  
  -- Delete order items first (due to foreign key constraints)
  DELETE FROM order_items WHERE order_id = order_id_param;
  
  -- Delete the order
  DELETE FROM orders WHERE id = order_id_param;
  
  -- Log the deletion for audit purposes
  INSERT INTO security_audit_log (
    action,
    resource_type,
    resource_id,
    details,
    success
  ) VALUES (
    'delete',
    'order',
    order_id_param::text,
    jsonb_build_object(
      'order_number', order_record.order_number,
      'customer_id', order_record.customer_id,
      'total_amount', order_record.total_amount,
      'deleted_by', auth.uid()
    ),
    true
  );
END;
$$;
