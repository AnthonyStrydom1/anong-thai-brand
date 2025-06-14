
import { useLanguage } from "@/contexts/LanguageContext";

const OrdersHeader = () => {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "My Orders"
    },
    th: {
      title: "คำสั่งซื้อของฉัน"
    }
  };

  const t = translations[language];

  return (
    <h1 className="text-4xl font-bold mb-8 text-anong-black">{t.title}</h1>
  );
};

export default OrdersHeader;
