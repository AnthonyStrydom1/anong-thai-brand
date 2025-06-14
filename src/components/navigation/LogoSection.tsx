
import React from 'react';
import { Link } from 'react-router-dom';

const LogoSection = () => {
  return (
    <Link to="/" className="mr-8 lg:mr-12 flex items-center">
      <div className="w-8 h-8 mr-3">
        <img 
          src="/lovable-uploads/f440215b-ebf7-4c9f-9cf6-412d4018796e.png" 
          alt="ANONG Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <h1 className="text-xl lg:text-2xl font-serif font-semibold text-anong-gold tracking-wide">
        ANONG
      </h1>
    </Link>
  );
};

export default LogoSection;
