
-- First, create the improved order number generation function
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Generate format: ORD-YYMMDD-#### (e.g., ORD-250614-0001)
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0');
END;
$function$;

-- Update existing orders using a CTE approach instead of window functions in UPDATE
WITH numbered_orders AS (
  SELECT 
    id,
    'ORD-' || TO_CHAR(created_at, 'YYMMDD') || '-' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::TEXT, 4, '0') as new_order_number
  FROM orders 
  WHERE order_number LIKE 'ORD-________-%'
)
UPDATE orders 
SET order_number = numbered_orders.new_order_number
FROM numbered_orders
WHERE orders.id = numbered_orders.id;
