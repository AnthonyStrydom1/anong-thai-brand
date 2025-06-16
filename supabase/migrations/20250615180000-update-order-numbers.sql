
-- Update the order number generation function to use ANONG prefix with 6 digits
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Generate format: ANONG123456 (6 digits)
  RETURN 'ANONG' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
END;
$function$;

-- Update all existing order numbers to the new format
UPDATE orders 
SET order_number = 'ANONG' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::TEXT, 6, '0')
WHERE order_number LIKE 'ORD-%';

-- Reset the sequence to continue from the highest number used
SELECT setval('order_number_seq', (
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 6) AS INTEGER)), 0)
  FROM orders 
  WHERE order_number LIKE 'ANONG%'
));
