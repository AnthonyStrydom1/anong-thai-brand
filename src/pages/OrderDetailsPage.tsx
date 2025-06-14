
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/hooks/useAuth";
import NavigationBanner from "@/components/NavigationBanner";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabaseService } from "@/services/supabaseService";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Package, MapPin, CreditCard, Truck } from "lucide-react";
import OrderTracking from "@/components/OrderTracking";

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const translations = {
    en: {
      orderDetails: "Order Details",
      backToOrders: "Back to Orders",
      orderNotFound: "Order not found",
      orderItems: "Order Items",
      shippingAddress: "Shipping Address",
      billingAddress: "Billing Address",
      paymentInfo: "Payment Information",
      orderSummary: "Order Summary",
      subtotal: "Subtotal",
      vat: "VAT",
      shipping: "Shipping",
      total: "Total",
      quantity: "Qty",
      price: "Price",
      status: "Status",
      orderDate: "Order Date",
      estimatedDelivery: "Estimated Delivery"
    },
    th: {
      orderDetails: "รายละเอียดคำสั่งซื้อ",
      backToOrders: "กลับไปที่คำสั่งซื้อ",
      orderNotFound: "ไม่พบคำสั่งซื้อ",
      orderItems: "รายการสินค้า",
      shippingAddress: "ที่อยู่จัดส่ง",
      billingAddress: "ที่อยู่เรียกเก็บเงิน",
      paymentInfo: "ข้อมูลการชำระเงิน",
      orderSummary: "สรุปคำสั่งซื้อ",
      subtotal: "ยอดย่อย",
      vat: "ภาษีมูลค่าเพิ่ม",
      shipping: "ค่าจัดส่ง",
      total: "ยอดรวม",
      quantity: "จำนวน",
      price: "ราคา",
      status: "สถานะ",
      orderDate: "วันที่สั่งซื้อ",
      estimatedDelivery: "กำหนดส่งโดยประมาณ"
    }
  };

  const t = translations[language];

  useEffect(() => {
    if (user && id) {
      loadOrderDetails();
    }
  }, [user, id]);

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true);
      console.log('Loading order details for ID:', id);
      
      if (!user || !id) {
        console.error('No user or order ID found');
        return;
      }

      const orderDetails = await supabaseService.getOrder(id);
      console.log('Loaded order details:', orderDetails);
      setOrder(orderDetails);
    } catch (error) {
      console.error('Error loading order details:', error);
      toast({
        title: "Error",
        description: "Failed to load order details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'delivered':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'shipped':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDelivery = () => {
    if (!order?.estimated_delivery_days) return null;
    
    const orderDate = new Date(order.created_at);
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(orderDate.getDate() + order.estimated_delivery_days);
    
    return estimatedDate.toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-anong-ivory">
        <NavigationBanner />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <Package className="w-8 h-8 animate-spin mx-auto mb-4 text-anong-black/50" />
            <p className="text-anong-black/70">Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-anong-ivory">
        <NavigationBanner />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <Package className="w-16 h-16 mx-auto mb-6 text-anong-black/50" />
            <h1 className="text-3xl font-bold mb-4 text-anong-black">{t.orderNotFound}</h1>
            <Button asChild className="bg-anong-black text-white hover:bg-anong-gold hover:text-anong-black">
              <Link to="/orders">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.backToOrders}
              </Link>
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
        <div className="mb-6">
          <Button asChild variant="outline" className="border-anong-gold text-anong-black hover:bg-anong-gold hover:text-anong-black">
            <Link to="/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.backToOrders}
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <Card className="border-anong-gold/20">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-anong-black">
                      Order #{order.order_number}
                    </CardTitle>
                    <p className="text-anong-black/70 mt-2">
                      {t.orderDate}: {formatDate(order.created_at)}
                    </p>
                    {getEstimatedDelivery() && (
                      <p className="text-anong-black/70">
                        {t.estimatedDelivery}: {getEstimatedDelivery()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusColor(order.status)} className="mb-2">
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </Badge>
                    <p className="text-2xl font-bold text-anong-black">
                      {formatPrice(order.total_amount)}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Order Tracking */}
            <OrderTracking order={order} />

            {/* Order Items */}
            <Card className="border-anong-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center text-anong-black">
                  <Package className="w-5 h-5 mr-2" />
                  {t.orderItems}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center py-3 border-b border-anong-gold/20 last:border-b-0">
                      <div className="flex-1">
                        <h4 className="font-medium text-anong-black">{item.product_name}</h4>
                        <p className="text-sm text-anong-black/70">SKU: {item.product_sku}</p>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-sm text-anong-black/70">{t.quantity}</p>
                        <p className="font-medium text-anong-black">{item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-anong-black">{formatPrice(item.total_price)}</p>
                        <p className="text-sm text-anong-black/70">
                          {formatPrice(item.unit_price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="border-anong-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center text-anong-black">
                  <CreditCard className="w-5 h-5 mr-2" />
                  {t.orderSummary}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-anong-black/70">{t.subtotal}</span>
                  <span className="text-anong-black">{formatPrice(order.subtotal)}</span>
                </div>
                {order.vat_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-anong-black/70">{t.vat}</span>
                    <span className="text-anong-black">{formatPrice(order.vat_amount)}</span>
                  </div>
                )}
                {order.shipping_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-anong-black/70">{t.shipping}</span>
                    <span className="text-anong-black">{formatPrice(order.shipping_amount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-anong-black">{t.total}</span>
                  <span className="text-anong-black">{formatPrice(order.total_amount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.shipping_address && (
              <Card className="border-anong-gold/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-anong-black">
                    <MapPin className="w-5 h-5 mr-2" />
                    {t.shippingAddress}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-anong-black/80 space-y-1">
                    <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                    <p>{order.shipping_address.address}</p>
                    <p>{order.shipping_address.city}, {order.shipping_address.postal_code}</p>
                    {order.shipping_address.phone && <p>{order.shipping_address.phone}</p>}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Info */}
            <Card className="border-anong-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center text-anong-black">
                  <CreditCard className="w-5 h-5 mr-2" />
                  {t.paymentInfo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-anong-black/70">{t.status}</span>
                    <Badge variant={getStatusColor(order.payment_status)}>
                      {order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-anong-black/70">Method</span>
                    <span className="text-anong-black">{order.shipping_method || 'Standard Shipping'}</span>
                  </div>
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

export default OrderDetailsPage;
