'use client';

import { useRouter } from 'next/navigation';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/services';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { getGoogleClientId } from '@/lib/env';

interface Props {
  /** Called after successful login — defaults to pushing /cars */
  onSuccess?: () => void;
}

export default function GoogleLoginButton({ onSuccess }: Props) {
  const router = useRouter();
  const { setGoogleUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const clientId = getGoogleClientId();

  if (!clientId) {
    return (
      <div className="w-full space-y-2">
        <button
          disabled
          className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed opacity-60 transition-opacity"
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Coming Soon
          </span>
        </button>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Google authentication will be available soon
        </p>
      </div>
    );
  }

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      toast.error('Google sign-in failed — no credential received.');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Signing in with Google…');

    try {
      // Exchange Google ID token for our own JWT pair
      const res = await authApi.googleLogin(idToken);
      const { accessToken, refreshToken, user } = res.data.data!;

      // Persist to localStorage (same as normal login)
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Hydrate Zustand store
      setGoogleUser(user, accessToken, refreshToken);

      toast.success(`Welcome, ${user.name}! 🎉`, { id: toastId });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/cars');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Google sign-in failed. Please try again.';
      toast.error(msg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    toast.error('Google sign-in was cancelled or failed. Please try again.');
  };

  return (
    <div className="w-full flex justify-center" id="google-signin-button">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        logo_alignment="left"
        width="400"
        useOneTap={false}
        auto_select={false}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-lg z-10">
          <svg
            className="animate-spin h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}
    </div>
  );
}
