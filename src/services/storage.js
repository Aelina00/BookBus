import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

class StorageService {
  constructor() {
    this.isNative = Capacitor.isNativePlatform();
  }

  async setItem(key, value) {
    try {
      const stringValue = JSON.stringify(value);
      
      if (this.isNative) {
        await Preferences.set({ key, value: stringValue });
      } else {
        localStorage.setItem(key, stringValue);
      }
    } catch (error) {
      console.error('Storage setItem error:', error);
      throw error;
    }
  }

  async getItem(key, defaultValue = null) {
    try {
      let stringValue;
      
      if (this.isNative) {
        const result = await Preferences.get({ key });
        stringValue = result.value;
      } else {
        stringValue = localStorage.getItem(key);
      }

      return stringValue ? JSON.parse(stringValue) : defaultValue;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return defaultValue;
    }
  }

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
}

export default new StorageService();