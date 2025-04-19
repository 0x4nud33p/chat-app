'use client';

import { motion } from 'framer-motion';

type LoadingProps = {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
};

export default function Loading({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}: LoadingProps) {
  // Size mappings
  const sizeMap = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  // Color mappings
  const colorMap = {
    primary: 'border-blue-600 border-t-transparent',
    secondary: 'border-gray-300 border-t-transparent',
    white: 'border-white border-t-transparent'
  };
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`rounded-full border-2 ${sizeMap[size]} ${colorMap[color]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}