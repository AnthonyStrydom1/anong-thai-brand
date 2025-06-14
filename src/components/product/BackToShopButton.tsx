
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BackToShopButtonProps {
  language: 'en' | 'th';
}

export const BackToShopButton = ({ language }: BackToShopButtonProps) => {
  return (
    <div className="mb-6">
      <Button asChild variant="outline" className="mb-4">
        <Link to="/shop">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'en' ? 'Back to Shop' : 'กลับไปยังร้านค้า'}
        </Link>
      </Button>
    </div>
  );
};
