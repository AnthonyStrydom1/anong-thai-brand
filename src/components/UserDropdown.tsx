
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const UserDropdown = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { language } = useLanguage();
  
  const translations = {
    en: {
      account: "Account",
      login: "Login",
      logout: "Logout",
      profile: "Profile",
      settings: "Settings",
      loginSuccess: "Successfully logged in",
      logoutSuccess: "Successfully logged out",
      welcomeBack: "Welcome back to Anong Thai!"
    },
    th: {
      account: "บัญชี",
      login: "เข้าสู่ระบบ",
      logout: "ออกจากระบบ",
      profile: "โปรไฟล์",
      settings: "ตั้งค่า",
      loginSuccess: "เข้าสู่ระบบสำเร็จ",
      logoutSuccess: "ออกจากระบบสำเร็จ",
      welcomeBack: "ยินดีต้อนรับกลับสู่อนงค์ไทย!"
    }
  };

  const t = translations[language];

  const handleLogin = () => {
    setIsLoggedIn(true);
    toast({
      title: t.loginSuccess,
      description: t.welcomeBack,
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: t.logoutSuccess,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          aria-label={t.account}
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {isLoggedIn ? (
          <>
            <DropdownMenuItem asChild>
              <Link to="/profile" className="w-full flex items-center">
                {t.profile}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="w-full flex items-center">
                {t.settings}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              {t.logout}
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={handleLogin} className="flex items-center">
            <LogIn className="mr-2 h-4 w-4" />
            {t.login}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
