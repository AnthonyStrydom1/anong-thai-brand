
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/hooks/useAuth";
import NavigationBanner from "@/components/NavigationBanner";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabaseService } from "@/services/supabaseService";
import { toast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Package, Eye, Calendar, CreditCard } from "lucide-react";
import OrderTracking from "@/components/OrderTracking";

const Orders = () => {
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const translations = {
    en: {
      title: "My Orders",
      noOrders: "You haven't placed any orders yet",
      startShopping: "Start Shopping",
      order: "Order",
      viewDetails: "View Details"
    },
    th: {
      title: "คำสั่งซื้อของฉัน",
      noOrders: "คุณยังไม่มีคำสั่งซื้อ",
      startShopping: "เริ่มซื้อสินค้า",
      order: "คำสั่งซื้อ",
      viewDetails: "ดูรายละเอียด"
    }
  };

  const t = translations[language];

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      console.log('Loading orders for user:', user?.id);
      
      if (!user) {
        console.error('No user found');
        setOrders([]);
        return;
      }

      const userOrders = await supabaseService.getCustomerOrdersByUserId(user.id);
      console.log('Loaded orders:', userOrders);
      setOrders(userOrders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive"
      });
      setOrders([]);
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
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = (order: any) => {
    navigate(`/orders/${order.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-anong-ivory">
        <NavigationBanner />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <Package className="w-8 h-8 animate-spin mx-auto mb-4 text-anong-black/50" />
            <p className="text-anong-black/70">Loading orders...</p>
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
            <h1 className="text-3xl font-bold mb-4 text-anong-black">{t.title}</h1>
            <p className="text-anong-black/80 mb-8">{t.noOrders}</p>
            <Button asChild className="bg-anong-black text-white hover:bg-anong-gold hover:text-anong-black">
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
        <h1 className="text-4xl font-bold mb-8 text-anong-black">{t.title}</h1>
        
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="shadow-sm border-anong-gold/20">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg text-anong-black flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      {t.order} #{order.order_number}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-anong-black/70">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.created_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        {order.payment_status}
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-lg font-semibold text-anong-black">
                      {formatPrice(order.total_amount)}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(order)}
                    className="border-anong-gold text-anong-black hover:bg-anong-gold hover:text-anong-black"
                  >
                    <Eye className="w-4 h-4 mr-2" />
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
