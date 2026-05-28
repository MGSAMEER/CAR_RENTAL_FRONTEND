'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message?: string;
  onClose?: () => void;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: React.ReactNode;
}

export default function Alert({
  variant = 'info',
  title,
  message,
  onClose,
  dismissible = true,
  action,
  children,
  className,
  ...props
}: AlertProps) {
  // Base styles
  const baseStyles = 'flex gap-3 p-4 rounded-lg border flex-wrap items-start sm:items-center justify-between';

  // Variant styles
  const variantStyles = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
  };

  // Icons
  const icons = {
    success: <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />,
    error: <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />,
    warning: <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />,
    info: <Info size={20} className="flex-shrink-0 mt-0.5" />,
  };

  const finalClassName = cn(baseStyles, variantStyles[variant], className);

  return (
    <div className={finalClassName} {...props}>
      <div className="flex gap-3 items-start flex-1">
        {icons[variant]}
        <div className="flex-1">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          {message && <p className="text-sm opacity-90">{message}</p>}
          {children}
        </div>
      </div>
      <div className="flex gap-2 items-center flex-shrink-0 w-full sm:w-auto justify-end sm:justify-normal mt-2 sm:mt-0">
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm font-medium underline hover:opacity-75 transition-opacity"
          >
            {action.label}
          </button>
        )}
        {dismissible && onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:opacity-70 transition-opacity"
            aria-label="Close alert"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
