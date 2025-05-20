import React, { useState, useEffect, useRef } from 'react';
import {
  CreditCard, Calendar, MapPin, Users, Clock, ArrowLeft,
  Bell, Home, Ticket, User, Mail, Phone, Lock, Edit,
  Plus, Check, AlertCircle, ChevronDown, ChevronRight,
  Globe, Settings, LogOut, Help, Star, X, Eye, EyeOff,
  Info, Menu, CheckCircle, Trash2, Map
} from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Настройка Stripe
const stripePromise = loadStripe('pk_test_51RQquL049hmpAfjvCQKeAXV4mGWiPDSgAit89TGGspUWCevRQxuLkZlo2cmNDp20zCq9ES44xCFIi4QqbxLfhImg008sS4qs01');

// Обновленный дизайн сидений в автобусе, соответствующий изображению
const seatLayout = [
  // Ряд 1 (передний)
  { id: 1, type: 'driver', position: 'front-left' },
  { id: 2, type: 'standard', position: 'front-right' },
  // Ряд 2
  { id: 3, type: 'standard', position: 'left' },
  { id: 4, type: 'standard', position: 'right' },
  // Ряд 3
  { id: 5, type: 'standard', position: 'left' },
  { id: 6, type: 'standard', position: 'right' },
  // Ряд 4
  { id: 7, type: 'standard', position: 'left' },
  { id: 8, type: 'standard', position: 'right' },
  // Ряд 5
  { id: 9, type: 'standard', position: 'left' },
  { id: 10, type: 'standard', position: 'right' },
  // Ряд 6
  { id: 11, type: 'standard', position: 'left' },
  { id: 12, type: 'standard', position: 'right' },
  // Ряд 7
  { id: 13, type: 'standard', position: 'left' },
  { id: 14, type: 'standard', position: 'right' },
  // Ряд 8
  { id: 15, type: 'standard', position: 'left' },
  { id: 16, type: 'standard', position: 'right' },
  // Ряд 9
  { id: 17, type: 'standard', position: 'left' },
  { id: 18, type: 'standard', position: 'right' },
  // Ряд 10
  { id: 19, type: 'standard', position: 'left' },
  { id: 20, type: 'standard', position: 'right' },
  // Ряд 11
  { id: 21, type: 'standard', position: 'left' },
  { id: 22, type: 'standard', position: 'right' },
  // Ряд 12
  { id: 23, type: 'standard', position: 'left' },
  { id: 24, type: 'standard', position: 'right' },
  // Ряд 13 
  { id: 25, type: 'standard', position: 'left' },
  { id: 26, type: 'standard', position: 'right' },
  // Последний ряд (задние 5 мест)
  { id: 47, type: 'comfort', position: 'back' },
  { id: 48, type: 'comfort', position: 'back' },
  { id: 49, type: 'comfort', position: 'back' },
  { id: 50, type: 'comfort', position: 'back' },
  { id: 51, type: 'comfort', position: 'back' }
];

// Комфортные места (с повышенной ценой)
const comfortSeats = [47, 48, 49, 50, 51];

// Начальные данные приложения
const initialRoutes = [
  {
    id: 1,
    from: "Бишкек",
    to: "Каракол",
    departureAddress: "Г. Бишкек, ул.Ибраимова/Фрунзе",
    arrivalAddress: "Г. Каракол, ул.Гебзе/Пржевальск",
    availableDates: ["15-05-2025", "16-05-2025", "17-05-2025"],
    price: 600,
    currency: "сом",
    duration: 430, // в минутах
    vehicleType: "автобус",
    stops: [
      { name: "Бишкек (отправление)", time: "23:00" },
      { name: "Балыкчи", time: "01:30" },
      { name: "Чолпон-Ата", time: "02:30" },
      { name: "Тамчы", time: "03:10" },
      { name: "Каракол (прибытие)", time: "06:10" }
    ]
  },
  {
    id: 2,
    from: "Каракол",
    to: "Бишкек",
    departureAddress: "Г. Каракол, ул.Гебзе/Пржевальск",
    arrivalAddress: "Г. Бишкек, ул.Ибраимова/Фрунзе",
    availableDates: ["15-05-2025", "16-05-2025", "17-05-2025"],
    price: 600,
    currency: "сом",
    duration: 430,
    vehicleType: "маршрутка",
    stops: [
      { name: "Каракол (отправление)", time: "23:00" },
      { name: "Тамчы", time: "01:50" },
      { name: "Чолпон-Ата", time: "02:30" },
      { name: "Балыкчи", time: "03:30" },
      { name: "Бишкек (прибытие)", time: "06:10" }
    ]
  },
];

// Начальные рейсы
const initialBuses = {
  "15-05-2025": [
    {
      id: 1,
      routeId: 1,
      departureTime: "23:00",
      arrivalTime: "06:10",
      busNumber: "09KG209ADF",
      carrier: "ОсОО \"GOBUS\"",
      totalSeats: 51,
      availableSeats: 51, // Изначально все места свободны
      vehicleType: "автобус"
    },
    {
      id: 2,
      routeId: 1,
      departureTime: "23:30",
      arrivalTime: "06:25",
      busNumber: "01KG919AO",
      carrier: "ОсОО \"GOBUS\"",
      totalSeats: 51,
      availableSeats: 51,
      vehicleType: "автобус"
    },
    {
      id: 3,
      routeId: 2,
      departureTime: "23:00",
      arrivalTime: "06:10",
      busNumber: "06KG377BA",
      carrier: "ОсОО \"GOBUS\"",
      totalSeats: 51,
      availableSeats: 51,
      vehicleType: "маршрутка"
    }
  ],
  "16-05-2025": [
    {
      id: 4,
      routeId: 1,
      departureTime: "23:00",
      arrivalTime: "06:10",
      busNumber: "09KG209ADF",
      carrier: "ОсОО \"GOBUS\"",
      totalSeats: 51,
      availableSeats: 51,
      vehicleType: "автобус"
    },
    {
      id: 5,
      routeId: 2,
      departureTime: "23:00",
      arrivalTime: "06:10",
      busNumber: "06KG379BA",
      carrier: "ОсОО \"GOBUS\"",
      totalSeats: 51,
      availableSeats: 51,
      vehicleType: "маршрутка"
    }
  ],
  "17-05-2025": [
    {
      id: 6,
      routeId: 1,
      departureTime: "23:00",
      arrivalTime: "06:10",
      busNumber: "09KG209ADF",
      carrier: "ОсОО \"GOBUS\"",
      totalSeats: 51,
      availableSeats: 51,
      vehicleType: "автобус"
    },
    {
      id: 7,
      routeId: 2,
      departureTime: "23:00",
      arrivalTime: "06:10",
      busNumber: "06KG379BA",
      carrier: "ОсОО \"GOBUS\"",
      totalSeats: 51,
      availableSeats: 51,
      vehicleType: "маршрутка"
    }
  ]
};

// Начальные забронированные места (пустые для всех рейсов)
const initialBookedSeats = {};

// Начальные пользователи
const initialUsers = [
  {
    id: 1,
    email: "admin@gobus.kg",
    password: "admin123",
    firstName: "Админ",
    lastName: "GOBUS",
    phone: "+996555123456",
    role: "admin",
    verificationCode: "",
    isVerified: true
  },
  {
    id: 2,
    email: "aelina@gmail.com",
    password: "password123",
    firstName: "Аэлина",
    lastName: "Рысбекова",
    phone: "+996508737705",
    role: "user",
    verificationCode: "",
    isVerified: true
  }
];

// Переводы для мультиязычной поддержки
const translations = {
  ru: {
    appName: "GOBUS",
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
    ticketReturn: "Возврат осуществляется в соответствии с договором оферты",
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
    verifyPhone: "Подтверждение номера",
    verificationCodeSent: "Код подтверждения отправлен на ваш номер телефона",
    enterVerificationCode: "Введите код подтверждения",
    verify: "Подтвердить",
    forgotPassword: "Забыли пароль?",
    resetPassword: "Сбросить пароль",
    newPassword: "Новый пароль",
    confirmNewPassword: "Подтвердите новый пароль",
    resetPasswordButton: "Сбросить пароль",
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
    insufficientFunds: "Недостаточно средств на карте",
    paymentSuccessful: "Оплата прошла успешно",
    returnTrip: "Обратная поездка",
    searchReturnTicket: "Искать обратный билет",
    alreadyBooked: "Занято",
    continueButton: "Продолжить",
    noTrips: "У вас пока нет забронированных поездок",
    selectLanguage: "Выберите язык",
    changePassword: "Изменить пароль",
    noBookings: "Нет бронирований",
    upcoming: "Предстоящий",
    completed: "Завершен",
    editRoute: "Редактировать маршрут",
    clearSelection: "Сбросить выбор",
    mapRoute: "Карта маршрута",
    reviews: "Отзывы",
    yourReview: "Ваш отзыв",
    yourRating: "Ваша оценка",
    shareExperience: "Расскажите о вашем опыте...",
    submitReview: "Отправить отзыв",
    noReviews: "Пока нет отзывов",
    resetSelection: "Сбросить выбор",
    seatSelected: "Место выбрано",
    seatOccupied: "Место занято",
    driver: "Водитель",
    bookedSeats: "Забронированные места",
    mapRoute: "Карта маршрута"
  },

  kg: {
    // Аналогичные переводы для кыргызского языка
    appName: "GOBUS",
    oneWay: "Бир жакка",
    // ... (остальные переводы аналогично)
  },

  en: {
    // Аналогичные переводы для английского языка
    appName: "GOBUS",
    oneWay: "One way",
    // ... (остальные переводы аналогично)
  }
};

// Компонент для обработки платежей через Stripe
const PaymentForm = ({ onSuccess, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    // Получаем данные карты
    const cardElement = elements.getElement(CardElement);

    // Создаем платежный метод
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    try {
      // Отправляем запрос на сервер для создания платежного намерения
      const response = await fetch('https://ваш-сервер.com/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Сумма в копейках/центах
          payment_method_id: paymentMethod.id,
          currency: 'kgs', // Или другая валюта
        }),
      });

      const paymentResponse = await response.json();

      if (paymentResponse.success) {
        setLoading(false);
        onSuccess();
      } else {
        setError(paymentResponse.error || 'Ошибка оплаты');
        setLoading(false);
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-3 border border-gray-300 rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
            hidePostalCode: true,
          }}
          onChange={(event) => {
            // Показать состояние валидации
            if (event.error) {
              setError(event.error.message);
            } else {
              setError(null);
            }
          }}
        />
      </div>

      {error && (
        <div className="p-3 mt-2 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="mt-4 w-full bg-blue-600 text-white rounded-lg py-3 font-medium"
        disabled={!stripe || loading}
      >
        {loading ? 'Обработка...' : `Оплатить ${amount} сом`}
      </button>
    </form>
  );
};

