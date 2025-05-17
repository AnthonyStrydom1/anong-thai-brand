import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ProductBannerProps {
  title: string;
  description: string;
}

// This component is no longer used in the application
// Keeping it for reference or future use if needed
const ProductBanner: React.FC<ProductBannerProps> = ({ title, description }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.2 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <div className="relative mb-14 rounded-xl overflow-hidden shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-[#520F7A] via-[#7A2BAA] to-[#9D4EDD] opacity-90"></div>
      
      <motion.div 
        className="relative py-12 px-8 md:py-16 md:px-12 text-center text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.h3 
          className="text-2xl md:text-3xl font-bold mb-4"
          variants={itemVariants}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="mb-6 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          {description}
        </motion.p>
        
        <motion.div variants={itemVariants}>
          <Button 
            asChild
            className="bg-white text-[#520F7A] hover:bg-white/90 hover:text-[#520F7A] transition-all duration-300"
          >
            <Link to="/menu">
              View Full Menu <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProductBanner;
