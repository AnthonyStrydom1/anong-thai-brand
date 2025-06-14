
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import NavigationBanner from "@/components/NavigationBanner";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { orderService } from "@/services/orderService";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { ShoppingBag, Package } from "lucide-react";

const Orders = () => {
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const translations = {
    en: {
      title: "My Orders",
      noOrders: "You haven't placed any orders yet",
      startShopping: "Start Shopping",
      order: "Order",
      date: "Date",
      status: "Status",
      total: "Total",
      items: "items",
      viewDetails: "View Details"
    },
    th: {
      title: "คำสั่งซื้อของฉัน",
      noOrders: "คุณยังไม่มีคำสั่งซื้อ",
      startShopping: "เริ่มซื้อสินค้า",
      order: "คำสั่งซื้อ",
      date: "วันที่",
      status: "สถานะ",
      total: "ยอดรวม",
      items: "รายการ",
      viewDetails: "ดูรายละเอียด"
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const userOrders = await orderService.getUserOrders();
      console.log('Loaded orders:', userOrders);
      setOrders(userOrders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
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
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'short',
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
            <p className="anong-body text-anong-black/70">Loading orders...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-anong-ivory">
        <NavigationBanner />
        
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-anong-black/50" />
            <h1 className="anong-heading text-3xl mb-4 text-anong-black">{t.title}</h1>
            <p className="anong-body text-anong-black/80 mb-8">{t.noOrders}</p>
            <Button asChild className="anong-btn-primary">
              <Link to="/shop">{t.startShopping}</Link>
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
        
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="anong-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="anong-subheading text-lg text-anong-black">
                      {t.order} #{order.order_number}
                    </CardTitle>
                    <p className="anong-body-light text-sm text-anong-black/70 mt-1">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </Badge>
                    <p className="anong-subheading text-lg text-anong-black">
                      {formatPrice(order.total_amount)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="anong-body text-anong-black/80">
                    {/* You can add order items count here if needed */}
                    {t.status}: <span className="font-medium">{order.payment_status}</span>
                  </div>
                  <Button variant="outline" className="anong-btn-secondary" size="sm">
                    {t.viewDetails}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Orders;
