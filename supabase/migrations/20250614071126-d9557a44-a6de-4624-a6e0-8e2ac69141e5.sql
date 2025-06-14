
-- Check the current orders table structure and see if vat_amount column exists
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'orders' 
AND column_name IN ('vat_amount', 'subtotal', 'total_amount');

-- Also check a sample of existing orders to see their VAT data
SELECT id, order_number, subtotal, vat_amount, total_amount, created_at
FROM public.orders 
ORDER BY created_at DESC 
LIMIT 5;
