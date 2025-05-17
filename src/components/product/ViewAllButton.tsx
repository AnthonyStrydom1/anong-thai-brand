
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ViewAllButtonProps {
  text: string;
}

const ViewAllButton: React.FC<ViewAllButtonProps> = ({ text }) => {
  return (
    <div className="text-center">
      <Button 
        asChild
        variant="outline" 
        className="border-thai-purple text-thai-purple hover:bg-thai-purple/10"
      >
        <Link to="/shop">
          {text}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};

export default ViewAllButton;
