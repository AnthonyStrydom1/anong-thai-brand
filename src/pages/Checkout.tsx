import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import NavigationBanner from "@/components/NavigationBanner";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Checkout = () => {
  const { language } = useLanguage();
  const { items, total, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  
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
      orderSummary: "Order Summary",
      subtotal: "Subtotal",
      shipping: "Shipping",
      total: "Total",
      placeOrder: "Place Order",
      free: "Free"
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
      orderSummary: "สรุปคำสั่งซื้อ",
      subtotal: "ราคารวม",
      shipping: "ค่าจัดส่ง",
      total: "ราคารวมทั้งสิ้น",
      placeOrder: "สั่งซื้อ",
      free: "ฟรี"
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle order submission here
    console.log('Order submitted:', { formData, items, total });
    // Clear cart after successful order
    clearCart();
    // Redirect to success page or show success message
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
          </div>
          
          {/* Order Summary */}
          <div>
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
                    <span className="text-anong-black">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between anong-body">
                    <span className="text-anong-black/80">{t.shipping}</span>
                    <span className="text-anong-black">{t.free}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between anong-subheading text-lg">
                  <span className="text-anong-black">{t.total}</span>
                  <span className="text-anong-black">{formatPrice(total)}</span>
                </div>
                
                <Button type="submit" className="w-full anong-btn-primary mt-6">
                  {t.placeOrder}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
