
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  productName: string;
  language: 'en' | 'th';
}

export const ProductBreadcrumb = ({ productName, language }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex items-center text-sm text-gray-500">
      <Link to="/" className="hover:text-thai-purple transition">
        {language === 'en' ? 'Home' : 'หน้าหลัก'}
      </Link>
      <ChevronRight className="h-4 w-4 mx-2" />
      <Link to="/shop" className="hover:text-thai-purple transition">
        {language === 'en' ? 'Shop' : 'ซื้อสินค้า'}
      </Link>
      <ChevronRight className="h-4 w-4 mx-2" />
      <span className="text-gray-700">{productName}</span>
    </div>
  );
};
