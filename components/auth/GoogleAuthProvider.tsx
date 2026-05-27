'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { getGoogleClientId } from '@/lib/env';

export default function GoogleAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId = getGoogleClientId();

  // If clientId is missing (e.g., during build-time prerendering on Vercel),
  // we provide a fallback dummy client ID so that the context Provider is always mounted.
  // This satisfies the library constraint and prevents build-time compilation crashes.
  const resolvedClientId = clientId || '1234567890-dummyclientid.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={resolvedClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
