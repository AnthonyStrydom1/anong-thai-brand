
import React from 'react';
import { Button } from "@/components/ui/button";
import { User } from 'lucide-react';
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface UserMenuButtonProps {
  isLoggedIn: boolean;
  onClick: (e: React.MouseEvent) => void;
  translations: {
    profile: string;
    login: string;
  };
}

const UserMenuButton = ({ isLoggedIn, onClick, translations }: UserMenuButtonProps) => {
  return (
    <DropdownMenuTrigger asChild>
      <Button 
        variant="ghost" 
        size="icon"
        className="text-white hover:bg-white hover:bg-opacity-20 transition-colors"
        aria-label={isLoggedIn ? translations.profile : translations.login}
        onClick={onClick}
      >
        <User className="h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
  );
};

export default UserMenuButton;
