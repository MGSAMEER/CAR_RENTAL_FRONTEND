'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Car, BookOpen, Users, CreditCard,
  LogOut, ChevronRight, Shield, Menu, X,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import ThemeToggle from '@/components/ui/ThemeToggle';
import toast from 'react-hot-toast';

const navItems = [
  { id: 'overview',  label: 'Overview',  icon: LayoutDashboard, href: '/admin' },
  { id: 'cars',      label: 'Cars',      icon: Car,              href: '/admin?tab=cars' },
  { id: 'bookings',  label: 'Bookings',  icon: BookOpen,         href: '/admin?tab=bookings' },
  { id: 'users',     label: 'Users',     icon: Users,            href: '/admin?tab=users' },
  { id: 'payments',  label: 'Payments',  icon: CreditCard,       href: '/admin?tab=payments' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Load sidebar preference from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('admin-sidebar-open');
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    // Default: open on desktop, closed on mobile
    setSidebarOpen(saved ? saved === 'true' : !isMobile);
  }, []);

  // Persist sidebar state
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('admin-sidebar-open', String(sidebarOpen));
    }
  }, [sidebarOpen, mounted]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/');
  };

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* ── Sidebar Overlay (Mobile) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 md:w-20'} shrink-0 flex flex-col bg-slate-900 dark:bg-slate-900 border-r border-slate-800 shadow-2xl z-20 transition-all duration-300 overflow-hidden fixed md:relative h-screen`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800 justify-between md:justify-start">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Car size={18} className="text-white" />
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-white font-bold text-base leading-tight">DriveEasy</p>
                <p className="text-slate-400 text-xs">Admin Panel</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={18} className="text-slate-400" />
            </button>
          )}
        </div>

        {/* Toggle Button (Collapsed) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="hidden md:flex items-center justify-center p-3 mx-2 mt-2 hover:bg-slate-800 rounded-xl transition-colors"
            title="Expand sidebar"
          >
            <Menu size={18} className="text-slate-400" />
          </button>
        )}

        {/* Admin badge */}
        {sidebarOpen && (
          <div className="mx-4 mt-4 mb-2 px-3 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl flex items-center gap-2">
            <Shield size={14} className="text-blue-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
              <p className="text-blue-400 text-xs">Administrator</p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.href === '/admin'
              ? pathname === '/admin' && !window?.location?.search?.includes('tab=')
              : window?.location?.href?.includes(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => sidebarOpen && setSidebarOpen(false)}
                id={`admin-sidebar-${item.id}`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group md:justify-center ${
                  !sidebarOpen ? 'md:px-2' : ''
                } ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <item.icon size={17} className="shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`} />
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className={`px-3 py-4 border-t border-slate-800 space-y-2 ${!sidebarOpen ? 'md:flex md:flex-col md:items-center md:justify-center' : ''}`}>
          {sidebarOpen && (
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-slate-400 text-xs">Theme</span>
              <ThemeToggle />
            </div>
          )}
          {!sidebarOpen && (
            <div className="flex md:flex-col md:items-center gap-2">
              <ThemeToggle />
            </div>
          )}
          {sidebarOpen && (
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200"
            >
              <Car size={17} />
              View Site
            </Link>
          )}
          {!sidebarOpen && (
            <Link
              href="/"
              title="View Site"
              className="flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200"
            >
              <Car size={17} />
            </Link>
          )}
          <button
            id="admin-sidebar-logout"
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 ${
              !sidebarOpen ? 'md:w-full md:justify-center' : 'w-full'
            }`}
            title={!sidebarOpen ? 'Logout' : ''}
          >
            <LogOut size={17} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen && 'md:ml-0'}`}>
        {/* Top bar */}
        <header className="h-14 shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
              title={sidebarOpen ? 'Close menu' : 'Open menu'}
            >
              {sidebarOpen ? <X size={20} className="text-slate-600 dark:text-slate-400" /> : <Menu size={20} className="text-slate-600 dark:text-slate-400" />}
            </button>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Admin Dashboard</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Manage your entire car rental platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Live</span>
            </div>
          </div>
        </header>

        {/* Scrollable page area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