// Основной компонент приложения
const App = () => {
  // Респонсивные медиа-запросы
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Состояния для многоязычной поддержки
  const [language, setLanguage] = useState('ru');
  const t = translations[language] || translations['ru']; // Текущие переводы

  // Основные состояния приложения
  const [step, setStep] = useState(0); // Начинаем с экрана регистрации/входа
  const [tripType, setTripType] = useState('one-way');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('15-05-2025');
  const [returnDate, setReturnDate] = useState('16-05-2025');
  const [passengers, setPassengers] = useState(1);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [previouslySelectedSeats, setPreviouslySelectedSeats] = useState([]);
  const [returnBus, setReturnBus] = useState(null);
  const [returnSeats, setReturnSeats] = useState([]);
  const [seatType, setSeatType] = useState('standard');
  const [isBuyingReturn, setIsBuyingReturn] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  // Состояния для данных приложения
  const [routes, setRoutes] = useState(initialRoutes);
  const [buses, setBuses] = useState(initialBuses);
  const [bookedSeats, setBookedSeats] = useState(initialBookedSeats);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [bookingHistory, setBookingHistory] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(initialUsers);

  // Состояния для регистрации/авторизации
  const [registrationData, setRegistrationData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Состояния для платежей
  const [paymentValidation, setPaymentValidation] = useState({
    isValid: false,
    message: '',
    isProcessing: false
  });
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  // Состояния для административной панели
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMode, setAdminMode] = useState('routes');
  const [adminTab, setAdminTab] = useState('bookings');
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
  const [showAddRouteForm, setShowAddRouteForm] = useState(false);
  const [showAddBusForm, setShowAddBusForm] = useState(false);
  const [editRouteId, setEditRouteId] = useState(null);

  // Состояния для вкладок и модальных окон
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedVerificationCode, setGeneratedVerificationCode] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    phone: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [resetPasswordStep, setResetPasswordStep] = useState(1);
  const [showStopsModal, setShowStopsModal] = useState(false);
  const [currentRouteStops, setCurrentRouteStops] = useState([]);

  // Состояния для профиля и языковых настроек
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Состояния для отзывов
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentReviewBooking, setCurrentReviewBooking] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  // Состояние для отображения карты
  const [mapView, setMapView] = useState(false);

  // Реф для календаря
  const calendarRef = useRef(null);

  // Текущая дата для валидации дат
  const currentDate = new Date();
  const formattedCurrentDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;

  // Эффект для установки информации о пользователе при входе
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

  // Эффект для обновления статуса поездок на основе даты
  useEffect(() => {
    const today = new Date();

    // Обновляем статус прошедших поездок на 'history'
    const updatedHistory = bookingHistory.map(booking => {
      // Преобразуем дату из строки формата "DD-MM-YYYY" в объект Date
      const [day, month, year] = booking.date.split('-').map(Number);
      const bookingDate = new Date(year, month - 1, day);

      // Если дата поездки уже прошла и статус "upcoming"
      if (bookingDate < today && booking.status === 'upcoming') {
        return { ...booking, status: 'history' };
      }
      return booking;
    });

    if (JSON.stringify(updatedHistory) !== JSON.stringify(bookingHistory)) {
      setBookingHistory(updatedHistory);
    }
  }, [bookingHistory]);

  // Функция для генерации случайного кода подтверждения
  const generateVerificationCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString(); // 4-значный код
    setGeneratedVerificationCode(code);
    return code;
  };

  // Функция для отправки кода подтверждения (имитация)
  const sendVerificationCode = (phone) => {
    const code = generateVerificationCode();
    console.log(`Verification code ${code} sent to ${phone}`);

    // В реальном приложении здесь бы отправлялось SMS
    alert(`Код подтверждения ${code} был отправлен на номер ${phone}`);

    return code;
  };

  // Функция для подтверждения номера телефона
  const verifyPhoneNumber = () => {
    if (verificationCode === generatedVerificationCode) {
      // Обновляем статус верификации пользователя
      if (currentUser) {
        const updatedUsers = users.map(user => {
          if (user.id === currentUser.id) {
            return { ...user, isVerified: true };
          }
          return user;
        });
        setUsers(updatedUsers);
        setCurrentUser({ ...currentUser, isVerified: true });
      }

      setShowVerificationModal(false);
      return true;
    } else {
      alert('Неверный код подтверждения');
      return false;
    }
  };

  // Функция для обработки регистрации
  const handleRegistration = (e) => {
    e.preventDefault();

    // Валидация формы
    if (registrationData.password !== registrationData.confirmPassword) {
      alert(t.passwordsDoNotMatch);
      return;
    }

    if (!registrationData.email || !registrationData.password || !registrationData.firstName ||
      !registrationData.lastName || !registrationData.phone) {
      alert(t.fillAllFields);
      return;
    }

    // Проверка, существует ли email уже
    if (users.some(user => user.email === registrationData.email)) {
      alert(t.userExists);
      return;
    }

    // Валидация формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registrationData.email)) {
      alert(t.invalidEmail);
      return;
    }

    // Валидация формата телефона
    const phoneRegex = /^\+996\d{9}$/;
    if (!phoneRegex.test(registrationData.phone)) {
      alert(t.invalidPhone);
      return;
    }

    // Отправка кода подтверждения и отображение модального окна
    sendVerificationCode(registrationData.phone);
    setShowVerificationModal(true);

    // Создание нового пользователя (будет завершено после верификации)
    const newUser = {
      id: users.length + 1,
      email: registrationData.email,
      password: registrationData.password,
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      phone: registrationData.phone,
      role: 'user',
      verificationCode: generatedVerificationCode,
      isVerified: false
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
  };

  // Функция для завершения регистрации после верификации
  const completeRegistration = () => {
    if (verifyPhoneNumber()) {
      setIsLoggedIn(true);
      setStep(1); // Переход на главный экран поиска
    }
  };

  // Функция для обработки входа
  const handleLogin = (e) => {
    e.preventDefault();

    // Поиск пользователя
    const user = users.find(u => u.email === loginData.email && u.password === loginData.password);

    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setIsAdmin(user.role === 'admin');
      setStep(1); // Переход на главный экран поиска
    } else {
      alert('Неверный email или пароль');
    }
  };

  // Функция для обработки забытого пароля
  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
    setResetPasswordStep(1);
  };

  // Функция для отправки кода сброса пароля
  const sendResetPasswordCode = () => {
    // Поиск пользователя по телефону
    const user = users.find(u => u.phone === resetPasswordData.phone);

    if (!user) {
      alert('Пользователь с таким номером телефона не найден');
      return;
    }

    const code = sendVerificationCode(resetPasswordData.phone);
    setGeneratedVerificationCode(code);
    setResetPasswordStep(2);
  };

  // Функция для проверки кода сброса пароля
  const verifyResetPasswordCode = () => {
    if (resetPasswordData.verificationCode === generatedVerificationCode) {
      setResetPasswordStep(3);
    } else {
      alert('Неверный код подтверждения');
    }
  };

  // Функция для сброса пароля
  const resetPassword = () => {
    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      alert(t.passwordsDoNotMatch);
      return;
    }

    // Обновление пароля пользователя
    const updatedUsers = users.map(user => {
      if (user.phone === resetPasswordData.phone) {
        return { ...user, password: resetPasswordData.newPassword };
      }
      return user;
    });

    setUsers(updatedUsers);
    setShowForgotPasswordModal(false);
    alert('Пароль успешно изменен');
  };

  // Функция для валидации кредитной карты (простая валидация)
  const validateCreditCard = (cardNumber, expiryDate, cvv, cardName) => {
    if (!cardNumber || !expiryDate || !cvv || !cardName) {
      return {
        isValid: false,
        message: t.fillAllFields
      };
    }

    // Простая валидация номера карты (16 цифр)
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      return {
        isValid: false,
        message: t.invalidCardNumber
      };
    }

    // Простая валидация даты срока действия (формат MM/YY)
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      return {
        isValid: false,
        message: t.invalidExpiryDate
      };
    }

    // Простая валидация CVV (3 или 4 цифры)
    if (!/^\d{3,4}$/.test(cvv)) {
      return {
        isValid: false,
        message: t.invalidCVV
      };
    }

    // Проверка, достаточно ли средств на карте (имитация)
    const totalPrice = calculateTotalPrice();
    if (totalPrice > 10000) { // Произвольная проверка для демонстрации
      return {
        isValid: false,
        message: t.insufficientFunds
      };
    }

    return {
      isValid: true,
      message: t.paymentSuccessful
    };
  };

  // Функция для получения доступных автобусов для маршрута и даты
  const getAvailableBuses = (routeFrom, routeTo, selectedDate) => {
    return (buses[selectedDate] || []).filter(bus => {
      const route = routes.find(r => r.id === bus.routeId);
      return route && route.from === routeFrom && route.to === routeTo;
    });
  };

  // Функция для расчета общей стоимости
  const calculateTotalPrice = () => {
    let totalPrice = 0;

    // Добавление цены для основного маршрута
    if (selectedBus) {
      const route = routes.find(r => r.id === selectedBus.routeId);
      if (route) {
        let basePrice = route.price * selectedSeats.length;

        // Добавление надбавки за комфортные места, если выбраны
        const comfortPriceAddition = selectedSeats.filter(seat => comfortSeats.includes(seat)).length * 50;
        totalPrice += basePrice + comfortPriceAddition;
      }
    }

    // Добавление цены для обратного маршрута, если применимо
    if (tripType === 'round-trip' && returnBus) {
      const returnRoute = routes.find(r => r.id === returnBus.routeId);
      if (returnRoute) {
        let returnBasePrice = returnRoute.price * returnSeats.length;

        // Добавление надбавки за комфортные места для обратного маршрута
        const returnComfortPriceAddition = returnSeats.filter(seat => comfortSeats.includes(seat)).length * 50;
        totalPrice += returnBasePrice + returnComfortPriceAddition;
      }
    }

    return totalPrice;
  };

  // Функция для обработки выбора места
  const handleSeatSelection = (seatNumber) => {
    // Проверка, является ли место местом водителя (id=1)
    if (seatNumber === 1) {
      return; // Нельзя выбрать место водителя
    }

    if (isBuyingReturn) {
      // Обработка выбора места для обратного маршрута
      if (returnSeats.includes(seatNumber)) {
        setReturnSeats(returnSeats.filter(seat => seat !== seatNumber));
      } else {
        if (returnSeats.length < passengers) {
          setReturnSeats([...returnSeats, seatNumber]);
        } else {
          // Если уже выбрано максимальное количество мест, заменяем первое выбранное место
          const newSeats = [...returnSeats];
          newSeats.shift(); // Удаляем первое место
          newSeats.push(seatNumber); // Добавляем новое место
          setReturnSeats(newSeats);
        }
      }
    } else {
      // Обработка выбора места для основного маршрута
      if (selectedSeats.includes(seatNumber)) {
        setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
      } else {
        if (selectedSeats.length < passengers) {
          setSelectedSeats([...selectedSeats, seatNumber]);
        } else {
          // Если уже выбрано максимальное количество мест, заменяем первое выбранное место
          const newSeats = [...selectedSeats];
          newSeats.shift(); // Удаляем первое место
          newSeats.push(seatNumber); // Добавляем новое место
          setSelectedSeats(newSeats);
        }
      }
    }
  };

  // Функция для проверки, забронировано ли место
  const isSeatBooked = (busId, selectedDate, seatNumber) => {
    const key = `${busId}-${selectedDate}`;
    return bookedSeats[key] && bookedSeats[key].includes(seatNumber);
  };

  // Функция для добавления отзыва
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

  // Функция для обработки платежа и завершения бронирования
  const processPayment = () => {
    setPaymentValidation({
      isValid: false,
      message: '',
      isProcessing: true
    });

    // Имитация вызова API для обработки платежа
    setTimeout(() => {
      // Валидация карты
      const validation = validateCreditCard(
        cardData.cardNumber,
        cardData.expiryDate,
        cardData.cvv,
        cardData.cardName
      );

      setPaymentValidation({
        ...validation,
        isProcessing: false
      });

      if (validation.isValid) {
        completeBooking();
      }
    }, 2000);
  };

  // Функция для завершения бронирования
  const completeBooking = () => {
    // В реальном приложении это бы отправляло данные на бэкенд
    const newBooking = {
      id: Math.floor(Math.random() * 1000) + 1,
      date: date,
      from: from,
      to: to,
      departureTime: selectedBus.departureTime,
      arrivalTime: selectedBus.arrivalTime,
      price: tripType === 'one-way' ? calculateTotalPrice() :
        calculateTotalPrice() / 2, // Разделение цены между основным и обратным маршрутами
      currency: routes.find(r => r.id === selectedBus.routeId).currency,
      seats: selectedSeats,
      busNumber: selectedBus.busNumber,
      passenger: `${personalInfo.firstName} ${personalInfo.lastName}`,
      phone: personalInfo.phone,
      duration: routes.find(r => r.id === selectedBus.routeId).duration,
      status: 'upcoming',
      stops: routes.find(r => r.id === selectedBus.routeId).stops
    };

    // Обновление забронированных мест для основного маршрута
    const outboundKey = `${selectedBus.id}-${date}`;
    setBookedSeats(prevBookedSeats => ({
      ...prevBookedSeats,
      [outboundKey]: [...(prevBookedSeats[outboundKey] || []), ...selectedSeats]
    }));

    // Обновление количества доступных мест для основного маршрута
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

    // Добавление в историю бронирований
    setBookingHistory(prevHistory => [newBooking, ...prevHistory]);

    // Обработка бронирования обратного маршрута, если применимо
    if (tripType === 'round-trip' && returnBus && returnSeats.length > 0) {
      const returnBooking = {
        id: Math.floor(Math.random() * 1000) + 1,
        date: returnDate,
        from: to, // меняем местами "откуда" и "куда" для обратного маршрута
        to: from,
        departureTime: returnBus.departureTime,
        arrivalTime: returnBus.arrivalTime,
        price: calculateTotalPrice() / 2, // разделение цены между основным и обратным маршрутами
        currency: routes.find(r => r.id === returnBus.routeId).currency,
        seats: returnSeats,
        busNumber: returnBus.busNumber,
        passenger: `${personalInfo.firstName} ${personalInfo.lastName}`,
        phone: personalInfo.phone,
        duration: routes.find(r => r.id === returnBus.routeId).duration,
        status: 'upcoming',
        stops: routes.find(r => r.id === returnBus.routeId).stops
      };

      // Обновление забронированных мест для обратного маршрута
      const returnKey = `${returnBus.id}-${returnDate}`;
      setBookedSeats(prevBookedSeats => ({
        ...prevBookedSeats,
        [returnKey]: [...(prevBookedSeats[returnKey] || []), ...returnSeats]
      }));

      // Обновление количества доступных мест для обратного маршрута
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

      // Добавление обратного маршрута в историю бронирований
      setBookingHistory(prevHistory => [returnBooking, ...prevHistory]);
    }

    // Сброс выбора и переход на экран подтверждения
    setStep(6);
  };

  // Функция для добавления нового маршрута (только для администратора)
  const handleAddRoute = () => {
    if (!newRouteData.from || !newRouteData.to || !newRouteData.price || !newRouteData.duration) {
      alert(t.fillAllFields);
      return;
    }

    // Проверка, является ли это редактированием
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
      // Добавление нового маршрута
      const newRoute = {
        id: routes.length + 1,
        from: newRouteData.from,
        to: newRouteData.to,
        departureAddress: newRouteData.departureAddress,
        arrivalAddress: newRouteData.arrivalAddress,
        availableDates: ["15-05-2025", "16-05-2025", "17-05-2025"],
        price: parseFloat(newRouteData.price),
        currency: "сом",
        duration: parseInt(newRouteData.duration),
        vehicleType: newRouteData.vehicleType,
        stops: newRouteData.stops.length > 0 ? newRouteData.stops : [
          { name: `${newRouteData.from} (отправление)`, time: "23:00" },
          { name: `${newRouteData.to} (прибытие)`, time: `${parseInt(newRouteData.duration / 60)}:${(newRouteData.duration % 60).toString().padStart(2, '0')}` }
        ]
      };

      setRoutes([...routes, newRoute]);
    }

    // Сброс формы
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

  // Функция для добавления нового рейса (только для администратора)
  const handleAddBus = () => {
    if (!newBusData.routeId || !newBusData.date || !newBusData.departureTime || !newBusData.arrivalTime || !newBusData.busNumber) {
      alert(t.fillAllFields);
      return;
    }

    const routeId = parseInt(newBusData.routeId);
    const route = routes.find(r => r.id === routeId);

    if (!route) {
      alert('Выбранный маршрут не существует');
      return;
    }

    const newBus = {
      id: Math.max(...Object.values(buses).flat().map(b => b.id), 0) + 1,
      routeId: routeId,
      departureTime: newBusData.departureTime,
      arrivalTime: newBusData.arrivalTime,
      busNumber: newBusData.busNumber,
      carrier: "ОсОО \"GOBUS\"",
      totalSeats: parseInt(newBusData.totalSeats),
      availableSeats: parseInt(newBusData.totalSeats), // Все места изначально свободны
      vehicleType: newBusData.vehicleType
    };

    // Инициализация ключа для забронированных мест
    const busKey = `${newBus.id}-${newBusData.date}`;
    setBookedSeats(prev => ({
      ...prev,
      [busKey]: [] // Пока нет забронированных мест
    }));

    const updatedBuses = { ...buses };
    if (!updatedBuses[newBusData.date]) {
      updatedBuses[newBusData.date] = [];
    }

    updatedBuses[newBusData.date].push(newBus);
    setBuses(updatedBuses);

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

  // Функция для редактирования маршрута
  const handleEditRoute = (routeId) => {
    const routeToEdit = routes.find(r => r.id === routeId);
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
      setEditRouteId(routeId);
      setShowAddRouteForm(true);
    }
  };

  // Функция для удаления маршрута
  const handleDeleteRoute = (routeId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот маршрут?')) {
      // Удаление маршрута
      const updatedRoutes = routes.filter(r => r.id !== routeId);
      setRoutes(updatedRoutes);

      // Удаление всех рейсов, связанных с этим маршрутом
      const updatedBuses = { ...buses };
      for (const date in updatedBuses) {
        updatedBuses[date] = updatedBuses[date].filter(b => b.routeId !== routeId);
      }
      setBuses(updatedBuses);
    }
  };

  // Функция для просмотра остановок
  const handleViewStops = (routeId) => {
    const route = routes.find(r => r.id === routeId);
    if (route && route.stops) {
      setCurrentRouteStops(route.stops);
      setShowStopsModal(true);
    }
  };

  // Функция для добавления остановки к маршруту
  const handleAddStop = (stopName, stopTime) => {
    if (!stopName || !stopTime) {
      alert('Пожалуйста, заполните название и время остановки');
      return;
    }

    const newStop = { name: stopName, time: stopTime };
    setNewRouteData({
      ...newRouteData,
      stops: [...newRouteData.stops, newStop]
    });
  };

  // Функция для обновления профиля пользователя
  const handleUpdateProfile = () => {
    if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.phone) {
      alert(t.fillAllFields);
      return;
    }

    // Обновление информации о пользователе
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
      phone: personalInfo.phone,
      password: showPasswordField && personalInfo.newPassword ? personalInfo.newPassword : currentUser.password
    });

    // Обновление бронирований с новым именем
    const updatedBookings = bookingHistory.map(booking => {
      if (booking.phone === currentUser.phone) {
        return {
          ...booking,
          passenger: `${personalInfo.firstName} ${personalInfo.lastName}`,
          phone: personalInfo.phone
        };
      }
      return booking;
    });

    setBookingHistory(updatedBookings);
    setIsEditingProfile(false);
    setShowPasswordField(false);
  };

  // Функции навигации
  const goBack = () => {
    if (step > 0) {
      if (step === 4 && isBuyingReturn) {
        // Если возвращаемся с выбора мест для обратного маршрута, остаемся в выборе мест, но переключаемся на основной маршрут
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

  // Функция для временного сохранения выбранных мест перед изменением
  const saveCurrentSeats = () => {
    if (isBuyingReturn) {
      setPreviouslySelectedSeats(returnSeats);
    } else {
      setPreviouslySelectedSeats(selectedSeats);
    }
  };

  // Функция для восстановления предыдущего выбора мест
  const restorePreviousSeats = () => {
    if (isBuyingReturn) {
      setReturnSeats(previouslySelectedSeats);
    } else {
      setSelectedSeats(previouslySelectedSeats);
    }
  };

  // Отрисовка различных экранов в зависимости от текущего шага
  const renderScreen = () => {
    switch (step) {
      case 0: // Экран регистрации/входа
        return (
          <div className="flex flex-col h-full bg-gray-100">
            <header className="flex justify-between items-center p-4 bg-white">
              <div className="text-2xl font-bold">
                <span className="text-green-500">GO</span>
                <span className="text-blue-600">BUS</span>
              </div>
              <div className="flex items-center">
                <div className="relative ml-4">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                  >
                    <Globe size={20} className="text-gray-600 mr-1" />
                    <span className="text-sm uppercase">{language}</span>
                    <ChevronDown size={16} className="text-gray-600 ml-1" />
                  </div>

                  {showLanguageSelector && (
                    <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <button
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${language === 'ru' ? 'font-bold' : ''}`}
                          onClick={() => {
                            setLanguage('ru');
                            setShowLanguageSelector(false);
                          }}
                        >
                          Русский
                        </button>
                        <button
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${language === 'kg' ? 'font-bold' : ''}`}
                          onClick={() => {
                            setLanguage('kg');
                            setShowLanguageSelector(false);
                          }}
                        >
                          Кыргызча
                        </button>
                        <button
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${language === 'en' ? 'font-bold' : ''}`}
                          onClick={() => {
                            setLanguage('en');
                            setShowLanguageSelector(false);
                          }}
                        >
                          English
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </header>

            <div className="p-4 flex flex-col">
              <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
                <div className="text-xl font-bold mb-4">{t.login}</div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                      <Mail size={20} className="text-gray-400 mr-2" />
                      <input
                        type="email"
                        className="w-full focus:outline-none"
                        placeholder="example@mail.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.password}</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                      <Lock size={20} className="text-gray-400 mr-2" />
                      <input
                        type="password"
                        className="w-full focus:outline-none"
                        placeholder={t.enterPassword}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      />
                    </div>
                    <div
                      className="text-right text-sm text-blue-600 mt-1 cursor-pointer"
                      onClick={handleForgotPassword}
                    >
                      {t.forgotPassword}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium"
                  >
                    {t.loginButton}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    {t.testCredentials}:<br />
                    Email: admin@gobus.kg<br />
                    {t.password}: admin123
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-xl font-bold mb-4">{t.registration}</div>

                <form onSubmit={handleRegistration} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                      <Mail size={20} className="text-gray-400 mr-2" />
                      <input
                        type="email"
                        className="w-full focus:outline-none"
                        placeholder="example@mail.com"
                        value={registrationData.email}
                        onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.firstName}</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                        placeholder={t.firstName}
                        value={registrationData.firstName}
                        onChange={(e) => setRegistrationData({ ...registrationData, firstName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.lastName}</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                        placeholder={t.lastName}
                        value={registrationData.lastName}
                        onChange={(e) => setRegistrationData({ ...registrationData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                      <Phone size={20} className="text-gray-400 mr-2" />
                      <input
                        type="tel"
                        className="w-full focus:outline-none"
                        placeholder="+996 XXX XXX XXX"
                        value={registrationData.phone}
                        onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.password}</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                      <Lock size={20} className="text-gray-400 mr-2" />
                      <input
                        type="password"
                        className="w-full focus:outline-none"
                        placeholder={t.password}
                        value={registrationData.password}
                        onChange={(e) => setRegistrationData({ ...registrationData, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.confirmPassword}</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                      <Lock size={20} className="text-gray-400 mr-2" />
                      <input
                        type="password"
                        className="w-full focus:outline-none"
                        placeholder={t.confirmPassword}
                        value={registrationData.confirmPassword}
                        onChange={(e) => setRegistrationData({ ...registrationData, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white rounded-lg py-3 font-medium"
                  >
                    {t.register}
                  </button>
                </form>
              </div>
            </div>

            {/* Модальное окно верификации телефона */}
            {showVerificationModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-5/6 max-w-md">
                  <h3 className="text-lg font-bold mb-4">{t.verifyPhone}</h3>
                  <p className="mb-4">{t.verificationCodeSent}</p>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.enterVerificationCode}</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                      onClick={() => setShowVerificationModal(false)}
                    >
                      {t.cancel}
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                      onClick={completeRegistration}
                    >
                      {t.verify}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Модальное окно забытого пароля */}
            {showForgotPasswordModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-5/6 max-w-md">
                  <h3 className="text-lg font-bold mb-4">{t.resetPassword}</h3>

                  {resetPasswordStep === 1 && (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
                        <input
                          type="tel"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                          placeholder="+996 XXX XXX XXX"
                          value={resetPasswordData.phone}
                          onChange={(e) => setResetPasswordData({ ...resetPasswordData, phone: e.target.value })}
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                          onClick={() => setShowForgotPasswordModal(false)}
                        >
                          {t.cancel}
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                          onClick={sendResetPasswordCode}
                        >
                          {t.continueButton}
                        </button>
                      </div>
                    </>
                  )}

                  {resetPasswordStep === 2 && (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.enterVerificationCode}</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                          value={resetPasswordData.verificationCode}
                          onChange={(e) => setResetPasswordData({ ...resetPasswordData, verificationCode: e.target.value })}
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                          onClick={() => setResetPasswordStep(1)}
                        >
                          {t.cancel}
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                          onClick={verifyResetPasswordCode}
                        >
                          {t.continueButton}
                        </button>
                      </div>
                    </>
                  )}

                  {resetPasswordStep === 3 && (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.newPassword}</label>
                        <input
                          type="password"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                          value={resetPasswordData.newPassword}
                          onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.confirmNewPassword}</label>
                        <input
                          type="password"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                          value={resetPasswordData.confirmPassword}
                          onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                          onClick={() => setShowForgotPasswordModal(false)}
                        >
                          {t.cancel}
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                          onClick={resetPassword}
                        >
                          {t.resetPasswordButton}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 1: // Главный экран поиска
        return (
          <div className="flex flex-col h-full bg-gray-100">
            <header className="flex justify-between items-center p-4 bg-white">
              <div className="text-2xl font-bold">
                <span className="text-green-500">GO</span>
                <span className="text-blue-600">BUS</span>
              </div>
              <div className="flex space-x-4 items-center">
                <div className="relative">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                  >
                    <Globe size={20} className="text-gray-600" />
                    <span className="ml-1 text-sm uppercase">{language}</span>
                  </div>

                  {showLanguageSelector && (
                    <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <button
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${language === 'ru' ? 'font-bold' : ''}`}
                          onClick={() => {
                            setLanguage('ru');
                            setShowLanguageSelector(false);
                          }}
                        >
                          Русский
                        </button>
                        <button
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${language === 'kg' ? 'font-bold' : ''}`}
                          onClick={() => {
                            setLanguage('kg');
                            setShowLanguageSelector(false);
                          }}
                        >
                          Кыргызча
                        </button>
                        <button
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${language === 'en' ? 'font-bold' : ''}`}
                          onClick={() => {
                            setLanguage('en');
                            setShowLanguageSelector(false);
                          }}
                        >
                          English
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <Bell size={20} />
              </div>
            </header>

            <div className={`p-4 flex flex-col space-y-4 ${isAdmin ? 'mb-16' : ''}`}>
              {isAdmin && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                  <div className="font-bold text-lg mb-2">Режим администратора</div>
                  <div className="flex space-x-2">
                    <button
                      className="bg-blue-600 text-white rounded-lg py-2 px-4 text-sm"
                      onClick={() => setStep(10)}
                    >
                      Управление маршрутами
                    </button>
                    <button
                      className="bg-green-500 text-white rounded-lg py-2 px-4 text-sm"
                      onClick={() => setStep(11)}
                    >
                      Все бронирования
                    </button>
                  </div>
                </div>
              )}

              <div className="flex rounded-lg overflow-hidden">
                <button
                  className={`flex-1 py-2 text-center ${tripType === 'one-way' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                  onClick={() => setTripType('one-way')}
                >
                  {t.oneWay}
                </button>
                <button
                  className={`flex-1 py-2 text-center ${tripType === 'round-trip' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                  onClick={() => setTripType('round-trip')}
                >
                  {t.roundTrip}
                </button>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center border-b border-gray-200 py-2">
                  <MapPin className="text-gray-400 mr-2" size={20} />
                  <select
                    className="w-full bg-transparent border-none focus:outline-none p-2"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  >
                    <option value="" disabled>{t.from}</option>
                    {routes.map(route => (
                      <option key={`from-${route.from}`} value={route.from}>{route.from}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center py-2">
                  <MapPin className="text-gray-400 mr-2" size={20} />
                  <select
                    className="w-full bg-transparent border-none focus:outline-none p-2"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  >
                    <option value="" disabled>{t.to}</option>
                    {routes.map(route => (
                      <option key={`to-${route.to}`} value={route.to}>{route.to}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-2">
                <div className="flex-1 bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center">
                    <Calendar className="text-gray-400 mr-2" size={20} />
                    <input
                      type="date"
                      className="w-full bg-transparent border-none focus:outline-none cursor-pointer"
                      value={date.split('-').reverse().join('-')} // Конвертируем DD-MM-YYYY в YYYY-MM-DD для input
                      onChange={(e) => {
                        const newDate = e.target.value.split('-').reverse().join('-'); // Конвертируем обратно в DD-MM-YYYY
                        setDate(newDate);
                      }}
                      min={formattedCurrentDate.split('-').reverse().join('-')}
                      ref={calendarRef}
                    />
                  </div>
                </div>

                {tripType === 'round-trip' && (
                  <div className="flex-1 bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center">
                      <Calendar className="text-gray-400 mr-2" size={20} />
                      <input
                        type="date"
                        className="w-full bg-transparent border-none focus:outline-none cursor-pointer"
                        value={returnDate.split('-').reverse().join('-')} // Конвертируем DD-MM-YYYY в YYYY-MM-DD для input
                        onChange={(e) => {
                          const newDate = e.target.value.split('-').reverse().join('-'); // Конвертируем обратно в DD-MM-YYYY
                          setReturnDate(newDate);
                        }}
                        min={date.split('-').reverse().join('-')} // Нельзя выбрать дату возврата до даты отправления
                        ref={calendarRef}
                      />
                    </div>
                  </div>
                )}

                <div className={`${tripType === 'round-trip' ? 'w-full' : 'flex-1'} bg-white rounded-lg shadow-sm p-4`}>
                  <div className="flex items-center">
                    <Users className="text-gray-400 mr-2" size={20} />
                    <select
                      className="w-full bg-transparent border-none focus:outline-none"
                      value={passengers}
                      onChange={(e) => setPassengers(parseInt(e.target.value))}
                    >
                      <option value="1">1 {t.passenger}</option>
                      <option value="2">2 {t.passengers}</option>
                      <option value="3">3 {t.passengers}</option>
                      <option value="4">4 {t.passengers}</option>
                      <option value="5">5 {t.passengers}</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                className="bg-blue-600 text-white rounded-lg py-3 font-medium"
                onClick={() => {
                  if (from && to && date) {
                    setStep(2);
                  } else {
                    alert(t.fillAllFields);
                  }
                }}
              >
                {t.search}
              </button>

              <div className="mt-4">
                <img
                  src="/api/placeholder/800/200"
                  alt="Available routes"
                  className="w-full rounded-lg"
                />
                <div className="flex justify-around mt-4">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <img src="/api/placeholder/24/24" alt="WhatsApp" />
                  </div>
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <img src="/api/placeholder/24/24" alt="Telegram" />
                  </div>
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <img src="/api/placeholder/24/24" alt="Instagram" />
                  </div>
                </div>
              </div>
            </div>

            <footer className="mt-auto border-t border-gray-200 bg-white fixed bottom-0 w-full">
              <div className="flex justify-around py-3">
                <div className="flex flex-col items-center text-xs">
                  <Home size={20} className="text-green-500" />
                  <span className="text-green-500">{t.home}</span>
                </div>
                <div
                  className="flex flex-col items-center text-xs cursor-pointer"
                  onClick={() => setStep(7)}
                >
                  <Ticket size={20} className="text-gray-500" />
                  <span className="text-gray-500">{t.trips}</span>
                </div>
                <div
                  className="flex flex-col items-center text-xs cursor-pointer"
                  onClick={() => setStep(9)}
                >
                  <User size={20} className="text-gray-500" />
                  <span className="text-gray-500">{t.profile}</span>
                </div>
              </div>
            </footer>
          </div>
        );

      case 2: // Доступные автобусы
        return (
          <div className="flex flex-col h-full bg-gray-100">
            <header className="flex items-center p-4 bg-blue-600 text-white">
              <button onClick={goBack} className="mr-4">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-medium">{from} - {to}</h1>
            </header>

            <div className="px-4 py-2 bg-white">
              <div className="flex border-b overflow-x-auto">
                {Object.keys(buses)
                  .filter(busDate =>
                    // Проверяем, есть ли доступные автобусы на данный маршрут
                    buses[busDate].some(bus => {
                      const route = routes.find(r => r.id === bus.routeId);
                      return route && route.from === from && route.to === to;
                    })
                  )
                  .sort((a, b) => {
                    // Сортировка дат
                    const dateA = a.split('-').reverse().join('-');
                    const dateB = b.split('-').reverse().join('-');
                    return new Date(dateA) - new Date(dateB);
                  })
                  .map((d) => (
                    <button
                      key={d}
                      className={`flex-shrink-0 py-2 px-4 ${date === d ? 'border-b-2 border-blue-600 font-medium' : ''}`}
                      onClick={() => setDate(d)}
                    >
                      {d.split('-').slice(0, 2).join('-')}
                    </button>
                  ))}
              </div>
            </div>

            <div className="p-4 flex flex-col space-y-4 pb-20">
              {getAvailableBuses(from, to, date).map((bus) => (
                <div key={bus.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold">{bus.departureTime}</div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={16} className="mr-1" />
                      {routes.find(r => r.id === bus.routeId)?.duration} {t.time}
                    </div>
                    <div className="text-xl font-bold">{bus.arrivalTime}</div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500 mt-1 mb-3">
                    <div>{from}</div>
                    <div>{to}</div>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                    <div className="text-sm">
                      <span className="text-gray-500">{t.available}: </span>
                      <span className="font-medium">{bus.availableSeats}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">{t.vehicleType}: </span>
                      <span className="font-medium">{bus.vehicleType}</span>
                    </div>
                    <div className="text-xl font-bold text-green-500">
                      {routes.find(r => r.id === bus.routeId)?.price} {routes.find(r => r.id === bus.routeId)?.currency}
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    {t.busNumber}: {bus.busNumber}
                  </div>

                  <div className="mt-2 text-xs text-blue-600">
                    {t.carrier}: {bus.carrier}
                  </div>

                  <div
                    className="mt-3 text-sm text-gray-600 hover:underline cursor-pointer"
                    onClick={() => {
                      const route = routes.find(r => r.id === bus.routeId);
                      if (route && route.stops) {
                        setCurrentRouteStops(route.stops);
                        setShowStopsModal(true);
                      }
                    }}
                  >
                    {t.boardingAddress}: {routes.find(r => r.id === bus.routeId)?.departureAddress}
                  </div>

                  <div className="mt-4 text-xs text-gray-500">
                    ! {t.exchangeNotPossible}<br />
                    {t.ticketReturn}
                  </div>

                  {bus.availableSeats > 0 && (
                    <button
                      className="mt-4 w-full bg-blue-600 text-white rounded-lg py-3 font-medium"
                      onClick={() => {
                        setSelectedBus(bus);
                        setStep(3);
                      }}
                    >
                      {t.select}
                    </button>
                  )}
                </div>
              ))}

              {getAvailableBuses(from, to, date).length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="text-lg text-gray-600 mb-2">{t.routesNotFound}</div>
                  <div className="text-sm text-gray-500">
                    {t.routesNotFoundMessage}
                  </div>
                </div>
              )}
            </div>

            {/* Модальное окно остановок */}
            {showStopsModal && (
              <div className="fixed in set-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-5/6 max-w-md max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">{t.stops}</h3>
                    <button onClick={() => setShowStopsModal(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {currentRouteStops.map((stop, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-medium">{index + 1}</span>
                          </div>
                          <div>{stop.name}</div>
                        </div>
                        <div className="font-medium">{stop.time}</div>
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
          <div className="flex flex-col h-full bg-gray-100">
            <header className="flex items-center p-4 bg-blue-600 text-white">
              <button onClick={goBack} className="mr-4">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-medium">{t.tripDetails}</h1>
            </header>
            <div className="p-4 bg-white mb-4">
              <div className="flex items-start">
                <div className="flex flex-col items-center mr-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <div className="w-0.5 h-16 bg-green-500"></div>
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center text-green-500 font-medium">
                    <span>{selectedBus?.departureTime}</span>
                    <span className="ml-2">{routes.find(r => r.id === selectedBus?.routeId)?.departureAddress}</span>
                  </div>
                  <div className="flex items-center text-green-500 font-medium mt-4">
                    <span>{selectedBus?.arrivalTime}</span>
                    <span className="ml-2">{routes.find(r => r.id === selectedBus?.routeId)?.arrivalAddress}</span>
                  </div>
                  <div
                    className="text-center text-green-500 text-sm mt-2 underline cursor-pointer"
                    onClick={() => {
                      const route = routes.find(r => r.id === selectedBus?.routeId);
                      if (route && route.stops) {
                        setCurrentRouteStops(route.stops);
                        setShowStopsModal(true);
                      }
                    }}
                  >
                    {t.viewAllStops}
                  </div>
                </div>
              </div>
            </div>
            {/* Добавляем карту маршрута */}
            <div className="mt-4 px-4 bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium mb-2">{t.mapRoute}</h3>
              <div className="h-48 w-full">
                <LoadScript
                  googleMapsApiKey="AIzaSyDLMGbQcqKxJjgU3vYHDmPjQqF4jV8H44Y"
                >
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={{
                      lat: 42.8746, // примерные координаты для Бишкека
                      lng: 74.5698
                    }}
                    zoom={7}
                  >
                    {/* Маркеры для начальной и конечной точек */}
                    <Marker
                      position={{
                        lat: 42.8746, // Координаты Бишкека
                        lng: 74.5698
                      }}
                      title={from}
                    />
                    <Marker
                      position={{
                        lat: 42.4922, // Координаты Каракола
                        lng: 78.3957
                      }}
                      title={to}
                    />
                  </GoogleMap>
                </LoadScript>
              </div>
            </div>
            <div className="p-4 flex flex-col space-y-4">
              <h2 className="font-medium">{t.personalData}</h2>
              <input
                type="text"
                placeholder={t.firstName}
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={personalInfo.firstName}
                onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                readOnly={!!currentUser}
              />

              <input
                type="text"
                placeholder={t.lastName}
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={personalInfo.lastName}
                onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                readOnly={!!currentUser}
              />

              <input
                type="tel"
                placeholder={t.phone}
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={personalInfo.phone}
                onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                readOnly={!!currentUser}
              />

              <button
                className="mt-auto bg-blue-600 text-white rounded-lg py-3 font-medium"
                onClick={() => {
                  if (personalInfo.firstName && personalInfo.lastName && personalInfo.phone) {
                    setStep(4);
                    setIsBuyingReturn(false); // Убедимся, что сначала выбираем места для основного маршрута
                    setSelectedSeats([]); // Сбросим выбранные места
                  } else {
                    alert(t.fillAllFields);
                  }
                }}
              >
                {t.selectSeat}
              </button>
            </div>
            {/* Модальное окно остановок */}
            {showStopsModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-5/6 max-w-md max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">{t.stops}</h3>
                    <button onClick={() => setShowStopsModal(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {currentRouteStops.map((stop, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-medium">{index + 1}</span>
                          </div>
                          <div>{stop.name}</div>
                        </div>
                        <div className="font-medium">{stop.time}</div>
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
          <div className="flex flex-col h-full bg-gray-100">
            <header className="flex items-center p-4 bg-blue-600 text-white">
              <button onClick={goBack} className="mr-4">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-medium">
                {isBuyingReturn ? `${t.returnTrip}: ${t.selectSeat}` : t.selectSeat}
              </h1>
            </header>
            <div className="p-4 flex flex-col space-y-4">
              <div className="flex rounded-lg overflow-hidden">
                <button
                  className={`flex-1 py-2 text-center ${seatType === 'standard' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setSeatType('standard')}
                >
                  {t.standard}
                </button>
                <button
                  className={`flex-1 py-2 text-center ${seatType === 'comfort' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setSeatType('comfort')}
                >
                  {t.comfort} (+50 {routes.find(r => r.id === (isBuyingReturn ? returnBus?.routeId : selectedBus?.routeId))?.currency})
                </button>
              </div>
              {/* Схема автобуса */}
              <div className="bg-white p-4 rounded-lg">
                {/* Передняя часть автобуса */}
                <div className="mb-4 flex justify-center">
                  <div className="w-40 h-10 bg-gray-200 rounded-t-lg flex items-center justify-center text-sm text-gray-500">
                    {t.driver}
                  </div>
                </div>

                {/* Сиденья */}
                <div className="grid grid-cols-4 gap-2">
                  {seatLayout.map((seat, index) => {
                    // Если это место водителя, отображаем его отдельно
                    if (seat.id === 1) {
                      return (
                        <div
                          key={seat.id}
                          className="aspect-square flex items-center justify-center border rounded-lg bg-gray-300 text-gray-600"
                        >
                          <div className="text-xs">{t.driver}</div>
                        </div>
                      );
                    }

                    // Если это null (пустое пространство), отображаем пустую ячейку
                    if (seat === null) {
                      return <div key={`empty-${index}`} className="aspect-square"></div>;
                    }

                    const seatNumber = seat.id;
                    const isBooked = isSeatBooked(
                      isBuyingReturn ? returnBus?.id : selectedBus?.id,
                      isBuyingReturn ? returnDate : date,
                      seatNumber
                    );
                    const isSelected = isBuyingReturn
                      ? returnSeats.includes(seatNumber)
                      : selectedSeats.includes(seatNumber);
                    const isComfort = comfortSeats.includes(seatNumber);

                    // Показываем только места выбранного типа
                    if ((seatType === 'standard' && isComfort) || (seatType === 'comfort' && !isComfort)) {
                      return null;
                    }

                    return (
                      <div
                        key={seatNumber}
                        className={`aspect-square flex items-center justify-center border rounded-lg cursor-pointer
            ${isBooked ? 'border-gray-300 bg-gray-100 cursor-not-allowed' :
                            isSelected ? 'border-blue-500 bg-blue-100 text-blue-600' :
                              isComfort ? 'border-green-300 text-green-500' : 'border-blue-300 text-blue-500'
                          }`}
                        onClick={() => !isBooked && handleSeatSelection(seatNumber)}
                      >
                        {isBooked ? (
                          <div className="text-gray-400">
                            <Lock size={16} />
                          </div>
                        ) : (
                          seatNumber
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex justify-between flex-wrap">
                  <div className="flex items-center mr-4 mb-2">
                    <div className="w-4 h-4 border border-blue-300 mr-1"></div>
                    <span className="text-xs">{t.available}</span>
                  </div>
                  <div className="flex items-center mr-4 mb-2">
                    <div className="w-4 h-4 border border-blue-500 bg-blue-100 mr-1"></div>
                    <span className="text-xs">{t.seatSelected}</span>
                  </div>
                  <div className="flex items-center mr-4 mb-2">
                    <div className="w-4 h-4 border border-gray-300 bg-gray-100 mr-1"></div>
                    <span className="text-xs">{t.seatOccupied}</span>
                  </div>
                  {seatType === 'comfort' && (
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 border border-green-300 mr-1"></div>
                      <span className="text-xs">{t.comfort}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="font-medium">{t.selected}: {
                  isBuyingReturn ?
                    (returnSeats.length > 0 ? returnSeats.join(', ') : '') :
                    (selectedSeats.length > 0 ? selectedSeats.join(', ') : '')
                }</div>

                {/* Кнопка сброса выбора */}
                {(isBuyingReturn ? returnSeats.length > 0 : selectedSeats.length > 0) && (
                  <button
                    className="text-red-500 text-sm"
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

              <div className="mt-2 text-sm text-gray-500">
                {t.passengers}: {passengers} - {t.available}: {
                  isBuyingReturn ? returnBus?.availableSeats : selectedBus?.availableSeats
                } {t.seats}
              </div>

              <button
                className={`mt-auto py-3 rounded-lg font-medium ${(isBuyingReturn ? returnSeats.length > 0 : selectedSeats.length > 0) ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
                  }`}
                disabled={isBuyingReturn ? returnSeats.length === 0 : selectedSeats.length === 0}
                onClick={() => {
                  // Сохраняем текущий выбор мест
                  saveCurrentSeats();

                  if (tripType === 'round-trip' && !isBuyingReturn) {
                    // Если это маршрут туда-обратно и мы еще не выбирали места для обратного пути
                    setIsBuyingReturn(true);

                    // Если мы еще не выбрали обратный автобус, находим подходящий
                    if (!returnBus) {
                      const availableReturnBuses = getAvailableBuses(to, from, returnDate);
                      if (availableReturnBuses.length > 0) {
                        setReturnBus(availableReturnBuses[0]);
                      } else {
                        // Если нет доступных обратных автобусов, идем к оплате только с основным маршрутом
                        setStep(5);
                      }
                    }
                  } else {
                    // Если уже выбираем места для обратного пути или это маршрут в одну сторону, идем к оплате
                    setStep(5);
                  }
                }}
              >
                {tripType === 'round-trip' && !isBuyingReturn ? t.continueButton : t.save}
              </button>
            </div>
          </div>
        );
      case 5: // Оплата
        return (
          <div className="flex flex-col h-full bg-gray-100">
            <header className="flex items-center p-4 bg-blue-600 text-white">
              <button onClick={goBack} className="mr-4">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-medium">{t.payment}</h1>
            </header>
            <div className="p-4 bg-white mb-4">
              <div className="flex justify-between">
                <div>
                  <div className="text-gray-500">{t.route}:</div>
                  <div className="font-medium">{from} - {to}</div>
                </div>
                <div>
                  <div className="text-gray-500">{t.date}:</div>
                  <div className="font-medium">{date}</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-gray-500">{t.departureTime}:</div>
                <div className="font-medium">{selectedBus?.departureTime}</div>
              </div>

              <div className="mt-4">
                <div className="text-gray-500">{t.seats}:</div>
                <div className="font-medium">{selectedSeats.join(', ')}</div>
              </div>

              {tripType === 'round-trip' && returnBus && returnSeats.length > 0 && (
                <>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-gray-500">{t.returnTrip}:</div>
                    <div className="font-medium">{to} - {from}</div>
                  </div>

                  <div className="mt-4">
                    <div className="text-gray-500">{t.date}:</div>
                    <div className="font-medium">{returnDate}</div>
                  </div>

                  <div className="mt-4">
                    <div className="text-gray-500">{t.departureTime}:</div>
                    <div className="font-medium">{returnBus?.departureTime}</div>
                  </div>

                  <div className="mt-4">
                    <div className="text-gray-500">{t.seats}:</div>
                    <div className="font-medium">{returnSeats.join(', ')}</div>
                  </div>
                </>
              )}

              <div className="mt-4">
                <div className="text-gray-500">{t.passenger}:</div>
                <div className="font-medium">{personalInfo.firstName} {personalInfo.lastName}</div>
              </div>

              <div className="mt-4 flex justify-between items-end">
                <div>
                  <div className="text-gray-500">{t.totalPayment}:</div>
                  <div className="text-xl font-bold text-green-500">
                    {calculateTotalPrice()} {routes.find(r => r.id === selectedBus?.routeId)?.currency}
                  </div>
                </div>
                <button
                  className="text-blue-600 underline"
                  onClick={() => {
                    // Возвращаемся к выбору мест
                    setStep(4);
                    // Восстанавливаем предыдущий выбор мест
                    restorePreviousSeats();
                  }}
                >
                  {t.changeSeats}
                </button>
              </div>
            </div>
            <div className="p-4 flex flex-col space-y-4">
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
                  <Elements stripe={stripePromise}>
                    <PaymentForm onSuccess={completeBooking} amount={calculateTotalPrice()} />
                  </Elements>
                </div>
              )}

              <div className="flex items-center p-3 rounded-lg bg-gray-100">
                <input
                  type="checkbox"
                  id="terms"
                  className="mr-3"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  {t.termsAgreement}
                </label>
              </div>
            </div>
          </div>
        );
      case 6: // Подтверждение бронирования
        return (
          <div className="flex flex-col h-full bg-gray-100">
            <header className="flex items-center p-4 bg-green-500 text-white">
              <button onClick={goHome} className="mr-4">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-medium">{t.bookingComplete}</h1>
            </header>
            <div className="p-4 flex flex-col items-center justify-center space-y-4 h-full">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-center">{t.bookingSuccess}</h2>

              <p className="text-center text-gray-600">
                {t.bookingSuccessMessage}
              </p>

              <div className="p-4 bg-white rounded-lg shadow-sm w-full mt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-xl">{selectedBus?.departureTime}</div>
                    <div className="text-sm text-gray-500">{date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl">{selectedBus?.arrivalTime}</div>
                    <div className="text-sm text-gray-500">{routes.find(r => r.id === selectedBus?.routeId)?.duration} {t.time}</div>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <div>{from}</div>
                  <div>{to}</div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-500">{t.seats}:</div>
                    <div className="font-medium">{selectedSeats.join(', ')}</div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="text-sm text-gray-500">{t.passenger}:</div>
                    <div className="font-medium">{personalInfo.firstName} {personalInfo.lastName}</div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="text-sm text-gray-500">{t.busNumber}:</div>
                    <div className="font-medium">{selectedBus?.busNumber}</div>
                  </div>
                </div>
              </div>

              {tripType === 'round-trip' && returnBus && returnSeats.length > 0 && (
                <div className="p-4 bg-white rounded-lg shadow-sm w-full">
                  <div className="text-center font-medium text-blue-600 mb-2">{t.returnTrip}</div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-xl">{returnBus?.departureTime}</div>
                      <div className="text-sm text-gray-500">{returnDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl">{returnBus?.arrivalTime}</div>
                      <div className="text-sm text-gray-500">{routes.find(r => r.id === returnBus?.routeId)?.duration} {t.time}</div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <div>{to}</div>
                    <div>{from}</div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between">
                      <div className="text-sm text-gray-500">{t.seats}:</div>
                      <div className="font-medium">{returnSeats.join(', ')}</div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <div className="text-sm text-gray-500">{t.passenger}:</div>
                      <div className="font-medium">{personalInfo.firstName} {personalInfo.lastName}</div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <div className="text-sm text-gray-500">{t.busNumber}:</div>
                      <div className="font-medium">{returnBus?.busNumber}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4 mt-4 w-full">
                <button
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium"
                  onClick={() => setStep(7)}
                >
                  {t.myTrips}
                </button>
                <button
                  className="flex-1 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg font-medium"
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
          <div className="flex flex-col h-full bg-gray-100">
            <header className="flex items-center p-4 bg-white border-b">
              <div className="flex justify-between items-center w-full">
                <h1 className="text-xl font-medium">{t.trips}</h1>
                <div className="flex">
                  <button
                    className={`px-4 py-2 ${activeTab === 'upcoming' ? 'border-b-2 border-blue-600' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                  >
                    {t.trips}
                  </button>
                  <button
                    className={`px-4 py-2 ${activeTab === 'history' ? 'border-b-2 border-blue-600' : ''}`}
                    onClick={() => setActiveTab('history')}
                  >
                    {t.history}
                  </button>
                </div>
              </div>
            </header>
            <div className="p-4 flex flex-col space-y-4 pb-20">
              {activeTab === 'upcoming' ? (
                <>
                  {bookingHistory.filter(b => b.status === 'upcoming').length > 0 ? (
                    bookingHistory
                      .filter(b => b.status === 'upcoming')
                      .map((booking, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                          <div className="flex justify-between items-center">
                            <div className="text-xl font-bold">{booking.departureTime}</div>
                            <div className="text-gray-500 text-sm">{booking.date}</div>
                            <div className="text-xl font-bold">{booking.arrivalTime}</div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <div>{booking.from}</div>
                            <div>{booking.to}</div>
                          </div>

                          <div className="mt-3 text-sm text-gray-600">
                            {t.busNumber}: {booking.busNumber}
                          </div>

                          <div className="mt-3 text-sm text-gray-600">
                            {t.seats}: {booking.seats.join(', ')}
                          </div>

                          <div className="flex justify-between items-center mt-3">
                            <div className="text-sm font-medium">{booking.price} {booking.currency}</div>
                            <button
                              className="text-green-500 text-sm"
                              onClick={() => {
                                // Просмотр деталей бронирования
                                setCurrentRouteStops(booking.stops || []);
                                setShowStopsModal(true);
                              }}
                            >
                              {t.viewDetails}
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center p-8 text-gray-500">
                      {t.noTrips}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {bookingHistory.filter(b => b.status === 'history').length > 0 ? (
                    bookingHistory
                      .filter(b => b.status === 'history')
                      .map((booking, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                          <div className="flex justify-between items-center">
                            <div className="text-xl font-bold">{booking.departureTime}</div>
                            <div className="text-gray-500 text-sm">{booking.date}</div>
                            <div className="text-xl font-bold">{booking.arrivalTime}</div>
                          </div>

                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <div>{booking.from}</div>
                            <div>{booking.to}</div>
                          </div>

                          <div className="mt-3 text-sm text-gray-600">
                            {t.busNumber}: {booking.busNumber}
                          </div>

                          <div className="mt-3 text-sm text-gray-600">
                            {t.seats}: {booking.seats.join(', ')}
                          </div>

                          <div className="flex justify-between items-center mt-3">
                            <div className="text-sm font-medium">{booking.price} {booking.currency}</div>
                            <button
                              className="text-green-500 text-sm"
                              onClick={() => {
                                setCurrentReviewBooking(booking);
                                setShowReviewModal(true);
                              }}
                            >
                              {t.leaveReview}
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center p-8 text-gray-500">
                      {t.noTrips}
                    </div>
                  )}
                </>
              )}
            </div>
            {/* Модальное окно для просмотра деталей поездки */}
            {showStopsModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-5/6 max-w-md max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">{t.tripDetails}</h3>
                    <button onClick={() => setShowStopsModal(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="font-medium">{t.stops}:</div>
                    {currentRouteStops.map((stop, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-medium">{index + 1}</span>
                          </div>
                          <div>{stop.name}</div>
                        </div>
                        <div className="font-medium">{stop.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Модальное окно для оставления отзыва */}
            {showReviewModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-5/6 max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">{t.leaveReview}</h3>
                    <button onClick={() => setShowReviewModal(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="mb-4">
                    <div className="font-medium mb-2">Маршрут: {currentReviewBooking?.from} - {currentReviewBooking?.to}</div>
                    <div className="text-sm text-gray-500">Дата: {currentReviewBooking?.date}</div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.yourRating}</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          size={24}
                          className={`cursor-pointer ${star <= reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          onClick={() => setReviewRating(star)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.yourReview}</label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg p-3"
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder={t.shareExperience}
                    />
                  </div>

                  <button
                    className="w-full bg-blue-600 text-white rounded-lg py-3"
                    onClick={addReview}
                  >
                    {t.submitReview}
                  </button>
                </div>
              </div>
            )}
            <footer className="mt-auto border-t border-gray-200 bg-white fixed bottom-0 w-full">
              <div className="flex justify-around py-3">
                <div
                  className="flex flex-col items-center text-xs cursor-pointer"
                  onClick={goHome}
                >
                  <Home size={20} className="text-gray-500" />
                  <span className="text-gray-500">{t.home}</span>
                </div>
                <div className="flex flex-col items-center text-xs">
                  <Ticket size={20} className="text-green-500" />
                  <span className="text-green-500">{t.trips}</span>
                </div>
                <div
                  className="flex flex-col items-center text-xs cursor-pointer"
                  onClick={() => setStep(9)}
                >
                  <User size={20} className="text-gray-500" />
                  <span className="text-gray-500">{t.profile}</span>
                </div>
              </div>
            </footer>
          </div>
        );
      case 9: // Профиль
        return (
          <div className="flex flex-col h-full bg-gray-100">
            <header className="p-4">
              <h1 className="text-2xl font-bold">{t.profile}</h1>
            </header>
            {!isEditingProfile ? (
              <>
                <div className="flex items-center p-4 bg-white border-b">
                  <div className="flex-1">
                    <div className="font-medium text-lg">{currentUser?.firstName} {currentUser?.lastName}</div>
                    <div className="text-gray-500">{currentUser?.phone}</div>
                    <div className="text-gray-500">{currentUser?.email}</div>
                  </div>
                  <button
                    className="text-gray-500"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <Edit size={20} />
                  </button>
                </div>
                <div className="p-4 flex flex-col space-y-4">
                  <button className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <Info size={20} className="text-gray-500" />
                    </div>
                    <span className="flex-1 text-left">{t.aboutUs}</span>
                  </button>

                  <button className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <CreditCard size={20} className="text-gray-500" />
                    </div>
                    <span className="flex-1 text-left">{t.wallet}</span>
                  </button>

                  <button
                    className="flex items-center p-4 bg-white rounded-lg shadow-sm"
                    onClick={() => {
                      setShowLanguageSelector(!showLanguageSelector);
                    }}
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <Globe size={20} className="text-gray-500" />
                    </div>
                    <span className="flex-1 text-left">{t.language}</span>
                    <span className="text-gray-500 uppercase">{language}</span>
                  </button>

                  {showLanguageSelector && (
                    <div className="bg-white rounded-lg shadow-sm p-2">
                      <button
                        className={`block w-full text-left p-3 my-1 rounded ${language === 'ru' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                        onClick={() => {
                          setLanguage('ru');
                          setShowLanguageSelector(false);
                        }}
                      >
                        Русский
                      </button>
                      <button
                        className={`block w-full text-left p-3 my-1 rounded ${language === 'kg' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                        onClick={() => {
                          setLanguage('kg');
                          setShowLanguageSelector(false);
                        }}
                      >
                        Кыргызча
                      </button>
                      <button
                        className={`block w-full text-left p-3 my-1 rounded ${language === 'en' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                        onClick={() => {
                          setLanguage('en');
                          setShowLanguageSelector(false);
                        }}
                      >
                        English
                      </button>
                    </div>
                  )}

                  <button
                    className="flex items-center p-4 bg-white rounded-lg shadow-sm"
                    onClick={logout}
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <LogOut size={20} className="text-gray-500" />
                    </div>
                    <span className="flex-1 text-left">{t.logout}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <button className="flex items-center justify-center p-3 bg-gray-200 rounded-lg">
                      <img src="/api/placeholder/24/24" alt="WhatsApp" className="mr-2" />
                      <span>WhatsApp</span>
                    </button>
                    <button className="flex items-center justify-center p-3 bg-gray-200 rounded-lg">
                      <img src="/api/placeholder/24/24" alt="Telegram" className="mr-2" />
                      <span>Telegram</span>
                    </button>
                  </div>

                  <div className="flex justify-center mt-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        <span className="text-green-500">GO</span>
                        <span className="text-blue-600">BUS</span>
                      </div>
                      <div className="mt-4">
                        <img src="/api/placeholder/200/80" alt="Tourism Development Support Fund of the Kyrgyz Republic" />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Режим редактирования профиля
              <div className="p-4 flex flex-col space-y-4">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-xl font-bold mb-4">{t.editProfile}</div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
                      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-100">
                        <Mail size={20} className="text-gray-400 mr-2" />
                        <input
                          type="email"
                          className="w-full focus:outline-none bg-transparent"
                          value={currentUser?.email}
                          readOnly
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.firstName}</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                        value={personalInfo.firstName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.lastName}</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                        value={personalInfo.lastName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
                      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                        <Phone size={20} className="text-gray-400 mr-2" />
                        <input
                          type="tel"
                          className="w-full focus:outline-none"
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="changePassword"
                        checked={showPasswordField}
                        onChange={() => setShowPasswordField(!showPasswordField)}
                        className="mr-2"
                      />
                      <label htmlFor="changePassword" className="text-sm">
                        {t.changePassword}
                      </label>
                    </div>

                    {showPasswordField && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t.newPassword}</label>
                          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                            <Lock size={20} className="text-gray-400 mr-2" />
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t.confirmNewPassword}</label>
                          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                            <Lock size={20} className="text-gray-400 mr-2" />
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

                    <div className="flex space-x-4 mt-4">
                      <button
                        className="flex-1 bg-gray-300 text-gray-700 rounded-lg py-3 font-medium"
                        onClick={() => {
                          setIsEditingProfile(false);
                          // Сброс к исходным данным пользователя
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
                        className="flex-1 bg-blue-600 text-white rounded-lg py-3 font-medium"
                        onClick={handleUpdateProfile}
                      >
                        {t.update}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <footer className="mt-auto border-t border-gray-200 bg-white fixed bottom-0 w-full">
              <div className="flex justify-around py-3">
                <div
                  className="flex flex-col items-center text-xs cursor-pointer"
                  onClick={goHome}
                >
                  <Home size={20} className="text-gray-500" />
                  <span className="text-gray-500">{t.home}</span>
                </div>
                <div
                  className="flex flex-col items-center text-xs cursor-pointer"
                  onClick={() => setStep(7)}
                >
                  <Ticket size={20} className="text-gray-500" />
                  <span className="text-gray-500">{t.trips}</span>
                </div>
                <div className="flex flex-col items-center text-xs">
                  <User size={20} className="text-green-500" />
                  <span className="text-green-500">{t.profile}</span>
                </div>
              </div>
            </footer>
          </div>
        );
      case 10: // Админ - Управление маршрутами
        return (
          <div className="flex flex-col h-full bg-gray-100">
            <header className="flex items-center p-4 bg-blue-600 text-white">
              <button onClick={goHome} className="mr-4">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-medium">{t.manageRoutes}</h1>
            </header>
            <div className="flex justify-center my-4">
              <div className="flex rounded-lg overflow-hidden">
                <button
                  className={`px-4 py-2 ${adminMode === 'routes' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                  onClick={() => setAdminMode('routes')}
                >
                  Маршруты
                </button>
                <button
                  className={`px-4 py-2 ${adminMode === 'buses' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                  onClick={() => setAdminMode('buses')}
                >
                  Рейсы
                </button>
              </div>
            </div>
            <div className="p-4 pb-20">
              {adminMode === 'routes' && (
                <>
                  <button
                    className="mb-4 bg-green-500 text-white rounded-lg py-2 px-4 flex items-center"
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
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <h2 className="text-lg font-medium mb-4">
                        {editRouteId ? t.editRoute : t.addingNewRoute}
                      </h2>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.from}</label>
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              value={newRouteData.from}
                              onChange={(e) => setNewRouteData({ ...newRouteData, from: e.target.value })}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.to}</label>
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              value={newRouteData.to}
                              onChange={(e) => setNewRouteData({ ...newRouteData, to: e.target.value })}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t.departureAddress}</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            value={newRouteData.departureAddress}
                            onChange={(e) => setNewRouteData({ ...newRouteData, departureAddress: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t.arrivalAddress}</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            value={newRouteData.arrivalAddress}
                            onChange={(e) => setNewRouteData({ ...newRouteData, arrivalAddress: e.target.value })}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.priceInSom}</label>
                            <input
                              type="number"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              value={newRouteData.price}
                              onChange={(e) => setNewRouteData({ ...newRouteData, price: e.target.value })}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.durationInMin}</label>
                            <input
                              type="number"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              value={newRouteData.duration}
                              onChange={(e) => setNewRouteData({ ...newRouteData, duration: e.target.value })}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t.vehicleType}</label>
                          <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            value={newRouteData.vehicleType}
                            onChange={(e) => setNewRouteData({ ...newRouteData, vehicleType: e.target.value })}
                          >
                            <option value="автобус">Автобус</option>
                            <option value="маршрутка">Маршрутка</option>
                          </select>
                        </div>

                        <div>
                          <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-700">{t.stops}</label>
                            <button
                              type="button"
                              className="text-blue-600 text-sm flex items-center"
                              onClick={() => {
                                // Добавление новой остановки
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

                          <div className="mt-2 space-y-2">
                            {newRouteData.stops.map((stop, index) => (
                              <div key={index} className="flex space-x-2">
                                <input
                                  type="text"
                                  placeholder={t.stopName}
                                  className="flex-grow border border-gray-300 rounded-lg px-3 py-2"
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
                                  className="w-24 border border-gray-300 rounded-lg px-3 py-2"
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
                                  className="text-red-500 p-2"
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
                          className="w-full bg-blue-600 text-white rounded-lg py-2"
                          onClick={handleAddRoute}
                        >
                          {editRouteId ? t.update : t.addRoute}
                        </button>
                      </div>
                    </div>
                  )}

                  <h2 className="font-bold text-lg mt-6 mb-3">{t.existingRoutes}</h2>

                  <div className="space-y-4 pb-20">
                    {routes.map(route => (
                      <div key={route.id} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                          <div className="text-lg font-medium">{route.from} - {route.to}</div>
                          <div className="text-green-500 font-medium">{route.price} {route.currency}</div>
                        </div>

                        <div className="mt-2 text-sm text-gray-600">
                          <div>{t.departureAddress}: {route.departureAddress}</div>
                          <div>{t.arrivalAddress}: {route.arrivalAddress}</div>
                          <div>{t.duration}: {route.duration} {t.time}</div>
                          <div>{t.vehicleType}: {route.vehicleType}</div>
                          <button
                            className="mt-1 text-blue-600 flex items-center"
                            onClick={() => {
                              if (route.stops) {
                                setCurrentRouteStops(route.stops);
                                setShowStopsModal(true);
                              }
                            }}
                          >
                            <span className="mr-1">{t.viewAllStops}</span>
                            <ChevronRight size={16} />
                          </button>
                        </div>

                        <div className="mt-3 flex space-x-2">
                          <button
                            className="bg-blue-100 text-blue-600 rounded px-3 py-1 text-sm"
                            onClick={() => handleEditRoute(route.id)}
                          >
                            {t.edit}
                          </button>
                          <button
                            className="bg-red-100 text-red-600 rounded px-3 py-1 text-sm"
                            onClick={() => handleDeleteRoute(route.id)}
                          >
                            {t.delete}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {adminMode === 'buses' && (
                <>
                  <button
                    className="mb-4 bg-blue-500 text-white rounded-lg py-2 px-4 flex items-center"
                    onClick={() => setShowAddBusForm(!showAddBusForm)}
                  >
                    <Plus size={20} className="mr-2" />
                    {showAddBusForm ? t.cancel : t.addNewBus}
                  </button>

                  {showAddBusForm && (
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <h2 className="text-lg font-medium mb-4">{t.addingNewBus}</h2>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t.route}</label>
                          <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            value={newBusData.routeId}
                            onChange={(e) => setNewBusData({ ...newBusData, routeId: e.target.value })}
                          >
                            <option value="">{t.selectRoute}</option>
                            {routes.map(route => (
                              <option key={route.id} value={route.id}>
                                {route.from} - {route.to}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t.date}</label>
                          <input
                            type="date"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            value={newBusData.date.split('-').reverse().join('-') || ''}
                            onChange={(e) => {
                              const newDate = e.target.value.split('-').reverse().join('-');
                              setNewBusData({ ...newBusData, date: newDate });
                            }}
                            min={formattedCurrentDate.split('-').reverse().join('-')}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.departureTime}</label>
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              placeholder="23:00"
                              value={newBusData.departureTime}
                              onChange={(e) => setNewBusData({ ...newBusData, departureTime: e.target.value })}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.arrivalTime}</label>
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              placeholder="06:10"
                              value={newBusData.arrivalTime}
                              onChange={(e) => setNewBusData({ ...newBusData, arrivalTime: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.busNumber}</label>
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              placeholder="01KG123ABC"
                              value={newBusData.busNumber}
                              onChange={(e) => setNewBusData({ ...newBusData, busNumber: e.target.value })}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.seatsCount}</label>
                            <input
                              type="number"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              value={newBusData.totalSeats}
                              onChange={(e) => setNewBusData({ ...newBusData, totalSeats: e.target.value })}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t.vehicleType}</label>
                          <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            value={newBusData.vehicleType}
                            onChange={(e) => setNewBusData({ ...newBusData, vehicleType: e.target.value })}
                          >
                            <option value="автобус">Автобус</option>
                            <option value="маршрутка">Маршрутка</option>
                          </select>
                        </div>

                        <button
                          className="w-full bg-blue-600 text-white rounded-lg py-2"
                          onClick={handleAddBus}
                        >
                          {t.addBus}
                        </button>
                      </div>
                    </div>
                  )}

                  <h2 className="font-bold text-lg mt-6 mb-3">Существующие рейсы</h2>
                  <div className="space-y-4 pb-20">
                    {Object.keys(buses).length > 0 ? (
                      Object.keys(buses).map(busDate => (
                        <div key={busDate} className="mb-4">
                          <h3 className="font-medium border-b pb-2">{busDate}</h3>
                          <div className="space-y-2 mt-2">
                            {buses[busDate].length > 0 ? (
                              buses[busDate].map(bus => (
                                <div key={bus.id} className="bg-white p-4 rounded-lg shadow-sm">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="font-medium">
                                        {routes.find(r => r.id === bus.routeId)?.from} - {routes.find(r => r.id === bus.routeId)?.to}
                                      </div>
                                      <div className="text-sm text-gray-500">{bus.departureTime} - {bus.arrivalTime}</div>
                                    </div>
                                    <div className="text-sm">
                                      {t.busNumber}: {bus.busNumber}
                                    </div>
                                  </div>
                                  <div className="mt-2 flex justify-between">
                                    <div className="text-sm">
                                      {t.available}: {bus.availableSeats} / {bus.totalSeats}
                                    </div>
                                    <button
                                      className="text-red-500 text-sm"
                                      onClick={() => {
                                        // Функция удаления рейса
                                        if (window.confirm('Вы уверены, что хотите удалить этот рейс?')) {
                                          const updatedBuses = { ...buses };
                                          updatedBuses[busDate] = updatedBuses[busDate].filter(b => b.id !== bus.id);
                                          setBuses(updatedBuses);
                                        }
                                      }}
                                    >
                                      {t.delete}
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center p-4 text-gray-500">
                                Нет рейсов на эту дату
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-8 text-gray-500">
                        Пока нет добавленных рейсов
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            {/* Модальное окно остановок */}
            {showStopsModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-5/6 max-w-md max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">{t.stops}</h3>
                    <button onClick={() => setShowStopsModal(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {currentRouteStops.map((stop, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-medium">{index + 1}</span>
                          </div>
                          <div>{stop.name}</div>
                        </div>
                        <div className="font-medium">{stop.time}</div>
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
          <div className="flex flex-col h-full bg-gray-100">
            <header className="flex items-center p-4 bg-blue-600 text-white">
              <button onClick={goHome} className="mr-4">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-medium">{adminTab === 'bookings' ? t.allBookings : t.reviews}</h1>
            </header>
            <div className="flex justify-center mb-4 mt-2">
              <div className="flex rounded-lg overflow-hidden">
                <button
                  className={`px-4 py-2 ${adminTab === 'bookings' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                  onClick={() => setAdminTab('bookings')}
                >
                  Бронирования
                </button>
                <button
                  className={`px-4 py-2 ${adminTab === 'reviews' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                  onClick={() => setAdminTab('reviews')}
                >
                  Отзывы
                </button>
              </div>
            </div>
            <div className="p-4 flex flex-col space-y-4 pb-20">
              {adminTab === 'bookings' ? (
                <>
                  {bookingHistory.length > 0 ? (
                    bookingHistory.map((booking, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex justify-between items-center">
                          <div className="text-lg font-medium">{booking.from} - {booking.to}</div>
                          <div className={`text-sm ${booking.status === 'upcoming' ? 'text-green-500' : 'text-gray-500'}`}>
                            {booking.status === 'upcoming' ? t.upcoming : t.completed}
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between">
                            <div className="text-xl font-bold">{booking.departureTime}</div>
                            <div className="text-gray-500 text-sm">{booking.date}</div>
                            <div className="text-xl font-bold">{booking.arrivalTime}</div>
                          </div>
                        </div>

                        <div className="mt-3 border-t border-gray-100 pt-3">
                          <div className="text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">{t.passenger}:</span>
                              <span className="font-medium">{booking.passenger}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-gray-500">{t.phone}:</span>
                              <span className="font-medium">{booking.phone}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-gray-500">{t.seats}:</span>
                              <span className="font-medium">{booking.seats.join(', ')}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-gray-500">{t.price}:</span>
                              <span className="font-medium">{booking.price} {booking.currency}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-gray-500">{t.busNumber}:</span>
                              <span className="font-medium">{booking.busNumber}</span>
                            </div>
                          </div>

                          <button
                            className="w-full mt-3 text-blue-600 border border-blue-600 rounded-lg py-2 text-sm"
                            onClick={() => {
                              // Просмотр деталей бронирования
                              setCurrentRouteStops(booking.stops || []);
                              setShowStopsModal(true);
                            }}
                          >
                            {t.viewDetails}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 text-gray-500">
                      {t.noBookings}
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map(review => (
                      <div key={review.id} className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{review.userName}</div>
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} size={16} className="text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>

                        <div className="text-sm text-gray-500 mt-1">
                          {review.route} • {review.date}
                        </div>

                        <div className="mt-2 border-t pt-2">
                          {review.text}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 text-gray-500">
                      {t.noReviews}
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Модальное окно для просмотра деталей поездки */}
            {showStopsModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-5/6 max-w-md max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">{t.tripDetails}</h3>
                    <button onClick={() => setShowStopsModal(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="font-medium">{t.stops}:</div>
                    {currentRouteStops.map((stop, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-medium">{index + 1}</span>
                          </div>
                          <div>{stop.name}</div>
                        </div>
                        <div className="font-medium">{stop.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <div>Unknown step: {step}</div>;
    }
  };
  // Основной компонент приложения, адаптирован для разных устройств
  return (
    <div className="flex justify-center">
      <div className={`flex flex-col h-screen bg-gray-100 ${isDesktop ? 'max-w-lg w-full' : 'w-full'}`}>
        {renderScreen()}
      </div>
    </div>
  );
};
export default App;