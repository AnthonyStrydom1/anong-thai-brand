
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
      hoursContent: "Monday - Sunday: 11:00 AM - 10:00 PM",
    },
    th: {
      title: "เยี่ยมชมเรา",
      address: "ที่อยู่",
      phone: "ติดต่อ",
      operatingHours: "เวลาทำการ",
      hoursContent: "จันทร์ - อาทิตย์: 11:00 - 22:00",
    }
  };
  
  const t = translations[language];
  
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#520F7A] mb-2">{t.title}</h2>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <MapPin className="mx-auto h-8 w-8 text-thai-gold mb-2" />
            <h3 className="font-semibold text-[#520F7A] mb-2">{t.address}</h3>
            <p className="text-gray-700">0 Hettie Street, Cyrildene</p>
            <p className="text-gray-700">Johannesburg, 2198</p>
          </div>
          
          <div className="text-center bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Phone className="mx-auto h-8 w-8 text-thai-gold mb-2" />
            <h3 className="font-semibold text-[#520F7A] mb-2">{t.phone}</h3>
            <p className="text-gray-700">Anong: 076 505 9941</p>
            <p className="text-gray-700">Howard: 074 240 6712</p>
            <p className="text-gray-700">Justin: 072 102 0284</p>
          </div>
          
          <div className="text-center bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="mx-auto h-8 w-8 text-thai-gold mb-2" 
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
            <h3 className="font-semibold text-[#520F7A] mb-2">{t.operatingHours}</h3>
            <p className="text-gray-700">{t.hoursContent}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
