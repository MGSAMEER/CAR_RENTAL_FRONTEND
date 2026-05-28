'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:ring-blue-400 shadow-md hover:shadow-blue-500/30 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus-visible:ring-blue-400',
    secondary: 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700',
    danger: 'bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-400 shadow-md dark:bg-red-600 dark:hover:bg-red-500',
    ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 focus-visible:ring-slate-400',
    outline: 'border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 focus-visible:ring-blue-400',
  };

  // Size styles (padding)
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-2',
    md: 'px-4 py-2.5 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-3',
  };

  const finalClassName = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    'rounded-lg',
    fullWidth && 'w-full',
    className
  );

  return (
    <button
      disabled={disabled || isLoading}
      className={finalClassName}
      {...props}
    >
      {isLoading && iconPosition === 'left' && <Loader size={16} className="animate-spin" />}
      {icon && !isLoading && iconPosition === 'left' && icon}
      {children}
      {isLoading && iconPosition === 'right' && <Loader size={16} className="animate-spin" />}
      {icon && !isLoading && iconPosition === 'right' && icon}
    </button>
  );
}
