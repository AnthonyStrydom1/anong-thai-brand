
import { Link } from "react-router-dom";

interface ProductNotFoundProps {
  language: 'en' | 'th';
}

export const ProductNotFound = ({ language }: ProductNotFoundProps) => {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-semibold mb-4">
        {language === 'en' ? 'Product not found' : 'ไม่พบสินค้า'}
      </h2>
      <Link to="/shop" className="text-thai-purple hover:underline">
        {language === 'en' ? 'Return to shop' : 'กลับไปที่ร้านค้า'}
      </Link>
    </div>
  );
};
