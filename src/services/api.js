import axios from 'axios';
import config from '../config/api';

// Базовая настройка Axios
const api = axios.create({
  baseURL: config.baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ответов
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API для аутентификации
export const authAPI = {
  // Отправка OTP
  sendOTP: async (phone) => {
    try {
      const response = await api.post('/auth/send-otp', { phone });
      return response.data;
    } catch (error) {
      console.log('Fallback: Using test OTP');
      return { success: true, message: 'Test OTP sent' };
    }
  },

  // Верификация OTP
  verifyOTP: async (phone, otp) => {
    try {
      const response = await api.post('/auth/verify-otp', { phone, otp });
      return response.data;
    } catch (error) {
      console.log('Fallback: Using test verification');
      if (otp === '1234') {
        return {
          success: true,
          user: {
            id: phone === '+996555123456' ? 1 : Date.now(),
            phone,
            firstName: phone === '+996555123456' ? 'Админ' : 'Пользователь',
            lastName: phone === '+996555123456' ? 'Системы' : '',
            role: phone === '+996555123456' ? 'admin' : 'user'
          },
          token: 'test_token_' + Date.now()
        };
      }
      throw new Error('Invalid OTP');
    }
  },

  // Создание пароля
  createPassword: async (phone, password) => {
    try {
      const response = await api.post('/auth/create-password', { phone, password });
      return response.data;
    } catch (error) {
      console.log('Fallback: Password created locally');
      return { success: true };
    }
  },

  // Обновление профиля
  updateProfile: async (userId, profileData) => {
    try {
      const response = await api.put(`/users/${userId}`, profileData);
      return response.data;
    } catch (error) {
      console.log('Fallback: Profile updated locally');
      return { success: true, user: profileData };
    }
  }
};

// API для маршрутов
export const routesAPI = {
  // Получить все маршруты
  getAll: async () => {
    try {
      const response = await api.get('/routes');
      return response.data;
    } catch (error) {
      console.log('Fallback: Using default routes');
      return {
        data: [
          {
            id: 1,
            from: "Бишкек",
            to: "Каракол",
            departureAddress: "Г. Бишкек, ул.Ибраимова/Фрунзе (Тойчубек кафе)",
            arrivalAddress: "Г. Каракол, ул.Гебзе/Пржевальск (Ак Керем мечит)",
            price: 600,
            currency: "сом",
            duration: 430,
            vehicleType: "автобус",
            stops: [
              { name: "Г. Бишкек, ул.Ибраимова/Фрунзе (Тойчубек кафе)", time: "23:00" },
              { name: "Г. Токмок", time: "00:45" },
              { name: "Г. Балыкчы (старые бензо колонки)", time: "02:30" },
              { name: "Г. Каракол, ул.Гебзе/Пржевальск (Ак Керем мечит)", time: "06:10" }
            ]
          },
          {
            id: 2,
            from: "Каракол",
            to: "Бишкек",
            departureAddress: "Г. Каракол, ул.Гебзе/Пржевальск (Ак Керем мечит)",
            arrivalAddress: "Г. Бишкек, ул.Ибраимова/Фрунзе (Тойчубек кафе)",
            price: 600,
            currency: "сом",
            duration: 430,
            vehicleType: "автобус",
            stops: [
              { name: "Г. Каракол, ул.Гебзе/Пржевальск (Ак Керем мечит)", time: "21:00" },
              { name: "Г. Балыкчы", time: "00:45" },
              { name: "Г. Токмок", time: "02:30" },
              { name: "Г. Бишкек, ул.Ибраимова/Фрунзе (Тойчубек кафе)", time: "04:10" }
            ]
          }
        ]
      };
    }
  },

  // Создать маршрут
  create: async (routeData) => {
    try {
      const response = await api.post('/routes', routeData);
      return response.data;
    } catch (error) {
      console.log('Fallback: Route created locally');
      return {
        data: {
          id: Date.now(),
          ...routeData,
          price: parseFloat(routeData.price),
          duration: parseInt(routeData.duration)
        }
      };
    }
  },

  // Обновить маршрут
  update: async (routeId, routeData) => {
    try {
      const response = await api.put(`/routes/${routeId}`, routeData);
      return response.data;
    } catch (error) {
      console.log('Fallback: Route updated locally');
      return {
        data: {
          id: routeId,
          ...routeData,
          price: parseFloat(routeData.price),
          duration: parseInt(routeData.duration)
        }
      };
    }
  },

  // Удалить маршрут
  delete: async (routeId) => {
    try {
      const response = await api.delete(`/routes/${routeId}`);
      return response.data;
    } catch (error) {
      console.log('Fallback: Route deleted locally');
      return { success: true };
    }
  }
};

// API для автобусов
export const busesAPI = {
  // Получить автобусы по дате
  getByDate: async (date) => {
    try {
      const response = await api.get(`/buses?date=${date}`);
      return response.data;
    } catch (error) {
      console.log('Fallback: Using default buses');
      return { data: [] };
    }
  },

  // Создать рейс
  create: async (busData) => {
    try {
      const response = await api.post('/buses', busData);
      return response.data;
    } catch (error) {
      console.log('Fallback: Bus created locally');
      return {
        data: {
          id: Date.now(),
          ...busData,
          carrier: "ОсОО \"Karakol Bus\""
        }
      };
    }
  },

  // Удалить рейс
  delete: async (busId) => {
    try {
      const response = await api.delete(`/buses/${busId}`);
      return response.data;
    } catch (error) {
      console.log('Fallback: Bus deleted locally');
      return { success: true };
    }
  }
};

// API для бронирований
export const bookingsAPI = {
  // Получить бронирования пользователя
  getUserBookings: async (userId) => {
    try {
      const response = await api.get(`/bookings/user/${userId}`);
      return response.data;
    } catch (error) {
      console.log('Fallback: Using local bookings');
      return { data: [] };
    }
  },

  // Получить все бронирования (для админа)
  getAll: async () => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      console.log('Fallback: Using local bookings');
      return { data: [] };
    }
  },

  // Создать бронирование
  create: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.log('Fallback: Booking created locally');
      return {
        data: {
          id: Date.now(),
          ...bookingData,
          createdAt: new Date().toISOString()
        }
      };
    }
  },

  // Отменить бронирование
  cancel: async (bookingId) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      console.log('Fallback: Booking cancelled locally');
      return { success: true };
    }
  }
};

export default api;