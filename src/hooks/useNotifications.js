import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';

export const useNotifications = (bookingHistory = []) => {
  const [permissionStatus, setPermissionStatus] = useState('prompt');

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      initializeNotifications();
    }
  }, []);

  const initializeNotifications = async () => {
    try {
      // Запрос разрешений для локальных уведомлений
      const localPermission = await LocalNotifications.requestPermissions();
      
      // Запрос разрешений для push уведомлений
      const pushPermission = await PushNotifications.requestPermissions();
      
      setPermissionStatus(localPermission.display);

      // Регистрация для push уведомлений
      if (pushPermission.receive === 'granted') {
        PushNotifications.register();
      }

      // Обработчики событий
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value);
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration error: ', error);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push received: ', notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push action performed: ', notification);
      });

    } catch (error) {
      console.error('Notification initialization error:', error);
    }
  };

  // Показать локальное уведомление
  const showLocalNotification = async (title, body, data = {}) => {
    try {
      if (Capacitor.isNativePlatform()) {
        await LocalNotifications.schedule({
          notifications: [
            {
              title,
              body,
              id: Date.now(),
              schedule: { at: new Date(Date.now() + 1000) },
              sound: 'beep.wav',
              attachments: [],
              actionTypeId: '',
              extra: data
            }
          ]
        });
      } else {
        // Для веб используем стандартные уведомления
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, { body, icon: '/logo192.png' });
        }
      }
    } catch (error) {
      console.error('Local notification error:', error);
    }
  };

  // Запланировать уведомление о поездке
  const scheduleBookingReminder = async (booking) => {
    try {
      if (!Capacitor.isNativePlatform()) return;

      const [day, month, year] = booking.date.split('-');
      const [hours, minutes] = booking.departureTime.split(':');
      
      const tripDate = new Date(year, month - 1, day, hours, minutes);
      const reminderDate = new Date(tripDate.getTime() - 2 * 60 * 60 * 1000); // За 2 часа

      if (reminderDate > new Date()) {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: 'Напоминание о поездке',
              body: `Ваша поездка ${booking.from} → ${booking.to} отправляется через 2 часа`,
              id: parseInt(`${booking.id}1`),
              schedule: { at: reminderDate },
              extra: { bookingId: booking.id, type: 'reminder' }
            },
            {
              title: 'Время отправления!',
              body: `Ваша поездка ${booking.from} → ${booking.to} отправляется сейчас`,
              id: parseInt(`${booking.id}2`),
              schedule: { at: tripDate },
              extra: { bookingId: booking.id, type: 'departure' }
            }
          ]
        });
      }
    } catch (error) {
      console.error('Booking reminder error:', error);
    }
  };

  // Отменить уведомления о поездке
  const cancelBookingReminders = async (bookingId) => {
    try {
      if (Capacitor.isNativePlatform()) {
        await LocalNotifications.cancel({
          notifications: [
            { id: parseInt(`${bookingId}1`) },
            { id: parseInt(`${bookingId}2`) }
          ]
        });
      }
    } catch (error) {
      console.error('Cancel booking reminders error:', error);
    }
  };

  return {
    permissionStatus,
    showLocalNotification,
    scheduleBookingReminder,
    cancelBookingReminders
  };
};