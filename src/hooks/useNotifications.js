import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

export const useNotifications = (bookings = []) => {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      initializePushNotifications();
      scheduleLocalNotifications(bookings);
    }
  }, [bookings]);

  const initializePushNotifications = async () => {
    try {
      // Запрос разрешений
      const permission = await PushNotifications.requestPermissions();
      
      if (permission.receive === 'granted') {
        await PushNotifications.register();
      }

      // Обработчики событий
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value);
        // Отправить токен на сервер
        sendTokenToServer(token.value);
      });

      PushNotifications.addListener('registrationError', (err) => {
        console.error('Registration error: ', err.error);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received: ', notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed', notification.actionId, notification.inputValue);
      });

    } catch (error) {
      console.error('Push notification setup error:', error);
    }
  };

  const scheduleLocalNotifications = async (bookings) => {
    try {
      // Запрос разрешений для локальных уведомлений
      const permission = await LocalNotifications.requestPermissions();
      
      if (permission.display === 'granted') {
        // Отменяем все предыдущие уведомления
        await LocalNotifications.cancel({ notifications: [] });

        // Планируем уведомления для предстоящих поездок
        const notifications = [];
        
        bookings.forEach((booking, index) => {
          if (booking.status === 'upcoming') {
            const tripDateTime = new Date(`${booking.date.split('-').reverse().join('-')} ${booking.departureTime}`);
            const reminderTime = new Date(tripDateTime.getTime() - 24 * 60 * 60 * 1000); // За 24 часа
            
            if (reminderTime > new Date()) {
              notifications.push({
                id: index + 1,
                title: 'Напоминание о поездке',
                body: `Завтра в ${booking.departureTime} отправление ${booking.from} → ${booking.to}`,
                schedule: { at: reminderTime },
                sound: 'beep.wav',
                attachments: null,
                actionTypeId: '',
                extra: {
                  bookingId: booking.id
                }
              });
            }
          }
        });

        if (notifications.length > 0) {
          await LocalNotifications.schedule({ notifications });
        }
      }
    } catch (error) {
      console.error('Local notification setup error:', error);
    }
  };

  const sendTokenToServer = async (token) => {
    try {
      // Отправляем токен на сервер для push-уведомлений
      await fetch('/api/notifications/register-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ token })
      });
    } catch (error) {
      console.error('Error sending token to server:', error);
    }
  };

  const showLocalNotification = async (title, body) => {
    try {
      await LocalNotifications.schedule({
        notifications: [{
          id: Date.now(),
          title,
          body,
          schedule: { at: new Date(Date.now() + 1000) }, // Через 1 секунду
          sound: 'beep.wav'
        }]
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };

  return {
    showLocalNotification
  };
};