import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronRight, CreditCard } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Checkout = () => {
  const { language } = useLanguage();
  const { items, total, clearCart } = useCart();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const navigate = useNavigate();
  
  const translations = {
    en: {
      checkout: "Checkout",
      contactInfo: "Contact Information",
      shippingAddress: "Shipping Address",
      paymentMethod: "Payment Method",
      orderSummary: "Order Summary",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      city: "City",
      state: "State",
      zip: "ZIP / Postal Code",
      country: "Country",
      cardDetails: "Card Details",
      cardNumber: "Card Number",
      cardName: "Name on Card",
      expiry: "Expiry Date",
      cvc: "CVC",
      payWithCard: "Pay with Credit Card",
      payWithPayfast: "Pay with PayFast",
      items: "Items",
      shipping: "Shipping",
      freeShipping: "Free",
      total: "Total",
      placeOrder: "Place Order",
      orderSuccess: "Order placed successfully!",
      processingPayment: "Processing payment...",
      backToCart: "Back to Cart"
    },
    th: {
      checkout: "ชำระเงิน",
      contactInfo: "ข้อมูลการติดต่อ",
      shippingAddress: "ที่อยู่จัดส่ง",
      paymentMethod: "วิธีการชำระเงิน",
      orderSummary: "สรุปคำสั่งซื้อ",
      firstName: "ชื่อ",
      lastName: "นามสกุล",
      email: "อีเมล",
      phone: "เบอร์โทรศัพท์",
      address: "ที่อยู่",
      city: "เมือง",
      state: "รัฐ / จังหวัด",
      zip: "รหัสไปรษณีย์",
      country: "ประเทศ",
      cardDetails: "รายละเอียดบัตร",
      cardNumber: "หมายเลขบัตร",
      cardName: "ชื่อบนบัตร",
      expiry: "วันหมดอายุ",
      cvc: "CVC",
      payWithCard: "ชำระด้วยบัตรเครดิต",
      payWithPayfast: "ชำระด้วย PayFast",
      items: "รายการ",
      shipping: "การจัดส่ง",
      freeShipping: "ฟรี",
      total: "รวมทั้งหมด",
      placeOrder: "สั่งซื้อ",
      orderSuccess: "สั่งซื้อสำเร็จ!",
      processingPayment: "กำลังดำเนินการชำระเงิน...",
      backToCart: "กลับไปที่ตะกร้า"
    }
  };

  const t = translations[language];

  const handlePayment = (paymentMethod: string) => {
    setPaymentProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentProcessing(false);
      toast({
        title: t.orderSuccess,
        description: `Payment method: ${paymentMethod}`,
      });
      
      // Clear the cart and redirect to home page
      clearCart();
      navigate('/');
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-semibold mb-4">{t.checkout}</h1>
          <p className="mb-4">Your cart is empty</p>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-sm text-gray-500">
          <Link to="/" className="hover:text-thai-purple transition">
            {language === 'en' ? 'Home' : 'หน้าหลัก'}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/cart" className="hover:text-thai-purple transition">
            {language === 'en' ? 'Cart' : 'ตะกร้าสินค้า'}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-700">{t.checkout}</span>
        </div>

        <h1 className="text-3xl font-semibold mb-8 text-gray-800">{t.checkout}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-medium mb-4">{t.contactInfo}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">{t.firstName}</Label>
                  <Input id="firstName" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastName">{t.lastName}</Label>
                  <Input id="lastName" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">{t.email}</Label>
                  <Input id="email" type="email" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone">{t.phone}</Label>
                  <Input id="phone" className="mt-1" />
                </div>
              </div>
            </div>
            
            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-medium mb-4">{t.shippingAddress}</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">{t.address}</Label>
                  <Input id="address" className="mt-1" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">{t.city}</Label>
                    <Input id="city" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="state">{t.state}</Label>
                    <Input id="state" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="zip">{t.zip}</Label>
                    <Input id="zip" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="country">{t.country}</Label>
                    <Input id="country" className="mt-1" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-medium mb-4">{t.paymentMethod}</h2>
              
              <div className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="font-medium mb-4">{t.cardDetails}</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">{t.cardNumber}</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="cardName">{t.cardName}</Label>
                      <Input id="cardName" className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardExpiry">{t.expiry}</Label>
                        <Input id="cardExpiry" placeholder="MM/YY" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cardCvc">{t.cvc}</Label>
                        <Input id="cardCvc" className="mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <Button 
                    className="flex-1"
                    onClick={() => handlePayment('credit-card')}
                    disabled={paymentProcessing}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    {t.payWithCard}
                  </Button>
                  
                  <Button 
                    variant="secondary"
                    className="flex-1"
                    onClick={() => handlePayment('payfast')}
                    disabled={paymentProcessing}
                  >
                    {t.payWithPayfast}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
              <h2 className="text-xl font-medium mb-4">{t.orderSummary}</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span>{t.items} ({items.length})</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span>{t.shipping}</span>
                  <span className="text-green-600">{t.freeShipping}</span>
                </div>
                <div className="flex justify-between text-lg font-medium pt-2">
                  <span>{t.total}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full mb-4"
                onClick={() => handlePayment('credit-card')}
                disabled={paymentProcessing}
              >
                {t.placeOrder}
              </Button>
              
              <Button
                variant="outline"
                asChild
                className="w-full"
              >
                <Link to="/cart">{t.backToCart}</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
