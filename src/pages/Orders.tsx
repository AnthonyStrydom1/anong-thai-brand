
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import NavigationBanner from "@/components/NavigationBanner";
import Footer from "@/components/Footer";
import { supabaseService } from "@/services/supabaseService";
import { toast } from "@/hooks/use-toast";
import OrdersHeader from "@/components/orders/OrdersHeader";
import OrdersEmptyState from "@/components/orders/OrdersEmptyState";
import OrdersLoadingState from "@/components/orders/OrdersLoadingState";
import OrderCard from "@/components/orders/OrderCard";

const Orders = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get search parameter from URL (for direct email links)
  const searchOrderNumber = searchParams.get('search');

  const translations = {
    en: {
      error: "Error",
      failedToLoad: "Failed to load orders. Please try again.",
      showingOrder: "Showing order:",
      noUserFound: "No user found"
    },
    th: {
      error: "ข้อผิดพลาด",
      failedToLoad: "ไม่สามารถโหลดคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง",
      showingOrder: "แสดงคำสั่งซื้อ:",
      noUserFound: "ไม่พบผู้ใช้"
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
        console.error(t.noUserFound);
        setOrders([]);
        return;
      }

      const userOrders = await supabaseService.getCustomerOrdersByUserId(user.id);
      console.log('Loaded orders:', userOrders);
      
      let filteredOrders = userOrders || [];
      
      // If there's a search parameter, filter to show only that order
      if (searchOrderNumber) {
        filteredOrders = filteredOrders.filter(order => 
          order.order_number === searchOrderNumber
        );
        
        // If we found the specific order, navigate to its details page
        if (filteredOrders.length === 1) {
          navigate(`/orders/${filteredOrders[0].id}`);
          return;
        }
      }
      
      setOrders(filteredOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: t.error,
        description: t.failedToLoad,
        variant: "destructive"
      });
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (order: any) => {
    navigate(`/orders/${order.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-anong-ivory">
        <NavigationBanner />
        <main className="flex-grow container mx-auto px-4 py-12">
          <OrdersLoadingState />
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
          <OrdersEmptyState />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <NavigationBanner />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <OrdersHeader />
        
        {searchOrderNumber && (
          <div className="mb-6 p-4 bg-anong-gold/10 border border-anong-gold/30 rounded-lg">
            <p className="anong-body text-anong-black">
              {t.showingOrder} <strong>#{searchOrderNumber}</strong>
            </p>
          </div>
        )}
        
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onViewDetails={handleViewDetails} 
            />
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Orders;
