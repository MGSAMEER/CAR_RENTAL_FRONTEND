'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onBack?: () => void;
}

export default function Breadcrumb({ items, onBack }: BreadcrumbProps) {
  const router = useRouter();

  const handleItemClick = (href?: string) => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <nav className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
      {/* Home link */}
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
      >
        <Home size={16} />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {/* Breadcrumb items */}
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight size={16} className="flex-shrink-0" />

          {item.href ? (
            <button
              onClick={() => handleItemClick(item.href)}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors line-clamp-1"
            >
              {item.label}
            </button>
          ) : (
            <span className="font-medium text-slate-900 dark:text-slate-200 line-clamp-1">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
