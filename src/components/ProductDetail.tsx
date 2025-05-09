
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '@/data/products';
import { recipes } from '@/data/recipes';
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";

interface ProductDetailProps {
  currentLanguage: 'en' | 'th';
}

const ProductDetail = ({ currentLanguage }: ProductDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          {currentLanguage === 'en' ? 'Product not found' : 'ไม่พบสินค้า'}
        </h2>
        <Link to="/shop" className="text-thai-purple hover:underline">
          {currentLanguage === 'en' ? 'Return to shop' : 'กลับไปที่ร้านค้า'}
        </Link>
      </div>
    );
  }
  
  const relatedRecipes = recipes.filter(recipe => 
    recipe.relatedProducts.includes(product.id)
  );
  
  const translations = {
    en: {
      ingredients: "Ingredients",
      description: "Description",
      howToUse: "How to Use",
      addToCart: "Add to Cart",
      quantity: "Quantity",
      relatedRecipes: "Recipes Using This Product",
      viewRecipe: "View Recipe",
      noRecipes: "No recipes found for this product.",
      addedToCart: "Product added to cart!"
    },
    th: {
      ingredients: "ส่วนผสม",
      description: "รายละเอียด",
      howToUse: "วิธีใช้",
      addToCart: "เพิ่มลงตะกร้า",
      quantity: "จำนวน",
      relatedRecipes: "สูตรอาหารที่ใช้ผลิตภัณฑ์นี้",
      viewRecipe: "ดูสูตรอาหาร",
      noRecipes: "ไม่พบสูตรอาหารสำหรับผลิตภัณฑ์นี้",
      addedToCart: "เพิ่มสินค้าลงตะกร้าแล้ว!"
    }
  };

  const t = translations[currentLanguage];
  
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  
  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({
      title: t.addedToCart,
      description: `${product.name[currentLanguage]} x ${quantity}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center text-sm text-gray-500">
        <Link to="/" className="hover:text-thai-purple transition">
          {currentLanguage === 'en' ? 'Home' : 'หน้าหลัก'}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link to="/shop" className="hover:text-thai-purple transition">
          {currentLanguage === 'en' ? 'Shop' : 'ซื้อสินค้า'}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-700">{product.name[currentLanguage]}</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <img 
            src={product.image} 
            alt={product.name[currentLanguage]} 
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            {product.name[currentLanguage]}
          </h1>
          <p className="text-2xl font-semibold text-thai-purple mb-6">
            ${product.price.toFixed(2)}
          </p>
          
          <p className="text-gray-700 mb-6">
            {product.shortDescription[currentLanguage]}
          </p>
          
          {/* Quantity Selector */}
          <div className="mb-8">
            <p className="text-gray-700 mb-2">{t.quantity}</p>
            <div className="flex border border-gray-300 rounded-md w-32">
              <button 
                onClick={decreaseQuantity}
                className="px-3 py-1 border-r border-gray-300"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full text-center focus:outline-none"
              />
              <button 
                onClick={increaseQuantity}
                className="px-3 py-1 border-l border-gray-300"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to Cart */}
          <Button
            onClick={handleAddToCart}
            className="bg-thai-purple hover:bg-thai-purple-dark w-full sm:w-auto mb-8"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {t.addToCart}
          </Button>
          
          {/* Product Details Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">{t.description}</TabsTrigger>
              <TabsTrigger value="ingredients">{t.ingredients}</TabsTrigger>
              <TabsTrigger value="howToUse">{t.howToUse}</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-4 text-gray-700">
              {product.description[currentLanguage]}
            </TabsContent>
            <TabsContent value="ingredients" className="pt-4">
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {product.ingredients[currentLanguage].map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="howToUse" className="pt-4">
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {product.useIn[currentLanguage].map((use, index) => (
                  <li key={index}>{use}</li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Related Recipes */}
      <div className="mt-16">
        <h3 className="text-2xl font-semibold mb-6">{t.relatedRecipes}</h3>
        {relatedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedRecipes.map(recipe => (
              <div key={recipe.id} className="thai-card">
                <img 
                  src={recipe.image} 
                  alt={recipe.name[currentLanguage]} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg font-semibold mb-2">
                    {recipe.name[currentLanguage]}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {recipe.description[currentLanguage]}
                  </p>
                  <Button 
                    asChild
                    variant="outline" 
                    className="border-thai-purple text-thai-purple hover:bg-thai-purple/10"
                  >
                    <Link to={`/recipe/${recipe.id}`}>
                      {t.viewRecipe}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 py-8 text-center">{t.noRecipes}</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
