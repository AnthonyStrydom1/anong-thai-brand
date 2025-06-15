
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ZoomIn } from "lucide-react";

const menuPages = [
  { 
    id: "starters",
    image: "/lovable-uploads/40d719d7-a6ed-41e0-9ac7-183c423f5093.png",
    name: { en: "Starters", th: "อาหารเรียกน้ำย่อย" }
  },
  { 
    id: "soups", 
    image: "/lovable-uploads/48742d52-2564-4756-9f23-9292b5dee610.png",
    name: { en: "Soup Dishes", th: "อาหารประเภทซุป" }
  },
  { 
    id: "curry", 
    image: "/lovable-uploads/f7e19060-fd48-4b9b-b3a7-6546bd43e53c.png",
    name: { en: "Curry Dishes", th: "อาหารประเภทแกง" }
  },
  { 
    id: "noodles", 
    image: "/lovable-uploads/b50024bf-4e1d-4749-9191-d1978f7cbcbb.png",
    name: { en: "Noodles", th: "อาหารประเภทเส้น" }
  },
  { 
    id: "stir-fry-1", 
    image: "/lovable-uploads/9f8e9bc1-8ae8-4a6f-971e-9352080d04e4.png",
    name: { en: "Stir Fry Dishes", th: "อาหารประเภทผัด" }
  },
  { 
    id: "stir-fry-2", 
    image: "/lovable-uploads/46721e2d-c858-4c55-a7d2-e000c70cae35.png",
    name: { en: "More Stir Fry", th: "อาหารประเภทผัดเพิ่มเติม" }
  },
  { 
    id: "rice", 
    image: "/lovable-uploads/5388d819-16bf-41d7-9438-28d32d2db832.png",
    name: { en: "Rice Dishes", th: "อาหารประเภทข้าว" }
  },
  { 
    id: "salads-1", 
    image: "/lovable-uploads/820da2f1-e4fa-4ea2-9e15-41b22d21841c.png",
    name: { en: "Salads", th: "อาหารประเภทยำ" }
  },
  { 
    id: "salads-2", 
    image: "/lovable-uploads/f73fda28-fa0a-48b1-8eae-7136ab56a6af.png",
    name: { en: "More Salads", th: "อาหารประเภทยำเพิ่มเติม" }
  },
  { 
    id: "seafood", 
    image: "/lovable-uploads/7ceb150f-76c0-4a2d-8447-a090b3b79a40.png",
    name: { en: "Seafood", th: "อาหารทะเล" }
  },
  { 
    id: "desserts", 
    image: "/lovable-uploads/5aa2bc0c-999e-493c-9e75-9b2e4181c469.png",
    name: { en: "Desserts", th: "ของหวาน" }
  },
  { 
    id: "drinks", 
    image: "/lovable-uploads/4d139cc6-cc49-4aa4-8b8b-f0b4122d282d.png",
    name: { en: "Drinks", th: "เครื่องดื่ม" }
  }
];

const MenuPagesGrid = () => {
  const { language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {menuPages.map((page) => (
        <Dialog key={page.id}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300 group">
              <CardContent className="p-4">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src={page.image} 
                    alt={page.name[language]} 
                    className="w-full h-64 object-contain bg-white transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
                  </div>
                </div>
                <h3 className="text-center mt-3 font-semibold text-anong-black">
                  {page.name[language]}
                </h3>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full p-0">
            <div className="relative">
              <img 
                src={page.image} 
                alt={page.name[language]} 
                className="w-full h-auto object-contain max-h-[80vh]"
              />
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};

export default MenuPagesGrid;
