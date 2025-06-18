
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingTransitionProps {
  message?: string;
  className?: string;
}

const LoadingTransition = ({ 
  message = "Processing...", 
  className = "" 
}: LoadingTransitionProps) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
      <p className="text-gray-600 text-center">{message}</p>
    </div>
  );
};

export default LoadingTransition;
