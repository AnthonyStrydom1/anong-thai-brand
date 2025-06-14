
-- Correct product prices - they are already VAT-inclusive, no need to add VAT on top
-- Reverting to the original VAT-inclusive prices from the products data

UPDATE public.products 
SET 
  price = CASE 
    WHEN sku = 'RCP-001' THEN 138.00  -- Red Curry Paste (already VAT-inclusive)
    WHEN sku = 'PTS-001' THEN 86.25   -- Pad Thai Sauce (already VAT-inclusive)
    WHEN sku = 'PCP-001' THEN 155.25  -- Panang Curry Paste (already VAT-inclusive)
    WHEN sku = 'GCP-001' THEN 149.50  -- Green Curry Paste (already VAT-inclusive)
    WHEN sku = 'TYCP-001' THEN 132.25 -- Tom Yum Chili Paste (already VAT-inclusive)
    WHEN sku = 'MCP-001' THEN 161.00  -- Massaman Curry Paste (already VAT-inclusive)
    WHEN sku = 'SS-001' THEN 97.75    -- Sukiyaki Sauce (already VAT-inclusive)
    ELSE price
  END,
  updated_at = now()
WHERE sku IN ('RCP-001', 'PTS-001', 'PCP-001', 'GCP-001', 'TYCP-001', 'MCP-001', 'SS-001');

-- Update comment to clarify that prices are already VAT-inclusive
COMMENT ON COLUMN public.products.price IS 'Product price including 15% VAT (VAT-inclusive)';
