
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Calendar, CreditCard, Eye } from "lucide-react";

interface OrderCardProps {
  order: any;
  onViewDetails: (order: any) => void;
}

const OrderCard = ({ order, onViewDetails }: OrderCardProps) => {
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();

  const translations = {
    en: {
      order: "Order",
      viewDetails: "View Details"
    },
    th: {
      order: "คำสั่งซื้อ",
      viewDetails: "ดูรายละเอียด"
    }
  };

  const t = translations[language];

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

  return (
    <Card className="shadow-sm border-anong-gold/20">
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
            onClick={() => onViewDetails(order)}
            className="border-anong-gold text-anong-black hover:bg-anong-gold hover:text-anong-black"
          >
            <Eye className="w-4 h-4 mr-2" />
            {t.viewDetails}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
