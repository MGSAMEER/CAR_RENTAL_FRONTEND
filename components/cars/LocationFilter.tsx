'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, Loader2, X, ChevronDown, Building2 } from 'lucide-react';
import { branchesApi } from '@/lib/services';
import type { Branch } from '@/lib/types';

interface LocationFilterProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}

export default function LocationFilter({ selectedCity, onCityChange }: LocationFilterProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [nearestBranch, setNearestBranch] = useState<(Branch & { distanceKm: number }) | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasLocated, setHasLocated] = useState(false);

  // Fetch all branches on mount
  useEffect(() => {
    branchesApi.getAll().then((res) => setBranches(res.data.data || [])).catch(() => {});
  }, []);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          // Fetch branches sorted by proximity
          const [branchesRes, nearestRes] = await Promise.all([
            branchesApi.getAll({ lat: latitude, lng: longitude }),
            branchesApi.getNearestBranch(latitude, longitude),
          ]);

          setBranches(branchesRes.data.data || []);
          const nearest = nearestRes.data.data;
          if (nearest) {
            setNearestBranch(nearest);
            onCityChange(nearest.city);
          }
          setHasLocated(true);
        } catch {
          setLocError('Failed to fetch nearby branches. Please select a city manually.');
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) setLocError('Location permission denied. Please select a city manually.');
        else setLocError('Could not detect your location. Please select a city manually.');
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, [onCityChange]);

  const uniqueCities = Array.from(new Set(branches.map((b) => b.city))).sort();

  return (
    <div className="relative">
      {/* Location banner */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {!hasLocated ? (
          <button
            id="detect-location-btn"
            onClick={detectLocation}
            disabled={locating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm"
          >
            {locating ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Navigation size={15} />
            )}
            {locating ? 'Detecting...' : 'Detect My Location'}
          </button>
        ) : nearestBranch ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
            <MapPin size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
              Nearest: {nearestBranch.name}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400">
              ({nearestBranch.distanceKm} km away)
            </span>
            <button
              onClick={() => { setHasLocated(false); setNearestBranch(null); onCityChange(''); }}
              className="ml-1 text-emerald-500 hover:text-emerald-700"
            >
              <X size={13} />
            </button>
          </div>
        ) : null}

        {/* City selector dropdown */}
        <div className="relative">
          <button
            id="city-filter-btn"
            onClick={() => setShowDropdown(!showDropdown)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
              selectedCity
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
            }`}
          >
            <Building2 size={14} />
            {selectedCity ? selectedCity : 'All Cities'}
            <ChevronDown size={13} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 min-w-[200px] animate-slide-up overflow-hidden">
              <button
                onClick={() => { onCityChange(''); setShowDropdown(false); }}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${!selectedCity ? 'text-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'text-slate-700 dark:text-slate-200'}`}
              >
                🌐 All Cities
              </button>
              {uniqueCities.map((city) => {
                const branch = branches.find((b) => b.city === city);
                return (
                  <button
                    key={city}
                    id={`city-filter-${city.toLowerCase().replace(/\s/g, '-')}`}
                    onClick={() => { onCityChange(city); setShowDropdown(false); }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 border-t border-slate-50 dark:border-slate-700/50 ${
                      selectedCity === city ? 'text-blue-600 font-semibold bg-blue-50/50 dark:bg-blue-900/20' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="font-medium">{city}</div>
                    {branch && (
                      <div className="text-xs text-slate-400 mt-0.5 truncate">{branch.name}</div>
                    )}
                    {branch?.distanceKm !== undefined && (
                      <div className="text-xs text-emerald-600 mt-0.5">{branch.distanceKm} km away</div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {selectedCity && (
          <button
            onClick={() => onCityChange('')}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium"
          >
            <X size={12} /> Clear city
          </button>
        )}
      </div>

      {locError && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-1">
          <span>⚠️</span> {locError}
        </p>
      )}

      {/* Close dropdown on outside click */}
      {showDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
      )}
    </div>
  );
}
