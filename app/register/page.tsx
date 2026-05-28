'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Car, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { authApi } from '@/lib/services';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ['confirmPassword'],
});
type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await authApi.register({ name: data.name, email: data.email, password: data.password });
      toast.success('Account created! Please sign in.');
      router.push('/login');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 to-white">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Car size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Start renting in minutes</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="register-form">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input id="name" type="text" placeholder="John Doe" {...register('name')}
                  className={`input pl-10 ${errors.name ? 'input-error' : ''}`} />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input id="email" type="email" placeholder="you@example.com" {...register('email')}
                  className={`input pl-10 ${errors.email ? 'input-error' : ''}`} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input id="password" type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" {...register('password')}
                  className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`} />
                <button type="button" id="toggle-pass-btn" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input id="confirmPassword" type={showPass ? 'text' : 'password'} placeholder="Re-enter password" {...register('confirmPassword')}
                  className={`input pl-10 ${errors.confirmPassword ? 'input-error' : ''}`} />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <Button
              id="register-submit-btn"
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              className="py-3"
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link href="/login" id="go-login-link" className="text-primary-600 font-medium hover:underline">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
