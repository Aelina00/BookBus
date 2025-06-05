import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export const useNotifications = (bookingHistory = []) => {
  const [permissionStatus, setPermissionStatus] = useState('prompt');

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      initializeNotifications();
    }
  }, []);

  const initializeNotifications = async () => {
    try {
      // Только локальные уведомления
      const localPermission = await LocalNotifications.requestPermissions();
      setPermissionStatus(localPermission.display);

      // НЕ ИСПОЛЬЗУЕМ PushNotifications - закомментировано
      /*
      const pushPermission = await PushNotifications.requestPermissions();
      if (pushPermission.receive === 'granted') {
        PushNotifications.register();
      }
      */

      console.log('Local notifications initialized');

    } catch (error) {
      console.error('Notification initialization error:', error);
    }
  };

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
              extra: data
            }
          ]
        });
      } else {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, { body, icon: '/logo192.png' });
        }
      }
    } catch (error) {
      console.error('Local notification error:', error);
    }
  };

  const scheduleBookingReminder = async (booking) => {
    try {
      if (!Capacitor.isNativePlatform()) return;

      const [day, month, year] = booking.date.split('-');
      const [hours, minutes] = booking.departureTime.split(':');
      
      const tripDate = new Date(year, month - 1, day, hours, minutes);
      const reminderDate = new Date(tripDate.getTime() - 2 * 60 * 60 * 1000);

      if (reminderDate > new Date()) {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: 'Напоминание о поездке',
              body: `Ваша поездка ${booking.from} → ${booking.to} отправляется через 2 часа`,
              id: parseInt(`${booking.id}1`),
              schedule: { at: reminderDate },
              extra: { bookingId: booking.id, type: 'reminder' }
            }
          ]
        });
      }
    } catch (error) {
      console.error('Booking reminder error:', error);
    }
  };

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