
-- Enable RLS on customers table if not already enabled
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to view all customers
-- This is for admin functionality - you may want to add role-based restrictions later
CREATE POLICY "Authenticated users can view customers" 
  ON public.customers 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Create policy to allow authenticated users to update customers
CREATE POLICY "Authenticated users can update customers" 
  ON public.customers 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Create policy to allow authenticated users to insert customers
CREATE POLICY "Authenticated users can insert customers" 
  ON public.customers 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);
