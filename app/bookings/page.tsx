'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Car, XCircle, CheckCircle2, Clock, AlertCircle, RotateCw } from 'lucide-react';
import { bookingsApi } from '@/lib/services';
import { useAuthStore } from '@/lib/store';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LeaveReviewModal from '@/components/cars/LeaveReviewModal';
import CancelBookingModal from '@/components/bookings/CancelBookingModal';
import type { Booking } from '@/lib/types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const statusConfig = {
  confirmed:  { label: 'Confirmed',  variant: 'confirmed' as const,  icon: CheckCircle2 },
  cancelled:  { label: 'Cancelled',  variant: 'cancelled' as const,  icon: XCircle },
  completed:  { label: 'Completed',  variant: 'completed' as const,  icon: CheckCircle2 },
  active:     { label: 'Active',     variant: 'confirmed' as const,  icon: Clock },
};

export default function BookingsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [reviewCar, setReviewCar] = useState<{ id: string, name: string } | null>(null);
  const [cancelModal, setCancelModal] = useState<{ id: string, carName: string, startDate: string, totalCost: number } | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await bookingsApi.getAll();
      
      const bookingsData = res.data?.data || [];
      if (!Array.isArray(bookingsData)) {
        throw new Error(`Expected array but got ${typeof bookingsData}`);
      }
      
      setBookings(bookingsData);
      setRetryCount(0);
      
    } catch (err: any) {
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

  const handleCancel = async (bookingId: string, reason?: string) => {
    try {
      const res = await bookingsApi.cancel(bookingId, reason);
      const updatedBooking = res.data as unknown as Booking;
      
      if (updatedBooking) {
        setBookings((prev) => prev.map((b) => b.id === bookingId ? updatedBooking : b));
        
        const refundInfo = updatedBooking.refundAmount 
          ? `Refund: ₹${updatedBooking.refundAmount}`
          : 'No refund applicable';
        
        toast.success(`Booking cancelled! ${refundInfo}`, { duration: 6000 });
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to cancel booking';
      toast.error(errorMsg, { duration: 5000 });
      throw err;
    }
  };

  const handleCancelClick = (booking: Booking) => {
    setCancelModal({
      id: booking.id,
      carName: booking.car ? `${booking.car.brand} ${booking.car.name}` : 'Unknown Car',
      startDate: booking.startDate,
      totalCost: booking.totalCost
    });
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

      {/* Error state UI */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-red-800 dark:text-red-200">{error}</p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              Check browser console for detailed error logs. Network: {navigator.onLine ? 'Online ✓' : 'Offline ✗'}
            </p>
          </div>
          <Button onClick={handleRetry} variant="danger" size="sm" icon={<RotateCw size={14} />}>Retry</Button>
        </div>
      )}

      {bookings.length === 0 && !error ? (
        <div className="text-center py-20">
          <Calendar size={56} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings yet</h3>
          <p className="text-gray-400 text-sm mb-6">Start by browsing our available cars</p>
          <Button onClick={() => router.push('/cars')} variant="primary" id="browse-cars-from-bookings-btn">
            Browse Cars
          </Button>
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
              <div key={booking.id} className="card-flat p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 animate-slide-up" id={`booking-card-${booking.id}`}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Car size={22} className="text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {booking.car?.brand} {booking.car?.name}
                      </h3>
                      {user?.role === 'admin' && booking.user && (
                        <p className="text-xs text-gray-400 truncate">{booking.user.name} · {booking.user.email}</p>
                      )}
                      <div className="flex flex-col gap-1 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{format(new Date(booking.startDate), 'dd MMM yyyy')}</span>
                          <span className="text-gray-300">→</span>
                          <span className="font-medium">{format(new Date(booking.endDate), 'dd MMM yyyy')}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {days} day{days !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-gray-700 sm:pl-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <Badge variant={status.variant} size="sm" icon={<StatusIcon size={12} />}>
                        {status.label}
                      </Badge>
                      <p className="font-bold text-gray-900 whitespace-nowrap">₹{Number(booking.totalCost).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      {booking.status === 'confirmed' && (
                        <Button 
                          id={`cancel-booking-btn-${booking.id}`} 
                          onClick={() => handleCancelClick(booking)} 
                          variant="danger" 
                          size="sm"
                        >
                          Cancel
                        </Button>
                      )}
                      {booking.status === 'completed' && booking.car && (
                        <Button onClick={() => setReviewCar({ id: booking.car!.id, name: `${booking.car!.brand} ${booking.car!.name}` })} variant="ghost" size="sm">
                          Leave a Review
                        </Button>
                      )}
                      <Button onClick={() => router.push(`/bookings/${booking.id}`)} variant="outline" size="sm">
                        View Details & Pickup Map
                      </Button>
                    </div>
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

      {cancelModal && (
        <CancelBookingModal
          bookingId={cancelModal.id}
          carName={cancelModal.carName}
          startDate={cancelModal.startDate}
          totalCost={cancelModal.totalCost}
          onCancel={handleCancel}
          onClose={() => setCancelModal(null)}
        />
      )}
    </div>
  );
}