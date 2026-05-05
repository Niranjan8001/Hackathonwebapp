import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  fullWidth = false,
  ...props 
}) => {
  const baseStyle = "font-medium rounded-xl py-3 px-4 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]";
  
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
    secondary: "bg-green-100 text-green-800 hover:bg-green-200",
    outline: "border-2 border-green-600 text-green-600 hover:bg-green-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
