const ensureApiVersion = (url: string) => {
  const trimmed = url.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api/v1') ? trimmed : `${trimmed}/api/v1`;
};

export const getApiBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl?.trim()) {
    return null;
  }

  return ensureApiVersion(apiUrl);
};

export const missingApiBaseUrlMessage =
  'NEXT_PUBLIC_API_URL is required. Set it to your backend URL, for example https://your-backend.onrender.com/api/v1.';

export const getGoogleClientId = () => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();

  if (!clientId) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. Google login will be disabled.');
    }
    return null;
  }

  return clientId;
};

export const getStripePublishableKey = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();

  if (!publishableKey) {
    return null;
  }

  return publishableKey;
};
