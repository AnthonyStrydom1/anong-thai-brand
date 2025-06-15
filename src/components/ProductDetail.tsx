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

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, reviewCount: 0, isLoading: true });
  
  const { product: supabaseProduct, isLoading: isLoadingSupabase } = useSupabaseProduct(id || '');
  
  // Fallback to local products data if Supabase product not found
  const localProduct = products.find(p => p.id === id);
  const product = supabaseProduct ? {
    ...localProduct,
    id: supabaseProduct.id,
    name: { en: supabaseProduct.name, th: supabaseProduct.name },
    description: { en: supabaseProduct.description || '', th: supabaseProduct.description || '' },
    price: Number(supabaseProduct.price),
    sku: supabaseProduct.sku,
    // Keep other properties from local product for UI consistency
    image: localProduct?.image || '',
    category: localProduct?.category || 'curry-pastes',
    featured: Boolean(supabaseProduct.is_featured),
    comparePrice: supabaseProduct.price ? Number(supabaseProduct.price) : undefined,
    ingredients: localProduct?.ingredients || { en: [], th: [] },
    useIn: localProduct?.useIn || { en: [], th: [] }
  } : localProduct;

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
    <div className="container mx-auto px-4 py-8">
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
              <p className="text-gray-700">
                {language === 'en' 
                  ? 'Detailed ingredient information coming soon.' 
                  : 'รายละเอียดส่วนผสมจะมีให้ในเร็วๆ นี้'
                }
              </p>
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
