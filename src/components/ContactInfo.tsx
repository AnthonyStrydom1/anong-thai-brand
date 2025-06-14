
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
    <section className="py-20 bg-anong-ivory/50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-anong-black mb-3 font-heading">{t.title}</h2>
          <div className="w-24 h-1 bg-anong-gold mx-auto mb-4"></div>
        </motion.div>
        
        <motion.div 
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10"
          initial="hidden"
          whileInView="visible" 
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div 
            className="anong-card text-center p-10 hover:shadow-xl transition-all duration-500"
            variants={itemVariants}
          >
            <motion.div 
              className="w-20 h-20 bg-anong-gold/10 rounded-full flex items-center justify-center mx-auto mb-6"
              variants={iconVariants}
            >
              <MapPin className="h-9 w-9 text-anong-deep-green" />
            </motion.div>
            <h3 className="font-heading text-2xl text-anong-black mb-4">{t.address}</h3>
            <p className="text-anong-black/80 text-lg">20 Hettie Street, Cyrildene</p>
            <p className="text-anong-black/80 text-lg">Johannesburg, 2198</p>
          </motion.div>
          
          <motion.div 
            className="anong-card text-center p-10 hover:shadow-xl transition-all duration-500"
            variants={itemVariants}
          >
            <motion.div 
              className="w-20 h-20 bg-anong-gold/10 rounded-full flex items-center justify-center mx-auto mb-6"
              variants={iconVariants}
            >
              <Phone className="h-9 w-9 text-anong-deep-green" />
            </motion.div>
            <h3 className="font-heading text-2xl text-anong-black mb-4">{t.phone}</h3>
            <p className="text-anong-black/80 text-lg">Anong: 076 505 9941</p>
            <p className="text-anong-black/80 text-lg">Howard: 074 240 6712</p>
            <p className="text-anong-black/80 text-lg">Justin: 072 102 0284</p>
          </motion.div>
          
          <motion.div 
            className="anong-card text-center p-10 hover:shadow-xl transition-all duration-500"
            variants={itemVariants}
          >
            <motion.div 
              className="w-20 h-20 bg-anong-gold/10 rounded-full flex items-center justify-center mx-auto mb-6"
              variants={iconVariants}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-9 w-9 text-anong-deep-green" 
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
            <h3 className="font-heading text-2xl text-anong-black mb-4">{t.operatingHours}</h3>
            <p className="text-anong-black/80 text-lg">{t.hoursContent}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactInfo;
