
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '@/data/products';
import { recipes } from '@/data/recipes';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductImage } from './product/ProductImage';
import ProductInfo from './product/ProductInfo';
import ProductRatings from './product/ProductRatings';
import { RelatedRecipes } from './product/RelatedRecipes';
import { ProductNotFound } from './product/ProductNotFound';
import { ProductDetailSkeleton } from './product/ProductDetailSkeleton';
import { useSupabaseProduct } from '@/hooks/useSupabaseProducts';

// Enhanced image extraction with exact mapping to uploaded images
const getProductImage = (productName: string) => {
  const imageMap: { [key: string]: string } = {
    'Pad Thai Sauce': '/lovable-uploads/5a0dec88-a26c-4e29-bda6-8d921887615e.png',
    'Sukiyaki Dipping Sauce': '/lovable-uploads/322ef915-5db5-4834-9e45-92a34dc3adb6.png',
    'Tom Yum Chili Paste': '/lovable-uploads/fc66a288-b44b-4bf4-a82f-a2c844b58979.png',
    'Red Curry Paste': '/lovable-uploads/dbb561f8-a97a-447c-8946-5a1d279bed05.png',
    'Panang Curry Paste': '/lovable-uploads/5308a5d2-4f12-42ed-b3f8-f2aa5d7fbac9.png',
    'Massaman Curry Paste': '/lovable-uploads/c936ed96-2c61-4919-9e6d-14f740c80b80.png',
    'Green Curry Paste': '/lovable-uploads/1ae4d3c5-e136-4ed4-9a71-f1e9d6123a83.png',
    'Yellow Curry Paste': '/lovable-uploads/acf32ec1-9435-4a5c-8baf-1943b85b93bf.png'
  };

  return imageMap[productName] || '/placeholder.svg';
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, reviewCount: 0, isLoading: true });
  
  const { product: supabaseProduct, isLoading: isLoadingSupabase } = useSupabaseProduct(id || '');
  
  // Fallback to local products data if Supabase product not found
  const localProduct = products.find(p => p.id === id);
  
  console.log('Product debug:', { 
    id, 
    supabaseProduct, 
    localProduct,
    supabaseIngredients: supabaseProduct?.ingredients,
    localProductIngredients: localProduct?.ingredients 
  });
  
  // Priority: use Supabase data but fallback to local data for missing fields
  const product = supabaseProduct ? {
    id: supabaseProduct.id,
    name: { en: supabaseProduct.name, th: supabaseProduct.name },
    description: { en: supabaseProduct.description || '', th: supabaseProduct.description || '' },
    shortDescription: localProduct?.shortDescription || { en: supabaseProduct.short_description || '', th: supabaseProduct.short_description || '' },
    price: Number(supabaseProduct.price),
    sku: supabaseProduct.sku,
    image: getProductImage(supabaseProduct.name),
    category: localProduct?.category || 'curry-pastes',
    featured: Boolean(supabaseProduct.is_featured),
    comparePrice: undefined,
    // Use Supabase ingredients if available, otherwise fallback to local data
    ingredients: supabaseProduct.ingredients || localProduct?.ingredients || { en: [], th: [] },
    useIn: localProduct?.useIn || { en: [], th: [] }
  } : localProduct ? {
    ...localProduct,
    image: getProductImage(localProduct.name[language])
  } : undefined;

  const relatedRecipes = recipes.filter(recipe => 
    recipe.relatedProducts?.includes(id || '')
  );

  const translations = {
    description: language === 'en' ? 'Description' : 'รายละเอียด',
    ingredients: language === 'en' ? 'Ingredients' : 'ส่วนผสม',
    reviews: language === 'en' ? 'Reviews' : 'รีวิว',
    relatedRecipes: language === 'en' ? 'Related Recipes' : 'สูตรอาหารที่เกี่ยวข้อง',
    viewRecipe: language === 'en' ? 'View Recipe' : 'ดูสูตร',
    noRecipes: language === 'en' ? 'No related recipes found.' : 'ไม่พบสูตรอาหารที่เกี่ยวข้อง'
  };

  // Handler to receive review stats from ProductRatings
  const handleReviewStatsUpdate = (stats: { averageRating: number; reviewCount: number; isLoading: boolean }) => {
    setReviewStats(stats);
  };

  if (isLoadingSupabase) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return <ProductNotFound language={language} />;
  }

  // Animation variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        <ProductImage 
          image={product.image} 
          productName={product.name[language]} 
          fadeInVariants={fadeInVariants} 
        />
        <ProductInfo 
          product={product} 
          averageRating={reviewStats.averageRating}
          reviewCount={reviewStats.reviewCount}
          isLoadingReviews={reviewStats.isLoading}
        />
      </div>

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">{translations.description}</TabsTrigger>
          <TabsTrigger value="ingredients">{translations.ingredients}</TabsTrigger>
          <TabsTrigger value="reviews">{translations.reviews}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed">
                {product.description[language]}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ingredients" className="mt-6">
          <Card>
            <CardContent className="p-6">
              {product.ingredients && product.ingredients[language] && product.ingredients[language].length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {product.ingredients[language].map((ingredient, index) => (
                    <li key={index} className="text-gray-700">{ingredient}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">
                  {language === 'en' 
                    ? 'Detailed ingredient information coming soon.' 
                    : 'รายละเอียดส่วนผสมจะมีให้ในเร็วๆ นี้'
                  }
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6">
          <ProductRatings 
            productId={product.id} 
            onStatsUpdate={handleReviewStatsUpdate}
          />
        </TabsContent>
      </Tabs>

      {relatedRecipes.length > 0 && (
        <RelatedRecipes
          recipes={relatedRecipes}
          language={language}
          translations={translations}
        />
      )}
    </div>
  );
};

export default ProductDetail;
