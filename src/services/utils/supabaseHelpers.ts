
import type { Database } from "@/integrations/supabase/types";

type DbProduct = Database['public']['Tables']['products']['Row'];

// Helper function to safely parse ingredients from database
export const parseIngredients = (ingredients: any): { en: string[]; th: string[] } | null => {
  if (!ingredients) return null;
  
  try {
    // If it's already parsed or in the correct format
    if (typeof ingredients === 'object' && ingredients.en && ingredients.th) {
      return {
        en: Array.isArray(ingredients.en) ? ingredients.en : [],
        th: Array.isArray(ingredients.th) ? ingredients.th : []
      };
    }
    
    // If it's a JSON string, parse it
    if (typeof ingredients === 'string') {
      const parsed = JSON.parse(ingredients);
      return {
        en: Array.isArray(parsed.en) ? parsed.en : [],
        th: Array.isArray(parsed.th) ? parsed.th : []
      };
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to parse ingredients:', error);
    return null;
  }
};

// Helper function to transform database product to SupabaseProduct
export const transformDbProduct = (dbProduct: DbProduct) => ({
  id: dbProduct.id,
  name: dbProduct.name,
  description: dbProduct.description,
  short_description: dbProduct.short_description,
  sku: dbProduct.sku,
  price: dbProduct.price,
  category_id: dbProduct.category_id,
  images: dbProduct.images,
  stock_quantity: dbProduct.stock_quantity,
  is_active: dbProduct.is_active,
  is_featured: dbProduct.is_featured,
  created_at: dbProduct.created_at,
  ingredients: parseIngredients(dbProduct.ingredients)
});
