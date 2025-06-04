import axios from 'axios';
import config from '../config/api';

const api = axios.create({
  baseURL: config.baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptors для обработки токенов
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  sendOTP: (phone) => api.post('/auth/send-otp', { phone }),
  verifyOTP: (phone, otp) => api.post('/auth/verify-otp', { phone, otp }),
  resetPassword: (phone, newPassword, otp) => api.post('/auth/reset-password', { phone, newPassword, otp }),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken })
};

// Routes API
export const routesAPI = {
  getAll: () => api.get('/routes'),
  create: (routeData) => api.post('/routes', routeData),
  update: (id, routeData) => api.put(`/routes/${id}`, routeData),
  delete: (id) => api.delete(`/routes/${id}`)
};

// Buses API
export const busesAPI = {
  getByDate: (date) => api.get(`/buses?date=${date}`),
  getByRoute: (routeId, date) => api.get(`/buses?routeId=${routeId}&date=${date}`),
  create: (busData) => api.post('/buses', busData),
  update: (id, busData) => api.put(`/buses/${id}`, busData),
  delete: (id) => api.delete(`/buses/${id}`)
};

// Bookings API
export const bookingsAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getUserBookings: (userId) => api.get(`/bookings/user/${userId}`),
  getAll: () => api.get('/bookings'),
  cancel: (bookingId) => api.put(`/bookings/${bookingId}/cancel`)
};

// Payment API
export const paymentAPI = {
  createFreedomPayPayment: (paymentData) => api.post('/payments/freedompay/create', paymentData),
  verifyPayment: (paymentId) => api.get(`/payments/verify/${paymentId}`)
};

export default api;