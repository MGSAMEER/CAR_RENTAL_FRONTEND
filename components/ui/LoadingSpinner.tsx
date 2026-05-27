import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  text?: string;
  fullPage?: boolean;
}

export default function LoadingSpinner({ size = 24, text, fullPage = false }: LoadingSpinnerProps) {
  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 size={40} className="text-primary-500 animate-spin" />
        {text && <p className="text-gray-500 text-sm">{text}</p>}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <Loader2 size={size} className="text-primary-500 animate-spin" />
      {text && <span className="text-gray-500 text-sm">{text}</span>}
    </div>
  );
}
