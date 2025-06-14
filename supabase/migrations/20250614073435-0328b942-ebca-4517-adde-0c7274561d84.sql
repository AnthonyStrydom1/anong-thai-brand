
-- Create a table for newsletter subscriptions
CREATE TABLE public.newsletter_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  source TEXT DEFAULT 'footer_signup'
);

-- Add Row Level Security (RLS)
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert (anyone can subscribe)
CREATE POLICY "Anyone can subscribe to newsletter" 
  ON public.newsletter_subscriptions 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for admin to view all subscriptions
CREATE POLICY "Admins can view all newsletter subscriptions" 
  ON public.newsletter_subscriptions 
  FOR SELECT 
  USING (public.is_admin());

-- Create policy for admin to update subscriptions
CREATE POLICY "Admins can update newsletter subscriptions" 
  ON public.newsletter_subscriptions 
  FOR UPDATE 
  USING (public.is_admin());
