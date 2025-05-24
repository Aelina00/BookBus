import React, { useState, useEffect, useRef } from 'react';
import {
  CreditCard, Calendar, MapPin, Users, Clock, ArrowLeft,
  Bell, Home, Ticket, User, Mail, Phone, Lock, Edit,
  Plus, Check, AlertCircle, ChevronDown, ChevronRight,
  Globe, Settings, LogOut, Help, Star, X, Eye, EyeOff,
  Info, Menu, CheckCircle, Trash2, Map, Filter, Search
} from 'lucide-react';
import logo from './logo/logo.png'
const AppLogo = ({ className = "h-10 w-auto" }) => {
  return (
    <img
      src={logo}
      alt="Karakol Bus"
      className={className}
      onError={(e) => {
        // Fallback к тексту если изображение не загрузится
        e.target.style.display = 'none';
        const fallback = e.target.nextElementSibling;
        if (fallback) fallback.style.display = 'block';
      }}
    />
  );
};
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

const isTimePassed = (timeString, dateString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const [day, month, year] = dateString.split('-').map(Number);
  const tripTime = new Date(year, month - 1, day);
  tripTime.setHours(hours, minutes, 0, 0);
  return tripTime < new Date();
};

// Комфортные места
const comfortSeats = [1, 2, 3, 4];

// Начальные пользователи (только админ)
const getInitialUsers = () => [
  {
    id: 1,
    email: "admin@karakolbus.kg",
    password: "admin123",
    firstName: "Админ",
    lastName: "Karakol Bus",
    phone: "+996555123456",
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
    returnDate: "Дата возврата",
    passengers: "Пассажиры",
    passenger: "Пассажир",
    search: "Поиск",
    availableRoutes: "Доступные маршруты",
    time: "Время",
    duration: "Длительность",
    available: "Свободно",
    vehicleType: "Тип",
    price: "Цена",
    busNumber: "Номер машины",
    carrier: "Перевозчик",
    boardingAddress: "Адрес посадки",
    select: "Выбрать",
    tripDetails: "Детали поездки",
    personalData: "Личные Данные",
    firstName: "Имя",
    lastName: "Фамилия",
    phone: "Телефон",
    selectSeat: "Выберите место",
    standard: "Стандарт",
    comfort: "Комфорт",
    selected: "Выбрано",
    save: "Сохранить",
    changeSeats: "Изменить места",
    payment: "Оплата",
    route: "Маршрут",
    departureTime: "Время отправления",
    seats: "Места",
    totalPayment: "Итого к оплате",
    paymentMethod: "Способ оплаты",
    bankCard: "Банковская карта",
    cardNumber: "Номер карты",
    expiryDate: "ММ/ГГ",
    cvv: "CVV",
    nameOnCard: "Имя на карте",
    termsAgreement: "Я согласен с условиями публичной оферты",
    pay: "Оплатить",
    processing: "Обработка...",
    bookingComplete: "Бронирование завершено",
    bookingSuccess: "Бронирование успешно завершено!",
    bookingSuccessMessage: "Билет успешно забронирован. Вы можете просмотреть все детали в разделе 'Поездки'.",
    myTrips: "Мои поездки",
    toMain: "На главную",
    trips: "Поездки",
    history: "История",
    profile: "Профиль",
    aboutUs: "О Нас",
    wallet: "Кошелек",
    logout: "Выйти",
    home: "Главная",
    login: "Вход в систему",
    email: "Email",
    password: "Пароль",
    enterPassword: "Введите пароль",
    loginButton: "Войти",
    testCredentials: "Тестовые данные для входа",
    registration: "Регистрация",
    confirmPassword: "Подтверждение пароля",
    register: "Зарегистрироваться",
    adminMode: "Режим администратора",
    manageRoutes: "Управление маршрутами",
    allBookings: "Все бронирования",
    routesNotFound: "Маршруты не найдены",
    routesNotFoundMessage: "На выбранную дату нет доступных маршрутов. Попробуйте выбрать другую дату или направление.",
    viewAllStops: "Смотреть все остановки",
    exchangeNotPossible: "Обмен билетов невозможен",
    viewDetails: "Детали",
    leaveReview: "Оставить отзыв",
    addNewRoute: "Добавить новый маршрут",
    cancel: "Отменить",
    addNewBus: "Добавить новый рейс",
    addingNewRoute: "Добавление нового маршрута",
    departureAddress: "Адрес отправления",
    arrivalAddress: "Адрес прибытия",
    priceInSom: "Цена (сом)",
    durationInMin: "Длительность (мин)",
    addRoute: "Добавить маршрут",
    addingNewBus: "Добавление нового рейса",
    selectRoute: "Выберите маршрут",
    selectDate: "Выберите дату",
    seatsCount: "Количество мест",
    addBus: "Добавить рейс",
    existingRoutes: "Существующие маршруты",
    edit: "Редактировать",
    delete: "Удалить",
    language: "Язык",
    stops: "Остановки",
    stopName: "Название остановки",
    stopTime: "Время",
    addStop: "Добавить остановку",
    editProfile: "Редактировать профиль",
    update: "Обновить",
    passwordsDoNotMatch: "Пароли не совпадают",
    fillAllFields: "Пожалуйста, заполните все поля",
    userExists: "Пользователь с таким email уже существует",
    invalidEmail: "Некорректный email",
    invalidPhone: "Некорректный номер телефона",
    invalidCardNumber: "Некорректный номер карты",
    invalidExpiryDate: "Некорректная дата (используйте формат ММ/ГГ)",
    invalidCVV: "Некорректный CVV код",
    paymentSuccessful: "Оплата прошла успешно",
    returnTrip: "Обратная поездка",
    continueButton: "Продолжить",
    noTrips: "У вас пока нет забронированных поездок",
    changePassword: "Изменить пароль",
    noBookings: "Нет бронирований",
    upcoming: "Предстоящие",
    completed: "Завершенные",
    editRoute: "Редактировать маршрут",
    clearSelection: "Сбросить выбор",
    reviews: "Отзывы",
    yourReview: "Ваш отзыв",
    yourRating: "Ваша оценка",
    shareExperience: "Расскажите о вашем опыте...",
    submitReview: "Отправить отзыв",
    noReviews: "Пока нет отзывов",
    resetSelection: "Сбросить выбор",
    seatSelected: "Место выбрано",
    seatOccupied: "Место занято",
    filterBookings: "Фильтр бронирований",
    filterByDate: "Фильтр по дате",
    filterByRoute: "Фильтр по маршруту",
    filterByBus: "Фильтр по автобусу",
    clearFilters: "Сбросить фильтры",
    apply: "Применить",
    ongoing: "Незавершенные",
    exit: "Выход",
    passengerCount: "Количество пассажиров",
    enterPassengerCount: "Введите количество пассажиров (1-{max})",
    invalidPassengerCount: "Неверное количество пассажиров",
    front: "Перед",
    back: "Зад",
    ticketReturn: "Возврат осуществляется в соответствии с договором оферты",
    newPassword: "Новый пароль",
    confirmNewPassword: "Подтвердите новый пароль"
  }
};

// Компонент для личной информации
const PersonalInfo = ({ initialInfo, t, onInfoChange, onSubmit }) => {
  const [info, setInfo] = useState(initialInfo);

  const handleChange = (field, value) => {
    const newInfo = { ...info, [field]: value };
    setInfo(newInfo);
    onInfoChange(newInfo);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!info.firstName || !info.lastName || !info.phone) {
      alert(t.fillAllFields);
      return;
    }

    const phoneRegex = /^\+996\d{9,}$/;
    if (!phoneRegex.test(info.phone)) {
      alert(t.invalidPhone);
      return;
    }

    onSubmit();
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">{t.personalData}</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.firstName}</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder={t.firstName}
            value={info.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.lastName}</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder={t.lastName}
            value={info.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.phone}</label>
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
            <Phone size={20} className="text-gray-400 mr-3" />
            <input
              type="tel"
              className="w-full focus:outline-none"
              placeholder="+996 XXX XXX XXX"
              value={info.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg py-3 font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {t.continueButton}
        </button>
      </form>
    </div>
  );
};

// Компонент для оплаты
const PaymentForm = ({ t, totalAmount, onPaymentComplete }) => {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const validateCard = () => {
    if (!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv || !cardData.cardName) {
      alert(t.fillAllFields);
      return false;
    }

    if (!/^\d{16}$/.test(cardData.cardNumber.replace(/\s/g, ''))) {
      alert(t.invalidCardNumber);
      return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
      alert(t.invalidExpiryDate);
      return false;
    }

    if (!/^\d{3,4}$/.test(cardData.cvv)) {
      alert(t.invalidCVV);
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!agreed) {
      alert(t.termsAgreement);
      return;
    }

    if (!validateCard()) return;

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete();
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="mb-6">
        <div className="text-2xl font-bold text-green-600 mb-2">{totalAmount}</div>
        <div className="text-lg font-semibold text-gray-800">{t.totalPayment}</div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.cardNumber}</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1234 5678 9012 3456"
            value={cardData.cardNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
              setCardData({ ...cardData, cardNumber: value });
            }}
            maxLength="19"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.expiryDate}</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ММ/ГГ"
              value={cardData.expiryDate}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
                setCardData({ ...cardData, expiryDate: value });
              }}
              maxLength="5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.cvv}</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="123"
              value={cardData.cvv}
              onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
              maxLength="4"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.nameOnCard}</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="IVAN PETROV"
            value={cardData.cardName}
            onChange={(e) => setCardData({ ...cardData, cardName: e.target.value.toUpperCase() })}
          />
        </div>

        <div className="flex items-start space-x-3 pt-4">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="terms" className="text-sm text-gray-700">
            {t.termsAgreement}
          </label>
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing || !agreed}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg py-4 font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {t.processing}
            </div>
          ) : (
            t.pay
          )}
        </button>
      </div>
    </div>
  );
};

