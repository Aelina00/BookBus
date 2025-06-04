import React, { useState, useEffect } from 'react';
import { CreditCard, Shield, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import freedomPayService from '../../services/freedomPay';
import { paymentAPI } from '../../services/api';

const FreedomPayment = ({ 
  bookingData, 
  totalAmount, 
  onPaymentSuccess, 
  onPaymentError, 
  onBack, 
  t 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, error
  const [error, setError] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // Создание платежа
  const createPayment = async () => {
    setIsProcessing(true);
    setError('');
    setPaymentStatus('processing');

    try {
      const orderData = {
        orderId: `booking_${bookingData.id}_${Date.now()}`,
        amount: totalAmount,
        description: `Билет ${bookingData.from} → ${bookingData.to}, ${bookingData.date}`,
        customerPhone: bookingData.phone,
        customerEmail: bookingData.email || '',
        metadata: {
          bookingId: bookingData.id,
          route: `${bookingData.from} → ${bookingData.to}`,
          date: bookingData.date,
          seats: bookingData.seats.join(', '),
          passenger: bookingData.passenger
        }
      };

      // Создаем платеж через FreedomPay
      const paymentResponse = await freedomPayService.createPayment(orderData);
      
      if (paymentResponse.success) {
        setPaymentUrl(paymentResponse.payment_url);
        setTransactionId(paymentResponse.transaction_id);
        
        // Открываем страницу оплаты
        window.open(paymentResponse.payment_url, '_blank');
        
        // Начинаем проверку статуса платежа
        startPaymentStatusCheck(paymentResponse.transaction_id);
      } else {
        throw new Error(paymentResponse.message || 'Ошибка создания платежа');
      }
    } catch (error) {
      console.error('Payment creation error:', error);
      setError(error.message || 'Ошибка при создании платежа');
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Проверка статуса платежа
  const startPaymentStatusCheck = (txId) => {
    const checkStatus = async () => {
      try {
        const statusResponse = await freedomPayService.checkPaymentStatus(txId);
        
        switch (statusResponse.status) {
          case 'SUCCESS':
            setPaymentStatus('success');
            onPaymentSuccess({
              transactionId: txId,
              amount: totalAmount,
              method: 'freedompay'
            });
            break;
          case 'FAILED':
            setPaymentStatus('error');
            setError('Платеж отклонен');
            break;
          case 'PENDING':
            // Продолжаем проверку
            setTimeout(() => checkStatus(), 3000);
            break;
          default:
            setTimeout(() => checkStatus(), 3000);
        }
      } catch (error) {
        console.error('Status check error:', error);
        setTimeout(() => checkStatus(), 5000);
      }
    };

    // Начинаем проверку через 5 секунд
    setTimeout(() => checkStatus(), 5000);
  };

  // Повторная попытка платежа
  const retryPayment = () => {
    setPaymentStatus('idle');
    setError('');
    setPaymentUrl('');
    setTransactionId('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center px-4 py-4">
          <button 
            onClick={onBack} 
            className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Оплата</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Информация о платеже */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Детали платежа</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Маршрут:</span>
              <span className="font-semibold">{bookingData.from} → {bookingData.to}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Дата:</span>
              <span className="font-semibold">{bookingData.date}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Время:</span>
              <span className="font-semibold">{bookingData.departureTime}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Места:</span>
              <span className="font-semibold text-blue-600">{bookingData.seats.join(', ')}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Пассажир:</span>
              <span className="font-semibold">{bookingData.passenger}</span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-lg font-bold text-gray-800">К оплате:</span>
              <span className="text-2xl font-bold text-green-600">{totalAmount} сом</span>
            </div>
          </div>
        </div>

        {/* Статус платежа */}
        {paymentStatus === 'idle' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={32} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Оплата через FreedomPay</h3>
              <p className="text-gray-600 mb-6">
                Безопасная оплата банковской картой через систему FreedomPay
              </p>
              
              <div className="flex items-center justify-center space-x-2 mb-6 text-sm text-gray-500">
                <Shield size={16} />
                <span>Защищенное соединение SSL</span>
              </div>

              <button
                onClick={createPayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg py-4 font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Создание платежа...
                  </div>
                ) : (
                  `Оплатить ${totalAmount} сом`
                )}
              </button>
            </div>
          </div>
        )}

        {paymentStatus === 'processing' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Ожидание оплаты</h3>
              <p className="text-gray-600 mb-4">
                Завершите оплату в открытом окне FreedomPay
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 text-sm">
                  💡 Не закрывайте это окно до завершения оплаты
                </p>
              </div>

              {paymentUrl && (
                <button
                  onClick={() => window.open(paymentUrl, '_blank')}
                  className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors mb-3"
                >
                  Открыть страницу оплаты заново
                </button>
              )}
              
              <button
                onClick={retryPayment}
                className="w-full bg-gray-300 text-gray-700 rounded-lg py-3 font-medium hover:bg-gray-400 transition-colors"
              >
                Отменить платеж
              </button>
            </div>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Оплата успешна!</h3>
              <p className="text-gray-600 mb-4">
                Ваш билет забронирован. Детали отправлены на указанный номер телефона.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 text-sm">
                  ID транзакции: {transactionId}
                </p>
              </div>
            </div>
          </div>
        )}

        {paymentStatus === 'error' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Ошибка оплаты</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              
              <div className="flex space-x-3">
                <button
                  onClick={retryPayment}
                  className="flex-1 bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors"
                >
                  Попробовать снова
                </button>
                <button
                  onClick={onBack}
                  className="flex-1 bg-gray-300 text-gray-700 rounded-lg py-3 font-medium hover:bg-gray-400 transition-colors"
                >
                  Назад
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreedomPayment;