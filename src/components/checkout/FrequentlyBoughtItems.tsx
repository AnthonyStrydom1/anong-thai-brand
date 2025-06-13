
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OptimizedLazyImage } from "@/components/ui/optimized-lazy-image";
import { products } from "@/data/products";
import { Plus } from "lucide-react";
import { useState } from "react";

interface FrequentlyBoughtItemsProps {
  currentItems: string[];
}

const FrequentlyBoughtItems = ({ currentItems }: FrequentlyBoughtItemsProps) => {
  const { language } = useLanguage();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const translations = {
    en: {
      title: "Frequently Bought Together",
      subtitle: "Customers who bought these items also purchased:",
      addToCart: "Add to Cart",
      added: "Added"
    },
    th: {
      title: "สินค้าที่ซื้อด้วยกันบ่อย",
      subtitle: "ลูกค้าที่ซื้อสินค้าเหล่านี้ยังซื้อเพิ่ม:",
      addToCart: "เพิ่มใส่ตะกร้า",
      added: "เพิ่มแล้ว"
    }
  };

  const t = translations[language];

  // Get suggested products based on current cart items
  const getSuggestedProducts = () => {
    // Filter out products already in cart
    const availableProducts = products.filter(product => 
      !currentItems.includes(product.id)
    );

    // For demo purposes, suggest first 3 available products
    // In real app, this would be based on actual purchase data
    return availableProducts.slice(0, 3);
  };

  const suggestedProducts = getSuggestedProducts();

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
    setAddedItems(prev => new Set([...prev, product.id]));
    
    // Reset the "added" state after 2 seconds
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 2000);
  };

  if (suggestedProducts.length === 0) {
    return null;
  }

  return (
    <Card className="anong-card mt-6">
      <CardHeader>
        <CardTitle className="anong-subheading text-lg text-anong-black">
          {t.title}
        </CardTitle>
        <p className="anong-body-light text-sm text-anong-black/70">
          {t.subtitle}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestedProducts.map((product) => (
            <div key={product.id} className="flex items-center space-x-4 p-3 border border-anong-gold/20 rounded-lg hover:bg-anong-cream/30 transition-colors">
              <div className="w-16 h-16 flex-shrink-0">
                <OptimizedLazyImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="flex-grow">
                <h4 className="anong-body font-medium text-anong-black line-clamp-1">
                  {product.name}
                </h4>
                <p className="anong-body-light text-sm text-anong-black/70 line-clamp-1">
                  {product.description}
                </p>
                <p className="anong-subheading text-sm text-anong-gold mt-1">
                  {formatPrice(product.price)}
                </p>
              </div>
              
              <Button
                size="sm"
                onClick={() => handleAddToCart(product)}
                disabled={addedItems.has(product.id)}
                className={
                  addedItems.has(product.id) 
                    ? "anong-btn-secondary" 
                    : "anong-btn-primary"
                }
              >
                {addedItems.has(product.id) ? (
                  t.added
                ) : (
                  <>
                    <Plus className="h-3 w-3 mr-1" />
                    {t.addToCart}
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FrequentlyBoughtItems;
