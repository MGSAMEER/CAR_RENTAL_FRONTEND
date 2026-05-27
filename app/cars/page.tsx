'use client';

import { useEffect, useState, useCallback } from 'react';
import { Car } from 'lucide-react';
import { carsApi } from '@/lib/services';
import CarCard from '@/components/cars/CarCard';
import CarFiltersPanel from '@/components/cars/CarFilters';
import LocationFilter from '@/components/cars/LocationFilter';
import CarSkeleton from '@/components/ui/CarSkeleton';
import type { Car as CarType, CarFilters } from '@/lib/types';

export default function CarsPage() {
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CarFilters>({});
  const [selectedCity, setSelectedCity] = useState('');

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const combinedFilters: CarFilters = {
        ...filters,
        ...(selectedCity ? { city: selectedCity } : {}),
      };
      const res = await carsApi.getAll(combinedFilters);
      setCars(res.data.data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [filters, selectedCity]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Browse Cars</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">
          Find the perfect car for your journey
          {selectedCity && (
            <span className="ml-2 text-blue-600 dark:text-blue-400 font-semibold">
              in {selectedCity}
            </span>
          )}
        </p>
      </div>

      {/* Location-based city selector */}
      <LocationFilter selectedCity={selectedCity} onCityChange={setSelectedCity} />

      {/* Standard filters */}
      <CarFiltersPanel filters={filters} onFiltersChange={setFilters} />

      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <CarSkeleton key={n} />
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700">
            <Car size={56} className="text-gray-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-1">
              No cars available{selectedCity ? ` in ${selectedCity}` : ''}
            </h3>
            <p className="text-gray-400 dark:text-slate-500 text-sm mb-4">
              {selectedCity
                ? 'Try selecting a different city or browse all locations.'
                : 'Try adjusting your filters or wait for admins to add vehicles.'}
            </p>
            {selectedCity && (
              <button
                onClick={() => setSelectedCity('')}
                className="btn-secondary text-sm"
              >
                Show All Cities
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
              Showing <span className="font-semibold text-gray-700 dark:text-slate-200">{cars.length}</span>{' '}
              car{cars.length !== 1 ? 's' : ''}
              {selectedCity && (
                <span className="text-blue-600 dark:text-blue-400"> in {selectedCity}</span>
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
