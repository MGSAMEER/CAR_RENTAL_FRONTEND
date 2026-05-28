'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'available' | 'unavailable' | 'confirmed' | 'cancelled' | 'completed' | 'default' | 'warning' | 'info';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function Badge({
  variant = 'default',
  size = 'sm',
  icon,
  children,
  className,
  ...props
}: BadgeProps) {
  // Base styles
  const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full';

  // Variant styles
  const variantStyles = {
    available: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    unavailable: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    confirmed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    cancelled: 'bg-slate-100 dark:bg-slate-700/40 text-slate-600 dark:text-slate-400',
    completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    default: 'bg-slate-100 dark:bg-slate-700/40 text-slate-600 dark:text-slate-400',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    info: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const finalClassName = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  return (
    <div className={finalClassName} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </div>
  );
}
