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
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-11 sm:h-11 ${color} rounded-xl flex items-center justify-center shadow-sm`}>
          <Icon size={18} className="text-white sm:size-20" />
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
      <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
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
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
      <h3 className="font-semibold text-slate-800 dark:text-white mb-3 sm:mb-4">Revenue (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={250} minHeight={200}>
        <LineChart data={formatted} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={5} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} width={40} />
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
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
      <h3 className="font-semibold text-slate-800 dark:text-white mb-3 sm:mb-4">Bookings (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={250} minHeight={200}>
        <BarChart data={formatted} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={5} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} width={20} />
          <Tooltip labelStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} verticalAlign="top" height={30} />
          <Bar dataKey="bookings" fill="#3b82f6" radius={[3,3,0,0]} name="Confirmed" />
          <Bar dataKey="cancelled" fill="#f87171" radius={[3,3,0,0]} name="Cancelled" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}