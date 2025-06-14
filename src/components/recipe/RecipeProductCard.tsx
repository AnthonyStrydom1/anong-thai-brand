
import { memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const RecipeProductCard = memo(({ product, language, t }: { 
  product: any; 
  language: 'en' | 'th'; 
  t: any;
}) => {
  // Enhanced image mapping for recipe products
  const getProductImage = () => {
    const imageMap: { [key: string]: string } = {
      'pad-thai-sauce': '/lovable-uploads/5a0dec88-a26c-4e29-bda6-8d921887615e.png',
      'sukiyaki-sauce': '/lovable-uploads/322ef915-5db5-4834-9e45-92a34dc3adb6.png',
      'tom-yum-paste': '/lovable-uploads/fc66a288-b44b-4bf4-a82f-a2c844b58979.png',
      'red-curry-paste': '/lovable-uploads/dbb561f8-a97a-447c-8946-5a1d279bed05.png',
      'panang-curry-paste': '/lovable-uploads/5308a5d2-4f12-42ed-b3f8-f2aa5d7fbac9.png',
      'massaman-curry-paste': '/lovable-uploads/c936ed96-2c61-4919-9e6d-14f740c80b80.png',
      'green-curry-paste': '/lovable-uploads/1ae4d3c5-e136-4ed4-9a71-f1e9d6123a83.png',
      'yellow-curry-paste': '/lovable-uploads/acf32ec1-9435-4a5c-8baf-1943b85b93bf.png'
    };

    return imageMap[product.id] || product.image || '/placeholder.svg';
  };
  
  return (
    <div className="bg-white rounded-lg border border-anong-gold/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="flex">
        <div className="w-32 h-32 bg-gradient-to-b from-anong-cream to-anong-ivory flex items-center justify-center p-6">
          <img
            src={getProductImage()}
            alt={product.name[language]}
            className="max-w-[80px] max-h-[80px] w-auto h-auto object-contain"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="anong-subheading text-lg font-medium text-anong-black group-hover:text-anong-gold transition-colors mb-2">
              {product.name[language]}
            </h3>
            <p className="anong-body-light text-sm text-anong-black/70 line-clamp-2 mb-3">
              {product.shortDescription[language]}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="w-16 h-px bg-anong-gold/60"></div>
            <Button 
              asChild
              size="sm"
              className="anong-btn-secondary text-xs px-4 py-2 h-auto rounded-full"
            >
              <Link to={`/product/${product.id}`} className="flex items-center">
                {t.viewProduct}
                <ChevronRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

RecipeProductCard.displayName = 'RecipeProductCard';

export default RecipeProductCard;
