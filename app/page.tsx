'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Car, Shield, Clock, Star, ChevronRight, Calendar, CheckCircle2 } from 'lucide-react';
import { carsApi } from '@/lib/services';
import CarCard from '@/components/cars/CarCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { Car as CarType } from '@/lib/types';

const faqItems = [
  {
    question: 'How do I book a car with DriveEasy?',
    answer:
      'Browse available cars, select your rental dates, and complete payment securely. Start by browsing our available cars.',
    path: '/cars',
    label: 'Browse Cars',
  },
  {
    question: 'What is the cancellation and refund policy?',
    answer:
      'You can review our refund policy before booking to understand the cancellation window and potential fees.',
    path: '/refund-policy',
    label: 'Refund Policy',
  },
  {
    question: 'How do I verify my driving license?',
    answer:
      'Upload your driving license from your profile page. Approved users can book cars immediately after verification.',
    path: '/profile',
    label: 'Complete Profile',
  },
];

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
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
              <Star size={14} className="text-yellow-400" fill="currentColor" />
              <span>Trusted by 500+ customers across India</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Rent Premium Cars{' '}
              <span className="text-primary-200">Instantly</span>
            </h1>

            <p className="text-lg text-primary-100 mb-8 max-w-xl leading-relaxed">
              Book SUVs, sedans & luxury cars in under 3 minutes. Doorstep delivery available. 
              DriveEasy offers affordable self-drive rentals across Mumbai, Delhi, Bangalore & more.
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
            <h2 className="section-title">Available Cars for Rent</h2>
            <p className="text-gray-500 mt-1">Choose from SUVs, sedans, and luxury vehicles - All verified and sanitized</p>
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

      <section className="bg-white py-16">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">How to Book Your Car in 3 Steps</h2>
            <p className="text-gray-500 mt-2">Simple, fast, and secure online car rental</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: Car, title: 'Choose Your Car', desc: 'Select from our premium SUVs, sedans, and luxury cars with verified condition and sanitization.' },
              { step: '02', icon: Calendar, title: 'Pick Dates & Location', desc: 'Choose pickup location and rental dates. Doorstep delivery available in select cities.' },
              { step: '03', icon: CheckCircle2, title: 'Confirm & Drive', desc: 'Complete payment, receive confirmation instantly, and drive away hassle-free.' },
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

      <section className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="section-title mb-4">Why Choose DriveEasy for Car Rental?</h2>
            <div className="space-y-4">
              {[
                { icon: Shield, title: 'Safe & Sanitized Vehicles', desc: 'All cars thoroughly cleaned and sanitized before every rental.' },
                { icon: Clock, title: 'Instant Booking Confirmation', desc: 'Get instant confirmation via email and SMS after booking.' },
                { icon: Star, title: 'Verified Premium Fleet', desc: 'Only well-maintained cars from trusted owners.' },
                { icon: CheckCircle2, title: 'Transparent Pricing', desc: 'No hidden charges or extra fees. Pay exactly what you see.' },
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

      <section className="page-container py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="text-gray-500">Answers to the most common car rental questions from our customers.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {faqItems.map((item) => (
              <div key={item.question} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">{item.question}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{item.answer}</p>
                <Link href={item.path} className="text-primary-600 dark:text-primary-300 font-semibold hover:underline">
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }) }}
      />
    </div>
  );
}