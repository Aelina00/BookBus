import axios from 'axios';
import config from '../config/api';
import CryptoJS from 'crypto-js';
class FreedomPayService {
  constructor() {
    this.merchantId = config.freedomPayMerchantId;
    this.secretKey = config.freedomPaySecretKey;
    this.baseURL = config.freedomPayURL;
  }

  // Создание подписи для запроса
  createSignature(data) {
    const sortedKeys = Object.keys(data).sort();
    const signString = sortedKeys.map(key => `${key}=${data[key]}`).join('&');
    return this.hashHmacSha256(signString, this.secretKey);
  }

  // HMAC SHA256 хеширование
  hashHmacSha256(data, key) {
    return CryptoJS.HmacSHA256(data, key).toString();
  }
  // Создание платежа
  async createPayment(orderData) {
    const paymentData = {
      merchant_id: this.merchantId,
      amount: Math.round(orderData.amount * 100), // В тыйынах
      currency: 'KGS',
      order_id: orderData.orderId,
      description: orderData.description,
      return_url: `${window.location.origin}/payment/success`,
      cancel_url: `${window.location.origin}/payment/cancel`,
      callback_url: `${config.baseURL}/payments/freedompay/callback`,
      customer_phone: orderData.customerPhone,
      customer_email: orderData.customerEmail || '',
      timestamp: Date.now()
    };

    paymentData.signature = this.createSignature(paymentData);

    try {
      const response = await axios.post(`${this.baseURL}/payment/create`, paymentData);
      return response.data;
    } catch (error) {
      console.error('FreedomPay payment creation error:', error);
      throw new Error('Ошибка создания платежа');
    }
  }

  // Проверка статуса платежа
  async checkPaymentStatus(transactionId) {
    const data = {
      merchant_id: this.merchantId,
      transaction_id: transactionId,
      timestamp: Date.now()
    };

    data.signature = this.createSignature(data);

    try {
      const response = await axios.post(`${this.baseURL}/payment/status`, data);
      return response.data;
    } catch (error) {
      console.error('FreedomPay status check error:', error);
      throw new Error('Ошибка проверки статуса платежа');
    }
  }

  // Возврат платежа
  async refundPayment(transactionId, amount) {
    const data = {
      merchant_id: this.merchantId,
      transaction_id: transactionId,
      amount: Math.round(amount * 100),
      timestamp: Date.now()
    };

    data.signature = this.createSignature(data);

    try {
      const response = await axios.post(`${this.baseURL}/payment/refund`, data);
      return response.data;
    } catch (error) {
      console.error('FreedomPay refund error:', error);
      throw new Error('Ошибка возврата платежа');
    }
  }
}

export default new FreedomPayService();