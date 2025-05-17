
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

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
  
  // Animation variants for staggered card animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }
    }
  };
  
  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5, type: "spring", bounce: 0.4 }
    }
  };
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-[#520F7A] mb-3 font-display">{t.title}</h2>
          <div className="w-24 h-1 bg-thai-gold mx-auto mb-4"></div>
        </motion.div>
        
        <motion.div 
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10"
          initial="hidden"
          whileInView="visible" 
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div 
            className="text-center bg-white p-10 rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] transition-shadow duration-500 border border-gray-100/60 backdrop-blur-sm"
            variants={itemVariants}
          >
            <motion.div 
              className="w-20 h-20 bg-[#f8f4ff] rounded-full flex items-center justify-center mx-auto mb-6"
              variants={iconVariants}
            >
              <MapPin className="h-9 w-9 text-[#520F7A]" />
            </motion.div>
            <h3 className="font-display text-2xl text-[#520F7A] mb-4">{t.address}</h3>
            <p className="text-gray-700 text-lg">20 Hettie Street, Cyrildene</p>
            <p className="text-gray-700 text-lg">Johannesburg, 2198</p>
          </motion.div>
          
          <motion.div 
            className="text-center bg-white p-10 rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] transition-shadow duration-500 border border-gray-100/60 backdrop-blur-sm"
            variants={itemVariants}
          >
            <motion.div 
              className="w-20 h-20 bg-[#f8f4ff] rounded-full flex items-center justify-center mx-auto mb-6"
              variants={iconVariants}
            >
              <Phone className="h-9 w-9 text-[#520F7A]" />
            </motion.div>
            <h3 className="font-display text-2xl text-[#520F7A] mb-4">{t.phone}</h3>
            <p className="text-gray-700 text-lg">Anong: 076 505 9941</p>
            <p className="text-gray-700 text-lg">Howard: 074 240 6712</p>
            <p className="text-gray-700 text-lg">Justin: 072 102 0284</p>
          </motion.div>
          
          <motion.div 
            className="text-center bg-white p-10 rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] transition-shadow duration-500 border border-gray-100/60 backdrop-blur-sm"
            variants={itemVariants}
          >
            <motion.div 
              className="w-20 h-20 bg-[#f8f4ff] rounded-full flex items-center justify-center mx-auto mb-6"
              variants={iconVariants}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-9 w-9 text-[#520F7A]" 
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
            </motion.div>
            <h3 className="font-display text-2xl text-[#520F7A] mb-4">{t.operatingHours}</h3>
            <p className="text-gray-700 text-lg">{t.hoursContent}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactInfo;
