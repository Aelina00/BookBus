import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';

export const useNetwork = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [networkType, setNetworkType] = useState('unknown');

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      initializeNetworkListeners();
    } else {
      // Web fallback
      setIsOnline(navigator.onLine);
      
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const initializeNetworkListeners = async () => {
    try {
      // Получаем текущий статус сети
      const status = await Network.getStatus();
      setIsOnline(status.connected);
      setNetworkType(status.connectionType);

      // Слушаем изменения статуса сети
      Network.addListener('networkStatusChange', (status) => {
        setIsOnline(status.connected);
        setNetworkType(status.connectionType);
      });
    } catch (error) {
      console.error('Network status error:', error);
    }
  };

  return { isOnline, networkType };
};