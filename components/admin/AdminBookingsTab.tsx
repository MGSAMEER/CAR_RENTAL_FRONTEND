'use client';

import { format } from 'date-fns';
import type { Booking } from '@/lib/types';
import { bookingsApi } from '@/lib/services';
import toast from 'react-hot-toast';

interface Props { bookings: Booking[]; setBookings: React.Dispatch<React.SetStateAction<Booking[]>>; }

const statusStyles: Record<string, string> = {
  confirmed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  cancelled:  'bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400',
  completed:  'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  active:     'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
};

const payStyles: Record<string, string> = {
  paid:    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  failed:  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  refunded:'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400',
};

export default function AdminBookingsTab({ bookings, setBookings }: Props) {
  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await bookingsApi.cancel(id);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b));
      toast.success('Booking cancelled');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">{bookings.length} total bookings</p>
        <div className="flex gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
            Active: {bookings.filter(b => b.status === 'confirmed' || b.status === 'active').length}
          </span>
          <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400">
            Cancelled: {bookings.filter(b => b.status === 'cancelled').length}
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50">
                {['Car', 'Customer', 'Dates', 'Total', 'Payment', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {bookings.map(b => (
                <tr key={b.id} id={`admin-booking-row-${b.id}`} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">{b.car?.name}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-slate-700 dark:text-slate-200">{b.user?.name}</p>
                    <p className="text-xs text-slate-400">{b.user?.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {format(new Date(b.startDate), 'dd MMM')} → {format(new Date(b.endDate), 'dd MMM yy')}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-white">₹{Number(b.totalCost).toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${payStyles[b.paymentStatus || 'pending'] || payStyles.pending}`}>
                      {b.paymentStatus || 'pending'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusStyles[b.status] || ''}`}>{b.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    {(b.status === 'confirmed' || b.status === 'active') && (
                      <button id={`admin-cancel-booking-${b.id}`} onClick={() => handleCancel(b.id)}
                        className="text-xs font-medium text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-2 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
