'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Car, Users, Gauge, Zap, Calendar, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { carsApi, bookingsApi, usersApi } from '@/lib/services';
import { useAuthStore } from '@/lib/store';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { Car as CarType } from '@/lib/types';
import PaymentModal from '@/components/payments/PaymentModal';
import ReviewList from '@/components/cars/ReviewList';
import StarRating from '@/components/ui/StarRating';
import { RangeCalendar } from '@/components/ui/calendar-rac';
import { getLocalTimeZone, today as getToday } from "@internationalized/date";
import type { DateRange, DateValue } from "react-aria-components";
import toast from 'react-hot-toast';

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const [car, setCar] = useState<CarType | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ startDate: '', endDate: '' });
  const [showPayment, setShowPayment] = useState(false);
  const [bookedDates, setBookedDates] = useState<string[]>([]);

  // Calendar State
  const now = getToday(getLocalTimeZone());
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      carsApi.getById(id),
      bookingsApi.getBookedDates(id)
    ])
      .then(([carRes, datesRes]) => {
        setCar(carRes.data.data ?? null);
        setBookedDates(datesRes.data.data?.individualDates || []);
      })
      .catch(() => toast.error('Failed to load car details'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (selectedRange?.start && selectedRange?.end) {
      setBooking({
        startDate: selectedRange.start.toString(),
        endDate: selectedRange.end.toString()
      });
    }
  }, [selectedRange]);

  const totalDays = (booking.startDate && booking.endDate)
    ? Math.max(0, Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / 86400000) + 1)
    : 0;
  const totalCost = car ? totalDays * Number(car.pricePerDay) : 0;

  const isDateUnavailable = (date: DateValue) => {
    const dateStr = date.toString(); // YYYY-MM-DD
    return bookedDates.includes(dateStr);
  };

  const handleBookClick = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a car');
      router.push('/login');
      return;
    }
    if (!booking.startDate || !booking.endDate) {
      toast.error('Please select both dates');
      return;
    }
    if (totalDays <= 0) {
      toast.error('End date must be after start date');
      return;
    }

    // Double-check overlap on client side for safety
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const isOverlap = bookedDates.some(dateStr => {
      const d = new Date(dateStr);
      // Normalize dates to same time for comparison
      d.setHours(0, 0, 0, 0);
      const s = new Date(start); s.setHours(0, 0, 0, 0);
      const e = new Date(end); e.setHours(0, 0, 0, 0);
      return d >= s && d <= e;
    });

    if (isOverlap) {
      toast.error('The selected range includes already booked dates');
      return;
    }

    try {
      const verifRes = await usersApi.getVerificationStatus();
      if (!verifRes.data.data || verifRes.data.data.verificationStatus !== 'approved') {
        toast.error('Please upload your driving license in your profile to continue booking.', { duration: 5000 });
        router.push('/profile');
        return;
      }
      setShowPayment(true);
    } catch {
      toast.error('Error checking verification status');
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    const payload = {
      user_id: user?.id,
      car_id: id as string,
      start_date: booking.startDate,
      end_date: booking.endDate,
      payment_intent_id: paymentIntentId
    };

    console.log('[DEBUG] Sending snake_case booking payload:', payload);

    try {
      await bookingsApi.create(payload as any);
      toast.success('🎉 Booking confirmed successfully!');
      router.push('/bookings');
    } catch (err: any) {
      console.error('[DEBUG] Booking API failed:', err.response?.data);
      toast.error(err.response?.data?.message || 'Failed to finalize booking.');
    }
  };

  if (loading) return <LoadingSpinner fullPage text="Loading car details..." />;
  if (!car) return (
    <div className="page-container text-center py-20">
      <p className="text-slate-500 dark:text-slate-400">Car not found</p>
      <button onClick={() => router.back()} className="btn-secondary mt-4">Go Back</button>
    </div>
  );

  return (
    <div className="page-container animate-fade-in">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-6 transition-colors" id="back-btn">
        <ArrowLeft size={18} /> Back to Cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Car Image & Info */}
        <div>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-900 h-72 mb-6">
            {car.imageUrl ? (
              <img src={car.imageUrl} alt={car.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car size={100} className="text-slate-300 dark:text-slate-700" strokeWidth={1.5} />
              </div>
            )}
            <div className="absolute top-4 right-4">
              {car.availability
                ? <span className="badge-available"><CheckCircle2 size={13} /> Available</span>
                : <span className="badge-unavailable"><XCircle size={13} /> Unavailable</span>
              }
            </div>
          </div>

          <div className="card-flat p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm text-primary-600 font-semibold uppercase tracking-wide mb-1">{car.brand}</p>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{car.name}</h1>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end text-sm font-medium">
                  <StarRating rating={Number(car.ratingAvg) || 0} size={16} />
                  <span>{Number(car.ratingAvg) || 0}</span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">({car.reviewCount || 0} reviews)</p>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed mt-4">{car.description || 'A great car for all your journeys.'}</p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Users, label: 'Seats', value: `${car.seats} seats` },
                { icon: Gauge, label: 'Transmission', value: car.transmission },
                { icon: Zap, label: 'Fuel', value: car.fuelType },
              ].map((spec) => (
                <div key={spec.label} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center border border-transparent dark:border-slate-700/50">
                  <spec.icon size={20} className="text-primary-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">{spec.label}</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 capitalize mt-0.5">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Panel */}
        <div>
          <div className="card p-6 sticky top-24">
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-primary-600">₹{Number(car.pricePerDay).toLocaleString()}</span>
              <span className="text-slate-400 dark:text-slate-500">/day</span>
            </div>

            <div className="mb-6 flex justify-center">
              <div className="w-full">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  <Calendar size={14} className="inline mr-1" /> Select Rental Dates
                </label>
                <div className="p-2 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center">
                  <RangeCalendar
                    className="bg-transparent"
                    minValue={now}
                    value={selectedRange}
                    onChange={(val) => setSelectedRange(val || undefined)}
                    isDateUnavailable={isDateUnavailable}
                  />
                  <div className="flex gap-4 mt-2 text-[10px] uppercase tracking-wider font-bold">
                    <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-primary-600"></div>
                      <span className="text-slate-500">Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-red-500"></div>
                      <span className="text-slate-500">Booked</span>
                    </div>
                  </div>
                </div>

                {selectedRange?.start && selectedRange?.end && (
                  <div className="flex justify-between mt-3 px-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span>Pickup: {selectedRange.start.toString()}</span>
                    <span>Return: {selectedRange.end.toString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price summary */}
            {totalDays > 0 && (
              <div className="bg-primary-50 rounded-xl p-4 mb-6 animate-slide-up">
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                  <span>₹{Number(car.pricePerDay).toLocaleString()} × {totalDays} day{totalDays > 1 ? 's' : ''}</span>
                  <span className="font-medium">₹{totalCost.toLocaleString()}</span>
                </div>
                <div className="border-t border-primary-200 dark:border-primary-900/50 pt-2 flex justify-between font-bold text-slate-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-primary-700">₹{totalCost.toLocaleString()}</span>
                </div>
              </div>
            )}

            <button
              id="confirm-booking-btn"
              onClick={handleBookClick}
              disabled={!car.availability}
              className="btn-primary w-full py-3 text-base"
            >
              {car.availability ? '🚗 Book Now' : 'Not Available'}
            </button>

            {!isAuthenticated && (
              <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-3">
                <a href="/login" className="text-primary-600 font-medium hover:underline">Sign in</a>{' '}to book
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 card-flat p-6 lg:p-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Customer Reviews</h2>
        <ReviewList carId={car.id} />
      </div>

      {showPayment && (
        <PaymentModal
          carId={id as string}
          startDate={booking.startDate}
          endDate={booking.endDate}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
