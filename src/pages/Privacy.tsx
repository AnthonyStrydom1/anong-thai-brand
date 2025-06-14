
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import NavigationBanner from "@/components/NavigationBanner";
import Footer from "@/components/Footer";

const Privacy = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);
  
  const translations = {
    en: {
      title: "Privacy Policy",
      subtitle: "Your privacy is important to us - here's how we protect your information",
      lastUpdated: "Last updated: December 2024",
      sections: [
        {
          title: "Information We Collect",
          content: [
            "Personal information: Name, email address, phone number, delivery address",
            "Payment information: Processed securely through encrypted payment gateways",
            "Order history: Products purchased, delivery preferences, special requests",
            "Website usage: Pages visited, time spent, browser information for analytics"
          ]
        },
        {
          title: "How We Use Your Information",
          content: [
            "Process and fulfill your orders",
            "Communicate about your purchases and delivery status",
            "Improve our products and services",
            "Send promotional offers (with your consent)",
            "Comply with legal requirements"
          ]
        },
        {
          title: "Information Sharing",
          content: [
            "We do not sell your personal information to third parties",
            "Delivery partners: Only shipping information needed for delivery",
            "Payment processors: Secure handling of payment transactions",
            "Legal compliance: When required by law or legal process"
          ]
        },
        {
          title: "Data Security",
          content: [
            "SSL encryption for all data transmission",
            "Secure servers with regular security updates",
            "Limited access to personal information by authorized staff only",
            "Regular security audits and monitoring"
          ]
        },
        {
          title: "Your Rights",
          content: [
            "Access your personal information",
            "Request correction of inaccurate data",
            "Request deletion of your data",
            "Opt-out of marketing communications",
            "Data portability upon request"
          ]
        },
        {
          title: "Contact Us",
          content: [
            "For privacy-related questions: privacy@anongthaibrand.com",
            "Phone: 076 505 9941",
            "Address: 20 Hettie Street, Cyrildene, Johannesburg"
          ]
        }
      ]
    },
    th: {
      title: "นโยบายความเป็นส่วนตัว",
      subtitle: "ความเป็นส่วนตัวของคุณสำคัญกับเรา - นี่คือวิธีที่เราปกป้องข้อมูลของคุณ",
      lastUpdated: "อัปเดตล่าสุด: ธันวาคม 2024",
      sections: [
        {
          title: "ข้อมูลที่เราเก็บรวบรวม",
          content: [
            "ข้อมูลส่วนบุคคล: ชื่อ ที่อยู่อีเมล หมายเลขโทรศัพท์ ที่อยู่จัดส่ง",
            "ข้อมูลการชำระเงิน: ดำเนินการอย่างปลอดภัยผ่านเกตเวย์การชำระเงินที่เข้ารหัส",
            "ประวัติการสั่งซื้อ: ผลิตภัณฑ์ที่ซื้อ ความต้องการการจัดส่ง คำขอพิเศษ",
            "การใช้งานเว็บไซต์: หน้าที่เยี่ยมชม เวลาที่ใช้ ข้อมูลเบราว์เซอร์สำหรับการวิเคราะห์"
          ]
        },
        {
          title: "วิธีที่เราใช้ข้อมูลของคุณ",
          content: [
            "ดำเนินการและตอบสนองคำสั่งซื้อของคุณ",
            "สื่อสารเกี่ยวกับการซื้อและสถานะการจัดส่งของคุณ",
            "ปรับปรุงผลิตภัณฑ์และบริการของเรา",
            "ส่งข้อเสนอโปรโมชั่น (ด้วยความยินยอมของคุณ)",
            "ปฏิบัติตามข้อกำหนดทางกฎหมาย"
          ]
        },
        {
          title: "การแบ่งปันข้อมูล",
          content: [
            "เราไม่ขายข้อมูลส่วนบุคคลของคุณให้กับบุคคลที่สาม",
            "พันธมิตรจัดส่ง: เฉพาะข้อมูลการจัดส่งที่จำเป็นสำหรับการจัดส่ง",
            "ผู้ประมวลผลการชำระเงิน: การจัดการที่ปลอดภัยของธุรกรรมการชำระเงิน",
            "การปฏิบัติตามกฎหมาย: เมื่อกฎหมายหรือกระบวนการทางกฎหมายกำหนด"
          ]
        },
        {
          title: "ความปลอดภัยของข้อมูล",
          content: [
            "การเข้ารหัส SSL สำหรับการส่งข้อมูลทั้งหมด",
            "เซิร์ฟเวอร์ที่ปลอดภัยพร้อมการอัปเดตความปลอดภัยเป็นประจำ",
            "การเข้าถึงข้อมูลส่วนบุคคลที่จำกัดโดยเจ้าหน้าที่ที่ได้รับอนุญาตเท่านั้น",
            "การตรวจสอบความปลอดภัยและการตรวจสอบเป็นประจำ"
          ]
        },
        {
          title: "สิทธิของคุณ",
          content: [
            "เข้าถึงข้อมูลส่วนบุคคลของคุณ",
            "ขอแก้ไขข้อมูลที่ไม่ถูกต้อง",
            "ขอลบข้อมูลของคุณ",
            "ยกเลิกการสื่อสารทางการตลาด",
            "การพกพาข้อมูลตามคำขอ"
          ]
        },
        {
          title: "ติดต่อเรา",
          content: [
            "สำหรับคำถามเกี่ยวกับความเป็นส่วนตัว: privacy@anongthaibrand.com",
            "โทรศัพท์: 076 505 9941",
            "ที่อยู่: 20 เฮตตี้ สตรีท ไซริลดีน โจฮันเนสเบิร์ก"
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

export default Privacy;
