
import React from 'react';

interface ProductJarMockupProps {
  image: string;
  altText: string;
}

const ProductJarMockup: React.FC<ProductJarMockupProps> = ({ image, altText }) => {
  return (
    <div className="relative w-full h-full max-w-[200px] mx-auto">
      {/* Glass jar container */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-gray-800/80 to-black rounded-lg"
        style={{
          clipPath: 'polygon(25% 0%, 75% 0%, 85% 5%, 85% 95%, 75% 100%, 25% 100%, 15% 95%, 15% 5%)'
        }}
      >
        {/* Glass reflections */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-white/10 to-black/0"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent" style={{ height: '20%' }}></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-white/5 to-transparent" style={{ height: '30%' }}></div>
      </div>
      
      {/* Product label positioned in the center of the jar */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-[70%] h-[70%] overflow-hidden rounded">
          <img 
            src={image} 
            alt={altText} 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      {/* Jar lid */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[50%] h-[8%] bg-gradient-to-b from-gray-600 to-gray-800 rounded-t-md"></div>
      
      {/* Realistic jar reflections */}
      <div className="absolute top-[15%] right-[15%] w-[3%] h-[70%] bg-white opacity-30 rounded-full"></div>
      <div className="absolute top-[25%] left-[20%] w-[2%] h-[50%] bg-white opacity-20 rounded-full"></div>
    </div>
  );
};

export default ProductJarMockup;
