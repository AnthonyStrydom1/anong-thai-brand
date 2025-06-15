
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BackToRecipesButtonProps {
  language: 'en' | 'th';
}

export const BackToRecipesButton = ({ language }: BackToRecipesButtonProps) => {
  return (
    <div className="mb-6">
      <Button asChild variant="outline" className="mb-4">
        <Link to="/recipes">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'en' ? 'Back to Recipes' : 'กลับสู่สูตรอาหาร'}
        </Link>
      </Button>
    </div>
  );
};
