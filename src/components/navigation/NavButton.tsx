
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const NavButton = ({ children, className, ...props }: NavButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "text-white hover:bg-[#631E8B] transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default NavButton;
