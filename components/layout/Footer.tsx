import Link from 'next/link';
import { Car } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1 flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary/10 p-2 rounded-xl text-primary dark:text-primary-light">
                <Car size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight dark:text-white">
                Drive<span className="text-primary dark:text-primary-light">Easy</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Premium car rental services at your fingertips. Fast, reliable, and hassle-free.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/cars" className="hover:text-primary dark:hover:text-primary-light transition-colors">Browse Cars</Link></li>
              <li><Link href="/profile" className="hover:text-primary dark:hover:text-primary-light transition-colors">My Profile</Link></li>
              <li><Link href="/bookings" className="hover:text-primary dark:hover:text-primary-light transition-colors">My Bookings</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/privacy" className="hover:text-primary dark:hover:text-primary-light transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary dark:hover:text-primary-light transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/refund-policy" className="hover:text-primary dark:hover:text-primary-light transition-colors">Refund & Cancellation Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="mailto:support@driveeasy.com" className="hover:text-primary dark:hover:text-primary-light transition-colors">support@driveeasy.com</a></li>
              <li><a href="tel:+1234567890" className="hover:text-primary dark:hover:text-primary-light transition-colors">+1 (234) 567-890</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 dark:text-slate-400">
          <p>&copy; {currentYear} DriveEasy Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
