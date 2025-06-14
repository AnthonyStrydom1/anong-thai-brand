
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import NavigationBanner from "@/components/NavigationBanner";
import Footer from "@/components/Footer";

const Returns = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);
  
  const translations = {
    en: {
      title: "Returns & Exchanges",
      subtitle: "Your satisfaction is our priority - easy returns and exchanges",
      returnPolicy: "Return Policy",
      returnDetails: [
        "30-day return window from delivery date",
        "Items must be unopened and in original packaging",
        "Return shipping costs covered by ANONG for defective items",
        "Refunds processed within 5-7 business days"
      ],
      exchangePolicy: "Exchange Policy",
      exchangeDetails: [
        "Exchange within 30 days of purchase",
        "Items must be in resaleable condition",
        "Free exchanges for defective or incorrect items",
        "Size/variety exchanges subject to availability"
      ],
      howToReturn: "How to Return Items",
      returnSteps: [
        "Contact our customer service team",
        "Receive return authorization and instructions",
        "Package items securely in original packaging",
        "Ship using provided return label"
      ],
      nonReturnable: "Non-Returnable Items",
      nonReturnableList: [
        "Opened food products (for safety reasons)",
        "Items damaged by misuse",
        "Products past 30-day return window",
        "Custom or personalized orders"
      ]
    },
    th: {
      title: "การคืนสินค้าและการแลกเปลี่ยน",
      subtitle: "ความพึงพอใจของคุณคือสิ่งสำคัญของเรา - คืนสินค้าและแลกเปลี่ยนง่ายๆ",
      returnPolicy: "นโยบายการคืนสินค้า",
      returnDetails: [
        "ช่วงเวลาการคืนสินค้า 30 วันนับจากวันที่ได้รับสินค้า",
        "สินค้าต้องยังไม่เปิดและอยู่ในบรรจุภัณฑ์เดิม",
        "ค่าจัดส่งคืนสินค้าครอบคลุมโดย ANONG สำหรับสินค้าที่มีตำหนิ",
        "การคืนเงินดำเนินการภายใน 5-7 วันทำการ"
      ],
      exchangePolicy: "นโยบายการแลกเปลี่ยน",
      exchangeDetails: [
        "แลกเปลี่ยนภายใน 30 วันหลังการซื้อ",
        "สินค้าต้องอยู่ในสภาพที่สามารถขายต่อได้",
        "แลกเปลี่ยนฟรีสำหรับสินค้าที่มีตำหนิหรือสินค้าผิด",
        "การแลกเปลี่ยนขนาด/ประเภทขึ้นอยู่กับความพร้อมของสินค้า"
      ],
      howToReturn: "วิธีการคืนสินค้า",
      returnSteps: [
        "ติดต่อทีมบริการลูกค้าของเรา",
        "รับการอนุมัติการคืนสินค้าและคำแนะนำ",
        "บรรจุสินค้าอย่างปลอดภัยในบรรจุภัณฑ์เดิม",
        "จัดส่งโดยใช้ป้ายคืนสินค้าที่ให้มา"
      ],
      nonReturnable: "สินค้าที่ไม่สามารถคืนได้",
      nonReturnableList: [
        "ผลิตภัณฑ์อาหารที่เปิดแล้ว (เพื่อความปลอดภัย)",
        "สินค้าที่เสียหายจากการใช้งานผิดวิธี",
        "ผลิตภัณฑ์ที่เกินช่วงเวลาคืนสินค้า 30 วัน",
        "คำสั่งซื้อที่กำหนดเองหรือเป็นส่วนตัว"
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
            {/* Return Policy */}
            <section className="anong-card p-8">
              <h2 className="anong-subheading text-2xl mb-6 text-anong-black">{t.returnPolicy}</h2>
              <ul className="space-y-3">
                {t.returnDetails.map((detail, index) => (
                  <li key={index} className="anong-body text-anong-black/80 flex items-start">
                    <span className="text-anong-gold mr-3">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </section>

            {/* Exchange Policy */}
            <section className="anong-card p-8">
              <h2 className="anong-subheading text-2xl mb-6 text-anong-black">{t.exchangePolicy}</h2>
              <ul className="space-y-3">
                {t.exchangeDetails.map((detail, index) => (
                  <li key={index} className="anong-body text-anong-black/80 flex items-start">
                    <span className="text-anong-gold mr-3">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </section>

            {/* How to Return */}
            <section className="anong-card p-8">
              <h2 className="anong-subheading text-2xl mb-6 text-anong-black">{t.howToReturn}</h2>
              <ul className="space-y-3">
                {t.returnSteps.map((step, index) => (
                  <li key={index} className="anong-body text-anong-black/80 flex items-start">
                    <span className="text-anong-gold mr-3 font-semibold">{index + 1}.</span>
                    {step}
                  </li>
                ))}
              </ul>
            </section>

            {/* Non-Returnable Items */}
            <section className="anong-card p-8">
              <h2 className="anong-subheading text-2xl mb-6 text-anong-black">{t.nonReturnable}</h2>
              <ul className="space-y-3">
                {t.nonReturnableList.map((item, index) => (
                  <li key={index} className="anong-body text-anong-black/80 flex items-start">
                    <span className="text-anong-gold mr-3">•</span>
                    {item}
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

export default Returns;
