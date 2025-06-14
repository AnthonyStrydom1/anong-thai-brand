
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import NavigationBanner from "@/components/NavigationBanner";
import Footer from "@/components/Footer";
import FrequentlyBoughtItems from "@/components/checkout/FrequentlyBoughtItems";
import OrderSuccess from "@/components/checkout/OrderSuccess";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingBag, CreditCard, Building2, Truck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { orderService } from "@/services/orderService";
import { shippingService, ShippingRate } from "@/services/shippingService";
import { VATCalculator } from "@/utils/vatCalculator";

const Checkout = () => {
  const { language } = useLanguage();
  const { items, total, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const [searchParams] = useSearchParams();
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<ShippingRate | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  // Calculate shipping when address changes
  useEffect(() => {
    if (formData.city && formData.postalCode && items.length > 0) {
      calculateShipping();
    }
  }, [formData.city, formData.postalCode, items]);

  const calculateShipping = async () => {
    if (!formData.city || !formData.postalCode) return;
    
    setIsCalculatingShipping(true);
    try {
      const rates = await orderService.calculateShipping(formData, items);
      setShippingRates(rates);
      if (rates.length > 0 && !selectedShippingRate) {
        setSelectedShippingRate(rates[0]);
      }
    } catch (error) {
      console.error('Error calculating shipping:', error);
      toast({
        title: "Shipping Error",
        description: "Could not calculate shipping rates. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCalculatingShipping(false);
    }
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast({
          title: "Authentication Required",
          description: t.authRequired,
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      // Validate form data
      const requiredFields = ['email', 'firstName', 'lastName', 'address', 'city', 'postalCode', 'phone'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      if (!selectedShippingRate) {
        toast({
          title: "Shipping Required",
          description: "Please select a shipping method.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      // Get customer ID from the customers table
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (customerError || !customerData) {
        toast({
          title: "Customer Error",
          description: "Could not find customer information. Please try again.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      // Format shipping and billing addresses
      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        phone: formData.phone
      };

      // Create order data in the correct format
      const orderDataForSubmission: CreateOrderData = {
        customer_id: customerData.id,
        items: items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_sku: item.product.sku,
          quantity: item.quantity,
          unit_price: item.product.price,
          total_price: item.product.price * item.quantity
        })),
        shipping_address: shippingAddress,
        billing_address: shippingAddress, // Use same as shipping for now
        shipping_amount: selectedShippingRate.cost,
        shipping_method: selectedShippingRate.description,
        notes: `Payment method: EFT Bank Transfer`
      };

      console.log('Creating EFT order with data:', orderDataForSubmission);

      const order = await orderService.createOrder(orderDataForSubmission);
      
      const orderResult = {
        orderNumber: order.order_number,
        items: items,
        total: orderTotals.totalAmount,
        customerInfo: formData,
        shippingCost: selectedShippingRate.cost,
        vatAmount: orderTotals.vatAmount
      };

      setOrderData(orderResult);
      setOrderSubmitted(true);
      clearCart();
      
      toast({
        title: "Order Created Successfully!",
        description: `Your order #${order.order_number} has been created. Please proceed with EFT payment.`,
      });

    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

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

            {/* Bank Details for EFT Payment */}
            <Card className="anong-card mb-6">
              <CardHeader>
                <CardTitle className="anong-subheading text-xl text-anong-black flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  {t.bankDetails}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="anong-body text-anong-black font-semibold">{t.bankName}</Label>
                    <p className="anong-body text-anong-black">First National Bank</p>
                  </div>
                  <div>
                    <Label className="anong-body text-anong-black font-semibold">{t.accountName}</Label>
                    <p className="anong-body text-anong-black">Anong Restaurant</p>
                  </div>
                  <div>
                    <Label className="anong-body text-anong-black font-semibold">{t.accountNumber}</Label>
                    <p className="anong-body text-anong-black font-mono">1234567890</p>
                  </div>
                  <div>
                    <Label className="anong-body text-anong-black font-semibold">{t.branchCode}</Label>
                    <p className="anong-body text-anong-black font-mono">250655</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-anong-gold/10 rounded-lg border border-anong-gold/30">
                  <h4 className="anong-subheading text-anong-black font-semibold mb-2">{t.paymentInstructions}</h4>
                  <p className="anong-body text-anong-black/80 text-sm">
                    {t.paymentNote}
                  </p>
                  <p className="anong-body text-anong-black font-semibold mt-2">
                    Reference: {orderData.orderNumber}
                  </p>
                  <p className="anong-body text-anong-black font-semibold">
                    Amount: {formatPrice(orderData.total)}
                  </p>
                </div>
              </CardContent>
            </Card>

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
            {/* Contact Information */}
            <Card className="anong-card">
              <CardHeader>
                <CardTitle className="anong-subheading text-xl text-anong-black">
                  {t.contactInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email" className="anong-body text-anong-black">
                    {t.email}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="anong-input"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="anong-card">
              <CardHeader>
                <CardTitle className="anong-subheading text-xl text-anong-black">
                  {t.shippingAddress}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="anong-body text-anong-black">
                      {t.firstName}
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="anong-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="anong-body text-anong-black">
                      {t.lastName}
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="anong-input"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address" className="anong-body text-anong-black">
                    {t.address}
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="anong-input"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="anong-body text-anong-black">
                      {t.city}
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="anong-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode" className="anong-body text-anong-black">
                      {t.postalCode}
                    </Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="anong-input"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone" className="anong-body text-anong-black">
                    {t.phone}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="anong-input"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Method */}
            {(shippingRates.length > 0 || isCalculatingShipping) && (
              <Card className="anong-card">
                <CardHeader>
                  <CardTitle className="anong-subheading text-xl text-anong-black flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    {t.shippingMethod}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isCalculatingShipping ? (
                    <div className="text-center py-4">
                      <p className="anong-body text-anong-black/70">{t.calculatingShipping}</p>
                    </div>
                  ) : (
                    <RadioGroup 
                      value={selectedShippingRate?.service || ''} 
                      onValueChange={(value) => {
                        const rate = shippingRates.find(r => r.service === value);
                        setSelectedShippingRate(rate || null);
                      }}
                    >
                      {shippingRates.map((rate) => (
                        <div key={rate.service} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value={rate.service} id={rate.service} />
                          <Label htmlFor={rate.service} className="flex-1 cursor-pointer">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="anong-body font-semibold text-anong-black">{rate.description}</p>
                                <p className="anong-body-light text-sm text-anong-black/70">
                                  Estimated delivery: {rate.estimatedDays} business days
                                </p>
                              </div>
                              <span className="anong-body font-semibold text-anong-black">
                                {formatPrice(rate.cost)}
                              </span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            <Card className="anong-card">
              <CardHeader>
                <CardTitle className="anong-subheading text-xl text-anong-black">
                  {t.paymentMethod}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 p-4 border rounded-lg bg-anong-gold/5 border-anong-gold/30">
                  <Building2 className="w-5 h-5 text-anong-gold" />
                  <div>
                    <p className="anong-body text-anong-black font-semibold">{t.eftPayment}</p>
                    <p className="anong-body text-anong-black/70 text-sm">Bank transfer payment method</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="space-y-6">
              <Card className="anong-card sticky top-24">
                <CardHeader>
                  <CardTitle className="anong-subheading text-xl text-anong-black">
                    {t.orderSummary}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between anong-body text-sm">
                        <span className="text-anong-black/80">
                          {item.product.name} × {item.quantity}
                        </span>
                        <span className="text-anong-black">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between anong-body">
                      <span className="text-anong-black/80">{t.subtotal}</span>
                      <span className="text-anong-black">{formatPrice(orderTotals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between anong-body">
                      <span className="text-anong-black/80">{t.vatAmount}</span>
                      <span className="text-anong-black">{formatPrice(orderTotals.vatAmount)}</span>
                    </div>
                    <div className="flex justify-between anong-body">
                      <span className="text-anong-black/80">{t.shipping}</span>
                      <span className="text-anong-black">
                        {selectedShippingRate ? formatPrice(selectedShippingRate.cost) : '-'}
                      </span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between anong-subheading text-lg">
                    <span className="text-anong-black">{t.total}</span>
                    <span className="text-anong-black">{formatPrice(orderTotals.totalAmount)}</span>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full anong-btn-primary mt-6"
                    disabled={isProcessing || !selectedShippingRate}
                  >
                    {isProcessing ? t.processing : t.placeOrder}
                  </Button>
                </CardContent>
              </Card>
              
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
