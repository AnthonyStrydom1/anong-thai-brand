
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Plus, Minus, ChevronRight, CreditCard } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const CartPage = () => {
  const { language } = useLanguage();
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  const translations = {
    en: {
      cartTitle: "Shopping Cart",
      emptyCart: "Your cart is empty",
      continueShopping: "Continue Shopping",
      product: "Product",
      price: "Price",
      quantity: "Quantity",
      subtotal: "Subtotal",
      actions: "Actions",
      clearCart: "Clear Cart",
      checkout: "Proceed to Checkout",
      payWithCard: "Pay with Credit Card",
      payWithPayfast: "Pay with PayFast",
      cartTotal: "Cart Total",
      shipping: "Shipping",
      freeShipping: "Free Shipping",
      total: "Total",
      removed: "Product removed from cart",
      cleared: "Cart cleared",
      processingPayment: "Processing payment..."
    },
    th: {
      cartTitle: "ตะกร้าสินค้า",
      emptyCart: "ตะกร้าสินค้าของคุณว่างเปล่า",
      continueShopping: "เลือกซื้อสินค้าต่อ",
      product: "สินค้า",
      price: "ราคา",
      quantity: "จำนวน",
      subtotal: "รวม",
      actions: "การกระทำ",
      clearCart: "ล้างตะกร้า",
      checkout: "ดำเนินการชำระเงิน",
      payWithCard: "ชำระด้วยบัตรเครดิต",
      payWithPayfast: "ชำระด้วย PayFast",
      cartTotal: "ยอดรวมในตะกร้า",
      shipping: "ค่าจัดส่ง",
      freeShipping: "จัดส่งฟรี",
      total: "ยอดรวมทั้งหมด",
      removed: "ลบสินค้าออกจากตะกร้าแล้ว",
      cleared: "ล้างตะกร้าแล้ว",
      processingPayment: "กำลังดำเนินการชำระเงิน..."
    }
  };

  const t = translations[language];
  
  const handleRemoveItem = (productId: string, productName: string) => {
    removeItem(productId);
    toast({
      title: t.removed,
      description: productName,
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: t.cleared,
    });
  };

  const handleCheckout = (paymentMethod: string) => {
    setPaymentProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentProcessing(false);
      toast({
        title: `${t.processingPayment}`,
        description: `Payment method: ${paymentMethod}`,
      });
      
      // Here you would typically redirect to a payment gateway or process payment
      // For now, we'll just show a success toast
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-sm text-gray-500">
          <Link to="/" className="hover:text-thai-purple transition">
            {language === 'en' ? 'Home' : 'หน้าหลัก'}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-700">{t.cartTitle}</span>
        </div>

        <h1 className="text-3xl font-semibold mb-8 text-gray-800">{t.cartTitle}</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-gray-100 mb-6">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">{t.emptyCart}</h2>
            <Button 
              asChild
            >
              <Link to="/shop">{t.continueShopping}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Table */}
            <div className="lg:col-span-2">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t.product}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t.price}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t.quantity}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t.subtotal}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t.actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => {
                      // Get the first image from the images array, or use placeholder
                      const productImage = item.product.images && Array.isArray(item.product.images) && item.product.images.length > 0 
                        ? item.product.images[0] 
                        : '/placeholder.svg';

                      return (
                        <tr key={item.product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-16 w-16">
                                <img className="h-16 w-16 object-cover rounded" src={productImage} alt={item.product.name} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  <Link to={`/product/${item.product.id}`} className="hover:text-thai-purple">
                                    {item.product.name}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${item.product.price.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center border border-gray-300 rounded-md w-24">
                              <button 
                                onClick={() => updateQuantity(item.product.id, Math.max(0, item.quantity - 1))}
                                className="p-1 hover:bg-gray-100 transition"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-3 py-1 text-center flex-1">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1 hover:bg-gray-100 transition"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t.clearCart}
                </Button>
              </div>
            </div>
            
            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                <h2 className="text-xl font-medium mb-4">{t.cartTotal}</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span>{t.shipping}</span>
                    <span className="text-green-600">{t.freeShipping}</span>
                  </div>
                  <div className="flex justify-between text-lg font-medium pt-2">
                    <span>{t.total}</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full"
                    asChild
                  >
                    <Link to="/checkout">{t.checkout}</Link>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => handleCheckout('credit-card')}
                    disabled={paymentProcessing}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {t.payWithCard}
                  </Button>
                  
                  <Button 
                    variant="secondary"
                    className="w-full"
                    onClick={() => handleCheckout('payfast')}
                    disabled={paymentProcessing}
                  >
                    {t.payWithPayfast}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CartPage;
