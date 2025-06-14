
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import NavigationBanner from "@/components/NavigationBanner";
import Footer from "@/components/Footer";
import FrequentlyBoughtItems from "@/components/checkout/FrequentlyBoughtItems";
import OrderSuccess from "@/components/checkout/OrderSuccess";
import { ContactInfoForm } from "@/components/checkout/ContactInfoForm";
import { ShippingMethodCard } from "@/components/checkout/ShippingMethodCard";
import { PaymentMethodCard } from "@/components/checkout/PaymentMethodCard";
import { OrderSummaryCard } from "@/components/checkout/OrderSummaryCard";
import { BankDetailsCard } from "@/components/checkout/BankDetailsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { VATCalculator } from "@/utils/vatCalculator";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";

const Checkout = () => {
  const { language } = useLanguage();
  const { items } = useCart();
  const { formatPrice } = useCurrency();
  
  const {
    formData,
    orderSubmitted,
    orderData,
    isProcessing,
    shippingRates,
    selectedShippingRate,
    setSelectedShippingRate,
    isCalculatingShipping,
    handleInputChange,
    handleSubmit
  } = useCheckoutForm();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate order totals with VAT
  const orderTotals = VATCalculator.calculateOrderTotals(
    items.map(item => ({ price: item.product.price, quantity: item.quantity })),
    selectedShippingRate?.cost || 0
  );

  const translations = {
    en: {
      title: "Checkout",
      emptyCart: "Your cart is empty",
      continueShopping: "Continue Shopping",
      contactInfo: "Contact Information",
      email: "Email",
      shippingAddress: "Shipping Address",
      firstName: "First Name",
      lastName: "Last Name",
      address: "Address",
      city: "City",
      postalCode: "Postal Code",
      phone: "Phone Number",
      shippingMethod: "Shipping Method",
      orderSummary: "Order Summary",
      subtotal: "Subtotal (excl. VAT)",
      vatAmount: "VAT (15%)",
      shipping: "Shipping",
      total: "Total",
      placeOrder: "Place Order (EFT Payment)",
      free: "Free",
      processing: "Processing...",
      authRequired: "Please sign in to complete your order",
      paymentMethod: "Payment Method",
      eftPayment: "EFT Bank Deposit",
      bankDetails: "Bank Details for Payment",
      bankName: "Bank Name",
      accountName: "Account Name",
      accountNumber: "Account Number",
      branchCode: "Branch Code",
      paymentInstructions: "Payment Instructions",
      paymentNote: "Please use your order number as the payment reference and email proof of payment to orders@anong.com",
      calculatingShipping: "Calculating shipping..."
    },
    th: {
      title: "ชำระเงิน",
      emptyCart: "ตะกร้าสินค้าของคุณว่างเปล่า",
      continueShopping: "เลือกซื้อสินค้าต่อ",
      contactInfo: "ข้อมูลการติดต่อ",
      email: "อีเมล",
      shippingAddress: "ที่อยู่จัดส่ง",
      firstName: "ชื่อ",
      lastName: "นามสกุล",
      address: "ที่อยู่",
      city: "เมือง",
      postalCode: "รหัสไปรษณีย์",
      phone: "หมายเลขโทรศัพท์",
      shippingMethod: "วิธีการจัดส่ง",
      orderSummary: "สรุปคำสั่งซื้อ",
      subtotal: "ราคารวม (ไม่รวม VAT)",
      vatAmount: "VAT (15%)",
      shipping: "ค่าจัดส่ง",
      total: "ราคารวมทั้งสิ้น",
      placeOrder: "สั่งซื้อ (โอนเงินผ่านธนาคาร)",
      free: "ฟรี",
      processing: "กำลังดำเนินการ...",
      authRequired: "กรุณาเข้าสู่ระบบเพื่อทำการสั่งซื้อ",
      paymentMethod: "วิธีการชำระเงิน",
      eftPayment: "โอนเงินผ่านธนาคาร",
      bankDetails: "รายละเอียดบัญชีธนาคารสำหรับการชำระเงิน",
      bankName: "ธนาคาร",
      accountName: "ชื่อบัญชี",
      accountNumber: "เลขที่บัญชี",
      branchCode: "รหัสสาขา",
      paymentInstructions: "คำแนะนำการชำระเงิน",
      paymentNote: "กรุณาใช้หมายเลขคำสั่งซื้อเป็นข้อมูลอ้างอิงและส่งหลักฐานการชำระเงินไปที่ orders@anong.com",
      calculatingShipping: "กำลังคำนวณค่าจัดส่ง..."
    }
  };

  const t = translations[language];

  if (items.length === 0 && !orderSubmitted) {
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

  // Show order success page with EFT payment details
  if (orderSubmitted && orderData) {
    return (
      <div className="min-h-screen flex flex-col bg-anong-ivory">
        <NavigationBanner />
        
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="anong-card mb-6">
              <CardHeader className="text-center">
                <CardTitle className="anong-heading text-2xl text-anong-black mb-2">
                  Order Confirmation
                </CardTitle>
                <p className="anong-body text-anong-black/80">
                  Order #{orderData.orderNumber} has been created successfully
                </p>
              </CardHeader>
            </Card>

            <BankDetailsCard
              orderNumber={orderData.orderNumber}
              total={orderData.total}
              translations={t}
            />

            <OrderSuccess {...orderData} />
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // Get current product IDs for frequently bought suggestions
  const currentProductIds = items.map(item => item.product.id);

  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <NavigationBanner />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="anong-heading text-4xl mb-8 text-anong-black">{t.title}</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <ContactInfoForm
              formData={formData}
              onInputChange={handleInputChange}
              translations={t}
            />

            <ShippingMethodCard
              shippingRates={shippingRates}
              selectedShippingRate={selectedShippingRate}
              onShippingRateChange={setSelectedShippingRate}
              isCalculatingShipping={isCalculatingShipping}
              translations={t}
            />

            <PaymentMethodCard translations={t} />
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="space-y-6">
              <OrderSummaryCard
                orderTotals={orderTotals}
                selectedShippingRate={selectedShippingRate}
                isProcessing={isProcessing}
                translations={t}
              />
              
              {/* Frequently Bought Items */}
              <FrequentlyBoughtItems currentItems={currentProductIds} />
            </div>
          </div>
        </form>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
