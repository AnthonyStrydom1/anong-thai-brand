
import React from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps {
  path: string;
  label: string;
  isActive: boolean;
}

const NavItem = ({ path, label, isActive }: NavItemProps) => {
  return (
    <Link
      to={path}
      className={`px-3 py-2 rounded-md transition-colors ${
        isActive
          ? 'text-white font-medium bg-white bg-opacity-20'
          : 'text-white hover:bg-white hover:bg-opacity-20'
      }`}
    >
      {label}
    </Link>
  );
};

export default NavItem;
