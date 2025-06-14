
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
}

interface DesktopNavProps {
  navItems: NavItem[];
}

const DesktopNav = ({ navItems }: DesktopNavProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="hidden md:flex space-x-8">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`font-sans text-sm tracking-wide transition-colors duration-300 ${
            isActive(item.path)
              ? 'text-anong-gold border-b border-anong-gold pb-1'
              : 'text-white/80 hover:text-anong-gold'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default DesktopNav;
