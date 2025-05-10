
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchOverlay = ({ isOpen, onClose, searchQuery, setSearchQuery }: SearchOverlayProps) => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      searchPlaceholder: "Search products or recipes...",
      clearSearch: "Clear",
    },
    th: {
      searchPlaceholder: "ค้นหาสินค้าหรือสูตรอาหาร...",
      clearSearch: "ล้าง",
    }
  };

  const t = translations[language];

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="absolute left-0 right-0 bg-white shadow-md p-4 animate-fade-in z-30">
      <div className="container mx-auto flex items-center">
        <input 
          type="text" 
          placeholder={t.searchPlaceholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#520F7A] focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />
        {searchQuery && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleClearSearch}
            className="ml-2"
            aria-label={t.clearSearch}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="ml-2"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default SearchOverlay;
