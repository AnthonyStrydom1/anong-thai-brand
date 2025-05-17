
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

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
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#520F7A]">{t.title}</h1>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">{t.description}</p>
          </div>
          
          <Tabs defaultValue="starters" className="max-w-5xl mx-auto">
            <TabsList className="flex flex-wrap justify-center mb-6">
              {menuCategories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="data-[state=active]:bg-thai-gold data-[state=active]:text-white"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {menuCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-4">
                <Card>
                  <CardContent className="p-0">
                    <img 
                      src={category.image} 
                      alt={category.label}
                      className="w-full h-auto object-contain rounded-md"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Menu;
