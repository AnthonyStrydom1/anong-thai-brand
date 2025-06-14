
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import NavigationBanner from "@/components/NavigationBanner";
import Footer from "@/components/Footer";

const Terms = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);
  
  const translations = {
    en: {
      title: "Terms of Service",
      subtitle: "Terms and conditions for using ANONG Thai Brand services",
      lastUpdated: "Last updated: December 2024",
      sections: [
        {
          title: "Acceptance of Terms",
          content: [
            "By using our website and services, you agree to these terms",
            "These terms apply to all visitors, users, and customers",
            "We may update these terms from time to time",
            "Continued use constitutes acceptance of updated terms"
          ]
        },
        {
          title: "Product Information",
          content: [
            "We strive to provide accurate product descriptions and images",
            "Colors and packaging may vary slightly from images shown",
            "Ingredients and nutritional information are provided for guidance",
            "Please check labels for the most current information"
          ]
        },
        {
          title: "Orders and Payment",
          content: [
            "All orders are subject to availability and acceptance",
            "Prices are subject to change without notice",
            "Payment must be received before order processing",
            "We accept major credit cards and secure online payments"
          ]
        },
        {
          title: "Delivery and Risk",
          content: [
            "Delivery times are estimates and not guaranteed",
            "Risk of loss passes to customer upon delivery",
            "We are not liable for delays caused by external factors",
            "Customers must inspect orders upon delivery"
          ]
        },
        {
          title: "Limitation of Liability",
          content: [
            "Our liability is limited to the purchase price of products",
            "We are not liable for indirect or consequential damages",
            "Food products are sold for intended culinary use only",
            "Customers with allergies should review ingredients carefully"
          ]
        },
        {
          title: "Intellectual Property",
          content: [
            "All content on this website is owned by ANONG Thai Brand",
            "Recipes, images, and brand materials are protected by copyright",
            "You may not reproduce content without written permission",
            "Trademarks and logos are protected intellectual property"
          ]
        }
      ]
    },
    th: {
      title: "เงื่อนไขการใช้บริการ",
      subtitle: "ข้อกำหนดและเงื่อนไขสำหรับการใช้บริการของแบรนด์อาหารไทยอนงค์",
      lastUpdated: "อัปเดตล่าสุด: ธันวาคม 2024",
      sections: [
        {
          title: "การยอมรับข้อกำหนด",
          content: [
            "การใช้เว็บไซต์และบริการของเรา คุณตกลงที่จะปฏิบัติตามข้อกำหนดเหล่านี้",
            "ข้อกำหนดเหล่านี้ใช้กับผู้เยี่ยมชม ผู้ใช้ และลูกค้าทั้งหมด",
            "เราอาจอัปเดตข้อกำหนดเหล่านี้เป็นครั้งคราว",
            "การใช้งานต่อเนื่องถือเป็นการยอมรับข้อกำหนดที่อัปเดต"
          ]
        },
        {
          title: "ข้อมูลผลิตภัณฑ์",
          content: [
            "เราพยายามให้คำอธิบายและภาพผลิตภัณฑ์ที่ถูกต้อง",
            "สีและบรรจุภัณฑ์อาจแตกต่างจากภาพที่แสดงเล็กน้อย",
            "ส่วนผสมและข้อมูลโภชนาการให้ไว้เพื่อเป็นแนวทาง",
            "โปรดตรวจสอบฉลากสำหรับข้อมูลล่าสุด"
          ]
        },
        {
          title: "คำสั่งซื้อและการชำระเงิน",
          content: [
            "คำสั่งซื้อทั้งหมดขึ้นอยู่กับความพร้อมของสินค้าและการยอมรับ",
            "ราคาอาจเปลี่ยนแปลงโดยไม่แจ้งให้ทราบล่วงหน้า",
            "ต้องได้รับการชำระเงินก่อนการประมวลผลคำสั่งซื้อ",
            "เรายอมรับบัตรเครดิตหลักและการชำระเงินออนไลน์ที่ปลอดภัย"
          ]
        },
        {
          title: "การจัดส่งและความเสี่ยง",
          content: [
            "เวลาจัดส่งเป็นการประมาณการและไม่ได้รับประกัน",
            "ความเสี่ยงในการสูญเสียส่งผ่านไปยังลูกค้าเมื่อจัดส่ง",
            "เราไม่รับผิดชอบต่อความล่าช้าที่เกิดจากปัจจัยภายนอก",
            "ลูกค้าต้องตรวจสอบคำสั่งซื้อเมื่อได้รับ"
          ]
        },
        {
          title: "ข้อจำกัดความรับผิดชอบ",
          content: [
            "ความรับผิดชอบของเราจำกัดอยู่ที่ราคาซื้อของผลิตภัณฑ์",
            "เราไม่รับผิดชอบต่อความเสียหายทางอ้อมหรือเป็นผลสืบเนื่อง",
            "ผลิตภัณฑ์อาหารขายเพื่อใช้ในการทำอาหารตามที่ตั้งใจเท่านั้น",
            "ลูกค้าที่มีอาการแพ้ควรตรวจสอบส่วนผสมอย่างละเอียด"
          ]
        },
        {
          title: "ทรัพย์สินทางปัญญา",
          content: [
            "เนื้อหาทั้งหมดในเว็บไซต์นี้เป็นของแบรนด์อาหารไทยอนงค์",
            "สูตรอาหาร ภาพ และวัสดุแบรนด์ได้รับการคุ้มครองด้วยลิขสิทธิ์",
            "คุณไม่สามารถทำซ้ำเนื้อหาโดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร",
            "เครื่องหมายการค้าและโลโก้เป็นทรัพย์สินทางปัญญาที่ได้รับการคุ้มครอง"
          ]
        }
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
            <p className="anong-body-light text-sm text-anong-black/60 mt-4">{t.lastUpdated}</p>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {t.sections.map((section, index) => (
              <section key={index} className="anong-card p-8">
                <h2 className="anong-subheading text-2xl mb-6 text-anong-black">{section.title}</h2>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="anong-body text-anong-black/80 flex items-start">
                      <span className="text-anong-gold mr-3">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
