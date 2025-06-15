
-- Update products with ingredients data
UPDATE public.products 
SET ingredients = '{"en": ["Red chilies", "Garlic", "Shallots", "Galangal", "Lemongrass", "Kaffir lime peel", "Coriander root", "Shrimp paste", "Salt"], "th": ["พริกแห้ง", "กระเทียม", "หอมแดง", "ข่า", "ตะไคร้", "ผิวมะกรูด", "รากผักชี", "กะปิ", "เกลือ"]}'::jsonb
WHERE name = 'Red Curry Paste';

UPDATE public.products 
SET ingredients = '{"en": ["Green chilies", "Garlic", "Shallots", "Galangal", "Lemongrass", "Kaffir lime peel", "Coriander root", "Shrimp paste", "Salt"], "th": ["พริกเขียว", "กระเทียม", "หอมแดง", "ข่า", "ตะไคร้", "ผิวมะกรูด", "รากผักชี", "กะปิ", "เกลือ"]}'::jsonb
WHERE name = 'Green Curry Paste';

UPDATE public.products 
SET ingredients = '{"en": ["Dried red chilies", "Garlic", "Shallots", "Galangal", "Lemongrass", "Coriander seeds", "Cumin", "Peanuts", "Tamarind", "Palm sugar", "Shrimp paste"], "th": ["พริกแห้ง", "กระเทียม", "หอมแดง", "ข่า", "ตะไคร้", "เม็ดผักชี", "ยี่หร่า", "ถั่วลิสง", "มะขามเปียก", "น้ำตาลปึก", "กะปิ"]}'::jsonb
WHERE name = 'Massaman Curry Paste';

UPDATE public.products 
SET ingredients = '{"en": ["Red chilies", "Garlic", "Shallots", "Galangal", "Lemongrass", "Kaffir lime peel", "Coriander root", "Peanuts", "Shrimp paste"], "th": ["พริกแห้ง", "กระเทียม", "หอมแดง", "ข่า", "ตะไคร้", "ผิวมะกรูด", "รากผักชี", "ถั่วลิสง", "กะปิ"]}'::jsonb
WHERE name = 'Panang Curry Paste';

UPDATE public.products 
SET ingredients = '{"en": ["Yellow chilies", "Turmeric", "Garlic", "Shallots", "Galangal", "Lemongrass", "Coriander seeds", "Cumin", "Shrimp paste"], "th": ["พริกเหลือง", "ขมิ้น", "กระเทียม", "หอมแดง", "ข่า", "ตะไคร้", "เม็ดผักชี", "ยี่หร่า", "กะปิ"]}'::jsonb
WHERE name = 'Yellow Curry Paste';

UPDATE public.products 
SET ingredients = '{"en": ["Tamarind paste", "Fish sauce", "Palm sugar", "Dried shrimp", "Garlic", "Shallots", "Dried chilies", "Peanuts"], "th": ["น้ำมะขามเปียก", "น้ำปลา", "น้ำตาลปึก", "กุ้งแห้ง", "กระเทียม", "หอมแดง", "พริกแห้ง", "ถั่วลิสง"]}'::jsonb
WHERE name = 'Pad Thai Sauce';

UPDATE public.products 
SET ingredients = '{"en": ["Soy sauce", "Sugar", "Garlic", "Chilies", "Sesame oil", "Rice vinegar", "Cornstarch"], "th": ["ซีอิ๊วขาว", "น้ำตาล", "กระเทียม", "พริก", "น้ำมันงา", "น้ำส้มสายชู", "แป้งข้าวโพด"]}'::jsonb
WHERE name = 'Sukiyaki Dipping Sauce';

UPDATE public.products 
SET ingredients = '{"en": ["Tom yum paste", "Lemongrass", "Galangal", "Kaffir lime leaves", "Thai chilies", "Fish sauce", "Lime juice", "Palm sugar", "Mushrooms"], "th": ["น้ำพริกต้มยำ", "ตะไคร้", "ข่า", "ใบมะกรูด", "พริกขี้หนู", "น้ำปลา", "น้ำมะนาว", "น้ำตาลปึก", "เห็ด"]}'::jsonb
WHERE name = 'Tom Yum Chili Paste';
