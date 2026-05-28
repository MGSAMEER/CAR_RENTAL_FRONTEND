'use client';

import { format } from 'date-fns';
import type { Booking } from '@/lib/types';
import { bookingsApi } from '@/lib/services';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface Props { bookings: Booking[]; setBookings: React.Dispatch<React.SetStateAction<Booking[]>>; }

function MobileBookingCard({ booking, onCancel }: { booking: Booking; onCancel: (id: string) => void }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-4 mb-3 last:mb-0">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-slate-900 dark:text-white truncate">{booking.car?.name}</p>
          <p className="text-sm text-slate-700 dark:text-slate-200">{booking.user?.name}</p>
          <p className="text-xs text-slate-400 truncate">{booking.user?.email}</p>
        </div>
        <div className="text-right shrink-0 ml-2">
          <p className="text-lg font-bold text-slate-800 dark:text-white">₹{Number(booking.totalCost).toLocaleString()}</p>
          <Badge variant={booking.status === 'cancelled' ? 'cancelled' : 'confirmed'} size="sm" className="mt-1">
            {booking.status}
          </Badge>
        </div>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Badge variant={booking.paymentStatus === 'paid' ? 'available' : booking.paymentStatus === 'pending' ? 'warning' : 'unavailable'} size="sm">
            {booking.paymentStatus || 'pending'}
          </Badge>
          {booking.refundAmount !== undefined && (
            <Badge variant={booking.refundStatus === 'processed' ? 'available' : 'warning'} size="sm">
              Refund: ₹{booking.refundAmount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>{format(new Date(booking.startDate), 'dd MMM')} → {format(new Date(booking.endDate), 'dd MMM yy')}</span>
          {(booking.status === 'confirmed' || booking.status === 'active') && (
            <Button id={`mobile-cancel-booking-${booking.id}`} onClick={() => onCancel(booking.id)} variant="danger" size="sm">
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminBookingsTab({ bookings, setBookings }: Props) {
  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      const res = await bookingsApi.cancel(id);
      const updatedBooking = res.data?.data || res.data;
      setBookings(prev => prev.map(b => b.id === id ? updatedBooking : b));
      const refundInfo = updatedBooking?.refundAmount 
        ? `Refund: ₹${updatedBooking.refundAmount}`
        : 'No refund applicable';
      toast.success(`Booking cancelled. ${refundInfo}`);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to cancel';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">{bookings.length} total bookings</p>
        <div className="flex gap-2 text-xs">
          <Badge variant="info" size="sm">
            Active: {bookings.filter(b => b.status === 'confirmed' || b.status === 'active').length}
          </Badge>
          <Badge variant="cancelled" size="sm">
            Cancelled: {bookings.filter(b => b.status === 'cancelled').length}
          </Badge>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {bookings.map(b => (
          <MobileBookingCard key={b.id} booking={b} onCancel={handleCancel} />
        ))}
        {bookings.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">No bookings found</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50">
                {['Car', 'Customer', 'Dates', 'Total', 'Payment', 'Status', 'Refund', 'Action'].map(h => (
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
                    <Badge variant={b.paymentStatus === 'paid' ? 'available' : b.paymentStatus === 'pending' ? 'warning' : b.paymentStatus === 'failed' ? 'unavailable' : 'cancelled'} size="sm">
                      {b.paymentStatus || 'pending'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={b.status === 'confirmed' || b.status === 'active' ? 'confirmed' : b.status === 'completed' ? 'completed' : 'cancelled'} size="sm">
                      {b.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    {b.refundAmount !== undefined ? (
                      <div className="text-xs">
                        <p className="font-bold text-slate-800 dark:text-white">₹{b.refundAmount}</p>
                        <Badge variant={b.refundStatus === 'processed' ? 'available' : 'warning'} size="sm" className="mt-1">
                          {b.refundStatus || 'not_requested'}
                        </Badge>
                      </div>
                    ) : null}
                  </td>
                  <td className="px-5 py-3.5">
                    {(b.status === 'confirmed' || b.status === 'active') && (
                      <Button id={`admin-cancel-booking-${b.id}`} onClick={() => handleCancel(b.id)} variant="danger" size="sm">
                        Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400">No bookings found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}