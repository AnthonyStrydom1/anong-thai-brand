import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import NavigationBanner from '@/components/NavigationBanner';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabaseService } from '@/services/supabaseService';
import { toast } from '@/hooks/use-toast';

interface CustomerOrder {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
}

const Orders = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const translations = {
    en: {
      title: 'My Orders',
      noOrders: 'You have no orders yet.',
      order: 'Order',
      date: 'Date',
      status: 'Status',
      total: 'Total',
      viewDetails: 'View Details',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      pending: 'Pending',
      cancelled: 'Cancelled',
      paid: 'Paid',
      failed: 'Failed',
      refunded: 'Refunded',
      loading: 'Loading your orders...',
      pleaseLogin: 'Please log in to view your orders.'
    },
    th: {
      title: 'คำสั่งซื้อของฉัน',
      noOrders: 'คุณยังไม่มีคำสั่งซื้อ',
      order: 'คำสั่งซื้อ',
      date: 'วันที่',
      status: 'สถานะ',
      total: 'ยอดรวม',
      viewDetails: 'ดูรายละเอียด',
      processing: 'กำลังดำเนินการ',
      shipped: 'จัดส่งแล้ว',
      delivered: 'จัดส่งถึงแล้ว',
      pending: 'รอดำเนินการ',
      cancelled: 'ยกเลิก',
      paid: 'ชำระแล้ว',
      failed: 'ชำระไม่สำเร็จ',
      refunded: 'คืนเงินแล้ว',
      loading: 'กำลังโหลดคำสั่งซื้อ...',
      pleaseLogin: 'กรุณาเข้าสู่ระบบเพื่อดูคำสั่งซื้อ'
    }
  };

  const t = translations[language];

  useEffect(() => {
    if (user?.id) {
      loadOrders();
      
      // Set up real-time subscription for order updates
      const channel = supabaseService.supabase
        .channel('order-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders'
          },
          (payload) => {
            console.log('Order update received:', payload);
            loadOrders(); // Reload orders when there's an update
          }
        )
        .subscribe();

      return () => {
        supabaseService.supabase.removeChannel(channel);
      };
    }
  }, [user?.id]);

  const loadOrders = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabaseService.supabase
        .rpc('get_customer_orders', { user_uuid: user.id });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'processing': t.processing,
      'shipped': t.shipped,
      'delivered': t.delivered,
      'pending': t.pending,
      'cancelled': t.cancelled,
      'paid': t.paid,
      'failed': t.failed,
      'refunded': t.refunded
    };
    return statusMap[status] || status;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavigationBanner />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-center text-gray-500">{t.pleaseLogin}</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBanner />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-thai-purple">{t.title}</h1>
        
        {isLoading ? (
          <Card>
            <CardContent className="flex justify-center py-8">
              <p className="text-gray-500">{t.loading}</p>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-center text-gray-500">{t.noOrders}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.order}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.date}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.status}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.total}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'th-TH')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col space-y-1">
                        <Badge className={getStatusClass(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                        <Badge className={getStatusClass(order.payment_status)}>
                          {getStatusLabel(order.payment_status)}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" className="text-thai-purple hover:text-thai-purple-dark">
                        {t.viewDetails}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
