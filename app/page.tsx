'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Car, Shield, Clock, Star, ChevronRight, CheckCircle2 } from 'lucide-react';
import { carsApi } from '@/lib/services';
import CarCard from '@/components/cars/CarCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { Car as CarType } from '@/lib/types';

export default function HomePage() {
  const [featuredCars, setFeaturedCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carsApi.getAll({ available: 'true' })
      .then((res) => setFeaturedCars((res.data.data || []).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
              <Star size={14} className="text-yellow-400" fill="currentColor" />
              <span>Trusted by 500+ customers</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Drive Your Way,{' '}
              <span className="text-primary-200">Every Day</span>
            </h1>

            <p className="text-lg text-primary-100 mb-8 max-w-xl leading-relaxed">
              Browse our premium fleet of cars and book in under 3 minutes. Reliable, affordable, and hassle-free car rentals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/cars"
                id="hero-browse-btn"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-primary-50 active:scale-95 transition-all duration-200 shadow-lg"
              >
                Browse Cars <ChevronRight size={18} />
              </Link>
              <Link
                href="/register"
                id="hero-register-btn"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/20 active:scale-95 transition-all duration-200"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative bg-primary-900/50 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: '50+', label: 'Premium Cars' },
                { value: '500+', label: 'Happy Customers' },
                { value: '< 3 min', label: 'Booking Time' },
                { value: '24/7', label: 'Support' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-primary-200 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CARS */}
      <section className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Available Cars</h2>
            <p className="text-gray-500 mt-1">Choose from our curated fleet of vehicles</p>
          </div>
          <Link href="/cars" id="see-all-cars-link" className="flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700 text-sm">
            See all <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size={32} text="Loading cars..." />
          </div>
        ) : featuredCars.length === 0 ? (
          <div className="text-center py-16">
            <Car size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No cars available right now</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-16">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">How It Works</h2>
            <p className="text-gray-500 mt-2">Book your car in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: Car, title: 'Browse & Choose', desc: 'Browse our fleet and pick the car that fits your needs.' },
              { step: '02', icon: Clock, title: 'Select Dates', desc: 'Choose your pickup and drop-off dates with our easy date picker.' },
              { step: '03', icon: CheckCircle2, title: 'Confirm Booking', desc: 'Confirm your booking instantly and get ready to drive.' },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-colors duration-200">
                  <item.icon size={28} className="text-primary-600" />
                </div>
                <div className="text-xs font-bold text-primary-400 mb-2 tracking-widest">{item.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="section-title mb-4">Why Choose DriveEasy?</h2>
            <div className="space-y-4">
              {[
                { icon: Shield, title: 'Secure Bookings', desc: 'All bookings are encrypted and secure.' },
                { icon: Clock, title: 'Quick & Easy', desc: 'Complete your booking in under 3 minutes.' },
                { icon: Star, title: 'Premium Fleet', desc: 'Handpicked, well-maintained vehicles.' },
                { icon: CheckCircle2, title: 'No Hidden Fees', desc: 'Transparent pricing, no surprises.' },
              ].map((feat) => (
                <div key={feat.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feat.icon size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{feat.title}</h4>
                    <p className="text-gray-500 text-sm">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/register" id="features-cta-btn" className="inline-flex mt-6 btn-primary">
              Start Renting Today
            </Link>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-8 flex items-center justify-center min-h-[300px]">
            <Car size={120} className="text-primary-300" strokeWidth={1} />
          </div>
        </div>
      </section>
    </div>
  );
}
