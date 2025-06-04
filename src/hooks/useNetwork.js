import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';

export const useNetwork = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    const handleStatusChange = (status) => {
      setIsOnline(status.connected);
      setConnectionType(status.connectionType);
    };

    if (Capacitor.isNativePlatform()) {
      // Для нативных платформ используем Capacitor Network
      Network.addListener('networkStatusChange', handleStatusChange);
      
      // Получаем текущий статус
      Network.getStatus().then(handleStatusChange);

      return () => {
        Network.removeAllListeners();
      };
    } else {
      // Для веб используем стандартные события
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

  return { isOnline, connectionType };
};