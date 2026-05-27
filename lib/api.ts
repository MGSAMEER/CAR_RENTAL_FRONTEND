import axios from 'axios';
import { getApiBaseUrl, missingApiBaseUrlMessage } from './env';

const API_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_URL ?? undefined,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (!API_URL) {
    return Promise.reject(new Error(missingApiBaseUrlMessage));
  }

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  if (config.url?.includes('booking')) {
    console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`, {
      hasToken: !!config.headers.Authorization,
      timestamp: new Date().toISOString(),
    });
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.config.url?.includes('booking')) {
      console.log(`[API RESPONSE] ${response.status} ${response.config.url}`, {
        dataLength: Array.isArray(response.data?.data) ? response.data.data.length : 'not-array',
        success: response.data?.success,
        timestamp: new Date().toISOString(),
      });
    }
    return response;
  },
  async (error) => {
    const original = error.config;

    if (original?.url?.includes('booking')) {
      console.error(`[API ERROR] ${error.response?.status} ${original?.url}`, {
        message: error.message,
        errorCode: error.response?.data?.error,
        errorMessage: error.response?.data?.message,
        timestamp: new Date().toISOString(),
      });
    }

    const isAuthRoute =
      original?.url?.includes('/auth/login') ||
      original?.url?.includes('/auth/google') ||
      original?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !original._retry && !isAuthRoute) {
      original._retry = true;
      try {
        console.log('[API] Token expired, attempting refresh...');
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken && API_URL) {
          const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          const { accessToken, refreshToken: newRefresh } = res.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefresh);
          original.headers.Authorization = `Bearer ${accessToken}`;
          console.log('[API] Token refreshed successfully, retrying request...');
          return api(original);
        }
      } catch (refreshError) {
        console.error('[API] Token refresh failed, redirecting to login');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
