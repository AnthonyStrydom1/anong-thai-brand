
-- Enable real-time updates for orders table
ALTER TABLE public.orders REPLICA IDENTITY FULL;

-- Add the orders table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Create a function to get orders for a specific customer by user_id
CREATE OR REPLACE FUNCTION public.get_customer_orders(user_uuid uuid)
RETURNS TABLE (
  id uuid,
  order_number text,
  status text,
  payment_status text,
  total_amount numeric,
  created_at timestamp with time zone,
  customer_id integer
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.id, o.order_number, o.status, o.payment_status, o.total_amount, o.created_at, o.customer_id
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  WHERE c.user_id = user_uuid
  ORDER BY o.created_at DESC;
$$;

-- Add RLS policies for orders table to allow customers to see their own orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view their own orders" ON public.orders
  FOR SELECT 
  USING (
    customer_id IN (
      SELECT id FROM public.customers WHERE user_id = auth.uid()
    )
  );

-- Allow authenticated users to view all orders (for admin functionality)
CREATE POLICY "Authenticated users can view all orders" ON public.orders
  FOR SELECT 
  TO authenticated
  USING (true);

-- Allow authenticated users to update order status (for admin functionality)
CREATE POLICY "Authenticated users can update orders" ON public.orders
  FOR UPDATE 
  TO authenticated
  USING (true);
