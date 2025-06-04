import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const useCapacitor = () => {
  const [isNative, setIsNative] = useState(false);
  const [appState, setAppState] = useState('active');

  useEffect(() => {
    const initializeCapacitor = async () => {
      setIsNative(Capacitor.isNativePlatform());

      if (Capacitor.isNativePlatform()) {
        // Скрыть splash screen
        await SplashScreen.hide();

        // Настроить статус бар
        await StatusBar.setStyle({ style: Style.Dark });

        // Слушать состояние приложения
        App.addListener('appStateChange', ({ isActive }) => {
          setAppState(isActive ? 'active' : 'background');
        });

        // Слушать кнопку "назад" на Android
        App.addListener('backButton', ({ canGoBack }) => {
          if (!canGoBack) {
            App.exitApp();
          } else {
            window.history.back();
          }
        });

        // Обработка клавиатуры
        Keyboard.addListener('keyboardWillShow', (info) => {
          console.log('Keyboard will show with height:', info.keyboardHeight);
        });

        Keyboard.addListener('keyboardWillHide', () => {
          console.log('Keyboard will hide');
        });
      }
    };

    initializeCapacitor();

    // Cleanup
    return () => {
      if (Capacitor.isNativePlatform()) {
        App.removeAllListeners();
        Keyboard.removeAllListeners();
      }
    };
  }, []);

  // Вибрация
  const vibrate = async (style = ImpactStyle.Medium) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style });
      } catch (error) {
        console.error('Haptics error:', error);
      }
    }
  };

  // Скрыть клавиатуру
  const hideKeyboard = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Keyboard.hide();
      } catch (error) {
        console.error('Hide keyboard error:', error);
      }
    }
  };

  // Установить стиль статус бара
  const setStatusBarStyle = async (style = Style.Dark) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.setStyle({ style });
      } catch (error) {
        console.error('Status bar error:', error);
      }
    }
  };

  return {
    isNative,
    appState,
    vibrate,
    hideKeyboard,
    setStatusBarStyle
  };
};