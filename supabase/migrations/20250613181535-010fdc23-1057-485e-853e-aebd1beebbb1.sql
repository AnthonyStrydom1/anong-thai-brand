
-- Phase 1: Critical Data Protection - Secure Customer Data Access
-- Remove overly permissive customer policies
DROP POLICY IF EXISTS "Authenticated users can view customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can update customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can insert customers" ON public.customers;

-- Create secure customer policies
CREATE POLICY "Users can view their own customer record" 
  ON public.customers 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own customer record" 
  ON public.customers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own customer record" 
  ON public.customers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Admin policies for customer management
CREATE POLICY "Admins can view all customers" 
  ON public.customers 
  FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all customers" 
  ON public.customers 
  FOR UPDATE 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Phase 2: Add Missing RLS Policies
-- Secure coupons table (admin only)
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage coupons" 
  ON public.coupons 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view active coupons" 
  ON public.coupons 
  FOR SELECT 
  TO authenticated
  USING (is_active = true AND (starts_at IS NULL OR starts_at <= now()) AND (expires_at IS NULL OR expires_at >= now()));

-- Secure inventory_movements table
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage inventory movements" 
  ON public.inventory_movements 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Enhance wishlists protection
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own wishlist" 
  ON public.wishlists 
  FOR ALL 
  TO authenticated
  USING (
    customer_id IN (
      SELECT c.id FROM public.customers c WHERE c.user_id = auth.uid()
    )
  );

-- Secure product_reviews table
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view approved reviews" 
  ON public.product_reviews 
  FOR SELECT 
  USING (is_approved = true);

CREATE POLICY "Users can manage their own reviews" 
  ON public.product_reviews 
  FOR ALL 
  TO authenticated
  USING (
    customer_id IN (
      SELECT c.id FROM public.customers c WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all reviews" 
  ON public.product_reviews 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Secure customer_addresses table
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own addresses" 
  ON public.customer_addresses 
  FOR ALL 
  TO authenticated
  USING (
    customer_id IN (
      SELECT c.id FROM public.customers c WHERE c.user_id = auth.uid()
    )
  );

-- Enhance order security policies
DROP POLICY IF EXISTS "Authenticated users can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON public.orders;

CREATE POLICY "Admins can manage all orders" 
  ON public.orders 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Secure order_items table (fixed ambiguous column reference)
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order items" 
  ON public.order_items 
  FOR SELECT 
  TO authenticated
  USING (
    order_id IN (
      SELECT o.id FROM public.orders o 
      JOIN public.customers c ON o.customer_id = c.id 
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all order items" 
  ON public.order_items 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Secure categories table for admin management
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active categories" 
  ON public.categories 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage categories" 
  ON public.categories 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Secure products table for admin management
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active products" 
  ON public.products 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage products" 
  ON public.products 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Update the customers table to make user_id NOT NULL for new records
-- (existing records may have NULL user_id for legacy reasons)
ALTER TABLE public.customers ADD CONSTRAINT customers_user_id_required 
  CHECK (user_id IS NOT NULL OR created_at < '2024-01-01');
