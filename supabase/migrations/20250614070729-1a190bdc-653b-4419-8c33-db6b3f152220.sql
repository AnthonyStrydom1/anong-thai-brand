
-- Update product prices to be VAT-inclusive (15% VAT)
-- Current prices appear to be VAT-exclusive, so we need to add 15% VAT

UPDATE public.products 
SET price = ROUND(price * 1.15, 2)
WHERE sku IN ('RCP-001', 'PTS-001', 'PCP-001', 'GCP-001', 'TYCP-001', 'MCP-001', 'SS-001');

-- Let's also add a comment to clarify that prices are VAT-inclusive
COMMENT ON COLUMN public.products.price IS 'Product price including 15% VAT (VAT-inclusive)';
