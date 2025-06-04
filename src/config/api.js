const API_CONFIG = {
    development: {
      baseURL: 'http://localhost:3001',
      freedomPayURL: 'https://sandbox.freedompay.kg/api',
      freedomPayMerchantId: 'your_sandbox_merchant_id',
      freedomPaySecretKey: 'your_sandbox_secret_key'
    },
    production: {
      baseURL: 'https://api.karakolbus.kg',
      freedomPayURL: 'https://api.freedompay.kg/api',
      freedomPayMerchantId: 'your_production_merchant_id',
      freedomPaySecretKey: 'your_production_secret_key'
    }
  };
  
  const config = API_CONFIG[process.env.NODE_ENV] || API_CONFIG.development;
  
  export default config;