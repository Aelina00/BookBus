import React, { useState, useEffect } from 'react';
import { CreditCard, Shield, AlertCircle, CheckCircle, ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import freedomPayService from '../../services/freedomPay';

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
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Проверка сетевого подключения
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Создание платежа
  const createPayment = async () => {
    if (!isOnline) {
      setError('Для оплаты необходимо подключение к интернету');
      return;
    }

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
        
        // Открываем страницу оплаты в новом окне
        const paymentWindow = window.open(
          paymentResponse.payment_url, 
          'freedompay_payment',
          'width=800,height=600,scrollbars=yes,resizable=yes'
        );
        
        // Начинаем проверку статуса платежа
        startPaymentStatusCheck(paymentResponse.transaction_id, paymentWindow);
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
  const startPaymentStatusCheck = (txId, paymentWindow) => {
    let checkCount = 0;
    const maxChecks = 60; // 5 минут максимум

    const checkStatus = async () => {
      try {
        checkCount++;
        
        // Проверяем, закрыто ли окно оплаты
        if (paymentWindow && paymentWindow.closed) {
          console.log('Payment window closed by user');
          setPaymentStatus('error');
          setError('Оплата отменена пользователем');
          return;
        }

        const statusResponse = await freedomPayService.checkPaymentStatus(txId);
        
        switch (statusResponse.status) {
          case 'SUCCESS':
            if (paymentWindow) paymentWindow.close();
            setPaymentStatus('success');
            onPaymentSuccess({
              transactionId: txId,
              amount: totalAmount,
              method: 'freedompay'
            });
            break;
          case 'FAILED':
            if (paymentWindow) paymentWindow.close();
            setPaymentStatus('error');
            setError('Платеж отклонен банком');
            onPaymentError('Payment failed');
            break;
          case 'PENDING':
            // Продолжаем проверку, если не превышен лимит
            if (checkCount < maxChecks) {
              setTimeout(() => checkStatus(), 5000);
            } else {
              if (paymentWindow) paymentWindow.close();
              setPaymentStatus('error');
              setError('Время ожидания истекло');
            }
            break;
          default:
            if (checkCount < maxChecks) {
              setTimeout(() => checkStatus(), 5000);
            } else {
              if (paymentWindow) paymentWindow.close();
              setPaymentStatus('error');
              setError('Не удалось получить статус платежа');
            }
        }
      } catch (error) {
        console.error('Status check error:', error);
        if (checkCount < maxChecks) {
          setTimeout(() => checkStatus(), 10000); // Увеличиваем интервал при ошибке
        } else {
          if (paymentWindow) paymentWindow.close();
          setPaymentStatus('error');
          setError('Ошибка проверки статуса платежа');
        }
      }
    };

    // Начинаем проверку через 3 секунды
    setTimeout(() => checkStatus(), 3000);
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
          <h1 className="text-xl font-semibold text-gray-800">Оплата через FreedomPay</h1>
          <div className="ml-auto flex items-center">
            {isOnline ? (
              <Wifi size={20} className="text-green-600" />
            ) : (
              <WifiOff size={20} className="text-red-600" />
            )}
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Информация о платеже */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <CreditCard size={20} className="mr-2 text-blue-600" />
            Детали платежа
          </h2>
          
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

        {/* Статус оплаты */}
        {!isOnline && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <WifiOff size={20} className="text-red-600 mr-3" />
              <div>
                <h3 className="font-semibold text-red-800">Нет подключения к интернету</h3>
                <p className="text-red-600 text-sm">Для оплаты необходимо подключение к интернету</p>
              </div>
            </div>
          </div>
        )}

        {paymentStatus === 'idle' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img 
                  src="/freedompay-logo.png" 
                  alt="FreedomPay" 
                  className="w-12 h-12"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <CreditCard size={32} className="text-blue-600" style={{display: 'none'}} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Оплата через FreedomPay</h3>
              <p className="text-gray-600 mb-6">
                Безопасная оплата банковской картой через систему FreedomPay Кыргызстан
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Shield size={16} />
                  <span>SSL защита</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <CheckCircle size={16} />
                  <span>PCI DSS</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">Поддерживаемые карты:</h4>
                <div className="flex justify-center space-x-4">
                  <img src="/visa-logo.png" alt="Visa" className="h-8" onError={(e) => e.target.style.display = 'none'} />
                  <img src="/mastercard-logo.png" alt="MasterCard" className="h-8" onError={(e) => e.target.style.display = 'none'} />
                  <img src="/elcard-logo.png" alt="Elcard" className="h-8" onError={(e) => e.target.style.display = 'none'} />
                </div>
                <p className="text-blue-600 text-sm mt-2">Visa, MasterCard, Элкарт и другие</p>
              </div>

              <button
                onClick={createPayment}
                disabled={isProcessing || !isOnline}
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
                <p className="text-blue-800 text-sm flex items-center justify-center">
                  <Shield size={16} className="mr-2" />
                  Не закрывайте это окно до завершения оплаты
                </p>
              </div>

              <div className="space-y-3">
                {paymentUrl && (
                  <button
                    onClick={() => window.open(paymentUrl, 'freedompay_payment', 'width=800,height=600,scrollbars=yes,resizable=yes')}
                    className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors"
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
                  <strong>ID транзакции:</strong> {transactionId}
                </p>
              </div>

              <div className="text-xs text-gray-500 mb-4">
                Чек об оплате будет отправлен на номер {bookingData.phone}
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
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700 text-sm">
                  Если деньги были списаны с карты, они будут возвращены в течение 3-5 рабочих дней
                </p>
              </div>
              
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