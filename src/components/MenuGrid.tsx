
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface MenuCategory {
  id: string;
  label: string;
  image: string;
}

interface MenuGridProps {
  categories: MenuCategory[];
}

const MenuGrid = ({ categories }: MenuGridProps) => {
  const { language } = useLanguage();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  
  const handleViewMenu = (category: MenuCategory) => {
    setSelectedCategory(category);
  };
  
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="cursor-pointer"
          >
            <Card className="luxury-card border-0 shadow-lg overflow-hidden h-full">
              <CardContent className="p-0 relative">
                <div className="aspect-[3/4] overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.label}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                
                {/* Overlay with category name */}
                <div className="absolute inset-0 bg-gradient-to-t from-anong-deep-black/60 via-transparent to-transparent flex items-end">
                  <div className="p-2 md:p-3 w-full">
                    <h3 className="font-elegant text-white text-sm md:text-base font-medium text-center">
                      {category.label}
                    </h3>
                  </div>
                </div>
                
                {/* Hover effect overlay */}
                {hoveredCategory === category.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-anong-dark-green/20 flex items-center justify-center"
                  >
                    <button
                      onClick={() => handleViewMenu(category)}
                      className="bg-anong-cream/90 backdrop-blur-sm rounded-lg px-3 py-2 hover:bg-anong-cream transition-colors"
                    >
                      <span className="text-anong-deep-black text-xs font-medium">
                        View Menu
                      </span>
                    </button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Modal Dialog for Menu View */}
      <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="font-elegant text-2xl text-anong-deep-black">
              {selectedCategory?.label}
            </DialogTitle>
          </DialogHeader>
          <div className="w-full h-[70vh] overflow-auto p-0">
            {selectedCategory && (
              <img 
                src={selectedCategory.image} 
                alt={selectedCategory.label}
                className="w-full h-auto object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MenuGrid;
