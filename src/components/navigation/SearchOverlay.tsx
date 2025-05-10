
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { NavigationTranslation } from "@/translations/navigation";

interface SearchOverlayProps {
  isOpen: boolean;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onClose: () => void;
  translations: NavigationTranslation;
}

const SearchOverlay = ({ 
  isOpen, 
  searchQuery, 
  onSearchChange, 
  onClear, 
  onClose,
  translations
}: SearchOverlayProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute left-0 right-0 bg-white shadow-md p-4 animate-fade-in z-30">
      <div className="container mx-auto flex items-center">
        <input 
          type="text" 
          placeholder={translations.searchPlaceholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#520F7A] focus:border-transparent"
          value={searchQuery}
          onChange={onSearchChange}
          autoFocus
        />
        {searchQuery && (
          <Button 
            variant="ghost" 
            onClick={onClear}
            className="ml-2"
          >
            <X className="h-4 w-4 mr-1" />
            {translations.clearSearch}
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
