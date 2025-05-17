
import { useState } from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

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

const MenuCarousel = () => {
  const { language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  
  return (
    <div className="relative">
      <Carousel
        opts={{ 
          loop: true,
          align: "center",
        }}
        className="mx-auto max-w-3xl"
        onSelect={(api) => {
          if (api) {
            setCurrentPage(api.selectedScrollSnap());
          }
        }}
      >
        <CarouselContent>
          {menuPages.map((page) => (
            <CarouselItem key={page.id}>
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <img 
                    src={page.image} 
                    alt={page.name[language]} 
                    className="w-full h-auto object-contain"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute -left-2 md:-left-8 border border-thai-gold text-thai-gold hover:text-white hover:bg-thai-gold focus:bg-thai-gold" />
        <CarouselNext className="absolute -right-2 md:-right-8 border border-thai-gold text-thai-gold hover:text-white hover:bg-thai-gold focus:bg-thai-gold" />
      </Carousel>
      
      <div className="flex justify-center mt-4">
        <div className="text-sm text-gray-500">
          {currentPage + 1} / {menuPages.length}
        </div>
      </div>
    </div>
  );
};

export default MenuCarousel;
