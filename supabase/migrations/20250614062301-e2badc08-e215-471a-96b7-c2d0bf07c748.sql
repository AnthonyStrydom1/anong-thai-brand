
-- Add VAT amount column and update currency default to ZAR
ALTER TABLE public.orders 
ADD COLUMN vat_amount numeric DEFAULT 0,
ALTER COLUMN currency SET DEFAULT 'ZAR';

-- Update existing orders to have ZAR currency if they have USD
UPDATE public.orders 
SET currency = 'ZAR' 
WHERE currency = 'USD';

-- Add shipping method and courier details columns
ALTER TABLE public.orders 
ADD COLUMN shipping_method text,
ADD COLUMN courier_service text DEFAULT 'courier_guy',
ADD COLUMN estimated_delivery_days integer;
