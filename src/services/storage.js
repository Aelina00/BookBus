import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

class StorageService {
  constructor() {
    this.isNative = Capacitor.isNativePlatform();
    this.cache = new Map(); // Кеш для быстрого доступа
  }

  async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      
      // Сохраняем в кеш
      this.cache.set(key, value);
      
      if (this.isNative) {
        await Preferences.set({ key, value: jsonValue });
      } else {
        localStorage.setItem(key, jsonValue);
      }
      
      console.log(`✅ Saved ${key}:`, value);
    } catch (error) {
      console.error('Storage setItem error:', error);
    }
  }

  async getItem(key, defaultValue = null) {
    try {
      // Сначала проверяем кеш
      if (this.cache.has(key)) {
        return this.cache.get(key);
      }
      
      let value;
      
      if (this.isNative) {
        const result = await Preferences.get({ key });
        value = result.value;
      } else {
        value = localStorage.getItem(key);
      }
      
      if (value === null || value === undefined) {
        console.log(`📭 ${key} not found, using default:`, defaultValue);
        this.cache.set(key, defaultValue);
        return defaultValue;
      }
      
      const parsed = JSON.parse(value);
      this.cache.set(key, parsed); // Сохраняем в кеш
      console.log(`📦 Loaded ${key}:`, parsed);
      return parsed;
    } catch (error) {
      console.error('Storage getItem error:', error);
      this.cache.set(key, defaultValue);
      return defaultValue;
    }
  }

  async removeItem(key) {
    try {
      this.cache.delete(key);
      
      if (this.isNative) {
        await Preferences.remove({ key });
      } else {
        localStorage.removeItem(key);
      }
      console.log(`🗑️ Removed ${key}`);
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  }

  async clear() {
    try {
      this.cache.clear();
      
      if (this.isNative) {
        await Preferences.clear();
      } else {
        localStorage.clear();
      }
      console.log('🧹 Storage cleared');
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }

  // Синхронизация данных между устройствами
  async syncData(serverData) {
    try {
      for (const [key, data] of Object.entries(serverData)) {
        await this.setItem(key, data);
      }
      console.log('🔄 Data synced from server');
    } catch (error) {
      console.error('Sync error:', error);
    }
  }

  // Получить все данные для отправки на сервер
  async getAllData() {
    try {
      const keys = ['routes', 'buses', 'bookedSeats', 'bookingHistory', 'reviews'];
      const data = {};
      
      for (const key of keys) {
        data[key] = await this.getItem(key, []);
      }
      
      return data;
    } catch (error) {
      console.error('Get all data error:', error);
      return {};
    }
  }
}

export default new StorageService();