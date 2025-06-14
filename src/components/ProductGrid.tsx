
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import ProductList from './product/ProductList';
import NavigationBanner from './NavigationBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ProductGridProps {
  initialCategory?: string | null;
}

const ProductGrid = ({ initialCategory }: ProductGridProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  const { products, isLoading, error } = useSupabaseProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'all');
  
  const translations = {
    en: {
      title: "Our Premium Collection",
      subtitle: "Discover authentic Thai flavors crafted with traditional recipes and premium ingredients",
      search: "Search our collection...",
      all: "All Products",
      curryPastes: "Curry Pastes",
      stirFrySauces: "Stir-Fry Sauces",
      dippingSauces: "Dipping Sauces",
      noProducts: "No products found matching your criteria.",
      craftedWith: "Crafted with tradition, delivered with love",
      loading: "Loading products...",
      errorTitle: "Unable to load products. Please try again later."
    },
    th: {
      title: "คอลเลคชั่นพรีเมียมของเรา",
      subtitle: "ค้นพบรสชาติไทยแท้ที่สร้างด้วยสูตรดั้งเดิมและวัตถุดิบคุณภาพพรีเมียม",
      search: "ค้นหาในคอลเลคชั่นของเรา...",
      all: "สินค้าทั้งหมด",
      curryPastes: "พริกแกง",
      stirFrySauces: "ซอสผัด",
      dippingSauces: "น้ำจิ้ม",
      noProducts: "ไม่พบสินค้าที่ตรงกับเงื่อนไขของคุณ",
      craftedWith: "สร้างด้วยประเพณี ส่งมอบด้วยความรัก",
      loading: "กำลังโหลดสินค้า...",
      errorTitle: "ไม่สามารถโหลดสินค้าได้ กรุณาลองใหม่อีกครั้ง"
    }
  };

  const t = translations[language];

  // Update category when URL parameter changes
  useEffect(() => {
    if (initialCategory && initialCategory !== activeCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory, activeCategory]);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // For now, show all products since we need to map category_id to category names
    // This will be improved once we have proper category mapping
    const matchesCategory = activeCategory === 'all' || 
      (activeCategory === 'curry-pastes' && (
        product.name.toLowerCase().includes('curry') || 
        product.name.toLowerCase().includes('paste')
      )) ||
      (activeCategory === 'stir-fry-sauces' && (
        product.name.toLowerCase().includes('pad thai') ||
        product.name.toLowerCase().includes('stir')
      )) ||
      (activeCategory === 'dipping-sauces' && (
        product.name.toLowerCase().includes('sukiyaki') ||
        product.name.toLowerCase().includes('dipping')
      ));
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: t.all },
    { id: 'curry-pastes', label: t.curryPastes },
    { id: 'stir-fry-sauces', label: t.stirFrySauces },
    { id: 'dipping-sauces', label: t.dippingSauces }
  ];

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    // Update URL parameter
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams, { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-anong-ivory">
        <NavigationBanner />
        <section className="anong-section px-4 md:px-6 bg-anong-ivory thai-pattern-bg">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center py-16">
              <p className="text-lg">{t.loading}</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-anong-ivory">
        <NavigationBanner />
        <section className="anong-section px-4 md:px-6 bg-anong-ivory thai-pattern-bg">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">{t.errorTitle}</p>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <NavigationBanner />
      <section className="anong-section px-4 md:px-6 bg-anong-ivory thai-pattern-bg">
        <div className="container mx-auto max-w-7xl">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16 md:mb-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* ANONG Logo */}
            <div className="mb-8">
              <div className="w-16 h-16 mx-auto mb-4">
                <img 
                  src="/lovable-uploads/f440215b-ebf7-4c9f-9cf6-412d4018796e.png" 
                  alt="ANONG Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            <h1 className="anong-heading text-4xl md:text-5xl lg:text-6xl mb-6 text-anong-black">{t.title}</h1>
            <p className="anong-body text-lg md:text-xl text-anong-black/80 max-w-3xl mx-auto leading-relaxed mb-8">{t.subtitle}</p>
            
            {/* Thai Lotus Divider */}
            <div className="flex items-center justify-center">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-anong-gold to-transparent"></div>
              <div className="mx-8 thai-lotus-divider w-8 h-8"></div>
              <div className="w-24 h-px bg-gradient-to-l from-transparent via-anong-gold to-transparent"></div>
            </div>
            
            <p className="anong-body-light text-sm tracking-wide text-anong-gold mt-6 font-medium">
              {t.craftedWith}
            </p>
          </motion.div>
          
          {/* Search and Filter Controls */}
          <div className="mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-anong-black/60 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 anong-input"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "gold" : "ghost"}
                  size="default"
                  onClick={() => handleCategoryChange(category.id)}
                  className={activeCategory === category.id ? 
                    "bg-anong-gold text-anong-black hover:bg-anong-warm-yellow font-medium" : 
                    "text-anong-black hover:bg-anong-gold/10 border border-anong-gold/20"
                  }
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Products List */}
          <ProductList
            products={filteredProducts}
            noProductsMessage={t.noProducts}
          />
        </div>
      </section>
    </div>
  );
};

export default ProductGrid;
