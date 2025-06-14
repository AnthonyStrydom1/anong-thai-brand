
import { productTranslations } from '@/translations/product';

export const useProductTranslations = (language: 'en' | 'th') => {
  return productTranslations[language];
};
