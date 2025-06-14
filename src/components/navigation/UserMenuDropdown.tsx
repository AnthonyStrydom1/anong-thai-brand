
import React from 'react';
import { Link } from 'react-router-dom';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import AdminLink from './AdminLink';
import { useUserRoles } from '@/hooks/useUserRoles';

interface UserMenuDropdownProps {
  onLogout: () => void;
  translations: {
    profile: string;
    account: string;
    orders: string;
    settings: string;
    logout: string;
  };
}

const UserMenuDropdown = ({ onLogout, translations }: UserMenuDropdownProps) => {
  const { isAdmin, isLoading } = useUserRoles();

  return (
    <DropdownMenuContent align="end" className="w-48">
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
      
      {!isLoading && isAdmin() && (
        <DropdownMenuItem asChild>
          <AdminLink />
        </DropdownMenuItem>
      )}
      
      <DropdownMenuSeparator />
      
      <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600">
        {translations.logout}
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

export default UserMenuDropdown;
