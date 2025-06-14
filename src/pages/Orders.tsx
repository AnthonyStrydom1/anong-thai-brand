
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
