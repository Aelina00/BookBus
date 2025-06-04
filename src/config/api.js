const config = {
    // Backend API
    baseURL: process.env.REACT_APP_API_URL || 'https://api.karakolbus.kg',
    
    // FreedomPay настройки
    freedomPayURL: process.env.REACT_APP_FREEDOMPAY_URL || 'https://api.freedompay.kg',
    freedomPayMerchantId: process.env.REACT_APP_FREEDOMPAY_MERCHANT_ID || 'test_merchant',
    freedomPaySecretKey: process.env.REACT_APP_FREEDOMPAY_SECRET_KEY || 'test_secret_key',
    
    // Уведомления
    vapidPublicKey: process.env.REACT_APP_VAPID_PUBLIC_KEY || '',
    
    // Настройки приложения
    app: {
      name: 'Karakol Bus',
      version: '1.0.0',
      supportPhone: '+996555123456',
      supportEmail: 'support@karakolbus.kg'
    },
  
    // Разработка
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production'
  };
  
  export default config;