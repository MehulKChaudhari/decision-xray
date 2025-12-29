import type { ButtonHTMLAttributes } from 'react';
import { ImSpinner2 } from 'react-icons/im';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ 
  children, 
  loading, 
  variant = 'primary', 
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition";
  
  const variantStyles = {
    primary: "border border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500",
    ghost: "border-none text-gray-700 hover:bg-gray-100 focus:ring-gray-500"
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <ImSpinner2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
      {children}
    </button>
  );
}

