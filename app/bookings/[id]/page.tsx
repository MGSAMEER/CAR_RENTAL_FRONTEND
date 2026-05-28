'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Car, CreditCard, User, Clock, AlertCircle } from 'lucide-react';
import { bookingsApi } from '@/lib/services';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PickupMap from '@/components/bookings/PickupMap';
import type { Booking } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingsApi.getById(id)
      .then((res) => setBooking(res.data.data || null))
      .catch(() => {
        toast.error('Booking not found');
        router.push('/bookings');
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <LoadingSpinner fullPage text="Loading booking details..." />;
  if (!booking) return null;

  // Safe days calculation
  const days = booking.startDate && booking.endDate 
    ? Math.max(1, Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / 86400000) + 1)
    : 0;

  // Safe date check
  const hasValidDates = booking.startDate && booking.endDate && 
    !isNaN(new Date(booking.startDate).getTime()) && !isNaN(new Date(booking.endDate).getTime());

  return (
    <div className="page-container animate-fade-in pb-20">
      <button onClick={() => router.push('/bookings')} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-8 transition-colors">
        <ArrowLeft size={18} /> Back to My Bookings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Booking Status Header */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-1">Booking Confirmed</p>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">#{booking.id?.slice(0, 8).toUpperCase() || 'N/A'}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Booked on {formatDate(booking.createdAt, 'Unknown date')}
                </p>
              </div>
              <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 px-6 py-3 rounded-2xl border border-green-100 dark:border-green-900/30">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="font-bold text-green-700 dark:text-green-400 capitalize">{booking.status || 'unknown'}</span>
              </div>
            </div>
          </div>

          {/* Car & Dates Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                   <Car size={20} className="text-primary-500" /> Vehicle Information
                </h2>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0">
                    {booking.car?.imageUrl ? (
                      <img src={booking.car.imageUrl} alt={booking.car.name || 'Car'} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car size={32} className="text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-primary-600 font-bold uppercase tracking-wide">{booking.car?.brand || 'Unknown'}</p>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{booking.car?.name || 'Unknown Vehicle'}</h3>
                    <p className="text-xs text-slate-500 mt-1 capitalize">{booking.car?.transmission} · {booking.car?.fuelType}</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                   <Calendar size={20} className="text-primary-500" /> Rental Schedule
                </h2>
                {hasValidDates ? (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Pickup Date</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          {formatDate(booking.startDate)}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">From 09:00 AM</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Return Date</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          {formatDate(booking.endDate)}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">By 08:00 PM</p>
                      </div>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-full text-xs font-bold">
                       <Clock size={12} /> Duration: {days} {days === 1 ? 'Day' : 'Days'}
                    </div>
                  </>
                ) : (
                  <div className="text-amber-600 dark:text-amber-400">
                    Dates unavailable - booking may have been modified
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pickup Map & Instructions */}
          {booking.car?.branch ? (
            <PickupMap branch={booking.car.branch} />
          ) : (
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-3xl p-8 border border-amber-100 dark:border-amber-900/30 flex items-start gap-4">
               <AlertCircle className="text-amber-600 flex-shrink-0" size={24} />
               <div>
                 <h3 className="text-lg font-bold text-amber-900 dark:text-amber-400">Pickup Location Pending</h3>
                 <p className="text-amber-700 dark:text-amber-500/80 mt-1">We are finalizing the pickup branch for your vehicle. Our team will update the location shortly. Please check back later or contact support.</p>
               </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-primary-400" /> Payment Details
             </h2>
             <div className="space-y-4">
                <div className="flex justify-between text-slate-400 text-sm">
                   <span>Daily Rate</span>
                   <span>₹{Number(booking.car?.pricePerDay || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                   <span>Duration</span>
                   <span>{days > 0 ? `${days} Day${days !== 1 ? 's' : ''}` : 'N/A'}</span>
                </div>
                <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline">
                   <span className="font-bold text-lg">Total Paid</span>
                   <span className="text-2xl font-bold text-primary-400">₹{Number(booking.totalCost || 0).toLocaleString()}</span>
                </div>
                <div className="mt-6 flex items-center gap-2 justify-center bg-white/5 py-2 rounded-xl border border-white/10 text-xs text-slate-400">
                   <div className="w-2 h-2 bg-green-500 rounded-full" />
                   Payment Successful (Stripe)
                </div>
             </div>
          </div>

          {/* User Info */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <User size={20} className="text-primary-500" /> Renter Information
             </h2>
             <div className="space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">{booking.user?.name || '—'}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{booking.user?.email || '—'}</p>
             </div>
             <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs text-slate-500">
               This booking is non-transferable. Please ensure the renter name matches your Driving License.
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}