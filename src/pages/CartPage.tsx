
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import NavigationBanner from "@/components/NavigationBanner";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const CartPage = () => {
  const { language } = useLanguage();
  const { items, updateQuantity, removeItem, totalAmount } = useCart();
  const { formatPrice } = useCurrency();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const translations = {
    en: {
      title: "Shopping Cart",
      emptyCart: "Your cart is empty",
      continueShopping: "Continue Shopping",
      quantity: "Quantity",
      remove: "Remove",
      subtotal: "Subtotal",
      proceedToCheckout: "Proceed to Checkout",
      backToShop: "Back to Shop"
    },
    th: {
      title: "ตะกร้าสินค้า",
      emptyCart: "ตะกร้าสินค้าของคุณว่างเปล่า",
      continueShopping: "เลือกซื้อสินค้าต่อ",
      quantity: "จำนวน",
      remove: "ลบ",
      subtotal: "ราคารวม",
      proceedToCheckout: "ดำเนินการชำระเงิน",
      backToShop: "กลับไปยังร้านค้า"
    }
  };

  const t = translations[language];

  // Enhanced image extraction with exact mapping
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-anong-ivory">
        <NavigationBanner />
        
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-anong-black/50" />
            <h1 className="anong-heading text-3xl mb-4 text-anong-black">{t.title}</h1>
            <p className="anong-body text-anong-black/80 mb-8">{t.emptyCart}</p>
            <Button asChild className="anong-btn-primary">
              <Link to="/shop">{t.continueShopping}</Link>
            </Button>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <NavigationBanner />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="anong-heading text-4xl mb-8 text-anong-black">{t.title}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={`${item.product.id}-cart`} className="anong-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gradient-to-b from-anong-cream to-anong-ivory rounded-lg flex items-center justify-center p-2">
                      <img
                        src={getProductImage(item.product.name)}
                        alt={item.product.name}
                        className="max-w-[60px] max-h-[60px] w-auto h-auto object-contain"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="anong-subheading text-lg font-medium text-anong-black">
                        {item.product.name}
                      </h3>
                      <p className="anong-body text-anong-black/70">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="anong-body font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="anong-card sticky top-24">
              <CardContent className="p-6">
                <h3 className="anong-subheading text-xl mb-4 text-anong-black">{t.subtotal}</h3>
                <div className="space-y-2 mb-6">
                  {items.map((item) => (
                    <div key={`${item.product.id}-summary`} className="flex justify-between anong-body text-sm">
                      <span className="text-anong-black/80">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="text-anong-black">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-anong-gold/20 pt-4 mb-6">
                  <div className="flex justify-between anong-subheading text-lg">
                    <span className="text-anong-black">Total</span>
                    <span className="text-anong-black">{formatPrice(totalAmount)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button asChild className="w-full anong-btn-primary">
                    <Link to="/checkout">{t.proceedToCheckout}</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full anong-btn-secondary">
                    <Link to="/shop">{t.backToShop}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CartPage;
