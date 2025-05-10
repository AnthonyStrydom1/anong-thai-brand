
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';

const CartDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, itemCount, total, removeItem } = useCart();
  const { language } = useLanguage();

  const translations = {
    en: {
      cart: "Cart",
      empty: "Your cart is empty",
      viewCart: "View Cart",
      checkout: "Checkout",
      total: "Total",
      items: "items",
      remove: "Remove"
    },
    th: {
      cart: "ตะกร้าสินค้า",
      empty: "ตะกร้าสินค้าของคุณว่างเปล่า",
      viewCart: "ดูตะกร้า",
      checkout: "ชำระเงิน",
      total: "รวม",
      items: "รายการ",
      remove: "ลบ"
    }
  };

  const t = translations[language];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
   const buttonStyle = "text-white hover:bg-white hover:bg-opacity-20 transition-colors";

  return (
    <div className="relative">
      <button 
        className="flex items-center text-gray-700 hover:text-thai-purple transition relative"
        onClick={toggleDropdown}
      >
        <ShoppingCart className="h-6 w-6 text-white" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-thai-purple text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-30"
            onClick={toggleDropdown}
          ></div>
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-40 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {t.cart} ({itemCount} {t.items})
              </h3>
            </div>
            
            {items.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {t.empty}
              </div>
            ) : (
              <>
                <div className="max-h-60 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.product.id} className="flex p-3 border-b border-gray-100">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name[language]} 
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="ml-3 flex-grow">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">{item.product.name[language]}</p>
                          <button 
                            onClick={() => removeItem(item.product.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-200">
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">{t.total}:</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      asChild
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link to="/cart">{t.viewCart}</Link>
                    </Button>
                    <Button 
                      variant="default"
                      className="w-full bg-thai-purple hover:bg-thai-purple-dark"
                    >
                      {t.checkout}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CartDropdown;
