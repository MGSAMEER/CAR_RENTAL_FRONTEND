'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Car, XCircle, CheckCircle2, Clock, AlertCircle, RotateCw } from 'lucide-react';
import { bookingsApi } from '@/lib/services';
import { useAuthStore } from '@/lib/store';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import LeaveReviewModal from '@/components/cars/LeaveReviewModal';
import type { Booking } from '@/lib/types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const statusConfig = {
  confirmed:  { label: 'Confirmed',  cls: 'badge-confirmed',  icon: CheckCircle2 },
  cancelled:  { label: 'Cancelled',  cls: 'badge-cancelled',  icon: XCircle },
  completed:  { label: 'Completed',  cls: 'badge-completed',  icon: CheckCircle2 },
  active:     { label: 'Active',     cls: 'badge-confirmed',  icon: Clock },
};

export default function BookingsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [reviewCar, setReviewCar] = useState<{ id: string, name: string } | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[BOOKINGS PAGE] Fetching bookings...', { 
        authenticated: isAuthenticated, 
        userRole: user?.role,
        retryAttempt: retryCount 
      });
      
      const res = await bookingsApi.getAll();
      
      console.log('[BOOKINGS PAGE] Bookings fetched successfully', {
        count: Array.isArray(res.data?.data) ? res.data.data.length : 0,
        hasData: !!res.data?.data,
        responseStructure: {
          success: res.data?.success,
          dataType: typeof res.data?.data,
          isArray: Array.isArray(res.data?.data),
        }
      });
      
      const bookingsData = res.data?.data || [];
      if (!Array.isArray(bookingsData)) {
        throw new Error(`Expected array but got ${typeof bookingsData}`);
      }
      
      setBookings(bookingsData);
      setRetryCount(0);
      
    } catch (err: any) {
      console.error('[BOOKINGS PAGE] Error fetching bookings', {
        errorMessage: err.message,
        errorCode: err.response?.data?.error,
        status: err.response?.status,
        responseData: err.response?.data,
        stack: err.stack,
      });
      
      let errorMessage = 'Failed to load bookings';
      
      if (err.response?.status === 401) {
        errorMessage = 'Your session has expired. Please login again.';
        router.push('/login');
      } else if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to view bookings.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Bookings endpoint not found. Server may be offline.';
      } else if (err.message?.includes('Network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      setBookings([]);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) { 
      router.push('/login'); 
      return; 
    }
    fetchBookings();
  }, [isAuthenticated]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchBookings();
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingsApi.cancel(id);
      toast.success('Booking cancelled');
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'cancelled' } : b));
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to cancel booking';
      console.error('[BOOKINGS PAGE] Cancel error', { errorMsg, status: err.response?.status });
      toast.error(errorMsg);
    }
  };

  if (loading) return <LoadingSpinner fullPage text="Loading your bookings..." />;

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title">
          {user?.role === 'admin' ? 'All Bookings' : 'My Bookings'}
        </h1>
        <p className="text-gray-500 mt-1">
          {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* ✅ Error state UI */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-red-800 dark:text-red-200">{error}</p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              Check browser console for detailed error logs. Network: {navigator.onLine ? 'Online ✓' : 'Offline ✗'}
            </p>
          </div>
          <button
            onClick={handleRetry}
            className="flex-shrink-0 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium flex items-center gap-1"
          >
            <RotateCw size={14} /> Retry
          </button>
        </div>
      )}

      {bookings.length === 0 && !error ? (
        <div className="text-center py-20">
          <Calendar size={56} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings yet</h3>
          <p className="text-gray-400 text-sm mb-6">Start by browsing our available cars</p>
          <button onClick={() => router.push('/cars')} className="btn-primary" id="browse-cars-from-bookings-btn">
            Browse Cars
          </button>
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const status = statusConfig[booking.status] || statusConfig.confirmed;
            const StatusIcon = status.icon;
            const days = Math.ceil(
              (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / 86400000
            );

            return (
              <div key={booking.id} className="card-flat p-6 hover:shadow-md transition-shadow duration-200 animate-slide-up" id={`booking-card-${booking.id}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Car size={22} className="text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {booking.car?.brand} {booking.car?.name}
                      </h3>
                      {user?.role === 'admin' && booking.user && (
                        <p className="text-xs text-gray-400">{booking.user.name} · {booking.user.email}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500">
                        <span>{format(new Date(booking.startDate), 'dd MMM yyyy')}</span>
                        <span>→</span>
                        <span>{format(new Date(booking.endDate), 'dd MMM yyyy')}</span>
                        <span className="text-gray-300">·</span>
                        <span>{days} day{days !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    <span className={status.cls}>
                      <StatusIcon size={12} /> {status.label}
                    </span>
                    <p className="font-bold text-gray-900">₹{Number(booking.totalCost).toLocaleString()}</p>
                    {booking.status === 'confirmed' && (
                      <button
                        id={`cancel-booking-btn-${booking.id}`}
                        onClick={() => handleCancel(booking.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Cancel
                      </button>
                    )}
                    {booking.status === 'completed' && booking.car && (
                      <button
                        onClick={() => setReviewCar({ id: booking.car!.id, name: `${booking.car!.brand} ${booking.car!.name}` })}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Leave a Review
                      </button>
                    )}
                    <button
                      onClick={() => router.push(`/bookings/${booking.id}`)}
                      className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 font-semibold underline underline-offset-4"
                    >
                      View Details & Pickup Map
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {reviewCar && (
        <LeaveReviewModal
          carId={reviewCar.id}
          carName={reviewCar.name}
          onClose={() => setReviewCar(null)}
          onSuccess={() => {
            setReviewCar(null);
            fetchBookings();
          }}
        />
      )}
    </div>
  );
}
