
-- Update the handle_new_user function to also create a customer record
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert into profiles table (existing functionality)
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  
  -- Also insert into customers table
  INSERT INTO public.customers (
    user_id,
    fullname,
    email,
    first_name,
    last_name,
    created_at
  )
  VALUES (
    NEW.id,
    COALESCE(
      (NEW.raw_user_meta_data ->> 'first_name') || ' ' || (NEW.raw_user_meta_data ->> 'last_name'),
      NEW.email
    ),
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NOW()
  );
  
  RETURN NEW;
END;
$$;
