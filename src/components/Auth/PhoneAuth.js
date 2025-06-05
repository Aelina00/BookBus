import React, { useState, useEffect } from 'react';
import { Phone, Lock, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import storageService from '../../services/storage';

const PhoneAuth = ({ onAuthSuccess }) => {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState([]);

  // Загружаем зарегистрированных пользователей при запуске
  useEffect(() => {
    loadRegisteredUsers();
  }, []);

  const loadRegisteredUsers = async () => {
    try {
      const users = await storageService.getItem('registeredUsers', []);
      setRegisteredUsers(users);
      console.log('📱 Loaded registered users:', users.length);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  // Форматирование номера телефона
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.startsWith('996')) {
      return '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
      return '+996' + cleaned.substring(1);
    } else if (cleaned.length <= 9) {
      return '+996' + cleaned;
    }
    
    return '+' + cleaned;
  };

  // Валидация номера телефона
  const isValidPhone = (phone) => {
    const phoneRegex = /^\+996[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  // Проверка, зарегистрирован ли пользователь
  const isUserRegistered = (phone) => {
    return registeredUsers.some(user => user.phone === phone);
  };

  // Отправка OTP
  const sendOTP = async () => {
    if (!isValidPhone(phone)) {
      setError('Введите корректный номер телефона');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log(`📨 Sending OTP to ${phone}`);
      
      setTimeout(() => {
        setStep('otp');
        setIsLoading(false);
        console.log(`✅ OTP sent to ${phone}. Test code: 1234`);
      }, 1000);
    } catch (error) {
      setError('Ошибка отправки SMS');
      setIsLoading(false);
    }
  };

  // Проверка OTP
  const verifyOTP = async () => {
    if (otp.length !== 4) {
      setError('Введите 4-значный код');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      setTimeout(async () => {
        if (otp === '1234') {
          // Проверяем, зарегистрирован ли пользователь
          const existingUser = registeredUsers.find(user => user.phone === phone);
          
          if (existingUser) {
            console.log('✅ Existing user found:', existingUser);
            // Пользователь уже зарегистрирован - входим
            await onAuthSuccess(existingUser);
          } else {
            console.log('🆕 New user, creating account');
            // Новый пользователь - переходим к созданию пароля
            if (phone === '+996555123456') {
              // Админ - сразу входим
              const adminUser = {
                id: 1,
                phone: phone,
                firstName: 'Админ',
                lastName: 'Системы',
                role: 'admin',
                createdAt: new Date().toISOString()
              };
              
              // Сохраняем админа в зарегистрированных пользователях
              const updatedUsers = [...registeredUsers, adminUser];
              await storageService.setItem('registeredUsers', updatedUsers);
              
              await onAuthSuccess(adminUser);
            } else {
              // Обычный пользователь - создаем пароль
              setStep('create-password');
            }
          }
        } else {
          setError('Неверный код');
        }
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setError('Ошибка проверки кода');
      setIsLoading(false);
    }
  };

  // Создание нового пользователя
  const createPassword = async () => {
    if (newPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      setTimeout(async () => {
        const newUser = {
          id: Date.now(),
          phone: phone,
          firstName: 'Пользователь',
          lastName: '',
          role: 'user',
          password: newPassword, // В реальном приложении нужно хешировать
          createdAt: new Date().toISOString()
        };

        console.log('👤 Creating new user:', newUser);

        // Добавляем пользователя в список зарегистрированных
        const updatedUsers = [...registeredUsers, newUser];
        await storageService.setItem('registeredUsers', updatedUsers);
        
        console.log('💾 User saved to registered users');

        await onAuthSuccess(newUser);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setError('Ошибка создания аккаунта');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center">
              {(step === 'otp' || step === 'create-password') && (
                <button
                  onClick={() => {
                    if (step === 'otp') setStep('phone');
                    else if (step === 'create-password') setStep('otp');
                    setError('');
                  }}
                  className="mr-4 p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
                >
                  <ArrowLeft size={20} className="text-white" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {step === 'phone' && 'Вход в систему'}
                  {step === 'otp' && 'Подтверждение'}
                  {step === 'create-password' && 'Создание аккаунта'}
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  {step === 'phone' && 'Введите номер телефона'}
                  {step === 'otp' && `Код отправлен на ${phone}`}
                  {step === 'create-password' && 'Придумайте пароль'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Ошибки */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle size={20} className="text-red-600 mr-3" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Шаг 1: Ввод номера телефона */}
            {step === 'phone' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Номер телефона
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={20} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="+996 XXX XXX XXX"
                      value={phone}
                      onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                      maxLength={13}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {isUserRegistered(phone) 
                      ? '✅ Этот номер уже зарегистрирован' 
                      : 'На этот номер будет отправлен код подтверждения'
                    }
                  </p>
                </div>

                <button
                  onClick={sendOTP}
                  disabled={isLoading || !isValidPhone(phone)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg py-3 font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Отправка SMS...
                    </div>
                  ) : (
                    isUserRegistered(phone) ? 'Войти' : 'Получить код'
                  )}
                </button>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 text-center">
                    <strong>Тестовые данные:</strong><br />
                    Админ: +996555123456<br />
                    SMS код: <strong>1234</strong><br />
                    Зарегистрированных пользователей: {registeredUsers.length}
                  </p>
                </div>
              </div>
            )}

            {/* Шаг 2: Ввод OTP */}
            {step === 'otp' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Код подтверждения
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                    placeholder="____"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Введите код <strong>1234</strong> из SMS
                  </p>
                </div>

                <button
                  onClick={verifyOTP}
                  disabled={isLoading || otp.length !== 4}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg py-3 font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Проверка...
                    </div>
                  ) : (
                    'Подтвердить'
                  )}
                </button>
              </div>
            )}

            {/* Шаг 3: Создание пароля */}
            {step === 'create-password' && (
              <div className="space-y-5">
                <div className="text-center mb-4">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Добро пожаловать!</h3>
                  <p className="text-sm text-gray-600">Создайте пароль для вашего аккаунта</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Новый пароль
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={20} className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Минимум 6 символов"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Подтвердите пароль
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={20} className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Повторите пароль"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={createPassword}
                  disabled={isLoading || newPassword.length < 6 || newPassword !== confirmPassword}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg py-3 font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Создание аккаунта...
                    </div>
                  ) : (
                    'Создать аккаунт'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneAuth;