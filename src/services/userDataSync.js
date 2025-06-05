import storageService from './storage';

class UserDataSyncService {
  // Синхронизация данных пользователя между устройствами
  async syncUserData(userId) {
    try {
      console.log('🔄 Syncing user data for ID:', userId);

      // Получаем все данные пользователя
      const allBookings = await storageService.getItem('bookingHistory', []);
      const allReviews = await storageService.getItem('reviews', []);
      const phoneHistory = await storageService.getItem('phoneHistory', {});

      // Фильтруем данные для конкретного пользователя
      const userBookings = allBookings.filter(b => b.userId === userId);
      const userReviews = allReviews.filter(r => r.userId === userId);

      // Ищем связанные номера телефонов
      const relatedPhones = this.findRelatedPhones(userId, phoneHistory);

      // Загружаем данные со всех связанных номеров
      const mergedData = await this.mergeDataFromRelatedPhones(
        relatedPhones, 
        allBookings, 
        allReviews
      );

      console.log('📊 Merged user data:', {
        bookings: mergedData.bookings.length,
        reviews: mergedData.reviews.length,
        relatedPhones: relatedPhones.length
      });

      return mergedData;
    } catch (error) {
      console.error('User data sync error:', error);
      return { bookings: [], reviews: [] };
    }
  }

  // Поиск связанных номеров телефонов
  findRelatedPhones(userId, phoneHistory) {
    const relatedPhones = [];

    for (const [phone, history] of Object.entries(phoneHistory)) {
      if (history.userId === userId) {
        relatedPhones.push(phone);
        if (history.previousPhone) {
          relatedPhones.push(history.previousPhone);
        }
      }
    }

    return [...new Set(relatedPhones)]; // Убираем дубликаты
  }

  // Объединение данных с связанных номеров
  async mergeDataFromRelatedPhones(relatedPhones, allBookings, allReviews) {
    const mergedBookings = [];
    const mergedReviews = [];

    // Собираем данные со всех связанных номеров
    for (const phone of relatedPhones) {
      const phoneBookings = allBookings.filter(b => 
        b.phone === phone || 
        b.userPhone === phone
      );
      
      const phoneReviews = allReviews.filter(r => 
        r.userPhone === phone
      );

      mergedBookings.push(...phoneBookings);
      mergedReviews.push(...phoneReviews);
    }

    // Убираем дубликаты по ID
    const uniqueBookings = mergedBookings.filter((booking, index, self) =>
      index === self.findIndex(b => b.id === booking.id)
    );

    const uniqueReviews = mergedReviews.filter((review, index, self) =>
      index === self.findIndex(r => r.id === review.id)
    );

    return {
      bookings: uniqueBookings,
      reviews: uniqueReviews
    };
  }

  // Автоматическая синхронизация при входе
  async autoSyncOnLogin(user) {
    try {
      const syncedData = await this.syncUserData(user.id);
      
      if (syncedData.bookings.length > 0 || syncedData.reviews.length > 0) {
        // Обновляем данные в хранилище
        const currentBookings = await storageService.getItem('bookingHistory', []);
        const currentReviews = await storageService.getItem('reviews', []);

        // Мержим с текущими данными
        const allBookings = [
          ...currentBookings.filter(b => b.userId !== user.id),
          ...syncedData.bookings.map(b => ({ ...b, userId: user.id }))
        ];

        const allReviews = [
          ...currentReviews.filter(r => r.userId !== user.id),
          ...syncedData.reviews.map(r => ({ ...r, userId: user.id }))
        ];

        await storageService.setItem('bookingHistory', allBookings);
        await storageService.setItem('reviews', allReviews);

        console.log('✅ User data auto-synced successfully');
        return { bookings: allBookings, reviews: allReviews };
      }

      return null;
    } catch (error) {
      console.error('Auto sync error:', error);
      return null;
    }
  }
}

export default new UserDataSyncService();