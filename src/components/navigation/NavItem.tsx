
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";

interface NavItemProps {
  path: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem = ({ path, label, isActive, onClick }: NavItemProps) => {
  return (
    <Link 
      to={path}
      className={cn(
        "px-3 py-2 text-white transition-all duration-200 relative",
        isActive 
          ? "font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-thai-gold" 
          : "hover:bg-[#631E8B]"
      )}
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default NavItem;
