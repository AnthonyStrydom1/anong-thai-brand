
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const Menu = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      title: "Our Menu",
      description: "Explore our authentic Thai dishes - from starters to desserts.",
      starters: "Starters",
      soups: "Soups",
      curry: "Curry",
      noodles: "Noodles",
      stirFry: "Stir Fry",
      rice: "Rice",
      salads: "Salads",
      seafood: "Seafood",
      desserts: "Desserts",
      drinks: "Drinks",
    },
    th: {
      title: "เมนูของเรา",
      description: "สำรวจอาหารไทยแท้ๆของเรา - ตั้งแต่อาหารเรียกน้ำย่อยไปจนถึงของหวาน",
      starters: "อาหารเรียกน้ำย่อย",
      soups: "ซุป",
      curry: "แกง",
      noodles: "ก๋วยเตี๋ยว",
      stirFry: "ผัด",
      rice: "ข้าว",
      salads: "ยำ",
      seafood: "อาหารทะเล",
      desserts: "ของหวาน",
      drinks: "เครื่องดื่ม",
    }
  };
  
  const t = translations[language];
  
  const menuCategories = [
    { 
      id: "starters", 
      label: t.starters,
      image: "/lovable-uploads/40d719d7-a6ed-41e0-9ac7-183c423f5093.png"
    },
    { 
      id: "soups", 
      label: t.soups,
      image: "/lovable-uploads/48742d52-2564-4756-9f23-9292b5dee610.png"
    },
    { 
      id: "curry", 
      label: t.curry,
      image: "/lovable-uploads/f7e19060-fd48-4b9b-b3a7-6546bd43e53c.png"
    },
    { 
      id: "noodles", 
      label: t.noodles,
      image: "/lovable-uploads/b50024bf-4e1d-4749-9191-d1978f7cbcbb.png"
    },
    { 
      id: "stir-fry", 
      label: t.stirFry,
      image: "/lovable-uploads/9f8e9bc1-8ae8-4a6f-971e-9352080d04e4.png"
    },
    { 
      id: "rice", 
      label: t.rice,
      image: "/lovable-uploads/5388d819-16bf-41d7-9438-28d32d2db832.png"
    },
    { 
      id: "salads", 
      label: t.salads,
      image: "/lovable-uploads/820da2f1-e4fa-4ea2-9e15-41b22d21841c.png"
    },
    { 
      id: "seafood", 
      label: t.seafood,
      image: "/lovable-uploads/7ceb150f-76c0-4a2d-8447-a090b3b79a40.png"
    },
    { 
      id: "desserts", 
      label: t.desserts,
      image: "/lovable-uploads/5aa2bc0c-999e-493c-9e75-9b2e4181c469.png"
    },
    { 
      id: "drinks", 
      label: t.drinks,
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
    <div className="min-h-screen flex flex-col bg-white subtle-pattern">
      <Header />
      
      <motion.main 
        className="flex-grow py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h1 className="text-5xl font-bold text-[#520F7A] mb-5 elegant-heading font-display">{t.title}</h1>
            <div className="w-24 h-0.5 bg-thai-gold mx-auto mb-5"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">{t.description}</p>
          </motion.div>
          
          <Tabs defaultValue="starters" className="max-w-5xl mx-auto">
            <motion.div variants={itemVariants}>
              <TabsList className="flex flex-wrap justify-center mb-12 bg-[#f8f4ff] p-2.5 rounded-xl shadow-inner">
                {menuCategories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="px-5 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#520F7A] data-[state=active]:to-[#6a1f97] data-[state=active]:text-white rounded-lg transition-all data-[state=active]:shadow-md"
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </motion.div>
            
            {menuCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-0 shadow-2xl overflow-hidden rounded-xl">
                    <CardContent className="p-0">
                      <img 
                        src={category.image} 
                        alt={category.label}
                        className="w-full h-auto object-contain rounded-md"
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default Menu;