// Главный компонент приложения
const App = () => {
  // Основные состояния
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState('ru');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Состояния для поиска и бронирования
  const [tripType, setTripType] = useState('one-way');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(getCurrentDate());
  const [returnDate, setReturnDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return `${String(tomorrow.getDate()).padStart(2, '0')}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${tomorrow.getFullYear()}`;
  });
  const [passengers, setPassengers] = useState(1);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [returnBus, setReturnBus] = useState(null);
  const [returnSeats, setReturnSeats] = useState([]);
  const [isBuyingReturn, setIsBuyingReturn] = useState(false);

  // Состояния для данных
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState({});
  const [bookedSeats, setBookedSeats] = useState({});
  const [bookingHistory, setBookingHistory] = useState([]);
  const [users, setUsers] = useState(getInitialUsers());
  const [reviews, setReviews] = useState([]);

  // Состояния для форм
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [registrationData, setRegistrationData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  // Административные состояния
  const [adminMode, setAdminMode] = useState('routes');
  const [newRouteData, setNewRouteData] = useState({
    from: '',
    to: '',
    departureAddress: '',
    arrivalAddress: '',
    price: '',
    duration: '',
    vehicleType: 'автобус',
    stops: []
  });
  const [newBusData, setNewBusData] = useState({
    routeId: '',
    date: '',
    departureTime: '',
    arrivalTime: '',
    busNumber: '',
    totalSeats: 51,
    vehicleType: 'автобус'
  });

  // Состояния для UI
  const [showAddRouteForm, setShowAddRouteForm] = useState(false);
  const [showAddBusForm, setShowAddBusForm] = useState(false);
  const [editRouteId, setEditRouteId] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [adminTab, setAdminTab] = useState('ongoing');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showStopsModal, setShowStopsModal] = useState(false);
  const [currentRouteStops, setCurrentRouteStops] = useState([]);
  const [showPassengerCountModal, setShowPassengerCountModal] = useState(false);
  const [customPassengers, setCustomPassengers] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentReviewBooking, setCurrentReviewBooking] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    date: '',
    route: '',
    busNumber: ''
  });
  const [filteredBookings, setFilteredBookings] = useState([]);

  const t = translations[language] || translations['ru'];

  // Загрузка данных из localStorage при старте
  useEffect(() => {
    const savedRoutes = loadFromLocalStorage('gobus_routes', []);
    const savedBuses = loadFromLocalStorage('gobus_buses', {});
    const savedBookedSeats = loadFromLocalStorage('gobus_bookedSeats', {});
    const savedBookingHistory = loadFromLocalStorage('gobus_bookingHistory', []);
    const savedUsers = loadFromLocalStorage('gobus_users', getInitialUsers());
    const savedReviews = loadFromLocalStorage('gobus_reviews', []);

    setRoutes(savedRoutes);
    setBuses(savedBuses);
    setBookedSeats(savedBookedSeats);
    setBookingHistory(savedBookingHistory);
    setUsers(savedUsers);
    setReviews(savedReviews);
  }, []);

  // Автосохранение данных в localStorage
  useEffect(() => {
    saveToLocalStorage('gobus_routes', routes);
  }, [routes]);

  useEffect(() => {
    saveToLocalStorage('gobus_buses', buses);
  }, [buses]);

  useEffect(() => {
    saveToLocalStorage('gobus_bookedSeats', bookedSeats);
  }, [bookedSeats]);

  useEffect(() => {
    saveToLocalStorage('gobus_bookingHistory', bookingHistory);
  }, [bookingHistory]);

  useEffect(() => {
    saveToLocalStorage('gobus_users', users);
  }, [users]);

  useEffect(() => {
    saveToLocalStorage('gobus_reviews', reviews);
  }, [reviews]);

  // Установка информации о пользователе при входе
  useEffect(() => {
    if (currentUser) {
      setPersonalInfo({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        phone: currentUser.phone
      });
      setIsAdmin(currentUser.role === 'admin');
    }
  }, [currentUser]);

  // Обновление статуса поездок
  useEffect(() => {
    const updatedHistory = bookingHistory.map(booking => {
      const dateIsPassed = isDatePassed(booking.date);
      const timeIsPassed = booking.date === getCurrentDate() && isTimePassed(booking.departureTime, booking.date);

      if ((dateIsPassed || timeIsPassed) && booking.status === 'upcoming') {
        return { ...booking, status: 'history' };
      }
      return booking;
    });

    if (JSON.stringify(updatedHistory) !== JSON.stringify(bookingHistory)) {
      setBookingHistory(updatedHistory);
    }

    applyFilters();
  }, [bookingHistory]);

  // Применение фильтров
  const applyFilters = () => {
    let filtered = bookingHistory.filter(booking =>
      booking.userId === currentUser?.id
    );

    if (filterOptions.date) {
      filtered = filtered.filter(booking => booking.date === filterOptions.date);
    }

    if (filterOptions.route) {
      const [from, to] = filterOptions.route.split(' - ');
      filtered = filtered.filter(booking => booking.from === from && booking.to === to);
    }

    if (filterOptions.busNumber) {
      filtered = filtered.filter(booking => booking.busNumber === filterOptions.busNumber);
    }

    if (adminTab === 'completed') {
      filtered = filtered.filter(booking => booking.status === 'history');
    } else if (adminTab === 'ongoing') {
      filtered = filtered.filter(booking => booking.status === 'upcoming');
    }

    setFilteredBookings(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filterOptions, adminTab, currentUser]);

  // Функции для работы с автобусами
  const getAvailableBuses = (routeFrom, routeTo, selectedDate) => {
    return (buses[selectedDate] || []).filter(bus => {
      const route = routes.find(r => r.id === bus.routeId);
      return route && route.from === routeFrom && route.to === routeTo;
    });
  };

  const getAvailableDates = () => {
    return Object.keys(buses).filter(date =>
      buses[date].length > 0 && !isDatePassed(date)
    ).sort((a, b) => {
      const dateA = new Date(a.split('-').reverse().join('-'));
      const dateB = new Date(b.split('-').reverse().join('-'));
      return dateA - dateB;
    });
  };

  // Расчет общей стоимости
  const calculateTotalPrice = () => {
    let totalPrice = 0;

    if (selectedBus) {
      const route = routes.find(r => r.id === selectedBus.routeId);
      if (route) {
        let basePrice = route.price * selectedSeats.length;
        const comfortPriceAddition = selectedSeats.filter(seat => comfortSeats.includes(seat)).length * 50;
        totalPrice += basePrice + comfortPriceAddition;
      }
    }

    if (tripType === 'round-trip' && returnBus) {
      const returnRoute = routes.find(r => r.id === returnBus.routeId);
      if (returnRoute) {
        let returnBasePrice = returnRoute.price * returnSeats.length;
        const returnComfortPriceAddition = returnSeats.filter(seat => comfortSeats.includes(seat)).length * 50;
        totalPrice += returnBasePrice + returnComfortPriceAddition;
      }
    }

    return totalPrice;
  };

  // Обработка выбора места
  const handleSeatSelection = (seatNumber) => {
    if (seatNumber === 0) return;

    if (isBuyingReturn) {
      if (returnSeats.includes(seatNumber)) {
        setReturnSeats(returnSeats.filter(seat => seat !== seatNumber));
      } else {
        if (returnSeats.length < passengers) {
          setReturnSeats([...returnSeats, seatNumber]);
        } else {
          const newSeats = [...returnSeats];
          newSeats.shift();
          newSeats.push(seatNumber);
          setReturnSeats(newSeats);
        }
      }
    } else {
      if (selectedSeats.includes(seatNumber)) {
        setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
      } else {
        if (selectedSeats.length < passengers) {
          setSelectedSeats([...selectedSeats, seatNumber]);
        } else {
          const newSeats = [...selectedSeats];
          newSeats.shift();
          newSeats.push(seatNumber);
          setSelectedSeats(newSeats);
        }
      }
    }
  };

  // Проверка забронированности места
  const isSeatBooked = (busId, selectedDate, seatNumber) => {
    const key = `${busId}-${selectedDate}`;
    return bookedSeats[key] && bookedSeats[key].includes(seatNumber);
  };

  // Обработка входа
  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === loginData.email && u.password === loginData.password);

    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setIsAdmin(user.role === 'admin');
      setStep(1);
    } else {
      alert('Неверный email или пароль');
    }
  };

  // Обработка регистрации
  const handleRegistration = (e) => {
    e.preventDefault();

    if (registrationData.password !== registrationData.confirmPassword) {
      alert(t.passwordsDoNotMatch);
      return;
    }

    if (!registrationData.email || !registrationData.password || !registrationData.firstName ||
      !registrationData.lastName || !registrationData.phone) {
      alert(t.fillAllFields);
      return;
    }

    if (users.some(user => user.email === registrationData.email)) {
      alert(t.userExists);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registrationData.email)) {
      alert(t.invalidEmail);
      return;
    }

    const phoneRegex = /^\+996\d{9,}$/;
    if (!phoneRegex.test(registrationData.phone)) {
      alert(t.invalidPhone);
      return;
    }

    const newUser = {
      id: users.length + 1,
      email: registrationData.email,
      password: registrationData.password,
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      phone: registrationData.phone,
      role: 'user',
      isVerified: true
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setStep(1);
  };

  // Добавление маршрута
  const handleAddRoute = () => {
    if (!newRouteData.from || !newRouteData.to || !newRouteData.price || !newRouteData.duration) {
      alert(t.fillAllFields);
      return;
    }

    if (editRouteId) {
      const updatedRoutes = routes.map(route => {
        if (route.id === editRouteId) {
          return {
            ...route,
            from: newRouteData.from,
            to: newRouteData.to,
            departureAddress: newRouteData.departureAddress,
            arrivalAddress: newRouteData.arrivalAddress,
            price: parseFloat(newRouteData.price),
            duration: parseInt(newRouteData.duration),
            vehicleType: newRouteData.vehicleType,
            stops: newRouteData.stops
          };
        }
        return route;
      });
      setRoutes(updatedRoutes);
      setEditRouteId(null);
    } else {
      const newRoute = {
        id: routes.length + 1,
        from: newRouteData.from,
        to: newRouteData.to,
        departureAddress: newRouteData.departureAddress,
        arrivalAddress: newRouteData.arrivalAddress,
        price: parseFloat(newRouteData.price),
        currency: "сом",
        duration: parseInt(newRouteData.duration),
        vehicleType: newRouteData.vehicleType,
        stops: newRouteData.stops.length > 0 ? newRouteData.stops : [
          { name: `${newRouteData.from} (отправление)`, time: "23:00" },
          { name: `${newRouteData.to} (прибытие)`, time: `${Math.floor(newRouteData.duration / 60)}:${(newRouteData.duration % 60).toString().padStart(2, '0')}` }
        ]
      };
      setRoutes([...routes, newRoute]);
    }

    setNewRouteData({
      from: '',
      to: '',
      departureAddress: '',
      arrivalAddress: '',
      price: '',
      duration: '',
      vehicleType: 'автобус',
      stops: []
    });
    setShowAddRouteForm(false);
  };

  // Добавление рейса
  const handleAddBus = () => {
    if (!newBusData.routeId || !newBusData.date || !newBusData.departureTime ||
      !newBusData.arrivalTime || !newBusData.busNumber) {
      alert(t.fillAllFields);
      return;
    }

    const routeId = parseInt(newBusData.routeId);
    const route = routes.find(r => r.id === routeId);

    if (!route) {
      alert('Выбранный маршрут не существует');
      return;
    }

    let maxBusId = 0;
    Object.values(buses).forEach(busesForDate => {
      busesForDate.forEach(bus => {
        if (bus.id > maxBusId) maxBusId = bus.id;
      });
    });

    const newBus = {
      id: maxBusId + 1,
      routeId: routeId,
      departureTime: newBusData.departureTime,
      arrivalTime: newBusData.arrivalTime,
      busNumber: newBusData.busNumber,
      carrier: "ОсОО \"Karakol Bus\"",
      totalSeats: parseInt(newBusData.totalSeats),
      availableSeats: parseInt(newBusData.totalSeats),
      vehicleType: newBusData.vehicleType
    };

    const updatedBuses = { ...buses };
    if (!updatedBuses[newBusData.date]) {
      updatedBuses[newBusData.date] = [];
    }
    updatedBuses[newBusData.date] = [...updatedBuses[newBusData.date], newBus];
    setBuses(updatedBuses);

    const busKey = `${newBus.id}-${newBusData.date}`;
    setBookedSeats(prev => ({
      ...prev,
      [busKey]: []
    }));

    setNewBusData({
      routeId: '',
      date: '',
      departureTime: '',
      arrivalTime: '',
      busNumber: '',
      totalSeats: 51,
      vehicleType: 'автобус'
    });
    setShowAddBusForm(false);
  };

  // Завершение бронирования
  const completeBooking = () => {
    const newBooking = {
      id: Math.floor(Math.random() * 1000) + 1,
      userId: currentUser.id,
      date: date,
      from: from,
      to: to,
      departureTime: selectedBus.departureTime,
      arrivalTime: selectedBus.arrivalTime,
      price: tripType === 'one-way' ? calculateTotalPrice() : calculateTotalPrice() / 2,
      currency: routes.find(r => r.id === selectedBus.routeId).currency,
      seats: selectedSeats,
      busNumber: selectedBus.busNumber,
      passenger: `${personalInfo.firstName} ${personalInfo.lastName}`,
      phone: personalInfo.phone,
      duration: routes.find(r => r.id === selectedBus.routeId).duration,
      status: 'upcoming',
      stops: routes.find(r => r.id === selectedBus.routeId).stops
    };

    const outboundKey = `${selectedBus.id}-${date}`;
    setBookedSeats(prevBookedSeats => ({
      ...prevBookedSeats,
      [outboundKey]: [...(prevBookedSeats[outboundKey] || []), ...selectedSeats]
    }));

    const updatedBuses = { ...buses };
    const busesForDate = [...(updatedBuses[date] || [])];
    const busIndex = busesForDate.findIndex(b => b.id === selectedBus.id);

    if (busIndex !== -1) {
      busesForDate[busIndex] = {
        ...busesForDate[busIndex],
        availableSeats: busesForDate[busIndex].availableSeats - selectedSeats.length
      };
      updatedBuses[date] = busesForDate;
      setBuses(updatedBuses);
    }

    setBookingHistory(prevHistory => [newBooking, ...prevHistory]);

    if (tripType === 'round-trip' && returnBus && returnSeats.length > 0) {
      const returnBooking = {
        id: Math.floor(Math.random() * 1000) + 1,
        userId: currentUser.id,
        date: returnDate,
        from: to,
        to: from,
        departureTime: returnBus.departureTime,
        arrivalTime: returnBus.arrivalTime,
        price: calculateTotalPrice() / 2,
        currency: routes.find(r => r.id === returnBus.routeId).currency,
        seats: returnSeats,
        busNumber: returnBus.busNumber,
        passenger: `${personalInfo.firstName} ${personalInfo.lastName}`,
        phone: personalInfo.phone,
        duration: routes.find(r => r.id === returnBus.routeId).duration,
        status: 'upcoming',
        stops: routes.find(r => r.id === returnBus.routeId).stops
      };

      const returnKey = `${returnBus.id}-${returnDate}`;
      setBookedSeats(prevBookedSeats => ({
        ...prevBookedSeats,
        [returnKey]: [...(prevBookedSeats[returnKey] || []), ...returnSeats]
      }));

      const returnBusesForDate = [...(updatedBuses[returnDate] || [])];
      const returnBusIndex = returnBusesForDate.findIndex(b => b.id === returnBus.id);

      if (returnBusIndex !== -1) {
        returnBusesForDate[returnBusIndex] = {
          ...returnBusesForDate[returnBusIndex],
          availableSeats: returnBusesForDate[returnBusIndex].availableSeats - returnSeats.length
        };
        updatedBuses[returnDate] = returnBusesForDate;
        setBuses(updatedBuses);
      }

      setBookingHistory(prevHistory => [returnBooking, ...prevHistory]);
    }

    setStep(6);
  };

  // Навигационные функции
  const goBack = () => {
    if (step > 0) {
      if (step === 4 && isBuyingReturn) {
        setIsBuyingReturn(false);
      } else {
        setStep(step - 1);
      }
    }
  };

  const goHome = () => {
    setStep(1);
    setSelectedBus(null);
    setSelectedSeats([]);
    setReturnBus(null);
    setReturnSeats([]);
    setIsBuyingReturn(false);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsAdmin(false);
    setStep(0);
  };

  // Добавление отзыва
  const addReview = () => {
    if (!reviewText) {
      alert('Пожалуйста, введите текст отзыва');
      return;
    }

    const newReview = {
      id: Math.floor(Math.random() * 1000) + 1,
      bookingId: currentReviewBooking.id,
      userId: currentUser.id,
      text: reviewText,
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
      route: `${currentReviewBooking.from} - ${currentReviewBooking.to}`,
      userName: `${currentUser.firstName} ${currentUser.lastName}`
    };

    setReviews([newReview, ...reviews]);
    setShowReviewModal(false);
    setReviewText('');
    setReviewRating(5);
    alert('Спасибо за ваш отзыв!');
  };

  // Рендеринг экранов
  const renderScreen = () => {
    switch (step) {
      case 0: // Экран входа/регистрации
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <header className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  <div className="flex items-center">
                    <AppLogo />
                    <div className="text-2xl font-bold" style={{ display: 'none' }}>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                    >
                      <Globe size={20} className="text-gray-600" />
                      <span className="text-sm uppercase font-medium">{language}</span>
                      <ChevronDown size={16} className="text-gray-600" />
                    </button>

                    {showLanguageSelector && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="py-2">
                          {['ru', 'kg', 'en'].map((lang) => (
                            <button
                              key={lang}
                              className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${language === lang ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                                }`}
                              onClick={() => {
                                setLanguage(lang);
                                setShowLanguageSelector(false);
                              }}
                            >
                              {lang === 'ru' ? 'Русский' : lang === 'kg' ? 'Кыргызча' : 'English'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </header>

            <div className="max-w-md mx-auto px-4 py-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
                  <h1 className="text-2xl font-bold text-white text-center">{t.login}</h1>
                </div>

                <div className="p-6">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.email}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={20} className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="admin@karakolbus.kg"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.password}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={20} className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder={t.enterPassword}
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg py-3 font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {t.loginButton}
                    </button>
                  </form>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 text-center">
                      <strong>{t.testCredentials}:</strong><br />
                      Email: admin@Karakolbus.kg<br />
                      {t.password}: admin123
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-green-600 to-green-700">
                  <h2 className="text-2xl font-bold text-white text-center">{t.registration}</h2>
                </div>

                <div className="p-6">
                  <form onSubmit={handleRegistration} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.email}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={20} className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="example@mail.com"
                          value={registrationData.email}
                          onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.firstName}</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder={t.firstName}
                          value={registrationData.firstName}
                          onChange={(e) => setRegistrationData({ ...registrationData, firstName: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.lastName}</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder={t.lastName}
                          value={registrationData.lastName}
                          onChange={(e) => setRegistrationData({ ...registrationData, lastName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.phone}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone size={20} className="text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="+996 XXX XXX XXX"
                          value={registrationData.phone}
                          onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.password}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={20} className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder={t.password}
                          value={registrationData.password}
                          onChange={(e) => setRegistrationData({ ...registrationData, password: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.confirmPassword}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={20} className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder={t.confirmPassword}
                          value={registrationData.confirmPassword}
                          onChange={(e) => setRegistrationData({ ...registrationData, confirmPassword: e.target.value })}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg py-3 font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {t.register}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Главный экран поиска
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <header className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  <div className="flex items-center">
                    <AppLogo />
                    <div className="text-2xl font-bold" style={{ display: 'none' }}>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <button
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                      >
                        <Globe size={20} className="text-gray-600" />
                        <span className="text-sm uppercase font-medium">{language}</span>
                      </button>

                      {showLanguageSelector && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                          <div className="py-2">
                            {['ru', 'kg', 'en'].map((lang) => (
                              <button
                                key={lang}
                                className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${language === lang ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                                  }`}
                                onClick={() => {
                                  setLanguage(lang);
                                  setShowLanguageSelector(false);
                                }}
                              >
                                {lang === 'ru' ? 'Русский' : lang === 'kg' ? 'Кыргызча' : 'English'}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <Bell size={20} className="text-gray-600" />
                  </div>
                </div>
              </div>
            </header>

            <div className="max-w-md mx-auto px-4 py-6">
              {isAdmin && (
                <div className="mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl shadow-lg">
                  <div className="font-bold text-lg mb-3">🛠️ {t.adminMode}</div>
                  <div className="flex space-x-2">
                    <button
                      className="bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-opacity-30 transition-all duration-200"
                      onClick={() => setStep(10)}
                    >
                      {t.manageRoutes}
                    </button>
                    <button
                      className="bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-opacity-30 transition-all duration-200"
                      onClick={() => setStep(11)}
                    >
                      {t.allBookings}
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-6">
                <div className="flex rounded-t-2xl overflow-hidden">
                  <button
                    className={`flex-1 py-3 text-center font-medium transition-all duration-200 ${tripType === 'one-way'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    onClick={() => setTripType('one-way')}
                  >
                    {t.oneWay}
                  </button>
                  <button
                    className={`flex-1 py-3 text-center font-medium transition-all duration-200 ${tripType === 'round-trip'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    onClick={() => setTripType('round-trip')}
                  >
                    {t.roundTrip}
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
                      <MapPin className="text-gray-400 mr-3" size={20} />
                      <select
                        className="w-full bg-transparent border-none focus:outline-none text-gray-800"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                      >
                        <option value="" disabled>{t.from}</option>
                        {[...new Set(routes.map(route => route.from))].map(city => (
                          <option key={`from-${city}`} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
                      <MapPin className="text-gray-400 mr-3" size={20} />
                      <select
                        className="w-full bg-transparent border-none focus:outline-none text-gray-800"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                      >
                        <option value="" disabled>{t.to}</option>
                        {[...new Set(routes.map(route => route.to))].map(city => (
                          <option key={`to-${city}`} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={`grid gap-4 ${tripType === 'round-trip' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
                      <Calendar className="text-gray-400 mr-3" size={20} />
                      <input
                        type="date"
                        className="w-full bg-transparent border-none focus:outline-none cursor-pointer text-gray-800"
                        value={date.split('-').reverse().join('-')}
                        onChange={(e) => {
                          const newDate = e.target.value.split('-').reverse().join('-');
                          setDate(newDate);
                        }}
                        min={getCurrentDate().split('-').reverse().join('-')}
                      />
                    </div>

                    {tripType === 'round-trip' && (
                      <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
                        <Calendar className="text-gray-400 mr-3" size={20} />
                        <input
                          type="date"
                          className="w-full bg-transparent border-none focus:outline-none cursor-pointer text-gray-800"
                          value={returnDate.split('-').reverse().join('-')}
                          onChange={(e) => {
                            const newDate = e.target.value.split('-').reverse().join('-');
                            setReturnDate(newDate);
                          }}
                          min={date.split('-').reverse().join('-')}
                        />
                      </div>
                    )}
                  </div>

                  <div
                    className="flex items-center border border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 transition-all duration-200"
                    onClick={() => setShowPassengerCountModal(true)}
                  >
                    <Users className="text-gray-400 mr-3" size={20} />
                    <div className="flex-1 text-gray-800">
                      {passengers} {passengers === 1 ? t.passenger : t.passengers}
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>

                  <button
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg py-4 font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    onClick={() => {
                      if (from && to && date) {
                        if (isDatePassed(date)) {
                          setDate(getCurrentDate());
                        }
                        setStep(2);
                      } else {
                        alert(t.fillAllFields);
                      }
                    }}
                  >
                    {t.search}
                  </button>
                </div>
              </div>
            </div>

            {/* Модальное окно выбора количества пассажиров */}
            {showPassengerCountModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                  <h3 className="text-xl font-bold mb-4 text-center">{t.passengerCount}</h3>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {t.enterPassengerCount.replace('{max}', '51')}
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg"
                      min="1"
                      max="51"
                      value={customPassengers}
                      onChange={(e) => setCustomPassengers(parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      className="flex-1 bg-gray-300 text-gray-700 rounded-lg py-3 font-medium hover:bg-gray-400 transition-colors"
                      onClick={() => setShowPassengerCountModal(false)}
                    >
                      {t.cancel}
                    </button>
                    <button
                      className="flex-1 bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors"
                      onClick={() => {
                        if (customPassengers >= 1 && customPassengers <= 51) {
                          setPassengers(customPassengers);
                          setShowPassengerCountModal(false);
                        } else {
                          alert(t.invalidPassengerCount);
                        }
                      }}
                    >
                      {t.apply}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Нижняя навигация */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
              <div className="max-w-md mx-auto flex justify-around py-3">
                <div className="flex flex-col items-center text-xs">
                  <Home size={24} className="text-blue-600 mb-1" />
                  <span className="text-blue-600 font-medium">{t.home}</span>
                </div>
                <button
                  className="flex flex-col items-center text-xs"
                  onClick={() => setStep(7)}
                >
                  <Ticket size={24} className="text-gray-500 mb-1" />
                  <span className="text-gray-500">{t.trips}</span>
                </button>
                <button
                  className="flex flex-col items-center text-xs"
                  onClick={() => setStep(9)}
                >
                  <User size={24} className="text-gray-500 mb-1" />
                  <span className="text-gray-500">{t.profile}</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 2: // Доступные автобусы
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <header className="bg-white shadow-sm border-b border-gray-200">
              <div className="flex items-center px-4 py-4">
                <button onClick={goBack} className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="text-xl font-semibold text-gray-800">{from} → {to}</h1>
              </div>
            </header>

            <div className="bg-white border-b border-gray-200">
              <div className="flex overflow-x-auto px-4">
                {getAvailableDates()
                  .filter(busDate =>
                    buses[busDate]?.some(bus => {
                      const route = routes.find(r => r.id === bus.routeId);
                      return route && route.from === from && route.to === to;
                    })
                  )
                  .map((d) => (
                    <button
                      key={d}
                      className={`flex-shrink-0 py-3 px-6 text-center transition-all duration-200 ${date === d
                        ? 'border-b-2 border-blue-600 text-blue-600 font-semibold'
                        : 'text-gray-600 hover:text-blue-600'
                        }`}
                      onClick={() => setDate(d)}
                    >
                      {d.split('-').slice(0, 2).join('.')}
                    </button>
                  ))}
              </div>
            </div>

            <div className="max-w-md mx-auto px-4 py-6 pb-24">
              {getAvailableBuses(from, to, date).map((bus) => (
                <div key={bus.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-4 hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-2xl font-bold text-gray-800">{bus.departureTime}</div>
                    <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      <Clock size={16} className="mr-1" />
                      {Math.floor(routes.find(r => r.id === bus.routeId)?.duration / 60)}ч {routes.find(r => r.id === bus.routeId)?.duration % 60}м
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{bus.arrivalTime}</div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <div className="font-medium">{from}</div>
                    <div className="font-medium">{to}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">{t.available}</div>
                      <div className="font-semibold text-green-600">{bus.availableSeats} {t.seats}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">{t.vehicleType}</div>
                      <div className="font-semibold">{bus.vehicleType}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="text-2xl font-bold text-green-600">
                      {routes.find(r => r.id === bus.routeId)?.price} {routes.find(r => r.id === bus.routeId)?.currency}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{t.busNumber}</div>
                      <div className="font-medium">{bus.busNumber}</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    <div className="font-medium text-blue-600">{t.carrier}: {bus.carrier}</div>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => {
                        const route = routes.find(r => r.id === bus.routeId);
                        if (route && route.stops) {
                          setCurrentRouteStops(route.stops);
                          setShowStopsModal(true);
                        }
                      }}
                    >
                      📍 {routes.find(r => r.id === bus.routeId)?.departureAddress}
                    </button>
                  </div>

                  <div className="text-xs text-gray-500 mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    ⚠️ {t.exchangeNotPossible}<br />
                    {t.ticketReturn}
                  </div>

                  {bus.availableSeats > 0 ? (
                    <button
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl py-4 font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      onClick={() => {
                        setSelectedBus(bus);
                        if (passengers > bus.availableSeats) {
                          setPassengers(bus.availableSeats);
                          setCustomPassengers(bus.availableSeats);
                          alert(`Доступно только ${bus.availableSeats} мест. Количество пассажиров изменено.`);
                        }
                        setStep(3);
                      }}
                    >
                      {t.select}
                    </button>
                  ) : (
                    <button
                      className="w-full bg-gray-300 text-gray-500 rounded-xl py-4 font-semibold cursor-not-allowed"
                      disabled
                    >
                      Нет свободных мест
                    </button>
                  )}
                </div>
              ))}

              {getAvailableBuses(from, to, date).length === 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                  <div className="text-6xl mb-4">🚌</div>
                  <div className="text-xl font-semibold text-gray-600 mb-2">{t.routesNotFound}</div>
                  <div className="text-gray-500">
                    {t.routesNotFoundMessage}
                  </div>
                </div>
              )}
            </div>

            {/* Модальное окно остановок */}
            {showStopsModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-96 overflow-y-auto shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{t.stops}</h3>
                    <button
                      onClick={() => setShowStopsModal(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {currentRouteStops.map((stop, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <div className="font-medium">{stop.name}</div>
                        </div>
                        <div className="font-bold text-blue-600">{stop.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 3: // Детали поездки и личная информация
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <header className="bg-white shadow-sm border-b border-gray-200">
              <div className="flex items-center px-4 py-4">
                <button onClick={goBack} className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="text-xl font-semibold text-gray-800">{t.tripDetails}</h1>
              </div>
            </header>

            <div className="max-w-md mx-auto px-4 py-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <div className="w-0.5 h-16 bg-green-500 my-2"></div>
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center text-green-600 font-semibold mb-4">
                      <span className="text-xl mr-3">{selectedBus?.departureTime}</span>
                      <span>{routes.find(r => r.id === selectedBus?.routeId)?.departureAddress}</span>
                    </div>
                    <div className="flex items-center text-green-600 font-semibold">
                      <span className="text-xl mr-3">{selectedBus?.arrivalTime}</span>
                      <span>{routes.find(r => r.id === selectedBus?.routeId)?.arrivalAddress}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium underline transition-colors"
                  onClick={() => {
                    const route = routes.find(r => r.id === selectedBus?.routeId);
                    if (route && route.stops) {
                      setCurrentRouteStops(route.stops);
                      setShowStopsModal(true);
                    }
                  }}
                >
                  {t.viewAllStops}
                </button>
              </div>

              <PersonalInfo
                initialInfo={personalInfo}
                t={t}
                onInfoChange={(info) => setPersonalInfo(info)}
                onSubmit={() => {
                  setStep(4);
                  setIsBuyingReturn(false);
                  setSelectedSeats([]);
                }}
              />
            </div>

            {/* Модальное окно остановок */}
            {showStopsModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-96 overflow-y-auto shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{t.stops}</h3>
                    <button
                      onClick={() => setShowStopsModal(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {currentRouteStops.map((stop, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <div className="font-medium">{stop.name}</div>
                        </div>
                        <div className="font-bold text-blue-600">{stop.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 4: // Выбор мест
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <header className="bg-white shadow-sm border-b border-gray-200">
              <div className="flex items-center px-4 py-4">
                <button onClick={goBack} className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="text-xl font-semibold text-gray-800">
                  {isBuyingReturn ? `${t.returnTrip}: ${t.selectSeat}` : t.selectSeat}
                </h1>
              </div>
            </header>

            <div className="max-w-md mx-auto px-4 py-6 pb-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 text-center">
                  {isBuyingReturn ? `${t.returnTrip}: ${t.selectSeat}` : t.selectSeat}
                </h2>

                {/* Схема автобуса */}
                <div className="mb-6">
                  {/* Передняя часть */}
                  <div className="flex justify-center mb-4">
                    <div className="w-32 h-8 bg-gray-200 rounded-t-lg flex items-center justify-center text-xs text-gray-500 font-medium">
                      {t.front}
                    </div>
                  </div>

                  {/* Водитель */}
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-600 font-medium">
                      🚗
                    </div>
                  </div>

                  {/* Комфортные места (1-4) */}
                  <div className="mb-4 flex justify-center">
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4].map((seatNum, index) => {
                        const isSelected = isBuyingReturn ? returnSeats.includes(seatNum) : selectedSeats.includes(seatNum);
                        const isBooked = isSeatBooked(
                          isBuyingReturn ? returnBus?.id : selectedBus?.id,
                          isBuyingReturn ? returnDate : date,
                          seatNum
                        );

                        return (
                          <div key={seatNum}>
                            {index === 2 && <div className="w-12"></div>}
                            <button
                              className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-200 ${isBooked
                                ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                                : isSelected
                                  ? 'bg-blue-100 border-blue-500 text-blue-600 shadow-lg transform scale-105'
                                  : 'bg-green-50 border-green-300 text-green-600 hover:bg-green-100 hover:border-green-400 hover:transform hover:scale-105'
                                }`}
                              onClick={() => !isBooked && handleSeatSelection(seatNum)}
                              disabled={isBooked}
                            >
                              {isBooked ? <Lock size={16} /> : seatNum}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Стандартные места */}
                  {Array.from({ length: 12 }, (_, rowIndex) => {
                    const startSeat = 5 + rowIndex * 4;
                    const seatsInRow = rowIndex === 11 ? 2 : 4; // Последний ряд имеет только 2 места слева

                    return (
                      <div key={rowIndex} className="mb-2 flex justify-center">
                        <div className="grid grid-cols-5 gap-2">
                          {Array.from({ length: seatsInRow }, (_, seatIndex) => {
                            const seatNum = startSeat + seatIndex;
                            const isSelected = isBuyingReturn ? returnSeats.includes(seatNum) : selectedSeats.includes(seatNum);
                            const isBooked = isSeatBooked(
                              isBuyingReturn ? returnBus?.id : selectedBus?.id,
                              isBuyingReturn ? returnDate : date,
                              seatNum
                            );

                            return (
                              <div key={seatNum}>
                                {seatIndex === 2 && <div className="w-12"></div>}
                                <button
                                  className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-200 ${isBooked
                                    ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                                    : isSelected
                                      ? 'bg-blue-100 border-blue-500 text-blue-600 shadow-lg transform scale-105'
                                      : 'bg-white border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:transform hover:scale-105'
                                    }`}
                                  onClick={() => !isBooked && handleSeatSelection(seatNum)}
                                  disabled={isBooked}
                                >
                                  {isBooked ? <Lock size={16} /> : seatNum}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* Последний ряд (47-51) */}
                  <div className="mb-4 flex justify-center">
                    <div className="grid grid-cols-5 gap-2">
                      {[47, 48, 49, 50, 51].map((seatNum) => {
                        const isSelected = isBuyingReturn ? returnSeats.includes(seatNum) : selectedSeats.includes(seatNum);
                        const isBooked = isSeatBooked(
                          isBuyingReturn ? returnBus?.id : selectedBus?.id,
                          isBuyingReturn ? returnDate : date,
                          seatNum
                        );

                        return (
                          <button
                            key={seatNum}
                            className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-200 ${isBooked
                              ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                              : isSelected
                                ? 'bg-blue-100 border-blue-500 text-blue-600 shadow-lg transform scale-105'
                                : 'bg-white border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:transform hover:scale-105'
                              }`}
                            onClick={() => !isBooked && handleSeatSelection(seatNum)}
                            disabled={isBooked}
                          >
                            {isBooked ? <Lock size={16} /> : seatNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Задняя часть */}
                  <div className="flex justify-center mt-4">
                    <div className="w-32 h-8 bg-gray-200 rounded-b-lg flex items-center justify-center text-xs text-gray-500 font-medium">
                      {t.back}
                    </div>
                  </div>

                  {/* Легенда */}
                  <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-blue-300 bg-white mr-2 rounded"></div>
                      <span>{t.available}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-blue-500 bg-blue-100 mr-2 rounded"></div>
                      <span>{t.seatSelected}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-gray-300 bg-gray-200 mr-2 rounded"></div>
                      <span>{t.seatOccupied}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-green-300 bg-green-50 mr-2 rounded"></div>
                      <span>{t.comfort}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="font-semibold">
                    {t.selected}: {
                      isBuyingReturn
                        ? (returnSeats.length > 0 ? returnSeats.join(', ') : t.clearSelection)
                        : (selectedSeats.length > 0 ? selectedSeats.join(', ') : t.clearSelection)
                    }
                  </div>

                  {((isBuyingReturn ? returnSeats.length : selectedSeats.length) > 0) && (
                    <button
                      className="text-red-500 text-sm font-medium hover:text-red-700 transition-colors"
                      onClick={() => {
                        if (isBuyingReturn) {
                          setReturnSeats([]);
                        } else {
                          setSelectedSeats([]);
                        }
                      }}
                    >
                      {t.resetSelection}
                    </button>
                  )}
                </div>

                <div className="text-sm text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <span>{t.passengers}:</span>
                    <span className="font-medium">{passengers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.available}:</span>
                    <span className="font-medium text-green-600">
                      {isBuyingReturn ? returnBus?.availableSeats : selectedBus?.availableSeats} {t.seats}
                    </span>
                  </div>
                </div>

                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${(isBuyingReturn ? returnSeats.length > 0 : selectedSeats.length > 0)
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  disabled={isBuyingReturn ? returnSeats.length === 0 : selectedSeats.length === 0}
                  onClick={() => {
                    if (tripType === 'round-trip' && !isBuyingReturn) {
                      setIsBuyingReturn(true);
                      if (!returnBus) {
                        const availableReturnBuses = getAvailableBuses(to, from, returnDate);
                        if (availableReturnBuses.length > 0) {
                          setReturnBus(availableReturnBuses[0]);
                        } else {
                          setStep(5);
                        }
                      }
                    } else {
                      setStep(5);
                    }
                  }}
                >
                  {tripType === 'round-trip' && !isBuyingReturn ? t.continueButton : t.save}
                </button>
              </div>
            </div>
          </div>
        );

      case 5: // Оплата
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <header className="bg-white shadow-sm border-b border-gray-200">
              <div className="flex items-center px-4 py-4">
                <button onClick={goBack} className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="text-xl font-semibold text-gray-800">{t.payment}</h1>
              </div>
            </header>

            <div className="max-w-md mx-auto px-4 py-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">📋 Детали бронирования</h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.route}:</span>
                    <span className="font-semibold">{from} → {to}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.date}:</span>
                    <span className="font-semibold">{date}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.departureTime}:</span>
                    <span className="font-semibold">{selectedBus?.departureTime}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.seats}:</span>
                    <span className="font-semibold text-blue-600">{selectedSeats.join(', ')}</span>
                  </div>

                  {tripType === 'round-trip' && returnBus && returnSeats.length > 0 && (
                    <>
                      <div className="pt-4 mt-4 border-t-2 border-gray-200">
                        <h4 className="font-semibold text-blue-600 mb-3">🔄 {t.returnTrip}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center py-1">
                            <span className="text-gray-600">{t.route}:</span>
                            <span className="font-semibold">{to} → {from}</span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-gray-600">{t.date}:</span>
                            <span className="font-semibold">{returnDate}</span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-gray-600">{t.departureTime}:</span>
                            <span className="font-semibold">{returnBus?.departureTime}</span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-gray-600">{t.seats}:</span>
                            <span className="font-semibold text-blue-600">{returnSeats.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.passenger}:</span>
                    <span className="font-semibold">{personalInfo.firstName} {personalInfo.lastName}</span>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        {calculateTotalPrice()} {routes.find(r => r.id === selectedBus?.routeId)?.currency}
                      </div>
                      <div className="text-sm text-gray-500">{t.totalPayment}</div>
                    </div>
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium underline transition-colors"
                      onClick={() => setStep(4)}
                    >
                      {t.changeSeats}
                    </button>
                  </div>
                </div>
              </div>

              <PaymentForm
                t={t}
                totalAmount={`${calculateTotalPrice()} ${routes.find(r => r.id === selectedBus?.routeId)?.currency}`}
                onPaymentComplete={() => completeBooking()}
              />
            </div>
          </div>
        );

      case 6: // Подтверждение бронирования
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
            <header className="bg-white shadow-sm border-b border-gray-200">
              <div className="flex items-center px-4 py-4">
                <button onClick={goHome} className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="text-xl font-semibold text-gray-800">{t.bookingComplete}</h1>
              </div>
            </header>

            <div className="max-w-md mx-auto px-4 py-8 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} className="text-green-500" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.bookingSuccess}</h2>
              <p className="text-gray-600 mb-8">{t.bookingSuccessMessage}</p>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 text-left">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{selectedBus?.departureTime}</div>
                    <div className="text-sm text-gray-500">{date}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">
                      {Math.floor(routes.find(r => r.id === selectedBus?.routeId)?.duration / 60)}ч {routes.find(r => r.id === selectedBus?.routeId)?.duration % 60}м
                    </div>
                    <div className="w-16 h-0.5 bg-gray-300"></div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">{selectedBus?.arrivalTime}</div>
                    <div className="text-sm text-gray-500">+1 день</div>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <div className="font-medium">{from}</div>
                  <div className="font-medium">{to}</div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.seats}:</span>
                    <span className="font-semibold text-blue-600">{selectedSeats.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.passenger}:</span>
                    <span className="font-medium">{personalInfo.firstName} {personalInfo.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.busNumber}:</span>
                    <span className="font-medium">{selectedBus?.busNumber}</span>
                  </div>
                </div>
              </div>

              {tripType === 'round-trip' && returnBus && returnSeats.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 text-left">
                  <div className="text-center font-semibold text-blue-600 mb-4">🔄 {t.returnTrip}</div>

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{returnBus?.departureTime}</div>
                      <div className="text-sm text-gray-500">{returnDate}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">
                        {Math.floor(routes.find(r => r.id === returnBus?.routeId)?.duration / 60)}ч {routes.find(r => r.id === returnBus?.routeId)?.duration % 60}м
                      </div>
                      <div className="w-16 h-0.5 bg-gray-300"></div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">{returnBus?.arrivalTime}</div>
                      <div className="text-sm text-gray-500">+1 день</div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <div className="font-medium">{to}</div>
                    <div className="font-medium">{from}</div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.seats}:</span>
                      <span className="font-semibold text-blue-600">{returnSeats.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.passenger}:</span>
                      <span className="font-medium">{personalInfo.firstName} {personalInfo.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.busNumber}:</span>
                      <span className="font-medium">{returnBus?.busNumber}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <button
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl py-4 font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={() => setStep(7)}
                >
                  {t.myTrips}
                </button>
                <button
                  className="bg-white border-2 border-blue-600 text-blue-600 rounded-xl py-4 font-semibold hover:bg-blue-50 transition-all duration-200"
                  onClick={goHome}
                >
                  {t.toMain}
                </button>
              </div>
            </div>
          </div>
        );

      case 7: // Мои поездки
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <header className="bg-white shadow-sm border-b border-gray-200">
              <div className="flex justify-between items-center px-4 py-4">
                <h1 className="text-2xl font-bold text-gray-800">{t.trips}</h1>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'upcoming'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600'
                      }`}
                    onClick={() => setActiveTab('upcoming')}
                  >
                    {t.upcoming}
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'history'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600'
                      }`}
                    onClick={() => setActiveTab('history')}
                  >
                    {t.history}
                  </button>
                </div>
              </div>
            </header>

            <div className="max-w-md mx-auto px-4 py-6 pb-24">
              {activeTab === 'upcoming' ? (
                <>
                  {bookingHistory.filter(b => b.status === 'upcoming' && b.userId === currentUser?.id).length > 0 ? (
                    bookingHistory
                      .filter(b => b.status === 'upcoming' && b.userId === currentUser?.id)
                      .map((booking, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-4 hover:shadow-xl transition-all duration-300">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-2">
                                <div className="text-2xl font-bold text-gray-800">{booking.departureTime}</div>
                                <div className="text-2xl font-bold text-gray-800">{booking.arrivalTime}</div>
                              </div>
                              <div className="flex justify-between text-sm text-gray-500 mb-2">
                                <div className="font-medium">{booking.from}</div>
                                <div className="font-medium">{booking.to}</div>
                              </div>
                              <div className="text-sm text-blue-600 font-medium">📅 {booking.date}</div>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between py-1">
                              <span className="text-gray-600">{t.busNumber}:</span>
                              <span className="font-medium">{booking.busNumber}</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span className="text-gray-600">{t.seats}:</span>
                              <span className="font-semibold text-blue-600">{booking.seats.join(', ')}</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span className="text-gray-600">{t.price}:</span>
                              <span className="font-bold text-green-600">{booking.price} {booking.currency}</span>
                            </div>
                          </div>

                          <button
                            className="w-full mt-4 bg-blue-50 text-blue-600 rounded-lg py-3 font-medium hover:bg-blue-100 transition-colors"
                            onClick={() => {
                              setCurrentRouteStops(booking.stops || []);
                              setShowStopsModal(true);
                            }}
                          >
                            {t.viewDetails}
                          </button>
                        </div>
                      ))
                  ) : (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                      <div className="text-6xl mb-4">🎫</div>
                      <div className="text-xl font-semibold text-gray-600 mb-2">Нет предстоящих поездок</div>
                      <div className="text-gray-500">{t.noTrips}</div>
                      <button
                        className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg py-3 px-6 font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                        onClick={goHome}
                      >
                        Найти билеты
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {bookingHistory.filter(b => b.status === 'history' && b.userId === currentUser?.id).length > 0 ? (
                    bookingHistory
                      .filter(b => b.status === 'history' && b.userId === currentUser?.id)
                      .map((booking, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-4 opacity-75 hover:opacity-100 transition-all duration-300">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-2">
                                <div className="text-2xl font-bold text-gray-600">{booking.departureTime}</div>
                                <div className="text-2xl font-bold text-gray-600">{booking.arrivalTime}</div>
                              </div>
                              <div className="flex justify-between text-sm text-gray-500 mb-2">
                                <div className="font-medium">{booking.from}</div>
                                <div className="font-medium">{booking.to}</div>
                              </div>
                              <div className="text-sm text-gray-500 font-medium">📅 {booking.date}</div>
                            </div>
                            <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                              Завершено
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between py-1">
                              <span className="text-gray-600">{t.busNumber}:</span>
                              <span className="font-medium">{booking.busNumber}</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span className="text-gray-600">{t.seats}:</span>
                              <span className="font-semibold text-blue-600">{booking.seats.join(', ')}</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span className="text-gray-600">{t.price}:</span>
                              <span className="font-bold text-green-600">{booking.price} {booking.currency}</span>
                            </div>
                          </div>

                          <button
                            className="w-full mt-4 bg-green-50 text-green-600 rounded-lg py-3 font-medium hover:bg-green-100 transition-colors"
                            onClick={() => {
                              setCurrentReviewBooking(booking);
                              setShowReviewModal(true);
                            }}
                          >
                            ⭐ {t.leaveReview}
                          </button>
                        </div>
                      ))
                  ) : (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                      <div className="text-6xl mb-4">📚</div>
                      <div className="text-xl font-semibold text-gray-600 mb-2">Нет завершенных поездок</div>
                      <div className="text-gray-500">История ваших поездок появится здесь</div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Модальные окна */}
            {showStopsModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-96 overflow-y-auto shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{t.tripDetails}</h3>
                    <button
                      onClick={() => setShowStopsModal(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="font-semibold text-gray-700">{t.stops}:</div>
                    {currentRouteStops.map((stop, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <div className="font-medium">{stop.name}</div>
                        </div>
                        <div className="font-bold text-blue-600">{stop.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {showReviewModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{t.leaveReview}</h3>
                    <button
                      onClick={() => setShowReviewModal(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold">Маршрут: {currentReviewBooking?.from} → {currentReviewBooking?.to}</div>
                    <div className="text-sm text-gray-500">Дата: {currentReviewBooking?.date}</div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.yourRating}</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          size={32}
                          className={`cursor-pointer transition-colors ${star <= reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-300'
                            }`}
                          onClick={() => setReviewRating(star)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.yourReview}</label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder={t.shareExperience}
                    />
                  </div>

                  <button
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg py-3 font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                    onClick={addReview}
                  >
                    {t.submitReview}
                  </button>
                </div>
              </div>
            )}

            {/* Нижняя навигация */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
              <div className="max-w-md mx-auto flex justify-around py-3">
                <button
                  className="flex flex-col items-center text-xs"
                  onClick={goHome}
                >
                  <Home size={24} className="text-gray-500 mb-1" />
                  <span className="text-gray-500">{t.home}</span>
                </button>
                <div className="flex flex-col items-center text-xs">
                  <Ticket size={24} className="text-blue-600 mb-1" />
                  <span className="text-blue-600 font-medium">{t.trips}</span>
                </div>
                <button
                  className="flex flex-col items-center text-xs"
                  onClick={() => setStep(9)}
                >
                  <User size={24} className="text-gray-500 mb-1" />
                  <span className="text-gray-500">{t.profile}</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 9: // Профиль
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <header className="bg-white shadow-sm border-b border-gray-200">
              <div className="px-4 py-4">
                <h1 className="text-2xl font-bold text-gray-800">{t.profile}</h1>
              </div>
            </header>

            <div className="max-w-md mx-auto px-4 py-6 pb-24">
              {!isEditingProfile ? (
                <>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white text-xl font-bold">
                            {currentUser?.firstName?.charAt(0)}{currentUser?.lastName?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-gray-800">
                            {currentUser?.firstName} {currentUser?.lastName}
                          </div>
                          <div className="text-gray-500">{currentUser?.phone}</div>
                          <div className="text-gray-500">{currentUser?.email}</div>
                        </div>
                      </div>
                      <button
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsEditingProfile(true)}
                      >
                        <Edit size={20} className="text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <Info size={20} className="text-blue-600" />
                      </div>
                      <span className="text-gray-800 font-medium">{t.aboutUs}</span>
                      <ChevronRight size={20} className="text-gray-400 ml-auto" />
                    </button>

                    <button className="w-full flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <CreditCard size={20} className="text-green-600" />
                      </div>
                      <span className="text-gray-800 font-medium">{t.wallet}</span>
                      <ChevronRight size={20} className="text-gray-400 ml-auto" />
                    </button>

                    <button
                      className="w-full flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                      onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                    >
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                        <Globe size={20} className="text-purple-600" />
                      </div>
                      <span className="text-gray-800 font-medium flex-1">{t.language}</span>
                      <span className="text-gray-500 uppercase text-sm mr-2">{language}</span>
                      <ChevronRight size={20} className="text-gray-400" />
                    </button>

                    {showLanguageSelector && (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
                        {['ru', 'kg', 'en'].map((lang) => (
                          <button
                            key={lang}
                            className={`block w-full text-left p-3 my-1 rounded-lg transition-colors ${language === lang ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-gray-100'
                              }`}
                            onClick={() => {
                              setLanguage(lang);
                              setShowLanguageSelector(false);
                            }}
                          >
                            {lang === 'ru' ? 'Русский' : lang === 'kg' ? 'Кыргызча' : 'English'}
                          </button>
                        ))}
                      </div>
                    )}

                    <button
                      className="w-full flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                      onClick={logout}
                    >
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                        <LogOut size={20} className="text-red-600" />
                      </div>
                      <span className="text-gray-800 font-medium">{t.logout}</span>
                    </button>
                  </div>

                  <div className="mt-8 text-center">
                    <div className="flex justify-center mb-4">
                      <AppLogo className="h-16 w-auto" />
                      <div className="text-3xl font-bold" style={{ display: 'none' }}>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Версия 1.0.0
                    </div>
                  </div>
                </>
              ) : (
                // Режим редактирования профиля
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <div className="text-xl font-bold mb-6">{t.editProfile}</div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.email}</label>
                      <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                        <Mail size={20} className="text-gray-400 mr-3" />
                        <input
                          type="email"
                          className="w-full focus:outline-none bg-transparent text-gray-600"
                          value={currentUser?.email}
                          readOnly
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.firstName}</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={personalInfo.firstName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.lastName}</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={personalInfo.lastName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.phone}</label>
                      <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                        <Phone size={20} className="text-gray-400 mr-3" />
                        <input
                          type="tel"
                          className="w-full focus:outline-none"
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                          placeholder="+996 XXX XXX XXX"
                        />
                      </div>
                    </div>

                    <div className="flex items-center mt-6">
                      <input
                        type="checkbox"
                        id="changePassword"
                        checked={showPasswordField}
                        onChange={() => setShowPasswordField(!showPasswordField)}
                        className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="changePassword" className="text-sm font-medium text-gray-700">
                        {t.changePassword}
                      </label>
                    </div>

                    {showPasswordField && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t.newPassword}</label>
                          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                            <Lock size={20} className="text-gray-400 mr-3" />
                            <input
                              type="password"
                              className="w-full focus:outline-none"
                              placeholder={t.newPassword}
                              value={personalInfo.newPassword || ''}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, newPassword: e.target.value })}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t.confirmNewPassword}</label>
                          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                            <Lock size={20} className="text-gray-400 mr-3" />
                            <input
                              type="password"
                              className="w-full focus:outline-none"
                              placeholder={t.confirmNewPassword}
                              value={personalInfo.confirmPassword || ''}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, confirmPassword: e.target.value })}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex space-x-4 mt-8">
                      <button
                        className="flex-1 bg-gray-300 text-gray-700 rounded-lg py-3 font-semibold hover:bg-gray-400 transition-colors"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setPersonalInfo({
                            firstName: currentUser.firstName,
                            lastName: currentUser.lastName,
                            phone: currentUser.phone
                          });
                          setShowPasswordField(false);
                        }}
                      >
                        {t.cancel}
                      </button>
                      <button
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg py-3 font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                        onClick={() => {
                          if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.phone) {
                            alert(t.fillAllFields);
                            return;
                          }

                          const phoneRegex = /^\+996\d{9,}$/;
                          if (!phoneRegex.test(personalInfo.phone)) {
                            alert(t.invalidPhone);
                            return;
                          }

                          if (showPasswordField && personalInfo.newPassword !== personalInfo.confirmPassword) {
                            alert(t.passwordsDoNotMatch);
                            return;
                          }

                          const updatedUsers = users.map(user => {
                            if (user.id === currentUser.id) {
                              return {
                                ...user,
                                firstName: personalInfo.firstName,
                                lastName: personalInfo.lastName,
                                phone: personalInfo.phone,
                                password: showPasswordField && personalInfo.newPassword ? personalInfo.newPassword : user.password
                              };
                            }
                            return user;
                          });

                          setUsers(updatedUsers);
                          setCurrentUser({
                            ...currentUser,
                            firstName: personalInfo.firstName,
                            lastName: personalInfo.lastName,
                            phone: personalInfo.phone
                          });

                          setIsEditingProfile(false);
                          setShowPasswordField(false);
                          alert('Профиль успешно обновлен');
                        }}
                      >
                        {t.update}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Нижняя навигация */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
              <div className="max-w-md mx-auto flex justify-around py-3">
                <button
                  className="flex flex-col items-center text-xs"
                  onClick={goHome}
                >
                  <Home size={24} className="text-gray-500 mb-1" />
                  <span className="text-gray-500">{t.home}</span>
                </button>
                <button
                  className="flex flex-col items-center text-xs"
                  onClick={() => setStep(7)}
                >
                  <Ticket size={24} className="text-gray-500 mb-1" />
                  <span className="text-gray-500">{t.trips}</span>
                </button>
                <div className="flex flex-col items-center text-xs">
                  <User size={24} className="text-blue-600 mb-1" />
                  <span className="text-blue-600 font-medium">{t.profile}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 10: // Админ - Управление маршрутами
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <header className="bg-white shadow-sm border-b border-gray-200">
              <div className="flex items-center px-4 py-4">
                <button onClick={goHome} className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="text-xl font-semibold text-gray-800">{t.manageRoutes}</h1>
              </div>
            </header>

            <div className="max-w-md mx-auto px-4 py-6">
              <div className="flex justify-center mb-6">
                <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                  <button
                    className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${adminMode === 'routes'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    onClick={() => setAdminMode('routes')}
                  >
                    📍 Маршруты
                  </button>
                  <button
                    className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${adminMode === 'buses'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    onClick={() => setAdminMode('buses')}
                  >
                    🚌 Рейсы
                  </button>
                </div>
              </div>

              {adminMode === 'routes' && (
                <>
                  <button
                    className="mb-6 w-full bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl py-4 px-6 font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                    onClick={() => {
                      setEditRouteId(null);
                      setNewRouteData({
                        from: '',
                        to: '',
                        departureAddress: '',
                        arrivalAddress: '',
                        price: '',
                        duration: '',
                        vehicleType: 'автобус',
                        stops: []
                      });
                      setShowAddRouteForm(!showAddRouteForm);
                    }}
                  >
                    <Plus size={20} className="mr-2" />
                    {showAddRouteForm ? t.cancel : t.addNewRoute}
                  </button>

                  {showAddRouteForm && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
                      <h2 className="text-xl font-bold mb-6 text-center">
                        {editRouteId ? t.editRoute : t.addingNewRoute}
                      </h2>

                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.from}</label>
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Бишкек"
                              value={newRouteData.from}
                              onChange={(e) => setNewRouteData({ ...newRouteData, from: e.target.value })}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.to}</label>
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Каракол"
                              value={newRouteData.to}
                              onChange={(e) => setNewRouteData({ ...newRouteData, to: e.target.value })}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t.departureAddress}</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Г. Бишкек, ул.Ибраимова/Фрунзе"
                            value={newRouteData.departureAddress}
                            onChange={(e) => setNewRouteData({ ...newRouteData, departureAddress: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t.arrivalAddress}</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Г. Каракол, ул.Гебзе/Пржевальск"
                            value={newRouteData.arrivalAddress}
                            onChange={(e) => setNewRouteData({ ...newRouteData, arrivalAddress: e.target.value })}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.priceInSom}</label>
                            <input
                              type="number"
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="600"
                              value={newRouteData.price}
                              onChange={(e) => setNewRouteData({ ...newRouteData, price: e.target.value })}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.durationInMin}</label>
                            <input
                              type="number"
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="430"
                              value={newRouteData.duration}
                              onChange={(e) => setNewRouteData({ ...newRouteData, duration: e.target.value })}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t.vehicleType}</label>
                          <select
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={newRouteData.vehicleType}
                            onChange={(e) => setNewRouteData({ ...newRouteData, vehicleType: e.target.value })}
                          >
                            <option value="автобус">🚌 Автобус</option>
                            <option value="маршрутка">🚐 Маршрутка</option>
                          </select>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-medium text-gray-700">{t.stops}</label>
                            <button
                              type="button"
                              className="text-blue-600 text-sm flex items-center hover:text-blue-800 transition-colors"
                              onClick={() => {
                                const newStop = { name: '', time: '' };
                                setNewRouteData({
                                  ...newRouteData,
                                  stops: [...newRouteData.stops, newStop]
                                });
                              }}
                            >
                              <Plus size={16} className="mr-1" />
                              {t.addStop}
                            </button>
                          </div>

                          <div className="space-y-3">
                            {newRouteData.stops.map((stop, index) => (
                              <div key={index} className="flex space-x-2">
                                <input
                                  type="text"
                                  placeholder={t.stopName}
                                  className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  value={stop.name}
                                  onChange={(e) => {
                                    const updatedStops = [...newRouteData.stops];
                                    updatedStops[index].name = e.target.value;
                                    setNewRouteData({
                                      ...newRouteData,
                                      stops: updatedStops
                                    });
                                  }}
                                />
                                <input
                                  type="text"
                                  placeholder={t.stopTime}
                                  className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  value={stop.time}
                                  onChange={(e) => {
                                    const updatedStops = [...newRouteData.stops];
                                    updatedStops[index].time = e.target.value;
                                    setNewRouteData({
                                      ...newRouteData,
                                      stops: updatedStops
                                    });
                                  }}
                                />
                                <button
                                  type="button"
                                  className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                  onClick={() => {
                                    const updatedStops = [...newRouteData.stops];
                                    updatedStops.splice(index, 1);
                                    setNewRouteData({
                                      ...newRouteData,
                                      stops: updatedStops
                                    });
                                  }}
                                >
                                  <X size={20} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl py-4 font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          onClick={handleAddRoute}
                        >
                          {editRouteId ? t.update : t.addRoute}
                        </button>
                      </div>
                    </div>
                  )}

                  <h2 className="font-bold text-xl mb-4 text-gray-800">{t.existingRoutes}</h2>

                  <div className="space-y-4 pb-24">
                    {routes.length > 0 ? routes.map(route => (
                      <div key={route.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <div className="text-xl font-bold text-gray-800">{route.from} → {route.to}</div>
                          <div className="text-2xl font-bold text-green-600">{route.price} {route.currency}</div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div><strong>📍 Отправление:</strong> {route.departureAddress}</div>
                          <div><strong>🎯 Прибытие:</strong> {route.arrivalAddress}</div>
                          <div><strong>⏱️ Длительность:</strong> {Math.floor(route.duration / 60)}ч {route.duration % 60}м</div>
                          <div><strong>🚌 Тип:</strong> {route.vehicleType}</div>

                          {route.stops && route.stops.length > 0 && (
                            <button
                              className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
                              onClick={() => {
                                setCurrentRouteStops(route.stops);
                                setShowStopsModal(true);
                              }}
                            >
                              <span className="mr-1">🛑 Остановки ({route.stops.length})</span>
                              <ChevronRight size={16} />
                            </button>
                          )}
                        </div>

                        <div className="flex space-x-3">
                          <button
                            className="flex-1 bg-blue-100 text-blue-600 rounded-lg py-3 font-medium hover:bg-blue-200 transition-colors flex items-center justify-center"
                            onClick={() => {
                              const routeToEdit = routes.find(r => r.id === route.id);
                              if (routeToEdit) {
                                setNewRouteData({
                                  from: routeToEdit.from,
                                  to: routeToEdit.to,
                                  departureAddress: routeToEdit.departureAddress,
                                  arrivalAddress: routeToEdit.arrivalAddress,
                                  price: routeToEdit.price.toString(),
                                  duration: routeToEdit.duration.toString(),
                                  vehicleType: routeToEdit.vehicleType,
                                  stops: routeToEdit.stops || []
                                });
                                setEditRouteId(route.id);
                                setShowAddRouteForm(true);
                              }
                            }}
                          >
                            <Edit size={16} className="mr-1" />
                            {t.edit}
                          </button>
                          <button
                            className="flex-1 bg-red-100 text-red-600 rounded-lg py-3 font-medium hover:bg-red-200 transition-colors flex items-center justify-center"
                            onClick={() => {
                              if (window.confirm('Вы уверены, что хотите удалить этот маршрут?')) {
                                const updatedRoutes = routes.filter(r => r.id !== route.id);
                                setRoutes(updatedRoutes);

                                const updatedBuses = { ...buses };
                                for (const date in updatedBuses) {
                                  updatedBuses[date] = updatedBuses[date].filter(b => b.routeId !== route.id);
                                }
                                setBuses(updatedBuses);
                              }
                            }}
                          >
                            <Trash2 size={16} className="mr-1" />
                            {t.delete}
                          </button>
                        </div>
                      </div>
                    )) : (
                      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                        <div className="text-6xl mb-4">📍</div>
                        <div className="text-xl font-semibold text-gray-600 mb-2">Нет маршрутов</div>
                        <div className="text-gray-500">Добавьте первый маршрут для начала работы</div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {adminMode === 'buses' && (
                <>
                  <button
                    className="mb-6 w-full bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl py-4 px-6 font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                    onClick={() => setShowAddBusForm(!showAddBusForm)}
                  >
                    <Plus size={20} className="mr-2" />
                    {showAddBusForm ? t.cancel : t.addNewBus}
                  </button>

                  {showAddBusForm && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
                      <h2 className="text-xl font-bold mb-6 text-center">{t.addingNewBus}</h2>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t.selectRoute}</label>
                          <select
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={newBusData.routeId}
                            onChange={(e) => setNewBusData({ ...newBusData, routeId: e.target.value })}
                          >
                            <option value="">{t.selectRoute}</option>
                            {routes.map(route => (
                              <option key={route.id} value={route.id}>
                                {route.from} → {route.to} ({route.price} сом)
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t.selectDate}</label>
                          <input
                            type="date"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={newBusData.date ? newBusData.date.split('-').reverse().join('-') : ''}
                            onChange={(e) => {
                              const newDate = e.target.value ? e.target.value.split('-').reverse().join('-') : '';
                              setNewBusData({ ...newBusData, date: newDate });
                            }}
                            min={getCurrentDate().split('-').reverse().join('-')}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.departureTime}</label>
                            <input
                              type="time"
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={newBusData.departureTime}
                              onChange={(e) => setNewBusData({ ...newBusData, departureTime: e.target.value })}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Время прибытия</label>
                            <input
                              type="time"
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={newBusData.arrivalTime}
                              onChange={(e) => setNewBusData({ ...newBusData, arrivalTime: e.target.value })}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t.busNumber}</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="09KG209ADF"
                            value={newBusData.busNumber}
                            onChange={(e) => setNewBusData({ ...newBusData, busNumber: e.target.value })}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.seatsCount}</label>
                            <input
                              type="number"
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={newBusData.totalSeats}
                              onChange={(e) => setNewBusData({ ...newBusData, totalSeats: parseInt(e.target.value) || 51 })}
                              min="1"
                              max="51"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.vehicleType}</label>
                            <select
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={newBusData.vehicleType}
                              onChange={(e) => setNewBusData({ ...newBusData, vehicleType: e.target.value })}
                            >
                              <option value="автобус">🚌 Автобус</option>
                              <option value="маршрутка">🚐 Маршрутка</option>
                            </select>
                          </div>
                        </div>

                        <button
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl py-4 font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          onClick={handleAddBus}
                        >
                          {t.addBus}
                        </button>
                      </div>
                    </div>
                  )}

                  <h2 className="font-bold text-xl mb-4 text-gray-800">Существующие рейсы</h2>

                  <div className="space-y-4 pb-24">
                    {Object.keys(buses).length > 0 ? (
                      Object.keys(buses)
                        .sort((a, b) => new Date(a.split('-').reverse().join('-')) - new Date(b.split('-').reverse().join('-')))
                        .map(date => (
                          <div key={date} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                              📅 {date}
                              <span className="ml-auto text-sm font-normal text-gray-500">
                                {buses[date].length} рейс(ов)
                              </span>
                            </h3>

                            <div className="space-y-3">
                              {buses[date].map(bus => {
                                const route = routes.find(r => r.id === bus.routeId);
                                return (
                                  <div key={bus.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <div className="font-semibold text-gray-800">
                                          {route ? `${route.from} → ${route.to}` : 'Маршрут не найден'}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          🚌 {bus.busNumber} • {bus.vehicleType}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-semibold text-blue-600">
                                          {bus.departureTime} → {bus.arrivalTime}
                                        </div>
                                        <div className="text-sm text-green-600">
                                          {bus.availableSeats}/{bus.totalSeats} свободно
                                        </div>
                                      </div>
                                    </div>

                                    <button
                                      className="w-full mt-2 bg-red-100 text-red-600 rounded-lg py-2 font-medium hover:bg-red-200 transition-colors flex items-center justify-center"
                                      onClick={() => {
                                        if (window.confirm('Вы уверены, что хотите удалить этот рейс?')) {
                                          const updatedBuses = { ...buses };
                                          if (updatedBuses[date]) {
                                            updatedBuses[date] = updatedBuses[date].filter(b => b.id !== bus.id);
                                            if (updatedBuses[date].length === 0) {
                                              delete updatedBuses[date];
                                            }
                                            setBuses(updatedBuses);
                                          }
                                        }
                                      }}
                                    >
                                      <Trash2 size={16} className="mr-1" />
                                      Удалить рейс
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                        <div className="text-6xl mb-4">🚌</div>
                        <div className="text-xl font-semibold text-gray-600 mb-2">Нет рейсов</div>
                        <div className="text-gray-500">Добавьте первый рейс для начала работы</div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Модальное окно остановок */}
            {showStopsModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-96 overflow-y-auto shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{t.stops}</h3>
                    <button
                      onClick={() => setShowStopsModal(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {currentRouteStops.map((stop, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <div className="font-medium">{stop.name}</div>
                        </div>
                        <div className="font-bold text-blue-600">{stop.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 11: // Админ - Все бронирования и отзывы
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <header className="bg-white shadow-sm border-b border-gray-200">
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center">
                  <button onClick={goHome} className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <ArrowLeft size={20} className="text-gray-600" />
                  </button>
                  <h1 className="text-xl font-semibold text-gray-800">
                    {adminTab === 'reviews' ? t.reviews : t.allBookings}
                  </h1>
                </div>
                {adminTab !== 'reviews' && (
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setShowFilterModal(true)}
                  >
                    <Filter size={20} className="text-gray-600" />
                  </button>
                )}
              </div>
            </header>

            <div className="max-w-md mx-auto px-4 py-6">
              <div className="flex justify-center mb-6">
                <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${adminTab === 'ongoing'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    onClick={() => setAdminTab('ongoing')}
                  >
                    🟢 {t.ongoing}
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${adminTab === 'completed'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    onClick={() => setAdminTab('completed')}
                  >
                    ✅ {t.completed}
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${adminTab === 'reviews'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    onClick={() => setAdminTab('reviews')}
                  >
                    ⭐ {t.reviews}
                  </button>
                </div>
              </div>

              {/* Отображение активных фильтров */}
              {adminTab !== 'reviews' && Object.values(filterOptions).some(v => v) && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.date && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          📅 {filterOptions.date}
                        </span>
                      )}
                      {filterOptions.route && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          🗺️ {filterOptions.route}
                        </span>
                      )}
                      {filterOptions.busNumber && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          🚌 {filterOptions.busNumber}
                        </span>
                      )}
                    </div>
                    <button
                      className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
                      onClick={() => {
                        setFilterOptions({ date: '', route: '', busNumber: '' });
                      }}
                    >
                      {t.clearFilters}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4 pb-24">
                {adminTab === 'reviews' ? (
                  <>
                    {reviews.length > 0 ? (
                      reviews.map(review => (
                        <div key={review.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="font-bold text-lg text-gray-800">{review.userName}</div>
                              <div className="text-sm text-gray-500">{review.route} • {review.date}</div>
                            </div>
                            <div className="flex">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} size={18} className="text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                            <p className="text-gray-700 italic">"{review.text}"</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                        <div className="text-6xl mb-4">⭐</div>
                        <div className="text-xl font-semibold text-gray-600 mb-2">{t.noReviews}</div>
                        <div className="text-gray-500">Отзывы пользователей появятся здесь</div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-2">
                                <div className="text-xl font-bold text-gray-800">{booking.from} → {booking.to}</div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'upcoming'
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-gray-100 text-gray-600'
                                  }`}>
                                  {booking.status === 'upcoming' ? t.upcoming : t.completed}
                                </div>
                              </div>
                              <div className="flex justify-between items-center mb-2">
                                <div className="text-lg font-semibold text-blue-600">{booking.departureTime}</div>
                                <div className="text-sm text-gray-500">📅 {booking.date}</div>
                                <div className="text-lg font-semibold text-blue-600">{booking.arrivalTime}</div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-gray-600 mb-1">{t.passenger}:</div>
                              <div className="font-semibold">{booking.passenger}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-gray-600 mb-1">{t.phone}:</div>
                              <div className="font-semibold">{booking.phone}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-gray-600 mb-1">{t.seats}:</div>
                              <div className="font-semibold text-blue-600">{booking.seats.join(', ')}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-gray-600 mb-1">{t.price}:</div>
                              <div className="font-bold text-green-600">{booking.price} {booking.currency}</div>
                            </div>
                          </div>

                          <div className="text-sm text-gray-600 mb-4">
                            <div className="flex justify-between py-1">
                              <span>{t.busNumber}:</span>
                              <span className="font-medium">{booking.busNumber}</span>
                            </div>
                          </div>

                          <button
                            className="w-full bg-blue-50 text-blue-600 rounded-lg py-3 font-medium hover:bg-blue-100 transition-colors"
                            onClick={() => {
                              setCurrentRouteStops(booking.stops || []);
                              setShowStopsModal(true);
                            }}
                          >
                            {t.viewDetails}
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <div className="text-xl font-semibold text-gray-600 mb-2">{t.noBookings}</div>
                        <div className="text-gray-500">Бронирования появятся здесь</div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Модальное окно фильтрации */}
            {showFilterModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">{t.filterBookings}</h3>
                    <button
                      onClick={() => setShowFilterModal(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.filterByDate}</label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={filterOptions.date ? filterOptions.date.split('-').reverse().join('-') : ''}
                        onChange={(e) => {
                          const newDate = e.target.value ? e.target.value.split('-').reverse().join('-') : '';
                          setFilterOptions({ ...filterOptions, date: newDate });
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.filterByRoute}</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={filterOptions.route}
                        onChange={(e) => setFilterOptions({ ...filterOptions, route: e.target.value })}
                      >
                        <option value="">Все маршруты</option>
                        {Array.from(new Set(bookingHistory.map(b => `${b.from} - ${b.to}`))).map((route, idx) => (
                          <option key={idx} value={route}>{route}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.filterByBus}</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={filterOptions.busNumber}
                        onChange={(e) => setFilterOptions({ ...filterOptions, busNumber: e.target.value })}
                      >
                        <option value="">Все автобусы</option>
                        {Array.from(new Set(bookingHistory.map(b => b.busNumber))).map((busNumber, idx) => (
                          <option key={idx} value={busNumber}>{busNumber}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        className="flex-1 bg-gray-300 text-gray-700 rounded-lg py-3 font-semibold hover:bg-gray-400 transition-colors"
                        onClick={() => {
                          setFilterOptions({ date: '', route: '', busNumber: '' });
                        }}
                      >
                        {t.clearFilters}
                      </button>
                      <button
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg py-3 font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                        onClick={() => {
                          applyFilters();
                          setShowFilterModal(false);
                        }}
                      >
                        {t.apply}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Модальное окно для просмотра деталей поездки */}
            {showStopsModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-96 overflow-y-auto shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{t.tripDetails}</h3>
                    <button
                      onClick={() => setShowStopsModal(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="font-semibold text-gray-700">{t.stops}:</div>
                    {currentRouteStops.map((stop, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <div className="font-medium">{stop.name}</div>
                        </div>
                        <div className="font-bold text-blue-600">{stop.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Нижняя навигация */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
              <div className="max-w-md mx-auto flex justify-around py-3">
                <button
                  className="flex flex-col items-center text-xs"
                  onClick={goHome}
                >
                  <Home size={24} className="text-gray-500 mb-1" />
                  <span className="text-gray-500">{t.home}</span>
                </button>
                <button
                  className="flex flex-col items-center text-xs"
                  onClick={() => setStep(1)}
                >
                  <Search size={24} className="text-gray-500 mb-1" />
                  <span className="text-gray-500">{t.search}</span>
                </button>
                <button
                  className="flex flex-col items-center text-xs"
                  onClick={logout}
                >
                  <LogOut size={24} className="text-gray-500 mb-1" />
                  <span className="text-gray-500">{t.exit}</span>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
              <div className="text-6xl mb-4">❌</div>
              <div className="text-xl font-semibold text-gray-800 mb-2">Неизвестный экран</div>
              <div className="text-gray-500 mb-6">Экран {step} не найден</div>
              <button
                className="bg-blue-600 text-white rounded-lg py-3 px-6 font-semibold hover:bg-blue-700 transition-colors"
                onClick={goHome}
              >
                На главную
              </button>
            </div>
          </div>
        );

    }
  };

  // Основной рендер приложения
  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md mx-auto bg-white shadow-2xl">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;