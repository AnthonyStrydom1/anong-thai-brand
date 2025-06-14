
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

const OrdersEmptyState = () => {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "My Orders",
      noOrders: "You haven't placed any orders yet",
      startShopping: "Start Shopping"
    },
    th: {
      title: "คำสั่งซื้อของฉัน",
      noOrders: "คุณยังไม่มีคำสั่งซื้อ",
      startShopping: "เริ่มซื้อสินค้า"
    }
  };

  const t = translations[language];

  return (
    <div className="text-center max-w-md mx-auto">
      <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-anong-black/50" />
      <h1 className="text-3xl font-bold mb-4 text-anong-black">{t.title}</h1>
      <p className="text-anong-black/80 mb-8">{t.noOrders}</p>
      <Button asChild className="bg-anong-black text-white hover:bg-anong-gold hover:text-anong-black">
        <Link to="/shop">{t.startShopping}</Link>
      </Button>
    </div>
  );
};

export default OrdersEmptyState;
