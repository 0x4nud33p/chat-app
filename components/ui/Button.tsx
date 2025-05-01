'use client';

import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { motion } from 'framer-motion';

type ButtonProps<T extends ElementType = 'button'> = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  as?: T;
  className?: string;
} & ComponentPropsWithoutRef<T>;

export default function Button<T extends ElementType = 'button'>({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  as,
  className = '',
  ...rest
}: ButtonProps<T>) {
  const Component = as || 'button';
  
  // Variants
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
    outline: 'border text-red-400 border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-white',
    ghost: 'hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  
  // Sizes
  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 rounded',
    md: 'text-sm px-4 py-2 rounded-md',
    lg: 'text-base px-6 py-3 rounded-md',
    icon: 'p-2 rounded-full',
  };
  
  const baseClasses = [
    'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : '',
    (disabled || isLoading) ? 'opacity-60 cursor-not-allowed' : '',
    className
  ].join(' ');

  return (
    <motion.div
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      className={fullWidth ? 'w-full' : 'inline-block'}
    >
      <Component
        className={baseClasses}
        disabled={disabled || isLoading}
        {...rest}
      >
        {isLoading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </Component>
    </motion.div>
  );
}