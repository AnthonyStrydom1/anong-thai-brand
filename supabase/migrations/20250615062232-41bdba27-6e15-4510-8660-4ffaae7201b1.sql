
-- Add ingredients column to the products table
ALTER TABLE public.products 
ADD COLUMN ingredients JSONB DEFAULT '{"en": [], "th": []}'::jsonb;

-- Add a comment to document the column structure
COMMENT ON COLUMN public.products.ingredients IS 'Multilingual ingredients list with structure: {"en": ["ingredient1", "ingredient2"], "th": ["ingredient1_th", "ingredient2_th"]}';
