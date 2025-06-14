
-- Update product prices to be VAT-inclusive (15% VAT)
-- Current prices in the database need to be updated to match the VAT-inclusive structure

UPDATE public.products 
SET 
  price = CASE 
    WHEN sku = 'RCP-001' THEN 138.00  -- Red Curry Paste (was 120.00)
    WHEN sku = 'PTS-001' THEN 86.25   -- Pad Thai Sauce (was 75.00)
    WHEN sku = 'PCP-001' THEN 155.25  -- Panang Curry Paste (was 135.00)
    WHEN sku = 'GCP-001' THEN 149.50  -- Green Curry Paste (was 130.00)
    WHEN sku = 'TYCP-001' THEN 132.25 -- Tom Yum Chili Paste (was 115.00)
    WHEN sku = 'MCP-001' THEN 161.00  -- Massaman Curry Paste (was 140.00)
    WHEN sku = 'SS-001' THEN 97.75    -- Sukiyaki Sauce (was 85.00)
    ELSE price
  END,
  updated_at = now()
WHERE sku IN ('RCP-001', 'PTS-001', 'PCP-001', 'GCP-001', 'TYCP-001', 'MCP-001', 'SS-001');

-- Add a comment to clarify that prices are VAT-inclusive
COMMENT ON COLUMN public.products.price IS 'Product price including 15% VAT (VAT-inclusive)';
