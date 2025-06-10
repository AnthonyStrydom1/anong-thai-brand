
-- Fix the search_path security warnings for all database functions
-- This prevents potential SQL injection attacks by setting a secure search path

-- Fix generate_order_number function
CREATE OR REPLACE FUNCTION public.generate_order_number()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0');
END;
$function$;

-- Fix set_order_number function
CREATE OR REPLACE FUNCTION public.set_order_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$function$;

-- Fix update_product_stock function
CREATE OR REPLACE FUNCTION public.update_product_stock()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  -- Decrease stock when order item is created
  IF TG_OP = 'INSERT' THEN
    UPDATE public.products 
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.product_id;
    
    -- Create inventory movement record
    INSERT INTO public.inventory_movements (product_id, movement_type, quantity, reference_type, reference_id)
    VALUES (NEW.product_id, 'out', NEW.quantity, 'sale', NEW.order_id);
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix update_customer_totals function
CREATE OR REPLACE FUNCTION public.update_customer_totals()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'delivered' THEN
    UPDATE public.customers 
    SET 
      total_spent = total_spent + NEW.total_amount,
      total_orders = total_orders + 1,
      last_order_date = NEW.created_at
    WHERE id = NEW.customer_id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix update_customer_details_updated_at function
CREATE OR REPLACE FUNCTION public.update_customer_details_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$function$;

-- Fix calculate_customer_tier function
CREATE OR REPLACE FUNCTION public.calculate_customer_tier(total_spent numeric)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  CASE 
    WHEN total_spent >= 10000 THEN RETURN 'vip';
    WHEN total_spent >= 5000 THEN RETURN 'platinum';
    WHEN total_spent >= 2000 THEN RETURN 'gold';
    WHEN total_spent >= 500 THEN RETURN 'silver';
    ELSE RETURN 'bronze';
  END CASE;
END;
$function$;

-- Fix update_customer_details_timestamp function
CREATE OR REPLACE FUNCTION public.update_customer_details_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    
    IF TG_OP = 'UPDATE' THEN
        IF OLD.total_spent != NEW.total_spent THEN
            NEW.customer_tier = CASE 
                WHEN NEW.total_spent >= 10000 THEN 'vip'
                WHEN NEW.total_spent >= 5000 THEN 'platinum'
                WHEN NEW.total_spent >= 2500 THEN 'gold'
                WHEN NEW.total_spent >= 1000 THEN 'silver'
                ELSE 'bronze'
            END;
        END IF;
        
        NEW.customer_lifetime_value = NEW.total_spent;
    END IF;
    
    RETURN NEW;
END;
$function$;

-- Fix initialize_customer_details function
CREATE OR REPLACE FUNCTION public.initialize_customer_details()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
    NEW.created_at = CURRENT_TIMESTAMP;
    NEW.updated_at = CURRENT_TIMESTAMP;
    
    IF NEW.referral_code IS NULL THEN
        NEW.referral_code = 'REF' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8));
    END IF;
    
    IF NEW.display_name IS NULL THEN
        NEW.display_name = NEW.first_name || ' ' || NEW.last_name;
    END IF;
    
    RETURN NEW;
END;
$function$;
