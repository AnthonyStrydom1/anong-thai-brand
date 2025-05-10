
import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchOverlayProps {
  isOpen: boolean;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onClose: () => void;
  translations: {
    search: string;
    searchPlaceholder: string;
  };
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
    <div className="absolute inset-x-0 bg-white p-4 shadow-lg z-50 animate-in fade-in">
      <div className="container mx-auto flex items-center">
        <Input
          type="text"
          placeholder={translations.searchPlaceholder}
          value={searchQuery}
          onChange={onSearchChange}
          className="flex-grow mr-2"
          autoFocus
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="mr-2"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
        <Button
          variant="default"
          className="bg-thai-purple hover:bg-thai-purple-dark"
          onClick={onClose}
        >
          {translations.search}
        </Button>
      </div>
    </div>
  );
};

export default SearchOverlay;
