import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

class StorageService {
  constructor() {
    this.isNative = Capacitor.isNativePlatform();
  }

  // Сохранить данные
  async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      
      if (this.isNative) {
        await Preferences.set({ key, value: jsonValue });
      } else {
        localStorage.setItem(key, jsonValue);
      }
    } catch (error) {
      console.error('Storage setItem error:', error);
      throw error;
    }
  }

  // Получить данные
  async getItem(key, defaultValue = null) {
    try {
      let value;
      
      if (this.isNative) {
        const result = await Preferences.get({ key });
        value = result.value;
      } else {
        value = localStorage.getItem(key);
      }
      
      if (value === null) {
        return defaultValue;
      }
      
      return JSON.parse(value);
    } catch (error) {
      console.error('Storage getItem error:', error);
      return defaultValue;
    }
  }

  // Удалить данные
  async removeItem(key) {
    try {
      if (this.isNative) {
        await Preferences.remove({ key });
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Storage removeItem error:', error);
      throw error;
    }
  }

  // Очистить все данные
  async clear() {
    try {
      if (this.isNative) {
        await Preferences.clear();
      } else {
        localStorage.clear();
      }
    } catch (error) {
      console.error('Storage clear error:', error);
      throw error;
    }
  }

  // Получить все ключи
  async keys() {
    try {
      if (this.isNative) {
        const result = await Preferences.keys();
        return result.keys;
      } else {
        return Object.keys(localStorage);
      }
    } catch (error) {
      console.error('Storage keys error:', error);
      return [];
    }
  }

  // Проверить существование ключа
  async hasItem(key) {
    try {
      const value = await this.getItem(key);
      return value !== null;
    } catch (error) {
      console.error('Storage hasItem error:', error);
      return false;
    }
  }

  // Сохранить множественные данные
  async setMultiple(items) {
    try {
      const promises = Object.entries(items).map(([key, value]) =>
        this.setItem(key, value)
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('Storage setMultiple error:', error);
      throw error;
    }
  }

  // Получить множественные данные
  async getMultiple(keys) {
    try {
      const promises = keys.map(async (key) => {
        const value = await this.getItem(key);
        return [key, value];
      });
      const results = await Promise.all(promises);
      return Object.fromEntries(results);
    } catch (error) {
      console.error('Storage getMultiple error:', error);
      return {};
    }
  }
}

export default new StorageService();