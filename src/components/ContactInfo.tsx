
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Phone } from "lucide-react";

const ContactInfo = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      title: "Visit Us",
      address: "Address",
      phone: "Contact",
      operatingHours: "Operating Hours",
      hoursContent: "Monday - Sunday: 9:00 AM - 9:00 PM",
    },
    th: {
      title: "เยี่ยมชมเรา",
      address: "ที่อยู่",
      phone: "ติดต่อ",
      operatingHours: "เวลาทำการ",
      hoursContent: "จันทร์ - อาทิตย์: 9:00 - 21:00",
    }
  };
  
  const t = translations[language];
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#520F7A] mb-3 font-display">{t.title}</h2>
          <div className="w-24 h-1 bg-thai-gold mx-auto"></div>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-white p-8 rounded-lg shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] transition-shadow duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-[#f8f4ff] rounded-full flex items-center justify-center mx-auto mb-5">
              <MapPin className="h-8 w-8 text-[#520F7A]" />
            </div>
            <h3 className="font-display text-xl text-[#520F7A] mb-3">{t.address}</h3>
            <p className="text-gray-700">20 Hettie Street, Cyrildene</p>
            <p className="text-gray-700">Johannesburg, 2198</p>
          </div>
          
          <div className="text-center bg-white p-8 rounded-lg shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] transition-shadow duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-[#f8f4ff] rounded-full flex items-center justify-center mx-auto mb-5">
              <Phone className="h-8 w-8 text-[#520F7A]" />
            </div>
            <h3 className="font-display text-xl text-[#520F7A] mb-3">{t.phone}</h3>
            <p className="text-gray-700">Anong: 076 505 9941</p>
            <p className="text-gray-700">Howard: 074 240 6712</p>
            <p className="text-gray-700">Justin: 072 102 0284</p>
          </div>
          
          <div className="text-center bg-white p-8 rounded-lg shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] transition-shadow duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-[#f8f4ff] rounded-full flex items-center justify-center mx-auto mb-5">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-[#520F7A]" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="font-display text-xl text-[#520F7A] mb-3">{t.operatingHours}</h3>
            <p className="text-gray-700">{t.hoursContent}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
