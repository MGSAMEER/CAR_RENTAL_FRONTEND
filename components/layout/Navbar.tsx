'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Car, Menu, X, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/');
    setMenuOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/cars', label: 'Browse Cars' },
    ...(isAuthenticated ? [
      { href: '/bookings', label: 'My Bookings' },
      { href: '/profile', label: 'Profile' },
    ] : []),
    ...(user?.role === 'admin' ? [{ href: '/admin', label: 'Admin' }] : []),
  ];

  // Hide Navbar on admin pages — admin has its own sidebar layout
  if (pathname?.startsWith('/admin')) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-700 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" id="nav-logo">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
              <Car size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Drive<span className="text-blue-600 dark:text-blue-400">Easy</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                id={`nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700/60 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <User size={14} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-200">{user?.name}</span>
                  {user?.role === 'admin' && (
                    <span className="text-xs bg-blue-600 dark:bg-blue-600 text-white px-1.5 py-0.5 rounded-md">Admin</span>
                  )}
                </div>
                <Button id="nav-logout-btn" onClick={handleLogout} variant="ghost" size="sm">
                  <LogOut size={15} />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" id="nav-login-btn" className="btn-ghost text-sm">
                  Sign In
                </Link>
                <Link href="/register" id="nav-register-btn" className="btn-primary text-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              id="nav-mobile-menu-btn"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} className="dark:text-white" /> : <Menu size={22} className="dark:text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 animate-fade-in transition-colors duration-300">
          <div className="px-4 py-4 space-y-1">
{navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 dark:border-slate-700">
              {isAuthenticated ? (
                <Button onClick={handleLogout} variant="ghost" size="sm" className="w-full justify-start text-red-600 dark:text-red-400">
                  <LogOut size={15} /> Logout
                </Button>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="block w-full btn-secondary text-sm text-center">Sign In</Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)} className="block w-full btn-primary text-sm text-center">Get Started</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
