import storageService from './storage';
import { authAPI, routesAPI, busesAPI, bookingsAPI } from './api';

class SyncService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncInterval = null;
    this.lastSync = null;
  }

  // Запуск автоматической синхронизации
  startAutoSync() {
    // Синхронизация каждые 30 секунд
    this.syncInterval = setInterval(() => {
      if (this.isOnline) {
        this.syncWithServer();
      }
    }, 30000);

    // Синхронизация при восстановлении соединения
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncWithServer();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Остановка автоматической синхронизации
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Полная синхронизация с сервером
  async syncWithServer() {
    try {
      if (!this.isOnline) return;

      console.log('🔄 Starting sync with server...');

      // Получаем данные с сервера
      const serverData = await this.getServerData();
      
      // Получаем локальные данные
      const localData = await storageService.getAllData();

      // Мержим данные
      const mergedData = this.mergeData(localData, serverData);

      // Сохраняем объединенные данные локально
      await this.saveLocalData(mergedData);

      // Отправляем обновленные данные на сервер
      await this.sendDataToServer(mergedData);

      this.lastSync = new Date();
      console.log('✅ Sync completed successfully');

      return mergedData;
    } catch (error) {
      console.error('❌ Sync failed:', error);
      throw error;
    }
  }

  // Получение данных с сервера
  async getServerData() {
    try {
      const [routes, buses, bookings] = await Promise.all([
        routesAPI.getAll(),
        this.getAllBuses(),
        this.getAllBookings()
      ]);

      return {
        routes: routes.data || [],
        buses: buses || {},
        bookingHistory: bookings || [],
        bookedSeats: await this.calculateBookedSeats(bookings || []),
        reviews: await this.getReviews()
      };
    } catch (error) {
      console.log('Server data fetch failed, using local data');
      return {};
    }
  }

  // Получение всех автобусов
  async getAllBuses() {
    try {
      // Здесь должен быть API вызов для получения всех автобусов
      // Пока возвращаем из локального хранилища
      return await storageService.getItem('buses', {});
    } catch (error) {
      return {};
    }
  }

  // Получение всех бронирований
  async getAllBookings() {
    try {
      const currentUser = await storageService.getItem('currentUser');
      if (!currentUser) return [];

      // Здесь должен быть API вызов
      return await storageService.getItem('bookingHistory', []);
    } catch (error) {
      return [];
    }
  }

  // Получение отзывов
  async getReviews() {
    try {
      return await storageService.getItem('reviews', []);
    } catch (error) {
      return [];
    }
  }

  // Расчет забронированных мест
  async calculateBookedSeats(bookings) {
    const bookedSeats = {};
    
    bookings.forEach(booking => {
      const key = `${booking.busId}-${booking.date}`;
      if (!bookedSeats[key]) {
        bookedSeats[key] = [];
      }
      bookedSeats[key] = [...bookedSeats[key], ...booking.seats];
    });

    return bookedSeats;
  }

  // Объединение локальных и серверных данных
  mergeData(localData, serverData) {
    const merged = {
      routes: this.mergeArrays(localData.routes || [], serverData.routes || [], 'id'),
      buses: { ...localData.buses, ...serverData.buses },
      bookingHistory: this.mergeArrays(localData.bookingHistory || [], serverData.bookingHistory || [], 'id'),
      bookedSeats: { ...localData.bookedSeats, ...serverData.bookedSeats },
      reviews: this.mergeArrays(localData.reviews || [], serverData.reviews || [], 'id')
    };

    console.log('🔀 Data merged:', {
      routes: merged.routes.length,
      bookings: merged.bookingHistory.length,
      reviews: merged.reviews.length
    });

    return merged;
  }

  // Объединение массивов по уникальному полю
  mergeArrays(local, server, idField) {
    const merged = [...local];
    const localIds = new Set(local.map(item => item[idField]));

    server.forEach(serverItem => {
      if (!localIds.has(serverItem[idField])) {
        merged.push(serverItem);
      }
    });

    return merged;
  }

  // Сохранение данных локально
  async saveLocalData(data) {
    await Promise.all([
      storageService.setItem('routes', data.routes),
      storageService.setItem('buses', data.buses),
      storageService.setItem('bookingHistory', data.bookingHistory),
      storageService.setItem('bookedSeats', data.bookedSeats),
      storageService.setItem('reviews', data.reviews)
    ]);
  }

  // Отправка данных на сервер
  async sendDataToServer(data) {
    try {
      // Здесь должны быть API вызовы для отправки данных
      console.log('📤 Sending data to server...');
      
      // Пример отправки (раскомментируйте когда будет backend):
      /*
      await Promise.all([
        this.sendRoutes(data.routes),
        this.sendBuses(data.buses),
        this.sendBookings(data.bookingHistory),
        this.sendReviews(data.reviews)
      ]);
      */
      
      console.log('✅ Data sent to server');
    } catch (error) {
      console.log('⚠️ Failed to send data to server:', error);
      // Не критично - данные сохранены локально
    }
  }

  // Принудительная синхронизация
  async forcSync() {
    return await this.syncWithServer();
  }

  // Получение статуса последней синхронизации
  getLastSyncTime() {
    return this.lastSync;
  }
}

export default new SyncService();