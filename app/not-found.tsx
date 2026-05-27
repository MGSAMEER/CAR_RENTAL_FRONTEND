import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl font-bold text-primary-100 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-8">The page you are looking for does not exist.</p>
      <Link href="/" className="btn-primary flex items-center gap-2" id="not-found-home-btn">
        <Home size={18} /> Go Home
      </Link>
    </div>
  );
}
