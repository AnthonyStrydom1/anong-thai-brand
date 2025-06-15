
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import ProductList from './product/ProductList';
import NavigationBanner from './NavigationBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

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
      errorTitle: "Unable to load products. Please try again later.",
      filterBy: "Filter by category"
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
      errorTitle: "ไม่สามารถโหลดสินค้าได้ กรุณาลองใหม่อีกครั้ง",
      filterBy: "กรองตามหมวดหมู่"
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
        <section className="anong-section px-4 md:px-6 bg-gradient-to-b from-anong-ivory to-anong-cream thai-pattern-bg">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center py-16">
              <div className="anong-card max-w-md mx-auto p-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-anong-gold/20 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-anong-gold/20 rounded w-1/2 mx-auto"></div>
                </div>
                <p className="anong-body text-anong-charcoal/70 mt-4">{t.loading}</p>
              </div>
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
        <section className="anong-section px-4 md:px-6 bg-gradient-to-b from-anong-ivory to-anong-cream thai-pattern-bg">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center py-16">
              <div className="anong-card max-w-md mx-auto p-8 border-red-200 bg-red-50/50">
                <p className="text-red-600 mb-4 font-medium">{t.errorTitle}</p>
                <p className="text-anong-charcoal/60">{error}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-anong-ivory via-anong-cream to-anong-ivory">
      <NavigationBanner />
      <section className="anong-section px-4 md:px-6 thai-pattern-bg relative">
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-anong-gold/5 via-transparent to-anong-deep-green/5 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Enhanced Hero Section */}
          <motion.div 
            className="text-center mb-16 md:mb-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* ANONG Logo with enhanced styling */}
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 anong-hover-lift">
                <div className="w-full h-full bg-gradient-to-br from-anong-gold to-anong-warm-yellow rounded-full p-1 shadow-lg">
                  <div className="w-full h-full bg-anong-ivory rounded-full flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/f440215b-ebf7-4c9f-9cf6-412d4018796e.png" 
                      alt="ANONG Logo"
                      className="w-3/4 h-3/4 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <h1 className="anong-heading text-4xl md:text-5xl lg:text-6xl mb-6 text-anong-black bg-gradient-to-r from-anong-black via-anong-deep-green to-anong-black bg-clip-text">{t.title}</h1>
            <p className="anong-body text-lg md:text-xl text-anong-black/80 max-w-3xl mx-auto leading-relaxed mb-8">{t.subtitle}</p>
            
            {/* Enhanced Thai Lotus Divider */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-anong-gold to-transparent"></div>
              <div className="mx-8 thai-lotus-divider w-12 h-12 bg-gradient-to-br from-anong-gold to-anong-warm-yellow rounded-full p-2 shadow-lg">
                <div className="w-full h-full bg-anong-ivory rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 thai-lotus-divider"></div>
                </div>
              </div>
              <div className="w-32 h-px bg-gradient-to-l from-transparent via-anong-gold to-transparent"></div>
            </div>
            
            <p className="anong-body-light text-sm tracking-wide text-anong-gold font-medium">
              {t.craftedWith}
            </p>
          </motion.div>
          
          {/* Enhanced Search and Filter Controls */}
          <motion.div 
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="anong-card p-6 md:p-8 mb-8 shadow-lg">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-anong-gold h-5 w-5" />
                  <Input
                    type="text"
                    placeholder={t.search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 anong-input border-anong-gold/30 focus:border-anong-gold text-lg"
                  />
                </div>
                <div className="flex items-center gap-2 text-anong-deep-green">
                  <Filter className="h-5 w-5" />
                  <span className="font-medium hidden md:inline">{t.filterBy}</span>
                </div>
              </div>
              
              {/* Enhanced Category Filter */}
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    size="default"
                    onClick={() => handleCategoryChange(category.id)}
                    className={activeCategory === category.id ? 
                      "bg-gradient-to-r from-anong-gold to-anong-warm-yellow text-anong-black hover:from-anong-warm-yellow hover:to-anong-gold font-medium shadow-md hover:shadow-lg transition-all duration-300" : 
                      "text-anong-deep-green hover:bg-anong-gold/10 border-anong-gold/30 hover:border-anong-gold transition-all duration-300 hover:shadow-md"
                    }
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Enhanced Products List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ProductList
              products={filteredProducts}
              noProductsMessage={t.noProducts}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProductGrid;
