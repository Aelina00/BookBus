// Создайте новый файл PaymentForm.js и добавьте следующий компонент:
import React, { useState } from 'react';
import { CreditCard, Check, AlertCircle } from 'lucide-react';

const PaymentForm = ({ t, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [paymentValidation, setPaymentValidation] = useState({
    isValid: false,
    message: '',
    isProcessing: false
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Валидация кредитной карты
  const validateCreditCard = () => {
    // Проверка на заполнение всех полей
    if (!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv || !cardData.cardName) {
      return {
        isValid: false,
        message: t.fillAllFields
      };
    }

    // Валидация номера карты (16 цифр)
    const digitsOnly = cardData.cardNumber.replace(/\s+/g, ''); // Удаляем все пробелы
    if (!/^\d{16}$/.test(digitsOnly)) {
      return {
        isValid: false,
        message: t.invalidCardNumber
      };
    }

    // Валидация даты срока действия (формат MM/YY)
    if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
      return {
        isValid: false,
        message: t.invalidExpiryDate
      };
    }

    // Валидация CVV (3 или 4 цифры)
    if (!/^\d{3,4}$/.test(cardData.cvv)) {
      return {
        isValid: false,
        message: t.invalidCVV
      };
    }

    // Проверка принятия условий
    if (!termsAccepted) {
      return {
        isValid: false,
        message: 'Пожалуйста, примите условия публичной оферты'
      };
    }

    return {
      isValid: true,
      message: t.paymentSuccessful
    };
  };

  // Обработка оплаты
  const processPayment = () => {
    // Валидация перед обработкой
    const validation = validateCreditCard();
    if (!validation.isValid) {
      setPaymentValidation({
        ...validation,
        isProcessing: false
      });
      return;
    }

    // Начинаем обработку
    setPaymentValidation({
      isValid: false,
      message: '',
      isProcessing: true
    });

    // Имитация вызова API для обработки платежа
    setTimeout(() => {
      setPaymentValidation({
        isValid: true,
        message: t.paymentSuccessful,
        isProcessing: false
      });

      // Уведомляем родительский компонент об успешной оплате
      setTimeout(() => {
        onPaymentComplete && onPaymentComplete();
      }, 1000);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <h2 className="font-medium">{t.paymentMethod}</h2>
      
      <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-white">
        <input
          type="radio"
          id="card"
          name="payment"
          checked={paymentMethod === 'card'}
          onChange={() => setPaymentMethod('card')}
          className="mr-3"
        />
        <label htmlFor="card" className="flex items-center">
          <CreditCard className="mr-2" />
          <span>{t.bankCard}</span>
        </label>
      </div>

      {paymentMethod === 'card' && (
        <div className="space-y-4 mt-4">
          <input
            type="text"
            placeholder={t.cardNumber}
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={cardData.cardNumber}
            onChange={(e) => {
              // Форматирование номера карты с пробелами каждые 4 цифры
              const input = e.target.value.replace(/\D/g, '');
              if (input.length <= 16) {  // Ограничиваем 16 цифрами
                const parts = [];
                for (let i = 0; i < input.length; i += 4) {
                  parts.push(input.substring(i, i + 4));
                }
                const formattedValue = parts.join(' ');
                setCardData({ ...cardData, cardNumber: formattedValue });
              }
            }}
            maxLength={19} // 16 цифр + 3 пробела
          />

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder={t.expiryDate}
              className="flex-1 p-3 border border-gray-300 rounded-lg"
              value={cardData.expiryDate}
              onChange={(e) => {
                const input = e.target.value.replace(/\D/g, '');
                if (input.length <= 4) {
                  let formattedValue = input;
                  if (input.length > 2) {
                    formattedValue = input.substring(0, 2) + '/' + input.substring(2);
                  }
                  setCardData({ ...cardData, expiryDate: formattedValue });
                }
              }}
              maxLength={5} // MM/YY
            />
            <input
              type="text"
              placeholder={t.cvv}
              className="flex-1 p-3 border border-gray-300 rounded-lg"
              value={cardData.cvv}
              onChange={(e) => {
                const input = e.target.value.replace(/\D/g, '');
                if (input.length <= 4) {
                  setCardData({ ...cardData, cvv: input });
                }
              }}
              maxLength={4}
            />
          </div>

          <input
            type="text"
            placeholder={t.nameOnCard}
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={cardData.cardName}
            onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
          />
        </div>
      )}

      {paymentValidation.message && (
        <div className={`p-3 rounded-lg ${paymentValidation.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {paymentValidation.isValid ? (
            <div className="flex items-center">
              <Check size={20} className="mr-2" />
              {paymentValidation.message}
            </div>
          ) : (
            <div className="flex items-center">
              <AlertCircle size={20} className="mr-2" />
              {paymentValidation.message}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center p-3 rounded-lg bg-gray-100">
        <input
          type="checkbox"
          id="terms"
          className="mr-3"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          {t.termsAgreement}
        </label>
      </div>

      <button
        className={`mt-4 w-full rounded-lg py-3 font-medium ${
          paymentValidation.isProcessing 
            ? 'bg-gray-400 text-white cursor-not-allowed' 
            : 'bg-blue-600 text-white'
        }`}
        onClick={processPayment}
        disabled={paymentValidation.isProcessing}
      >
        {paymentValidation.isProcessing ? t.processing : `${t.pay}`}
      </button>
    </div>
  );
};

export default PaymentForm;