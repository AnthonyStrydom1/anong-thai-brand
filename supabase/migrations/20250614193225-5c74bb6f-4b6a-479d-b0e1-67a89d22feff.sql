
-- Create a users table in public schema that we can manage
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  auth_user_id UUID NULL, -- Link to auth.users when they sign in
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- First, populate the users table with existing data from profiles
INSERT INTO public.users (id, email, first_name, last_name, auth_user_id, created_at)
SELECT 
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.id, -- Use profile ID as auth_user_id since profiles are linked to auth.users
  p.created_at
FROM public.profiles p
ON CONFLICT (id) DO NOTHING;

-- Also insert any users that might exist in user_roles but not in profiles
INSERT INTO public.users (id, email, created_at)
SELECT DISTINCT 
  ur.user_id,
  'unknown@example.com', -- Placeholder email, will be updated when they sign in
  ur.created_at
FROM public.user_roles ur
LEFT JOIN public.users u ON ur.user_id = u.id
WHERE u.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Now update the foreign key constraint
ALTER TABLE public.user_roles 
DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;

ALTER TABLE public.user_roles 
ADD CONSTRAINT user_roles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Admin policies for users table
CREATE POLICY "Admins can manage all users" 
  ON public.users 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Update the assign_admin_role function to work with our users table
CREATE OR REPLACE FUNCTION public.assign_admin_role(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if this is the first admin (no admins exist yet) or if caller is admin
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') 
     OR public.is_admin() THEN
    INSERT INTO public.user_roles (user_id, role, created_by)
    VALUES (_user_id, 'admin', auth.uid())
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    RAISE EXCEPTION 'Only admins can assign admin roles';
  END IF;
END;
$$;

-- Update has_role function to work with our users table
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Create function to link auth users to our users table when they sign in
CREATE OR REPLACE FUNCTION public.link_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Update users table with auth user ID when they sign in
  UPDATE public.users 
  SET auth_user_id = NEW.id,
      updated_at = now()
  WHERE email = NEW.email 
    AND auth_user_id IS NULL;
  
  RETURN NEW;
END;
$$;

-- Create trigger to link auth users automatically
CREATE OR REPLACE TRIGGER on_auth_user_signin
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.link_auth_user();
