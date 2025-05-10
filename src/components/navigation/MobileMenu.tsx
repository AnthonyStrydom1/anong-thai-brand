
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, LogIn, LogOut, ShoppingCart } from "lucide-react";
import { NavigationTranslation } from "@/translations/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  navItems: { path: string; label: string }[];
  isLoggedIn: boolean;
  onMenuItemClick: () => void;
  onSearchClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  translations: NavigationTranslation;
}

const MobileMenu = ({ 
  isOpen, 
  navItems, 
  isLoggedIn, 
  onMenuItemClick, 
  onSearchClick, 
  onLoginClick, 
  onLogoutClick,
  translations
}: MobileMenuProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden bg-[#631E8B] border-t border-thai-gold/30 animate-fade-in">
      <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className="text-white hover:text-thai-gold p-2 transition" 
            onClick={onMenuItemClick}
          >
            {item.label}
          </Link>
        ))}
        <hr className="border-thai-gold/30" />
        <div className="flex justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-white hover:text-thai-gold"
            onClick={() => {
              onMenuItemClick();
              onSearchClick();
            }}
          >
            <Search className="h-4 w-4 mr-2" />
            {translations.search}
          </Button>
          {isLoggedIn ? (
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-red-300"
              onClick={onLogoutClick}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {translations.logout}
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-white hover:text-thai-gold"
              onClick={onLoginClick}
            >
              <LogIn className="h-4 w-4 mr-2" />
              {translations.login}
            </Button>
          )}
          <Link to="/cart" onClick={onMenuItemClick}>
            <Button variant="ghost" size="sm" className="flex items-center text-white hover:text-thai-gold">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {translations.cart}
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
