
import { Link } from 'react-router-dom';
import { User, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavigationTranslation } from "@/translations/navigation";

interface UserMenuProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  translations: NavigationTranslation;
}

const UserMenu = ({ isLoggedIn, onLogin, onLogout, translations }: UserMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          aria-label={translations.account}
          className="text-white hover:bg-[#631E8B]"
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {isLoggedIn ? (
          <>
            <DropdownMenuItem asChild>
              <Link to="/profile" className="w-full flex items-center">
                {translations.profile}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="w-full flex items-center">
                {translations.settings}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout} className="flex items-center text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              {translations.logout}
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={onLogin} className="flex items-center">
            <LogIn className="mr-2 h-4 w-4" />
            {translations.login}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
