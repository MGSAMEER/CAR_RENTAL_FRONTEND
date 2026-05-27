import { Car, Gauge, Users, Zap, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import type { Car as CarType } from '@/lib/types';
import StarRating from '../ui/StarRating';

interface CarCardProps {
  car: CarType;
}

const typeColors: Record<string, string> = {
  sedan:     'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  suv:       'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  hatchback: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  luxury:    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  electric:  'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
};

export default function CarCard({ car }: CarCardProps) {
  return (
    <div className="card group cursor-pointer animate-slide-up" id={`car-card-${car.id}`}>
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 overflow-hidden">
        {car.imageUrl ? (
          <img
            src={car.imageUrl}
            alt={car.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car size={64} className="text-gray-300 dark:text-slate-600" />
          </div>
        )}
        {/* Availability badge */}
        <div className="absolute top-3 right-3">
          {car.availability ? (
            <span className="badge-available">
              <CheckCircle2 size={12} /> Available
            </span>
          ) : (
            <span className="badge-unavailable">
              <XCircle size={12} /> Unavailable
            </span>
          )}
        </div>
        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${typeColors[car.type] || 'bg-gray-100 text-gray-700'}`}>
            {car.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium uppercase tracking-wide">{car.brand}</p>
            {Number(car.ratingAvg) > 0 && (
              <div className="flex items-center gap-1">
                <StarRating rating={Number(car.ratingAvg)} size={12} />
                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">{Number(car.ratingAvg)}</span>
              </div>
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{car.name}</h3>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 dark:bg-slate-700/40 rounded-lg">
            <Users size={14} className="text-gray-400 dark:text-slate-400" />
            <span className="text-xs text-gray-600 dark:text-slate-300 font-medium">{car.seats} seats</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 dark:bg-slate-700/40 rounded-lg">
            <Gauge size={14} className="text-gray-400 dark:text-slate-400" />
            <span className="text-xs text-gray-600 dark:text-slate-300 font-medium capitalize">{car.transmission}</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 dark:bg-slate-700/40 rounded-lg">
            <Zap size={14} className="text-gray-400 dark:text-slate-400" />
            <span className="text-xs text-gray-600 dark:text-slate-300 font-medium capitalize">{car.fuelType}</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{Number(car.pricePerDay).toLocaleString()}</span>
            <span className="text-gray-400 dark:text-slate-400 text-sm">/day</span>
          </div>
          <Link
            href={`/cars/${car.id}`}
            id={`car-book-btn-${car.id}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              car.availability
                ? 'bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-500 dark:hover:bg-blue-500 active:scale-95'
                : 'bg-gray-100 dark:bg-slate-700/40 text-gray-400 dark:text-slate-500 cursor-not-allowed pointer-events-none'
            }`}
          >
            {car.availability ? 'View Details' : 'Unavailable'}
          </Link>
        </div>
      </div>
    </div>
  );
}
