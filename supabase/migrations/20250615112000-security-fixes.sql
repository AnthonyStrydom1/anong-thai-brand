
-- Security Fixes Migration
-- Phase 1: Critical RLS Policy Standardization

-- Fix categories table RLS policies
DROP POLICY IF EXISTS "Everyone can view active categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;

-- Recreate standardized category policies
CREATE POLICY "Public can view active categories" 
  ON public.categories 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage all categories" 
  ON public.categories 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Fix customer_addresses RLS policies
DROP POLICY IF EXISTS "Users can manage their own addresses" ON public.customer_addresses;

-- Recreate with standardized auth pattern
CREATE POLICY "Users can manage own addresses" 
  ON public.customer_addresses 
  FOR ALL 
  TO authenticated
  USING (
    customer_id IN (
      SELECT c.id FROM public.customers c WHERE c.user_id = auth.uid()
    )
  );

-- Strengthen order_items security
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;

-- Recreate with consistent auth pattern
CREATE POLICY "Users can view own order items" 
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

-- Fix product_reviews policies to remove conflicts
DROP POLICY IF EXISTS "Users can view approved reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can manage their own reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.product_reviews;

-- Recreate with clear hierarchy
CREATE POLICY "Public can view approved reviews" 
  ON public.product_reviews 
  FOR SELECT 
  USING (is_approved = true);

CREATE POLICY "Users can manage own reviews" 
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

-- Add missing RLS policies for complete coverage
-- Ensure newsletter_subscriptions has proper RLS
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can subscribe to newsletter" 
  ON public.newsletter_subscriptions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can manage newsletter subscriptions" 
  ON public.newsletter_subscriptions 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Secure user_roles table properly
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Users can view own roles" 
  ON public.user_roles 
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" 
  ON public.user_roles 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Secure users table (admin users only)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage admin users" 
  ON public.users 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Add session security enhancements
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  last_used_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_address inet,
  user_agent text
);

-- Enable RLS on sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" 
  ON public.user_sessions 
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own sessions" 
  ON public.user_sessions 
  FOR DELETE 
  TO authenticated
  USING (user_id = auth.uid());

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.user_sessions
  WHERE expires_at < now();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Enhanced security logging function
CREATE OR REPLACE FUNCTION public.log_security_event_enhanced(
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_success BOOLEAN DEFAULT true,
  p_severity TEXT DEFAULT 'info'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    details,
    success
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    COALESCE(p_details, '{}'::jsonb) || jsonb_build_object('severity', p_severity),
    p_success
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;
