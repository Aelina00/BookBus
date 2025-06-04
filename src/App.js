// ВСЕ ИМПОРТЫ В НАЧАЛЕ ФАЙЛА (исправляем ESLint ошибки)
import React, { useState, useEffect } from 'react';
import {
  CreditCard, Calendar, MapPin, Users, Clock, ArrowLeft,
  Bell, Home, Ticket, User, Mail, Phone, Lock, Edit,
  Plus, Check, AlertCircle, ChevronDown, ChevronRight,
  Globe, Settings, LogOut, Help, Star, X, Eye, EyeOff,
  Info, Menu, CheckCircle, Trash2, Map, Filter, Search
} from 'lucide-react';
import './App.css';
import logo from './logo/logo.png';

// Утилиты для работы с localStorage
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Ошибка при сохранении данных:', error);
  }
};

const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    return defaultValue;
  }
};

// Утилиты для работы с датами
const getCurrentDate = () => {
  const today = new Date();
  return `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
};

const isDatePassed = (dateString) => {
  const [day, month, year] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// Начальные пользователи
const getInitialUsers = () => [
  {
    id: 1,
    phone: "+996555123456",
    password: "admin123",
    firstName: "Админ",
    lastName: "Karakol Bus",
    role: "admin",
    isVerified: true
  }
];

// Переводы
const translations = {
  ru: {
    appName: "Karakol Bus",
    oneWay: "В одну сторону",
    roundTrip: "Туда-обратно",
    from: "Откуда",
    to: "Куда",
    date: "Дата",
    passengers: "Пассажиры",
    search: "Поиск",
    login: "Вход в систему",
    phone: "Телефон",
    password: "Пароль",
    loginButton: "Войти",
    firstName: "Имя",
    lastName: "Фамилия",
    home: "Главная",
    trips: "Поездки",
    profile: "Профиль",
    logout: "Выйти",
    fillAllFields: "Заполните все поля",
    invalidPhone: "Неверный формат номера телефона"
  }
};

// Компонент для аутентификации по телефону
const PhoneAuth = ({ onAuthSuccess }) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const t = translations.ru;

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

  const isValidPhone = (phone) => {
    const phoneRegex = /^\+996[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!isValidPhone(phone)) {
      setError('Введите корректный номер телефона');
      return;
    }

    setIsLoading(true);
    setError('');

    // Симуляция проверки
    setTimeout(() => {
      if (phone === '+996555123456') {
        const user = {
          id: 1,
          phone: phone,
          firstName: 'Админ',
          lastName: 'Системы',
          role: 'admin'
        };
        
        saveToLocalStorage('currentUser', user);
        onAuthSuccess(user);
      } else {
        // Создаем нового пользователя
        const user = {
          id: Date.now(),
          phone: phone,
          firstName: 'Пользователь',
          lastName: '',
          role: 'user'
        };
        
        saveToLocalStorage('currentUser', user);
        onAuthSuccess(user);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <h1 className="text-2xl font-bold text-white text-center">{t.login}</h1>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle size={20} className="text-red-600 mr-3" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.phone}</label>
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
              </div>

              <button
                type="submit"
                disabled={isLoading || !isValidPhone(phone)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg py-3 font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Вход...
                  </div>
                ) : (
                  t.loginButton
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                <strong>Тестовые данные:</strong><br />
                Админ: +996555123456<br />
                Пользователь: любой другой номер
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Главный компонент приложения
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('search');
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: getCurrentDate(),
    passengers: 1
  });

  const t = translations.ru;

  // Инициализация приложения
  useEffect(() => {
    const savedUser = loadFromLocalStorage('currentUser');
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsLoggedIn(false);
    setCurrentScreen('search');
  };

  // Если не аутентифицирован
  if (!isLoggedIn) {
    return <PhoneAuth onAuthSuccess={handleAuthSuccess} />;
  }

  // Рендер основного приложения
  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md mx-auto bg-white shadow-2xl relative">
        
        {/* Основной экран поиска */}
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-4 py-4">
              <div className="flex items-center justify-between">
                <img src={logo} alt="Karakol Bus" className="h-10 w-auto" />
                <div className="flex items-center space-x-4">
                  <Bell size={20} className="text-gray-600" />
                  <button
                    onClick={() => setCurrentScreen('profile')}
                    className="p-2 rounded-full bg-blue-100"
                  >
                    <User size={20} className="text-blue-600" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className="px-4 py-6">
            {/* Приветствие */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Добро пожаловать, {currentUser?.firstName || 'Пользователь'}! 👋
              </h1>
              <p className="text-gray-600">Найдите и забронируйте билет на автобус</p>
            </div>

            {/* Форма поиска */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
              <div className="p-6 space-y-4">
                {/* Направления */}
                <div className="space-y-3">
                  <div className="relative">
                    <select
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchData.from}
                      onChange={(e) => setSearchData({...searchData, from: e.target.value})}
                    >
                      <option value="">{t.from}</option>
                      <option value="Бишкек">Бишкек</option>
                      <option value="Каракол">Каракол</option>
                      <option value="Ош">Ош</option>
                    </select>
                  </div>

                  <div className="relative">
                    <select
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchData.to}
                      onChange={(e) => setSearchData({...searchData, to: e.target.value})}
                    >
                      <option value="">{t.to}</option>
                      <option value="Каракол">Каракол</option>
                      <option value="Бишкек">Бишкек</option>
                      <option value="Ош">Ош</option>
                    </select>
                  </div>
                </div>

                {/* Дата */}
                <div>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchData.date.split('-').reverse().join('-')}
                    onChange={(e) => {
                      const newDate = e.target.value.split('-').reverse().join('-');
                      setSearchData({...searchData, date: newDate});
                    }}
                    min={getCurrentDate().split('-').reverse().join('-')}
                  />
                </div>

                {/* Количество пассажиров */}
                <div className="relative">
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchData.passengers}
                    onChange={(e) => setSearchData({...searchData, passengers: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'пассажир' : num < 5 ? 'пассажира' : 'пассажиров'}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    if (searchData.from && searchData.to && searchData.date) {
                      alert('Поиск рейсов...');
                    } else {
                      alert(t.fillAllFields);
                    }
                  }}
                  disabled={!searchData.from || !searchData.to || !searchData.date}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg py-4 font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {t.search}
                </button>
              </div>
            </div>

            {/* Популярные маршруты */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Популярные маршруты</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setSearchData({...searchData, from: 'Бишкек', to: 'Каракол'})}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span>Бишкек → Каракол</span>
                  <span className="text-blue-600 font-medium">600 сом</span>
                </button>
                <button
                  onClick={() => setSearchData({...searchData, from: 'Каракол', to: 'Бишкек'})}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span>Каракол → Бишкек</span>
                  <span className="text-blue-600 font-medium">600 сом</span>
                </button>
              </div>
            </div>
          </div>

          {/* Нижняя навигация */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-md mx-auto flex justify-around py-3">
              <button className="flex flex-col items-center text-xs">
                <Home size={24} className="text-blue-600 mb-1" />
                <span className="text-blue-600 font-medium">{t.home}</span>
              </button>
              <button className="flex flex-col items-center text-xs">
                <Ticket size={24} className="text-gray-500 mb-1" />
                <span className="text-gray-500">{t.trips}</span>
              </button>
              <button 
                className="flex flex-col items-center text-xs"
                onClick={handleLogout}
              >
                <LogOut size={24} className="text-gray-500 mb-1" />
                <span className="text-gray-500">{t.logout}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;