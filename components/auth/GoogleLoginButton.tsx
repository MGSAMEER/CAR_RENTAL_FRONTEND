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
      <div className="w-full text-center p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <p className="text-xs text-slate-500 font-medium">
          Google Login is currently disabled (missing Client ID).
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
