'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from './Button';

interface BackButtonProps {
  label?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function BackButton({
  label = 'Go Back',
  href,
  onClick,
  className,
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      size="sm"
      icon={<ArrowLeft size={18} />}
      iconPosition="left"
      className={className}
    >
      {label}
    </Button>
  );
}
