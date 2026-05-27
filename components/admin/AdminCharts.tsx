'use client';

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  growth?: number;
}

export function StatCard({ label, value, icon: Icon, color, growth }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center shadow-sm`}>
          <Icon size={20} className="text-white" />
        </div>
        {growth !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            growth >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {growth >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(growth)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

interface RevenueChartProps {
  data: { date: string; revenue: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const formatted = data.map(d => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
  }));
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
      <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Revenue (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={4} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, 'Revenue']} labelStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface BookingsChartProps {
  data: { date: string; bookings: number; cancelled: number }[];
}

export function BookingsChart({ data }: BookingsChartProps) {
  const formatted = data.map(d => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
  }));
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
      <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Bookings (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={4} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip labelStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="bookings" fill="#3b82f6" radius={[4,4,0,0]} name="Confirmed" />
          <Bar dataKey="cancelled" fill="#f87171" radius={[4,4,0,0]} name="Cancelled" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
