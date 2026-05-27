'use client';

import { format } from 'date-fns';
import { ExternalLink } from 'lucide-react';

interface Payment {
  id: string; totalCost: number; paymentStatus: string | null;
  stripeIntentId: string | null; status: string; createdAt: string;
  car: { name: string; brand: string } | null;
  user: { name: string; email: string } | null;
}

interface Props { payments: Payment[]; }

const payStyles: Record<string, string> = {
  paid:    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  failed:  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  refunded:'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400',
};

export default function AdminPaymentsTab({ payments }: Props) {
  const totalCollected = payments.filter(p => p.paymentStatus === 'paid').reduce((s, p) => s + Number(p.totalCost), 0);
  const totalPending = payments.filter(p => p.paymentStatus === 'pending').reduce((s, p) => s + Number(p.totalCost), 0);

  return (
    <div className="animate-slide-up space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Collected', value: `₹${totalCollected.toLocaleString()}`, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
          { label: 'Pending', value: `₹${totalPending.toLocaleString()}`, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
          { label: 'Total Transactions', value: payments.length.toString(), color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
            <p className={`text-xl font-bold ${s.color.split(' ').slice(2).join(' ')}`}>{s.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
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
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">{p.car?.name || '—'}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-slate-700 dark:text-slate-200">{p.user?.name}</p>
                    <p className="text-xs text-slate-400">{p.user?.email}</p>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-white">₹{Number(p.totalCost).toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${payStyles[p.paymentStatus || 'pending'] || payStyles.pending}`}>
                      {p.paymentStatus || 'pending'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                      p.status === 'cancelled' ? 'bg-slate-100 dark:bg-slate-700/50 text-slate-500' :
                      p.status === 'confirmed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    }`}>{p.status}</span>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
