'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Car, BookOpen, Users, CreditCard,
  TrendingUp, DollarSign, Activity, FileBadge,
} from 'lucide-react';
import { carsApi, bookingsApi, usersApi, adminApi } from '@/lib/services';
import { useAuthStore } from '@/lib/store';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { Car as CarType, Booking, User } from '@/lib/types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { StatCard, RevenueChart, BookingsChart } from '@/components/admin/AdminCharts';
import AdminCarsTab from '@/components/admin/AdminCarsTab';
import AdminBookingsTab from '@/components/admin/AdminBookingsTab';
import AdminUsersTab from '@/components/admin/AdminUsersTab';
import AdminPaymentsTab from '@/components/admin/AdminPaymentsTab';
import AdminVerificationsTab from '@/components/admin/AdminVerificationsTab';
import Badge from '@/components/ui/Badge';

type Tab = 'overview' | 'cars' | 'bookings' | 'users' | 'payments' | 'verifications';
interface ExtUser extends User { isBlocked?: boolean; }

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview',      label: 'Overview',      icon: LayoutDashboard },
  { id: 'cars',          label: 'Cars',          icon: Car },
  { id: 'bookings',      label: 'Bookings',      icon: BookOpen },
  { id: 'users',         label: 'Users',         icon: Users },
  { id: 'payments',      label: 'Payments',      icon: CreditCard },
  { id: 'verifications', label: 'Verifications', icon: FileBadge },
];

function AdminPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [tab, setTab] = useState<Tab>((searchParams.get('tab') as Tab) || 'overview');
  const [loading, setLoading] = useState(true);

  // Data
  const [cars, setCars] = useState<CarType[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<ExtUser[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [revenue, setRevenue] = useState<{ date: string; revenue: number }[]>([]);
  const [bookingsChart, setBookingsChart] = useState<{ date: string; bookings: number; cancelled: number }[]>([]);
  const [topCars, setTopCars] = useState<{ car: CarType; bookingCount: number; totalRevenue: number }[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  // ✅ Track individual endpoint errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') { router.push('/'); return; }
    loadAll();
  }, [isAuthenticated, user]);

  useEffect(() => {
    const t = searchParams.get('tab') as Tab;
    if (t) setTab(t);
  }, [searchParams]);

  const loadAll = async () => {
    setLoading(true);
    setErrors({}); // ✅ Clear previous errors

    console.log('[ADMIN DASHBOARD] Loading all data...');

    // ✅ Use Promise.allSettled instead of Promise.all
    const results = await Promise.allSettled([
      carsApi.getAll(),
      bookingsApi.getAll(),
      usersApi.getAll(),
      adminApi.getStats(),
      adminApi.getRevenue(),
      adminApi.getBookingsChart(),
      adminApi.getTopCars(),
      adminApi.getPayments(),
    ]);

    console.log('[ADMIN DASHBOARD] API calls completed', {
      resultsCount: results.length,
      fulfilled: results.filter(r => r.status === 'fulfilled').length,
      rejected: results.filter(r => r.status === 'rejected').length,
    });

    // ✅ Process each result individually
    const newErrors: Record<string, string> = {};

    // Cars
    if (results[0].status === 'fulfilled') {
      setCars(results[0].value.data.data || []);
      console.log('[ADMIN DASHBOARD] Cars loaded', { count: results[0].value.data.data?.length || 0 });
    } else {
      newErrors.cars = 'Failed to load cars';
      setCars([]);
      console.error('[ADMIN DASHBOARD] Cars load failed', results[0].reason);
    }

    // Bookings
    if (results[1].status === 'fulfilled') {
      setBookings(results[1].value.data.data || []);
      console.log('[ADMIN DASHBOARD] Bookings loaded', { count: results[1].value.data.data?.length || 0 });
    } else {
      newErrors.bookings = 'Failed to load bookings';
      setBookings([]);
      console.error('[ADMIN DASHBOARD] Bookings load failed', results[1].reason);
    }

    // Users
    if (results[2].status === 'fulfilled') {
      setUsers(results[2].value.data.data || []);
      console.log('[ADMIN DASHBOARD] Users loaded', { count: results[2].value.data.data?.length || 0 });
    } else {
      newErrors.users = 'Failed to load users';
      setUsers([]);
      console.error('[ADMIN DASHBOARD] Users load failed', results[2].reason);
    }

    // Stats
    if (results[3].status === 'fulfilled') {
      setStats(results[3].value.data.data);
      console.log('[ADMIN DASHBOARD] Stats loaded');
    } else {
      newErrors.stats = 'Failed to load stats';
      setStats(null);
      console.error('[ADMIN DASHBOARD] Stats load failed', results[3].reason);
    }

    // Revenue
    if (results[4].status === 'fulfilled') {
      setRevenue(results[4].value.data.data || []);
      console.log('[ADMIN DASHBOARD] Revenue loaded', { count: results[4].value.data.data?.length || 0 });
    } else {
      newErrors.revenue = 'Failed to load revenue data';
      setRevenue([]);
      console.error('[ADMIN DASHBOARD] Revenue load failed', results[4].reason);
    }

    // Bookings Chart
    if (results[5].status === 'fulfilled') {
      setBookingsChart(results[5].value.data.data || []);
      console.log('[ADMIN DASHBOARD] Bookings chart loaded', { count: results[5].value.data.data?.length || 0 });
    } else {
      newErrors.bookingsChart = 'Failed to load bookings chart';
      setBookingsChart([]);
      console.error('[ADMIN DASHBOARD] Bookings chart load failed', results[5].reason);
    }

    // Top Cars
    if (results[6].status === 'fulfilled') {
      setTopCars(results[6].value.data.data || []);
      console.log('[ADMIN DASHBOARD] Top cars loaded', { count: results[6].value.data.data?.length || 0 });
    } else {
      newErrors.topCars = 'Failed to load top cars';
      setTopCars([]);
      console.error('[ADMIN DASHBOARD] Top cars load failed', results[6].reason);
    }

    // Payments
    if (results[7].status === 'fulfilled') {
      setPayments(results[7].value.data.data || []);
      console.log('[ADMIN DASHBOARD] Payments loaded', { count: results[7].value.data.data?.length || 0 });
    } else {
      newErrors.payments = 'Failed to load payments';
      setPayments([]);
      console.error('[ADMIN DASHBOARD] Payments load failed', results[7].reason);
    }

    setErrors(newErrors);
    setLoading(false);

    // ✅ Show toasts only for errors
    Object.values(newErrors).forEach(error => {
      console.warn('[ADMIN DASHBOARD] Endpoint error:', error);
      toast.error(error);
    });

    console.log('[ADMIN DASHBOARD] Loading complete', {
      errorsCount: Object.keys(newErrors).length,
      totalEndpoints: results.length,
      successRate: ((results.length - Object.keys(newErrors).length) / results.length * 100).toFixed(1) + '%',
    });
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    router.push(t === 'overview' ? '/admin' : `/admin?tab=${t}`, { scroll: false });
  };

  if (loading) return <LoadingSpinner fullPage text="Loading dashboard..." />;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Breadcrumb Navigation (Mobile: tabs, Desktop: full tabs) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
        {/* Mobile: Scrollable tabs instead of dropdown */}
        <div className="flex sm:hidden gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {tabs.map(t => (
            <button
              key={t.id}
              id={`admin-tab-${t.id}`}
              onClick={() => switchTab(t.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex-shrink-0 whitespace-nowrap ${
                tab === t.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>
        
        {/* Tab bar (visible on desktop) */}
        <div className="hidden sm:flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              id={`admin-tab-${t.id}`}
              onClick={() => switchTab(t.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                tab === t.id
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <t.icon size={15} /> <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div className="space-y-6 animate-slide-up">
          {/* KPI cards - 2 column on mobile, 4 on xl */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <StatCard label="Total Revenue" value={`₹${Number(stats?.totalRevenue || 0).toLocaleString()}`} icon={DollarSign} color="bg-gradient-to-br from-blue-500 to-blue-600" growth={stats?.revenueGrowth} />
            <StatCard label="Total Bookings" value={String(stats?.totalBookings || 0)} icon={BookOpen} color="bg-gradient-to-br from-violet-500 to-violet-600" growth={stats?.bookingGrowth} />
            <StatCard label="Active Bookings" value={String(stats?.activeBookings || 0)} icon={Activity} color="bg-gradient-to-br from-emerald-500 to-emerald-600" />
            <StatCard label="Registered Users" value={String(stats?.totalUsers || 0)} icon={Users} color="bg-gradient-to-br from-orange-500 to-orange-600" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">
            <RevenueChart data={revenue} />
            <BookingsChart data={bookingsChart} />
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">
            {/* Top cars */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-4 sm:p-5">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-500" /> Most Rented Cars
              </h3>
              <div className="space-y-3">
                {topCars.slice(0, 5).map((tc, i) => (
                  <div key={tc.car?.id} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">{i + 1}</span>
                    {tc.car?.imageUrl && <img src={tc.car.imageUrl} alt={tc.car.name} className="w-10 h-7 object-cover rounded-lg border border-slate-100 dark:border-slate-700" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{tc.car?.name}</p>
                      <p className="text-xs text-slate-400">{tc.car?.brand}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{tc.bookingCount} trips</p>
                      <p className="text-xs text-slate-400">₹{tc.totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {topCars.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No booking data yet</p>}
              </div>
            </div>

            {/* Recent bookings */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-4 sm:p-5">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                <BookOpen size={16} className="text-violet-500" /> Recent Bookings
              </h3>
              <div className="space-y-3">
                {bookings.slice(0, 5).map(b => (
                  <div key={b.id} className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-700 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{b.car?.name}</p>
                      <p className="text-xs text-slate-400">{b.user?.name} · {format(new Date(b.createdAt), 'dd MMM')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800 dark:text-white">₹{Number(b.totalCost).toLocaleString()}</p>
                      <Badge variant={b.status === 'cancelled' ? 'cancelled' : 'confirmed'} size="sm" className="mt-0.5">
                        {b.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No bookings yet</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'cars' && <AdminCarsTab cars={cars} setCars={setCars} />}
      {tab === 'bookings' && <AdminBookingsTab bookings={bookings} setBookings={setBookings} />}
      {tab === 'users' && <AdminUsersTab users={users} setUsers={setUsers} />}
      {tab === 'payments' && <AdminPaymentsTab payments={payments} />}
      {tab === 'verifications' && <AdminVerificationsTab />}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage text="Loading admin..." />}>
      <AdminPageInner />
    </Suspense>
  );
}
