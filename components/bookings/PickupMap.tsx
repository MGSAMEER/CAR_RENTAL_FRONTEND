'use client';

import { MapPin, Phone, Navigation, Clock } from 'lucide-react';

interface PickupMapProps {
  branch: {
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    contactNumber: string;
  };
}

export default function PickupMap({ branch }: PickupMapProps) {
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`;
  
  // Using an iframe for embedded Google Map (Embed API doesn't strictly need a key for basic search/place)
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=REPLACE_ME_OR_USE_IFRAME_SEARCH&q=${branch.latitude},${branch.longitude}`;
  
  // For production without a key, we can use the search URL which works in many cases as a fallback or a simpler iframe
  const fallbackEmbedUrl = `https://maps.google.com/maps?q=${branch.latitude},${branch.longitude}&z=15&output=embed`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="h-64 w-full relative">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={fallbackEmbedUrl}
          allowFullScreen
        ></iframe>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{branch.name}</h3>
            <p className="flex items-start gap-2 text-slate-500 dark:text-slate-400 text-sm">
              <MapPin size={16} className="mt-0.5 text-primary-500 flex-shrink-0" />
              <span>{branch.address}, {branch.city}</span>
            </p>
          </div>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
          >
            <Navigation size={14} /> Navigate
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
              <Phone size={18} className="text-primary-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Contact Number</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{branch.contactNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
              <Clock size={18} className="text-primary-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pickup Timing</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">09:00 AM - 08:00 PM</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Pickup Instructions</h4>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4">
            <li>Carry your original Driving License and Aadhaar/Passport.</li>
            <li>Security deposit might be required at the counter.</li>
            <li>Arrive at least 15 minutes before your scheduled pickup time.</li>
            <li>Fuel level will be checked at pickup and should be returned at same level.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
