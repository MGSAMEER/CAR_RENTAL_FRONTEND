'use client';

import React from 'react';
import { FieldError } from 'react-hook-form';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError;
  icon?: React.ReactNode;
  hint?: string;
  required?: boolean;
  showPasswordToggle?: boolean;
}

export default function FormField(
  {
    label,
    error,
    icon,
    hint,
    required = false,
    className,
    type = 'text',
    showPasswordToggle = false,
    ...props
  }: FormFieldProps,
  ref?: React.ForwardedRef<HTMLInputElement>
) {
  const [showPassword, setShowPassword] = React.useState(false);
  const actualType = showPasswordToggle && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-900 dark:text-white">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 flex-shrink-0 pointer-events-none">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          type={actualType}
          className={cn(
            'input',
            icon && 'pl-10',
            showPasswordToggle && 'pr-10',
            error && 'input-error',
            className
          )}
          {...props}
        />

        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error.message}</span>
        </div>
      )}

      {/* Hint text */}
      {hint && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}
    </div>
  );
}

export const FormFieldComponent = React.forwardRef(FormField);
FormFieldComponent.displayName = 'FormField';
