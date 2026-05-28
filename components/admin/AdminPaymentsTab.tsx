'use client';

import { format } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface Payment {
  id: string; totalCost: number; paymentStatus: string | null;
  stripeIntentId: string | null; status: string; createdAt: string;
  car: { name: string; brand: string } | null;
  user: { name: string; email: string } | null;
}

interface Props { payments: Payment[]; }

function MobilePaymentCard({ payment }: { payment: Payment }) {
  const statusVariant = payment.paymentStatus === 'paid' ? 'available' : 
                       payment.paymentStatus === 'pending' ? 'warning' : 
                       payment.paymentStatus === 'failed' ? 'unavailable' : 'cancelled';
  
  const bookingStatusVariant = payment.status === 'confirmed' || payment.status === 'active' ? 'confirmed' : 
                               payment.status === 'cancelled' ? 'cancelled' : 'completed';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-4 mb-3 last:mb-0">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-slate-900 dark:text-white truncate">{payment.car?.name || '—'}</p>
          <p className="text-sm text-slate-700 dark:text-slate-200">{payment.user?.name}</p>
          <p className="text-xs text-slate-400 truncate">{payment.user?.email}</p>
        </div>
        <div className="text-right shrink-0 ml-2">
          <p className="text-lg font-bold text-slate-800 dark:text-white">₹{Number(payment.totalCost).toLocaleString()}</p>
          <Badge variant={statusVariant} size="sm" className="mt-1">
            {payment.paymentStatus || 'pending'}
          </Badge>
        </div>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Badge variant={bookingStatusVariant} size="sm">
            {payment.status}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          {payment.stripeIntentId ? (
            <a href={`https://dashboard.stripe.com/test/payment_intents/${payment.stripeIntentId}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-500 transition-colors">
              <span className="font-mono">{payment.stripeIntentId.slice(0, 14)}…</span>
              <ExternalLink size={12} />
            </a>
          ) : <span>—</span>}
          <span>{format(new Date(payment.createdAt), 'dd MMM yy')}</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminPaymentsTab({ payments }: Props) {
  const totalCollected = payments.filter(p => p.paymentStatus === 'paid').reduce((s, p) => s + Number(p.totalCost), 0);
  const totalPending = payments.filter(p => p.paymentStatus === 'pending').reduce((s, p) => s + Number(p.totalCost), 0);

  return (
    <div className="animate-slide-up space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
        {[
          { label: 'Total Collected', value: `₹${totalCollected.toLocaleString()}`, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
          { label: 'Pending', value: `₹${totalPending.toLocaleString()}`, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
          { label: 'Total Transactions', value: payments.length.toString(), color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
            <p className={`text-lg font-bold ${s.color.split(' ').slice(2).join(' ')}`}>{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {payments.map(p => (
          <MobilePaymentCard key={p.id} payment={p} />
        ))}
        {payments.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">No payments found</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50">
                {['Car', 'Customer', 'Amount', 'Payment', 'Booking Status', 'Stripe ID', 'Date'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {payments.map(p => {
                const statusVariant = p.paymentStatus === 'paid' ? 'available' : 
                                     p.paymentStatus === 'pending' ? 'warning' : 
                                     p.paymentStatus === 'failed' ? 'unavailable' : 'cancelled';
                const bookingStatusVariant = p.status === 'confirmed' || p.status === 'active' ? 'confirmed' : 
                                            p.status === 'cancelled' ? 'cancelled' : 'completed';
                return (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">{p.car?.name || '—'}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-slate-700 dark:text-slate-200">{p.user?.name}</p>
                      <p className="text-xs text-slate-400">{p.user?.email}</p>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-white">₹{Number(p.totalCost).toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={statusVariant} size="sm">
                        {p.paymentStatus || 'pending'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={bookingStatusVariant} size="sm">
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      {p.stripeIntentId ? (
                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          {p.stripeIntentId.slice(0, 18)}…
                          <a href={`https://dashboard.stripe.com/test/payment_intents/${p.stripeIntentId}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700">
                            <ExternalLink size={11} />
                          </a>
                        </span>
                      ) : <span className="text-xs text-slate-400">—</span>}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {format(new Date(p.createdAt), 'dd MMM yy')}
                    </td>
                  </tr>
                );
              })}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400">No payments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
