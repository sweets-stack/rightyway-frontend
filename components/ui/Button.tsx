
import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  asLink?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    asLink, 
    className = '', 
    ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300";

  const variantStyles = {
    primary: 'bg-brand-maroon text-white hover:bg-brand-gold focus:ring-brand-gold',
    secondary: 'bg-brand-slate text-white hover:bg-gray-700 focus:ring-gray-700',
    outline: 'bg-transparent border border-brand-maroon text-brand-maroon hover:bg-brand-maroon hover:text-white focus:ring-brand-maroon',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (asLink) {
    return (
      <Link to={asLink} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
