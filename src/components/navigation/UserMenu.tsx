
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { User, LogIn } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  translations: {
    login: string;
    profile: string;
    logout: string;
    account: string;
    orders: string;
    settings: string;
  };
}

const UserMenu = ({
  isLoggedIn,
  onLogin,
  onLogout,
  translations
}: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Common style for consistent white box highlighting
  const buttonStyle = "text-white hover:bg-white hover:bg-opacity-20 transition-colors";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className={buttonStyle}
          aria-label={isLoggedIn ? translations.profile : translations.login}
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        {isLoggedIn ? (
          <>
            <DropdownMenuItem asChild>
              <Link to="/profile" className="w-full cursor-pointer">
                {translations.profile}
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/account" className="w-full cursor-pointer">
                {translations.account}
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/orders" className="w-full cursor-pointer">
                {translations.orders}
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/settings" className="w-full cursor-pointer">
                {translations.settings}
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
              {translations.logout}
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={onLogin} className="cursor-pointer">
            <LogIn className="mr-2 h-4 w-4" />
            {translations.login}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
