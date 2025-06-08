import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Orders = () => {
  const { language } = useLanguage();
  
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
      delivered: 'Delivered'
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
      delivered: 'จัดส่งถึงแล้ว'
    }
  };

  const t = translations[language];
  
  // Mock orders data
  const mockOrders = [
    {
      id: '1001',
      date: '2025-05-10',
      status: 'delivered',
      total: 45.90,
      items: 3
    },
    {
      id: '1002',
      date: '2025-05-15',
      status: 'shipped',
      total: 28.50,
      items: 2
    },
    {
      id: '1003',
      date: '2025-05-17',
      status: 'processing',
      total: 56.75,
      items: 4
    }
  ];
  
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'processing':
        return t.processing;
      case 'shipped':
        return t.shipped;
      case 'delivered':
        return t.delivered;
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-thai-purple">{t.title}</h1>
        
        {mockOrders.length === 0 ? (
          <p className="text-center py-8 text-gray-500">{t.noOrders}</p>
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
                {mockOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString(language === 'en' ? 'en-US' : 'th-TH')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.total.toFixed(2)}
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
