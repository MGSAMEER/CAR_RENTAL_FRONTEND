'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { CarFilters } from '@/lib/types';

interface CarFiltersProps {
  filters: CarFilters;
  onFiltersChange: (filters: CarFilters) => void;
}

const carTypes = ['All', 'sedan', 'suv', 'hatchback', 'luxury', 'electric'];

export default function CarFiltersPanel({ filters, onFiltersChange }: CarFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof CarFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value === '' ? undefined : value });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-4">
      {/* Search bar + filter toggle */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="car-search-input"
            type="text"
            placeholder="Search by name, brand..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="input pl-10"
          />
        </div>
        <button
          id="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium text-sm transition-all duration-200 ${
            showFilters || hasActiveFilters
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-gray-300 text-gray-600 hover:border-gray-400'
          }`}
        >
          <SlidersHorizontal size={16} />
          Filters
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center">
              {Object.values(filters).filter(Boolean).length}
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            id="clear-filters-btn"
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-all duration-200"
          >
            <X size={15} /> Clear
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="card-flat p-5 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Car Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Car Type</label>
              <div className="flex flex-wrap gap-2">
                {carTypes.map((type) => (
                  <button
                    key={type}
                    id={`filter-type-${type}`}
                    onClick={() => updateFilter('type', type === 'All' ? '' : type)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 capitalize ${
                      (type === 'All' && !filters.type) || filters.type === type
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price (₹/day)</label>
              <input
                id="filter-min-price"
                type="number"
                placeholder="e.g. 1000"
                value={filters.minPrice || ''}
                onChange={(e) => updateFilter('minPrice', e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (₹/day)</label>
              <input
                id="filter-max-price"
                type="number"
                placeholder="e.g. 5000"
                value={filters.maxPrice || ''}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                className="input"
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select
                id="filter-availability"
                value={filters.available || ''}
                onChange={(e) => updateFilter('available', e.target.value)}
                className="input"
              >
                <option value="">All cars</option>
                <option value="true">Available only</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
