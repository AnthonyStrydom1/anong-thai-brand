
-- Insert products from the local data file into the products table (with proper UUIDs)
INSERT INTO public.products (
  name, description, short_description, sku, price, 
  category_id, stock_quantity, is_active, is_featured
) VALUES 
-- Red Curry Paste
(
  'Red Curry Paste',
  'Our authentic Red Curry Paste is crafted using Anong''s traditional family recipe. Made with a perfect blend of dried red chili, garlic, lemongrass, galangal, and other premium Thai ingredients. A perfect base for creating delicious Thai curries and other dishes.',
  'A rich, aromatic paste for authentic Thai red curry',
  'RCP-001',
  120.00,
  NULL, -- We'll assign categories after creating them
  50,
  true,
  true
),
-- Pad Thai Sauce
(
  'Pad Thai Sauce',
  'Our Pad Thai Sauce captures the perfect balance of sweet, tangy and savory flavors essential for Thailand''s most famous stir-fried noodle dish. Made with premium tamarind, palm sugar, and fish sauce following Anong''s secret recipe.',
  'Sweet, tangy, and savory for authentic Pad Thai',
  'PTS-001',
  75.00,
  NULL,
  75,
  true,
  false
),
-- Panang Curry Paste
(
  'Panang Curry Paste',
  'Rich and aromatic Panang Curry Paste featuring dried chili, galangal, lemongrass, kaffir lime peel, shallots, garlic, coriander seeds, krachai, peas, cumin, pepper, and krapid.',
  'Rich and nutty Thai curry paste with a hint of sweetness',
  'PCP-001',
  135.00,
  NULL,
  40,
  true,
  false
),
-- Green Curry Paste
(
  'Green Curry Paste',
  'Fragrant Green Curry Paste made with fresh green chili, shallots, garlic, galangal, lemongrass, shrimp paste, soybean paste, coriander seeds, salt, and sweet dark soy sauce.',
  'Aromatic green curry paste with a fresh herbaceous flavor',
  'GCP-001',
  130.00,
  NULL,
  45,
  true,
  false
),
-- Tom Yum Chili Paste
(
  'Tom Yum Chili Paste',
  'Spicy and tangy Tom Yum Chili Paste with roasted dry chili, shallots, garlic, coconut sugar, fish sauce, shrimp paste, oyster sauce, and dark soy sauce.',
  'Spicy and tangy paste perfect for Tom Yum soup',
  'TYCP-001',
  115.00,
  NULL,
  60,
  true,
  false
),
-- Massaman Curry Paste
(
  'Massaman Curry Paste',
  'Complex and aromatic Massaman Curry Paste featuring dried chili, shallots, garlic, galangal, lemongrass, fresh ginger, peanuts, cornstarch, coriander seeds, cumin, cinnamon, rice bran oil, cloves, shrimp paste, and lime peel.',
  'Complex curry paste with warm spices and nutty flavors',
  'MCP-001',
  140.00,
  NULL,
  35,
  true,
  false
),
-- Sukiyaki Sauce
(
  'Sukiyaki Sauce',
  'Savory and sweet Sukiyaki Sauce with fresh chili, garlic, pickled garlic, coriander seeds, fermented bean curd, roasted sesame seeds, cane sugar, tamarind paste, chili sauce, light soy sauce, sesame oil, oyster sauce, tomato sauce, and salt.',
  'Sweet and tangy dipping sauce perfect for hot pot',
  'SS-001',
  85.00,
  NULL,
  80,
  true,
  false
);

-- Create categories for better organization (also using proper UUIDs)
INSERT INTO public.categories (name, description, slug, is_active, sort_order) VALUES
('Curry Pastes', 'Traditional Thai curry pastes made from authentic recipes', 'curry-pastes', true, 1),
('Stir-Fry Sauces', 'Ready-to-use sauces for Thai stir-fry dishes', 'stir-fry-sauces', true, 2),
('Dipping Sauces', 'Flavorful dipping sauces for various Thai dishes', 'dipping-sauces', true, 3);

-- Update products with their respective categories (using category names to find the UUIDs)
UPDATE public.products SET category_id = (SELECT id FROM categories WHERE name = 'Curry Pastes') 
WHERE sku IN ('RCP-001', 'PCP-001', 'GCP-001', 'TYCP-001', 'MCP-001');

UPDATE public.products SET category_id = (SELECT id FROM categories WHERE name = 'Stir-Fry Sauces') 
WHERE sku = 'PTS-001';

UPDATE public.products SET category_id = (SELECT id FROM categories WHERE name = 'Dipping Sauces') 
WHERE sku = 'SS-001';
