
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/components/ui/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface FeaturedProductCarouselProps {
  products: Product[];
  language: 'en' | 'th';
  translations: {
    addToCart: string;
    addedToCart: string;
  };
}

const FeaturedProductCarousel: React.FC<FeaturedProductCarouselProps> = ({ 
  products, 
  language, 
  translations 
}) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast({
      title: translations.addedToCart,
      description: `${product.name[language]} x 1`,
    });
  };

  return (
    <div className="mb-10">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="thai-card group">
                <Link to={`/product/${product.id}`} className="block overflow-hidden">
                  <div className="h-64 overflow-hidden flex items-center justify-center">
                    <img 
                      src={product.image}
                      alt={product.name[language]}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      {translations.addToCart}
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
  );
};

export default FeaturedProductCarousel;
