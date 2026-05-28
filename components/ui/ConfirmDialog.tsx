'use client';

import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';
import { useState, useEffect } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'warning',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [internalIsLoading, setInternalIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setInternalIsLoading(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    setInternalIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setInternalIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: 'text-red-500',
      button: 'danger' as const,
      bg: 'bg-red-50 dark:bg-red-900/20',
    },
    warning: {
      icon: 'text-amber-500',
      button: 'danger' as const,
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    info: {
      icon: 'text-blue-500',
      button: 'primary' as const,
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up">
        {/* Header */}
        <div className={`${styles.bg} p-6 flex items-start gap-4`}>
          <AlertTriangle size={24} className={styles.icon} />
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </h2>
          </div>
          <button
            onClick={onCancel}
            disabled={internalIsLoading || isLoading}
            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <Button
            onClick={onCancel}
            variant="secondary"
            fullWidth
            disabled={internalIsLoading || isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={handleConfirm}
            variant={styles.button}
            fullWidth
            isLoading={internalIsLoading || isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
