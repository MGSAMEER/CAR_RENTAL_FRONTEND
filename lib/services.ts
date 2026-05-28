import api from './api';
import type { LoginCredentials, RegisterData, BookingPayload, CarFilters, ApiResponse, User, Car, Booking, Review, Branch } from './types';

// ---- AUTH ----
export const authApi = {
  register: (data: RegisterData) =>
    api.post<ApiResponse<{ userId: string }>>('/auth/register', data),

  login: (data: LoginCredentials) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string; user: User }>>('/auth/login', data),

  googleLogin: (idToken: string) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string; user: User }>>('/auth/google', { idToken }),

  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),

  getMe: () =>
    api.get<ApiResponse<User>>('/auth/me'),

  verifyEmail: (token: string) =>
    api.get<ApiResponse<{ message: string }>>(`/auth/verify-email/${token}`),

  forgotPassword: (data: { email: string }) =>
    api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', data),

  resetPassword: (token: string, data: { password: string }) =>
    api.post<ApiResponse<{ message: string }>>(`/auth/reset-password/${token}`, data),
};

// ---- CARS ----
export const carsApi = {
  getAll: (filters?: CarFilters) =>
    api.get<ApiResponse<Car[]>>('/cars', { params: filters }),

  getById: (id: string) =>
    api.get<ApiResponse<Car>>(`/cars/${id}`),

  create: (data: Partial<Car>) =>
    api.post<ApiResponse<Car>>('/cars', data),

  update: (id: string, data: Partial<Car>) =>
    api.put<ApiResponse<Car>>(`/cars/${id}`, data),

  delete: (id: string) =>
    api.delete(`/cars/${id}`),

  getReviews: (id: string) =>
    api.get<ApiResponse<Review[]>>(`/cars/${id}/reviews`),

  addReview: (id: string, data: { rating: number; comment?: string }) =>
    api.post<ApiResponse<Review>>(`/cars/${id}/reviews`, data),
};

// ---- BOOKINGS ----
export const bookingsApi = {
  create: (data: BookingPayload) =>
    api.post<ApiResponse<Booking>>('/bookings', data),

  getAll: () =>
    api.get<ApiResponse<Booking[]>>('/bookings'),

  getById: (id: string) =>
    api.get<ApiResponse<Booking>>(`/bookings/${id}`),

  cancel: (id: string, reason?: string) =>
    api.patch<ApiResponse<Booking>>(`/bookings/${id}/cancel`, { reason }),

  getBookedDates: (carId: string) =>
    api.get<ApiResponse<{ ranges: { startDate: string, endDate: string }[], individualDates: string[] }>>(`/bookings/car/${carId}/dates`),
};

// ---- PAYMENTS ----
export const paymentsApi = {
  createIntent: (data: { carId: string; startDate: string; endDate: string }) =>
    api.post<ApiResponse<{ clientSecret: string, paymentIntentId: string }>>('/payments/create-intent', data),
};

// ---- USERS ----
export const usersApi = {
  getAll: () =>
    api.get<ApiResponse<User[]>>('/users'),

  getById: (id: string) =>
    api.get<ApiResponse<User>>(`/users/${id}`),

  update: (id: string, data: Partial<User>) =>
    api.put<ApiResponse<User>>(`/users/${id}`, data),

  delete: (id: string) =>
    api.delete(`/users/${id}`),

  getBookings: (id: string) =>
    api.get<ApiResponse<Booking[]>>(`/users/${id}/bookings`),

  uploadLicense: (data: FormData) =>
    api.post<ApiResponse<any>>('/users/upload-license', data, { headers: { 'Content-Type': 'multipart/form-data' } }),

  getVerificationStatus: () =>
    api.get<ApiResponse<any>>('/users/verification-status'),
};

// ---- ADMIN ----
export const adminApi = {
  getStats: () =>
    api.get<ApiResponse<{
      totalRevenue: number; totalBookings: number; activeBookings: number;
      totalUsers: number; totalCars: number; revenueGrowth: number; bookingGrowth: number;
    }>>('/admin/stats'),

  getRevenue: () =>
    api.get<ApiResponse<{ date: string; revenue: number }[]>>('/admin/revenue'),

  getBookingsChart: () =>
    api.get<ApiResponse<{ date: string; bookings: number; cancelled: number }[]>>('/admin/bookings-chart'),

  getTopCars: () =>
    api.get<ApiResponse<{ car: Car; bookingCount: number; totalRevenue: number }[]>>('/admin/top-cars'),

  getPayments: () =>
    api.get<ApiResponse<{
      id: string; totalCost: number; paymentStatus: string | null;
      stripeIntentId: string | null; status: string; createdAt: string;
      car: { name: string; brand: string } | null;
      user: { name: string; email: string } | null;
    }[]>>('/admin/payments'),

  blockUser: (id: string) =>
    api.patch<ApiResponse<User>>(`/users/${id}/block`),

  unblockUser: (id: string) =>
    api.patch<ApiResponse<User>>(`/users/${id}/unblock`),

  getVerifications: () =>
    api.get<ApiResponse<any[]>>('/admin/verifications'),

  verifyUser: (id: string, status: 'approved' | 'rejected') =>
    api.patch<ApiResponse<any>>(`/admin/verify-user/${id}`, { status }),
};

// ---- BRANCHES ----
export const branchesApi = {
  getAll: (params?: { lat?: number; lng?: number }) =>
    api.get<ApiResponse<Branch[]>>('/branches', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Branch>>(`/branches/${id}`),

  getNearestBranch: (lat: number, lng: number) =>
    api.get<ApiResponse<Branch & { distanceKm: number }>>('/branches/nearest', { params: { lat, lng } }),

  create: (data: Omit<Branch, 'id' | 'createdAt' | 'distanceKm' | '_count'>) =>
    api.post<ApiResponse<Branch>>('/branches', data),

  update: (id: string, data: Partial<Branch>) =>
    api.put<ApiResponse<Branch>>(`/branches/${id}`, data),

  delete: (id: string) =>
    api.delete(`/branches/${id}`),
};