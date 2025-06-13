
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface OrderSuccessProps {
  orderNumber: string;
  items: OrderItem[];
  total: number;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

const OrderSuccess = ({ orderNumber, items, total, customerInfo }: OrderSuccessProps) => {
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();

  const translations = {
    en: {
      title: "Order Confirmed!",
      subtitle: "Thank you for your order",
      orderNumber: "Order Number",
      confirmation: "We've sent a confirmation email to",
      summary: "Order Summary",
      total: "Total",
      continueShopping: "Continue Shopping",
      viewOrders: "View My Orders"
    },
    th: {
      title: "ยืนยันคำสั่งซื้อแล้ว!",
      subtitle: "ขอบคุณสำหรับคำสั่งซื้อของคุณ",
      orderNumber: "หมายเลขคำสั่งซื้อ",
      confirmation: "เราได้ส่งอีเมลยืนยันไปยัง",
      summary: "สรุปคำสั่งซื้อ",
      total: "รวมทั้งสิ้น",
      continueShopping: "เลือกซื้อสินค้าต่อ",
      viewOrders: "ดูคำสั่งซื้อของฉัน"
    }
  };

  const t = translations[language];

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="anong-card text-center mb-6">
        <CardHeader>
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="anong-heading text-2xl text-anong-black">
            {t.title}
          </CardTitle>
          <p className="anong-body text-anong-black/70">{t.subtitle}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="anong-body font-medium text-anong-black">
                {t.orderNumber}: <span className="text-anong-gold">{orderNumber}</span>
              </p>
              <p className="anong-body-light text-sm text-anong-black/70 mt-2">
                {t.confirmation} {customerInfo.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="anong-card">
        <CardHeader>
          <CardTitle className="anong-subheading text-lg text-anong-black">
            {t.summary}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
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
          
          <div className="border-t border-anong-gold/20 pt-4">
            <div className="flex justify-between anong-subheading text-lg">
              <span className="text-anong-black">{t.total}</span>
              <span className="text-anong-black">{formatPrice(total)}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button asChild className="flex-1 anong-btn-primary">
              <Link to="/shop">{t.continueShopping}</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 anong-btn-secondary">
              <Link to="/orders">{t.viewOrders}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;
