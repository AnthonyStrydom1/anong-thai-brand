
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '@/data/products';
import ProductCard from './ProductCard';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, ArrowRight as ArrowRightIcon, ShoppingCart } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/components/ui/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addItem } = useCart();
  
  const translations = {
    en: {
      title: "Featured Products",
      subtitle: "Discover Anong's premium Thai sauces and curry pastes",
      all: "All",
      curryPastes: "Curry Pastes",
      stirFrySauces: "Stir-Fry Sauces",
      dippingSauces: "Dipping Sauces",
      viewAll: "View All Products",
      exploreProducts: "Explore Our Best Sellers",
      addToCart: "Add to Cart",
      addedToCart: "Added to cart!"
    },
    th: {
      title: "สินค้าแนะนำ",
      subtitle: "ค้นพบซอสและพริกแกงไทยระดับพรีเมียมของอนงค์",
      all: "ทั้งหมด",
      curryPastes: "พริกแกง",
      stirFrySauces: "ซอสผัด",
      dippingSauces: "น้ำจิ้ม",
      viewAll: "ดูสินค้าทั้งหมด",
      exploreProducts: "สำรวจสินค้าขายดีของเรา",
      addToCart: "เพิ่มลงตะกร้า",
      addedToCart: "เพิ่มลงตะกร้าแล้ว!"
    }
  };

  const t = translations[language];

  const filteredProducts = activeCategory === 'all'
    ? products.slice(0, 6)
    : products.filter(p => p.category === activeCategory).slice(0, 6);
  
  const categories = [
    { id: 'all', name: { en: t.all, th: t.all } },
    { id: 'curry-pastes', name: { en: t.curryPastes, th: t.curryPastes } },
    { id: 'stir-fry-sauces', name: { en: t.stirFrySauces, th: t.stirFrySauces } },
    { id: 'dipping-sauces', name: { en: t.dippingSauces, th: t.dippingSauces } }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-[#FCFAFF] to-[#F5EBFF]">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold mb-2 text-gray-800">{t.title}</h2>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>
        
        {/* Banner with background */}
        <div className="relative mb-14 rounded-xl overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#520F7A] via-[#7A2BAA] to-[#9D4EDD] opacity-90"></div>
          <div className="relative py-12 px-8 md:py-16 md:px-12 text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">{t.exploreProducts}</h3>
            <p className="mb-6 max-w-2xl mx-auto">
              {language === 'en'
                ? "Quality ingredients, authentic flavors, made with passion. Elevate your cooking with our premium Thai products."
                : "วัตถุดิบคุณภาพ รสชาติแท้ ผลิตด้วยใจ ยกระดับการทำอาหารด้วยผลิตภัณฑ์ไทยระดับพรีเมียม"}
            </p>
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className={
                activeCategory === category.id
                  ? "bg-thai-purple hover:bg-thai-purple-dark"
                  : "border-thai-purple text-thai-purple hover:bg-thai-purple/10"
              }
            >
              {category.name[language]}
            </Button>
          ))}
        </div>
        
        {/* Products Carousel */}
        <div className="mb-10">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {filteredProducts.map((product) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="thai-card group">
                    <Link to={`/product/${product.id}`} className="block overflow-hidden">
                      <div className="h-48 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
                        <img 
                          src={product.image} 
                          alt={product.name[language]} 
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-thai-purple transition">
                          {product.name[language]}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.shortDescription[language]}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-thai-purple">
                          ${product.price.toFixed(2)}
                        </span>
                        <Button 
                          size="sm" 
                          className="bg-thai-purple hover:bg-thai-purple-dark"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItem(product, 1);
                            toast({
                              title: t.addedToCart,
                              description: `${product.name[language]} x 1`,
                            });
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          {t.addToCart}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-thai-purple text-thai-purple hover:bg-thai-purple/10" />
            <CarouselNext className="border-thai-purple text-thai-purple hover:bg-thai-purple/10" />
          </Carousel>
        </div>
        
        {/* View All Button */}
        <div className="text-center">
          <Button 
            asChild
            variant="outline" 
            className="border-thai-purple text-thai-purple hover:bg-thai-purple/10"
          >
            <Link to="/shop">
              {t.viewAll}
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
