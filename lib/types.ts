export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;              // Google profile picture URL
  authProvider?: 'local' | 'google';
  isEmailVerified?: boolean;
  createdAt?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  contactNumber: string;
  distanceKm?: number;
  _count?: { cars: number };
  createdAt?: string;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  type: string;
  pricePerDay: number;
  availability: boolean;
  imageUrl?: string;
  description?: string;
  seats: number;
  transmission: string;
  fuelType: string;
  createdAt?: string;
  ratingAvg?: number;
  reviewCount?: number;
  branchId?: string;
  branch?: Branch;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  carId: string;
  userId: string;
  createdAt: string;
  user?: User;
}

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  status: 'confirmed' | 'cancelled' | 'completed' | 'active';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  stripeIntentId?: string;
  createdAt: string;
  car?: Car;
  user?: User;
  days?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
  details?: { field: string; message: string }[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface BookingPayload {
  user_id?: string;
  car_id: string;
  start_date: string;
  end_date: string;
  payment_intent_id: string;
}

export interface CarFilters {
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  available?: string;
  search?: string;
  city?: string;
  branchId?: string;
}
