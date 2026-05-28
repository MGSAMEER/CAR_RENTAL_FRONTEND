'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import { authApi } from '@/lib/services';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email is required');
      return;
    }
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setSent(true);
      toast.success('Check your email for the reset link');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to send reset email';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 to-white">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-500 mt-1">Enter your email to receive a reset link</p>
        </div>

        <div className="card p-8">
          {sent ? (
            <div className="text-center">
              <Mail size={48} className="text-green-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Check your email for the password reset link. If it doesn&apos;t arrive, check your spam folder.
              </p>
              <Link href="/login" className="text-primary-600 font-medium hover:underline text-sm">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                fullWidth
                isLoading={loading}
                className="py-3"
              >
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center gap-1 text-sm text-primary-600 hover:underline">
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}