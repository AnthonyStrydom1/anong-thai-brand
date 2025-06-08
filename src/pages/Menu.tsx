import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import MenuGrid from "@/components/MenuGrid";
import { motion } from "framer-motion";

const Menu = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      title: "Our Menu",
      description: "Explore our authentic Thai dishes - from starters to desserts.",
    },
    th: {
      title: "เมนูของเรา",
      description: "สำรวจอาหารไทยแท้ๆของเรา - ตั้งแต่อาหารเรียกน้ำย่อยไปจนถึงของหวาน",
    }
  };
  
  const t = translations[language];
  
  const menuCategories = [
    { 
      id: "starters", 
      label: language === 'en' ? "Starters" : "อาหารเรียกน้ำย่อย",
      image: "/lovable-uploads/40d719d7-a6ed-41e0-9ac7-183c423f5093.png"
    },
    { 
      id: "soups", 
      label: language === 'en' ? "Soups" : "ซุป",
      image: "/lovable-uploads/48742d52-2564-4756-9f23-9292b5dee610.png"
    },
    { 
      id: "curry", 
      label: language === 'en' ? "Curry" : "แกง",
      image: "/lovable-uploads/f7e19060-fd48-4b9b-b3a7-6546bd43e53c.png"
    },
    { 
      id: "noodles", 
      label: language === 'en' ? "Noodles" : "ก๋วยเตี๋ยว",
      image: "/lovable-uploads/b50024bf-4e1d-4749-9191-d1978f7cbcbb.png"
    },
    { 
      id: "stir-fry", 
      label: language === 'en' ? "Stir Fry" : "ผัด",
      image: "/lovable-uploads/9f8e9bc1-8ae8-4a6f-971e-9352080d04e4.png"
    },
    { 
      id: "stir-fry-2", 
      label: language === 'en' ? "More Stir Fry" : "อาหารประเภทผัดเพิ่มเติม",
      image: "/lovable-uploads/46721e2d-c858-4c55-a7d2-e000c70cae35.png"
    },
    { 
      id: "rice", 
      label: language === 'en' ? "Rice" : "ข้าว",
      image: "/lovable-uploads/5388d819-16bf-41d7-9438-28d32d2db832.png"
    },
    { 
      id: "salads", 
      label: language === 'en' ? "Salads" : "ยำ",
      image: "/lovable-uploads/820da2f1-e4fa-4ea2-9e15-41b22d21841c.png"
    },
    { 
      id: "salads-2", 
      label: language === 'en' ? "More Salads" : "อาหารประเภทยำเพิ่มเติม",
      image: "/lovable-uploads/f73fda28-fa0a-48b1-8eae-7136ab56a6af.png"
    },
    { 
      id: "seafood", 
      label: language === 'en' ? "Seafood" : "อาหารทะเล",
      image: "/lovable-uploads/7ceb150f-76c0-4a2d-8447-a090b3b79a40.png"
    },
    { 
      id: "desserts", 
      label: language === 'en' ? "Desserts" : "ของหวาน",
      image: "/lovable-uploads/5aa2bc0c-999e-493c-9e75-9b2e4181c469.png"
    },
    { 
      id: "drinks", 
      label: language === 'en' ? "Drinks" : "เครื่องดื่ม",
      image: "/lovable-uploads/4d139cc6-cc49-4aa4-8b8b-f0b4122d282d.png"
    },
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren" 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-anong-cream">
      <motion.main 
        className="flex-grow section-premium"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <span className="font-elegant text-anong-gold text-sm tracking-[0.25em] uppercase mb-4 block">
              Authentic Thai Cuisine
            </span>
            <h1 className="heading-premium text-4xl md:text-5xl lg:text-6xl text-anong-deep-black mb-6">{t.title}</h1>
            <div className="w-24 h-px bg-anong-gold mx-auto mb-6"></div>
            <p className="text-luxury text-anong-charcoal max-w-2xl mx-auto text-lg leading-relaxed">{t.description}</p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <MenuGrid categories={menuCategories} />
          </motion.div>
        </div>
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default Menu;
