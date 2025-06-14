
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import NavigationBanner from "@/components/NavigationBanner";
import Footer from "@/components/Footer";

const Shipping = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);
  
  const translations = {
    en: {
      title: "Shipping & Delivery",
      subtitle: "Fast, reliable delivery of authentic Thai flavors to your door",
      domesticShipping: "Domestic Shipping (South Africa)",
      domesticDetails: [
        "Free shipping on orders over R500",
        "Standard delivery: 3-5 business days",
        "Express delivery: 1-2 business days (additional charges apply)",
        "Delivery to major cities and towns nationwide"
      ],
      internationalShipping: "International Shipping",
      internationalDetails: [
        "Available to selected countries",
        "Delivery time: 7-14 business days",
        "Customs duties and taxes may apply",
        "Contact us for shipping quotes to your country"
      ],
      packaging: "Packaging & Care",
      packagingDetails: [
        "All products carefully packaged to prevent damage",
        "Temperature-controlled packaging for sensitive items",
        "Eco-friendly packaging materials when possible",
        "Each order includes handling instructions"
      ],
      tracking: "Order Tracking",
      trackingDetails: [
        "Tracking information sent via email once shipped",
        "Track your order through our delivery partners",
        "SMS notifications for delivery updates",
        "Contact support for any delivery concerns"
      ]
    },
    th: {
      title: "การจัดส่งและการขนส่ง",
      subtitle: "จัดส่งรสชาติไทยแท้ถึงบ้านคุณอย่างรวดเร็วและเชื่อถือได้",
      domesticShipping: "การจัดส่งภายในประเทศ (แอฟริกาใต้)",
      domesticDetails: [
        "จัดส่งฟรีสำหรับคำสั่งซื้อมากกว่า R500",
        "การจัดส่งมาตรฐาน: 3-5 วันทำการ",
        "การจัดส่งด่วน: 1-2 วันทำการ (มีค่าใช้จ่ายเพิ่มเติม)",
        "จัดส่งถึงเมืองใหญ่และเมืองต่างๆ ทั่วประเทศ"
      ],
      internationalShipping: "การจัดส่งระหว่างประเทศ",
      internationalDetails: [
        "มีบริการจัดส่งไปยังประเทศที่เลือก",
        "เวลาในการจัดส่ง: 7-14 วันทำการ",
        "อาจมีภาษีศุลกากรและภาษีอื่นๆ",
        "ติดต่อเราเพื่อขอใบเสนอราคาจัดส่งไปยังประเทศของคุณ"
      ],
      packaging: "การบรรจุภัณฑ์และการดูแล",
      packagingDetails: [
        "บรรจุผลิตภัณฑ์ทั้งหมดอย่างระมัดระวังเพื่อป้องกันความเสียหาย",
        "บรรจุภัณฑ์ควบคุมอุณหภูมิสำหรับสินค้าที่ต้องการความระมัดระวัง",
        "วัสดุบรรจุภัณฑ์ที่เป็นมิตรกับสิ่งแวดล้อมเมื่อเป็นไปได้",
        "แต่ละคำสั่งซื้อรวมคำแนะนำในการจัดการ"
      ],
      tracking: "การติดตามคำสั่งซื้อ",
      trackingDetails: [
        "ส่งข้อมูลติดตามทางอีเมลเมื่อจัดส่งแล้ว",
        "ติดตามคำสั่งซื้อของคุณผ่านพันธมิตรจัดส่งของเรา",
        "การแจ้งเตือนทาง SMS สำหรับการอัปเดตการจัดส่ง",
        "ติดต่อฝ่ายสนับสนุนสำหรับข้อกังวลเกี่ยวกับการจัดส่งใดๆ"
      ]
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <NavigationBanner />
      
      <main className="flex-grow anong-section thai-pattern-bg">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl py-8 md:py-12">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="w-16 h-16 mx-auto mb-6">
              <img 
                src="/lovable-uploads/f440215b-ebf7-4c9f-9cf6-412d4018796e.png" 
                alt="ANONG Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="anong-heading text-4xl md:text-5xl lg:text-6xl mb-6 text-anong-black">{t.title}</h1>
            <p className="anong-body text-lg md:text-xl text-anong-black/80 max-w-3xl mx-auto leading-relaxed">{t.subtitle}</p>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Domestic Shipping */}
            <section className="anong-card p-8">
              <h2 className="anong-subheading text-2xl mb-6 text-anong-black">{t.domesticShipping}</h2>
              <ul className="space-y-3">
                {t.domesticDetails.map((detail, index) => (
                  <li key={index} className="anong-body text-anong-black/80 flex items-start">
                    <span className="text-anong-gold mr-3">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </section>

            {/* International Shipping */}
            <section className="anong-card p-8">
              <h2 className="anong-subheading text-2xl mb-6 text-anong-black">{t.internationalShipping}</h2>
              <ul className="space-y-3">
                {t.internationalDetails.map((detail, index) => (
                  <li key={index} className="anong-body text-anong-black/80 flex items-start">
                    <span className="text-anong-gold mr-3">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </section>

            {/* Packaging */}
            <section className="anong-card p-8">
              <h2 className="anong-subheading text-2xl mb-6 text-anong-black">{t.packaging}</h2>
              <ul className="space-y-3">
                {t.packagingDetails.map((detail, index) => (
                  <li key={index} className="anong-body text-anong-black/80 flex items-start">
                    <span className="text-anong-gold mr-3">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </section>

            {/* Tracking */}
            <section className="anong-card p-8">
              <h2 className="anong-subheading text-2xl mb-6 text-anong-black">{t.tracking}</h2>
              <ul className="space-y-3">
                {t.trackingDetails.map((detail, index) => (
                  <li key={index} className="anong-body text-anong-black/80 flex items-start">
                    <span className="text-anong-gold mr-3">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shipping;
