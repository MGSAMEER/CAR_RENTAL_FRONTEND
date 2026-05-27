'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { getGoogleClientId } from '@/lib/env';

const clientId = getGoogleClientId();

export default function GoogleAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!clientId) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
