import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, MapPin, Users, Clock, ArrowLeft, Bell, Home, Ticket, User, Mail, Phone, Lock, Edit, Plus, Check, AlertCircle } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';

// Simulated database of routes and available seats
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
    duration: 430, // in minutes
    vehicleType: "автобус"
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
    duration: 430, // in minutes
    vehicleType: "маршрутка"
  },
];

// Simulated buses for each date/route
const initialBuses = {
  "15-05-2025": [
    {
      id: 1,
      routeId: 1,
      departureTime: "23:00",
      arrivalTime: "06:10",
      busNumber: "09KG209ADF",
      carrier: "ОсОО \"GOBUS\"",
      totalSeats: 46,
      availableSeats: 30,
      vehicleType: "автобус"
    },
    {
      id: 2,
      routeId: 1,
      departureTime: "23:30",
      arrivalTime: "06:25",
      busNumber: "01KG919AO",
      carrier: "ОсОО \"GOBUS\"",
      totalSeats: 46,
      availableSeats: 1,
      vehicleType: "автобус"
    }
  ],
  "16-05-2025": [
    {
      id: 3,
      routeId: 1,
      departureTime: "23:00",
      arrivalTime: "06:10",
      busNumber: "09KG209ADF",
      carrier: "ОсОО \"GOBUS\"",
      totalSeats: 46,
      availableSeats: 30,
      vehicleType: "автобус"
    }
  ],
};

// Seat layout definition based on new screenshot
const seatLayout = {
  standard: {
    rows: 6,
    cols: 4,
    price: 0,
    seats: [
      23, 24, null, null,
      null, 26, null, null,
      29, 30, null, null,
      33, 34, null, null,
      37, 38, 35, null,
      41, 42, 39, 40,
      45, 46, 43, 44
    ]
  },
  comfort: {
    rows: 6,
    cols: 2,
    price: 50, // Additional price
    seats: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
  }
};

// Simulated booked seats
const initialBookedSeats = {
  "1-15-05-2025": [25, 27, 28, 31, 32, 36],
  "2-15-05-2025": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 14, 15, 17, 18, 19, 21, 22, 25, 27, 28, 29, 30],
  "3-16-05-2025": [2, 5, 7, 9, 13, 18, 22, 25, 29]
};

// Simulated users database
const initialUsers = [
  {
    id: 1,
    email: "admin@gobus.kg",
    password: "admin123",
    firstName: "Админ",
    lastName: "GOBUS",
    phone: "+996555123456",
    role: "admin"
  },
  {
    id: 2,
    email: "aelina@gmail.com",
    password: "password123",
    firstName: "Аэлина",
    lastName: "Рысбекова",
    phone: "+996508737705",
    role: "user"
  }
];

const App = () => {
  // Responsive breakpoints
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isMobile = useMediaQuery({ maxWidth: 767 });
  
  const [step, setStep] = useState(0); // Start with registration/login screen
  const [tripType, setTripType] = useState('one-way');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('15-05-2025');
  const [passengers, setPassengers] = useState(1);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatType, setSeatType] = useState('standard');
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [routes, setRoutes] = useState(initialRoutes);
  const [buses, setBuses] = useState(initialBuses);
  const [bookedSeats, setBookedSeats] = useState(initialBookedSeats);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [bookingHistory, setBookingHistory] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(initialUsers);
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
  const [paymentValidation, setPaymentValidation] = useState({
    isValid: false,
    message: '',
    isProcessing: false
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [newRouteData, setNewRouteData] = useState({
    from: '',
    to: '',
    departureAddress: '',
    arrivalAddress: '',
    price: '',
    duration: '',
    vehicleType: 'автобус'
  });
  const [newBusData, setNewBusData] = useState({
    routeId: '',
    date: '',
    departureTime: '',
    arrivalTime: '',
    busNumber: '',
    totalSeats: 46,
    vehicleType: 'автобус'
  });
  const [showAddRouteForm, setShowAddRouteForm] = useState(false);
  const [showAddBusForm, setShowAddBusForm] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Effect to set user profile info when logged in
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

  // Function to handle registration
  const handleRegistration = (e) => {
    e.preventDefault();
    
    // Validate form
    if (registrationData.password !== registrationData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    
    if (!registrationData.email || !registrationData.password || !registrationData.firstName || 
        !registrationData.lastName || !registrationData.phone) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    
    // Check if email already exists
    if (users.some(user => user.email === registrationData.email)) {
      alert('Пользователь с таким email уже существует');
      return;
    }
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      email: registrationData.email,
      password: registrationData.password,
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      phone: registrationData.phone,
      role: 'user'
    };
    
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setStep(1); // Go to main search screen
  };
  
  // Function to handle login
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Find user
    const user = users.find(u => u.email === loginData.email && u.password === loginData.password);
    
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setIsAdmin(user.role === 'admin');
      setStep(1); // Go to main search screen
    } else {
      alert('Неверный email или пароль');
    }
  };
  
  // Function to validate credit card (simple validation)
  const validateCreditCard = (cardNumber, expiryDate, cvv, cardName) => {
    if (!cardNumber || !expiryDate || !cvv || !cardName) {
      return {
        isValid: false,
        message: 'Пожалуйста, заполните все поля'
      };
    }
    
    // Simple card number validation (16 digits)
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      return {
        isValid: false,
        message: 'Некорректный номер карты'
      };
    }
    
    // Simple expiry date validation (MM/YY format)
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      return {
        isValid: false,
        message: 'Некорректная дата (используйте формат ММ/ГГ)'
      };
    }
    
    // Simple CVV validation (3 or 4 digits)
    if (!/^\d{3,4}$/.test(cvv)) {
      return {
        isValid: false,
        message: 'Некорректный CVV код'
      };
    }
    
    // Check if card has enough balance (simulated)
    const totalPrice = calculateTotalPrice();
    if (totalPrice > 10000) { // Arbitrary check for demo purposes
      return {
        isValid: false,
        message: 'Недостаточно средств на карте'
      };
    }
    
    return {
      isValid: true,
      message: 'Оплата прошла успешно'
    };
  };

  // Function to get available buses for a route and date
  const getAvailableBuses = (date) => {
    return buses[date] || [];
  };

  // Function to calculate the total price
  const calculateTotalPrice = () => {
    if (!selectedBus) return 0;
    
    const route = routes.find(r => r.id === selectedBus.routeId);
    if (!route) return 0;
    
    let basePrice = route.price * selectedSeats.length;
    
    // Add comfort price if needed
    const comfortSeats = selectedSeats.filter(seat => seat > 16);
    const comfortPrice = comfortSeats.length * seatLayout.comfort.price;
    
    return basePrice + comfortPrice;
  };

  // Function to handle seat selection
  const handleSeatSelection = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      if (selectedSeats.length < passengers) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      }
    }
  };

  // Function to check if a seat is booked
  const isSeatBooked = (busId, date, seatNumber) => {
    const key = `${busId}-${date}`;
    return bookedSeats[key] && bookedSeats[key].includes(seatNumber);
  };

  // Function to process payment and complete booking
  const processPayment = (cardData) => {
    setPaymentValidation({
      isValid: false,
      message: '',
      isProcessing: true
    });
    
    // Simulate API call for payment processing
    setTimeout(() => {
      // Validate card
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

  // Function to complete booking
  const completeBooking = () => {
    // In a real app, this would send data to a backend
    const newBooking = {
      id: Math.floor(Math.random() * 1000) + 1,
      date: date,
      from: from,
      to: to,
      departureTime: selectedBus.departureTime,
      arrivalTime: selectedBus.arrivalTime,
      price: calculateTotalPrice(),
      currency: routes.find(r => r.id === selectedBus.routeId).currency,
      seats: selectedSeats,
      busNumber: selectedBus.busNumber,
      passenger: `${personalInfo.firstName} ${personalInfo.lastName}`,
      duration: selectedBus.duration || routes.find(r => r.id === selectedBus.routeId).duration,
      status: 'upcoming'
    };
    
    // Update booked seats
    const key = `${selectedBus.id}-${date}`;
    setBookedSeats({
      ...bookedSeats,
      [key]: [...(bookedSeats[key] || []), ...selectedSeats]
    });
    
    // Update available seats count
    const updatedBuses = {...buses};
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
    
    // Add to history
    setBookingHistory([newBooking, ...bookingHistory]);
    
    // Reset selection
    setStep(6);
  };
  
  // Function to add new route (admin only)
  const handleAddRoute = () => {
    if (!newRouteData.from || !newRouteData.to || !newRouteData.price || !newRouteData.duration) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
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
      vehicleType: newRouteData.vehicleType
    };
    
    setRoutes([...routes, newRoute]);
    setNewRouteData({
      from: '',
      to: '',
      departureAddress: '',
      arrivalAddress: '',
      price: '',
      duration: '',
      vehicleType: 'автобус'
    });
    setShowAddRouteForm(false);
  };
  
  // Function to add new bus (admin only)
  const handleAddBus = () => {
    if (!newBusData.routeId || !newBusData.date || !newBusData.departureTime || !newBusData.arrivalTime || !newBusData.busNumber) {
      alert('Пожалуйста, заполните все обязательные поля');
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
      availableSeats: parseInt(newBusData.totalSeats),
      vehicleType: newBusData.vehicleType
    };
    
    const updatedBuses = {...buses};
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
      totalSeats: 46,
      vehicleType: 'автобус'
    });
    setShowAddBusForm(false);
  };

  // Navigation functions
  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const goHome = () => {
    setStep(1);
    setSelectedBus(null);
    setSelectedSeats([]);
  };
  
  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setStep(0);
  };

  // Render different screens based on step
  const renderScreen = () => {
    switch (step) {
      case 0: // Registration/Login screen
        return (
          <div className="flex flex-col h-full bg-gray-100">
            <header className="flex justify-between items-center p-4 bg-white">
              <div className="text-2xl font-bold">
                <span className="text-green-500">GO</span>
                <span className="text-blue-600">BUS</span>
              </div>
            </header>
            
            <div className="p-4 flex flex-col">
              <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
                <div className="text-xl font-bold mb-4">Вход в систему</div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                      <Mail size={20} className="text-gray-400 mr-2" />
                      <input
                        type="email"
                        className="w-full focus:outline-none"
                        placeholder="example@mail.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                      <Lock size={20} className="text-gray-400 mr-2" />
                      <input
                        type="password"
                        className="w-full focus:outline-none"
                        placeholder="Пароль"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium"
                  >
                    Войти
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Тестовые данные для входа:<br />
                    Email: admin@gobus.kg<br />
                    Пароль: admin123
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-xl font-bold mb-4">Регистрация</div>
                
                <form onSubmit={handleRegistration} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                      <Mail size={20} className="text-gray-400 mr-2" />
                      <input
                        type="email"
                        className="w-full focus:outline-none"
                        placeholder="example@mail.com"
                        value={registrationData.email}
                        onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                        placeholder="Имя"
                        value={registrationData.firstName}
                        onChange={(e) => setRegistrationData({...registrationData, firstName: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                        placeholder="Фамилия"
                        value={registrationData.lastName}
                        onChange={(e) => setRegistrationData({...registrationData, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                      <Phone size={20} className="text-gray-400 mr-2" />
                      <input
                        type="tel"
                        className="w-full focus:outline-none"
                        placeholder="+996 XXX XXX XXX"
                        value={registrationData.phone}
                        onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                      <Lock size={20} className="text-gray-400 mr-2" />
                      <input
                        type="password"
                        className="w-full focus:outline-none"
                        placeholder="Пароль"
                        value={registrationData.password}
                        onChange={(e) => setRegistrationData({...registrationData, password: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Подтверждение пароля</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                      <Lock size={20} className="text-gray-400 mr-2" />
                      <input
                        type="password"
                        className="w-full focus:outline-none"
                        placeholder="Подтвердите пароль"
                        value={registrationData.confirmPassword}
                        onChange={(e) => setRegistrationData({...registrationData, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-green-500 text-white rounded-lg py-3 font-medium"
                  >
                    Зарегистрироваться
                  </button>
                </form>
              </div>
            </div>
          </div>
        );
        
      case 1: // Main search screen
        return (
          <div className="flex flex-col h-full bg-gray-100">
            <header className="flex justify-between items-center p-4 bg-white">
              <div className="text-2xl font-bold">
                <span className="text-green-500">GO</span>
                <span className="text-blue-600">BUS</span>
              </div>
              <div className="flex space-x-4">
                <div>🇷🇺</div>
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
                  В одну сторону
                </button>
                <button 
                  className={`flex-1 py-2 text-center ${tripType === 'round-trip' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                  onClick={() => setTripType('round-trip')}
                >
                  Туда - обратно
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
                    <option value="" disabled>Откуда</option>
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
                    <option value="" disabled>Куда</option>
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
                    <select
                      className="w-full bg-transparent border-none focus:outline-none"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    >
                      <option value="15-05-2025">15.05.2025</option>
                      <option value="16-05-2025">16.05.2025</option>
                      <option value="17-05-2025">17.05.2025</option>
                      <option value="15-05-2025">15.05.2025</option>
                      <option value="16-05-2025">16.05.2025</option>
                      <option value="17-05-2025">17.05.2025</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex-1 bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center">
                    <Users className="text-gray-400 mr-2" size={20} />
                    <select
                      className="w-full bg-transparent border-none focus:outline-none"
                      value={passengers}
                      onChange={(e) => setPassengers(parseInt(e.target.value))}
                    >
                      <option value="1">1 Пассажир</option>
                      <option value="2">2 Пассажира</option>
                      <option value="3">3 Пассажира</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <button
                className="bg-blue-600 text-white rounded-lg py-3 font-medium"
                onClick={() => {
                  if (from && to && date) {
                    setStep(2);
                  }
                }}
              >
                Поиск
              </button>
              
              <div className="mt-4">
                <img 
                  src="/api/placeholder/800/200" 
                  alt="Available routes to Ala-Archa" 
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
            
            <footer className="mt-auto border-t border-gray-200 bg-white">
              <div className="flex justify-around py-3">
                <div className="flex flex-col items-center text-xs">
                  <Home size={20} className="text-green-500" />
                  <span className="text-green-500">Главная</span>
                </div>
                <div className="flex flex-col items-center text-xs" onClick={() => setStep(7)}>
                  <Ticket size={20} className="text-gray-500" />
                  <span className="text-gray-500">Поездки</span>
                </div>
                <div className="flex flex-col items-center text-xs" onClick={() => setStep(9)}>
                  <User size={20} className="text-gray-500" />
                  <span className="text-gray-500">Профиль</span>
                </div>
              </div>
            </footer>
          </div>
        );
        
      case 2: // Available buses
        return (
          <div className="flex flex-col h-full bg-gray-100">
            <header className="flex items-center p-4 bg-blue-600 text-white">
              <button onClick={goBack} className="mr-4">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-medium">{from} - {to}</h1>
            </header>
            
            <div className="px-4 py-2 bg-white">
              <div className="flex border-b">
                {['15-05-2025', '16-05-2025', '17-05-2025'].map((d) => (
                  <button
                    key={d}
                    className={`flex-1 py-2 ${date === d ? 'border-b-2 border-blue-600 font-medium' : ''}`}
                    onClick={() => setDate(d)}
                  >
                    {d.split('-').slice(0, 2).join('-')}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-4 flex flex-col space-y-4">
              {getAvailableBuses(date).filter(bus => 
                routes.find(r => r.id === bus.routeId)?.from === from && 
                routes.find(r => r.id === bus.routeId)?.to === to
              ).map((bus) => (
                <div key={bus.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold">{bus.departureTime}</div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={16} className="mr-1" />
                      {routes.find(r => r.id === bus.routeId)?.duration} мин
                    </div>
                    <div className="text-xl font-bold">{bus.arrivalTime}</div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500 mt-1 mb-3">
                    <div>{from}</div>
                    <div>{to}</div>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                    <div className="text-sm">
                      <span className="text-gray-500">Свободно: </span>
                      <span className="font-medium">{bus.availableSeats}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Тип: </span>
                      <span className="font-medium">{bus.vehicleType}</span>
                    </div>
                    <div className="text-xl font-bold text-green-500">
                      {routes.find(r => r.id === bus.routeId)?.price} {routes.find(r => r.id === bus.routeId)?.currency}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    Номер машины: {bus.busNumber}
                  </div>
                  
                  <div className="mt-2 text-xs text-blue-600">
                    Перевозчик: {bus.carrier}
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-600 hover:underline cursor-pointer">
                    Адрес посадки: {routes.find(r => r.id === bus.routeId)?.departureAddress}
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-500">
                    ! Обмен билетов невозможен<br />
                    Возврат осуществляется в соответствии с договором оферты
                  </div>
                  
                  {bus.availableSeats > 0 && (
                    <button
                      className="mt-4 w-full bg-blue-600 text-white rounded-lg py-3 font-medium"
                      onClick={() => {
                        setSelectedBus(bus);
                        setStep(3);
                      }}
                    >
                      Выбрать
                    </button>
                  )}
                </div>
              ))}
              
              {getAvailableBuses(date).filter(bus => 
                routes.find(r => r.id === bus.routeId)?.from === from && 
                routes.find(r => r.id === bus.routeId)?.to === to
              ).length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="text-lg text-gray-600 mb-2">Маршруты не найдены</div>
                  <div className="text-sm text-gray-500">
                    На выбранную дату нет доступных маршрутов. Попробуйте выбрать другую дату или направление.
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 3: // Trip details and personal info
        return (
          <div className="flex flex-col h-full bg-gray-100">
            <header className="flex items-center p-4 bg-blue-600 text-white">
              <button onClick={goBack} className="mr-4">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-medium">Детали поездки</h1>
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
                  <div className="text-center text-green-500 text-sm mt-2 underline">
                    Смотреть все остановки...
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 flex flex-col space-y-4">
              <h2 className="font-medium">Личные Данные</h2>
              
              <input
                type="text"
                placeholder="Имя"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={personalInfo.firstName}
                onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                readOnly={!!currentUser}
              />
              
              <input
                type="text"
                placeholder="Фамилия"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={personalInfo.lastName}
                onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                readOnly={!!currentUser}
              />
              
              <input
                type="tel"
                placeholder="Телефон"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={personalInfo.phone}
                onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                readOnly={!!currentUser}
              />
              
              <button
                className="mt-auto bg-blue-600 text-white rounded-lg py-3 font-medium"
                onClick={() => {
                  if (personalInfo.firstName && personalInfo.lastName && personalInfo.phone) {
                    setStep(4);
                  }
                }}
              >
                Выберите место
              </button>
            </div>
          </div>
        );
        
      case 4: // Seat selection
        return (
          <div className="flex flex-col h-full bg-gray-100">
            <header className="flex items-center p-4 bg-blue-600 text-white">
              <button onClick={goBack} className="mr-4">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-medium">Выберите место</h1>
            </header>
            
            <div className="p-4 flex flex-col space-y-4">
              <div className="flex rounded-lg overflow-hidden">
                <button 
                  className={`flex-1 py-2 text-center ${seatType === 'standard' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setSeatType('standard')}
                >
                  Стандарт
                </button>
                <button 
                  className={`flex-1 py-2 text-center ${seatType === 'comfort' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setSeatType('comfort')}
                >
                  Комфорт (+50 сом)
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {seatLayout.standard.seats.map((seatNumber, index) => {
                  if (seatNumber === null) {
                    return <div key={`empty-${index}`} className="aspect-square"></div>;
                  }
                  
                  const isBooked = isSeatBooked(selectedBus.id, date, seatNumber);
                  const isSelected = selectedSeats.includes(seatNumber);
                  
                  return (
                    <div 
                      key={seatNumber}
                      className={`aspect-square flex items-center justify-center border rounded-lg ${
                        isBooked ? 'border-gray-300 bg-gray-100' :
                        isSelected ? 'border-blue-500 bg-blue-100 text-blue-600' :
                        'border-blue-300 text-blue-500'
                      }`}
                      onClick={() => !isBooked && handleSeatSelection(seatNumber)}
                    >
                      {isBooked ? (
                        <div className="text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v-6m0 0V5m0 3h6m-6 0H6" />
                          </svg>
                        </div>
                      ) : (
                        seatNumber
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4">
                <div className="font-medium">Выбрано: {selectedSeats.join(', ')}</div>
              </div>
              
              <button
                className={`mt-auto py-3 rounded-lg font-medium ${
                  selectedSeats.length > 0 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
                }`}
                disabled={selectedSeats.length === 0}
                onClick={() => selectedSeats.length > 0 && setStep(5)}
              >
                Сохранить
              </button>
            </div>
          </div>
        );
        
      case 5: // Payment
        return (
          <div className="flex flex-col h-full bg-gray-100">
            <header className="flex items-center p-4 bg-blue-600 text-white">
              <button onClick={goBack} className="mr-4">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-medium">Оплата</h1>
            </header>
            
            <div className="p-4 bg-white mb-4">
              <div className="flex justify-between">
                <div>
                  <div className="text-gray-500">Маршрут:</div>
                  <div className="font-medium">{from} - {to}</div>
                </div>
                <div>
                  <div className="text-gray-500">Дата:</div>
                  <div className="font-medium">{date}</div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-gray-500">Время отправления:</div>
                <div className="font-medium">{selectedBus?.departureTime}</div>
              </div>
              
              <div className="mt-4">
                <div className="text-gray-500">Места:</div>
                <div className="font-medium">{selectedSeats.join(', ')}</div>
              </div>
              
              <div className="mt-4">
                <div className="text-gray-500">Пассажир:</div>
                <div className="font-medium">{personalInfo.firstName} {personalInfo.lastName}</div>
              </div>
              
              <div className="mt-4 flex justify-between items-end">
                <div>
                  <div className="text-gray-500">Итого к оплате:</div>
                  <div className="text-xl font-bold text-green-500">
                    {calculateTotalPrice()} {routes.find(r => r.id === selectedBus?.routeId)?.currency}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 flex flex-col space-y-4">
              <h2 className="font-medium">Способ оплаты</h2>
              
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
                  <span>Банковская карта</span>
                </label>
              </div>
              
              <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-white">
                <input
                  type="radio"
                  id="elsom"
                  name="payment"
                  checked={paymentMethod === 'elsom'}
                  onChange={() => setPaymentMethod('elsom')}
                  className="mr-3"
                />
                <label htmlFor="elsom" className="flex items-center">
                  <img src="/api/placeholder/24/24" alt="Elsom" className="mr-2" />
                  <span>Элсом</span>
                </label>
              </div>
              
              {paymentMethod === 'card' && (
                <div className="space-y-4 mt-4">
                  <input
                    type="text"
                    placeholder="Номер карты"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    id="cardNumber"
                  />
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="ММ/ГГ"
                      className="flex-1 p-3 border border-gray-300 rounded-lg"
                      id="expiryDate"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="flex-1 p-3 border border-gray-300 rounded-lg"
                      id="cvv"
                    />
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Имя на карте"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    id="cardName"
                  />
                </div>
              )}
              
              {paymentMethod === 'elsom' && (
                <div className="space-y-4 mt-4">
                  <input
                    type="tel"
                    placeholder="Номер телефона"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              )}
              
              {paymentValidation.message && (
                <div className={`p-3 rounded-lg ${
                  paymentValidation.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
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
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  Я согласен с условиями публичной оферты
                </label>
              </div>
              
              <button
                className="mt-auto bg-blue-600 text-white rounded-lg py-3 font-medium"
                onClick={() => {
                  if (paymentMethod === 'card') {
                    const cardNumber = document.getElementById('cardNumber').value;
                    const expiryDate = document.getElementById('expiryDate').value;
                    const cvv = document.getElementById('cvv').value;
                    const cardName = document.getElementById('cardName').value;
                    
                    processPayment({
                      cardNumber,
                      expiryDate,
                      cvv,
                      cardName
                    });
                  } else {
                    // For demo, just complete the booking
                    completeBooking();
                  }
                }}
                disabled={paymentValidation.isProcessing}
              >
                {paymentValidation.isProcessing ? 'Обработка...' : `Оплатить ${calculateTotalPrice()} ${routes.find(r => r.id === selectedBus?.routeId)?.currency}`}
              </button>
            </div>
          </div>
        );
        
      case 6: // Booking confirmation
        return (
          <div className="flex flex-col h-full bg-gray-100">
            <header className="flex items-center p-4 bg-green-500 text-white">
              <button onClick={goHome} className="mr-4">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-medium">Бронирование завершено</h1>
            </header>
            
            <div className="p-4 flex flex-col items-center justify-center space-y-4 h-full">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-xl font-bold text-center">Бронирование успешно завершено!</h2>
              
              <p className="text-center text-gray-600">
                Билет на направление {from} - {to} успешно забронирован. Вы можете просмотреть все детали в разделе "Поездки".
              </p>
              
              <div className="p-4 bg-white rounded-lg shadow-sm w-full mt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-xl">{selectedBus?.departureTime}</div>
                    <div className="text-sm text-gray-500">{date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl">{selectedBus?.arrivalTime}</div>
                    <div className="text-sm text-gray-500">{routes.find(r => r.id === selectedBus?.routeId)?.duration} мин</div>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <div>{from}</div>
                  <div>{to}</div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-500">Место:</div>
                    <div className="font-medium">{selectedSeats.join(', ')}</div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="text-sm text-gray-500">Пассажир:</div>
                    <div className="font-medium">{personalInfo.firstName} {personalInfo.lastName}</div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="text-sm text-gray-500">Номер машины:</div>
                    <div className="font-medium">{selectedBus?.busNumber}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-4">
                <button
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium"
                  onClick={() => setStep(7)}
                >
                  Мои поездки
                </button>
                <button
                  className="flex-1 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg font-medium"
                  onClick={goHome}
                >
                  На главную
                </button>
              </div>
            </div>
          </div>
        );
        
        case 7: // My trips
        return (
          <div className="flex flex-col h-full bg-gray-100">
            <header className="flex items-center p-4 bg-white border-b">
              <div className="flex justify-between items-center w-full">
                <h1 className="text-xl font-medium">Поездки</h1>
                <div className="flex">
                  <button 
                    className={`px-4 py-2 ${activeTab === 'upcoming' ? 'border-b-2 border-blue-600' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                  >
                    Поездки
                  </button>
                  <button 
                    className={`px-4 py-2 ${activeTab === 'history' ? 'border-b-2 border-blue-600' : ''}`}
                    onClick={() => setActiveTab('history')}
                  >
                    История
                  </button>
                </div>
              </div>
            </header>
            
            <div className="p-4 flex flex-col space-y-4">
              {activeTab === 'upcoming' ? (
                <>
                  {bookingHistory.filter(b => b.status === 'upcoming').map((booking, index) => (
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
                        Номер машины: {booking.busNumber}
                      </div>
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="text-sm font-medium">{booking.price} {booking.currency}</div>
                        <button className="text-green-500 text-sm">Детали</button>
                      </div>
                    </div>
                  ))}
                  
                  {bookingHistory.filter(b => b.status === 'upcoming').length === 0 && (
                    <div className="text-center p-8 text-gray-500">
                      У вас пока нет забронированных поездок.
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-xl font-bold">23:30</div>
                      <div className="text-gray-500 text-sm">12 апреля 2025</div>
                      <div className="text-xl font-bold">06:25</div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <div>Г. Бишкек</div>
                      <div>Г. Каракол</div>
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600">
                      Номер машины: 01KG920AO
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-sm font-medium">600 сом</div>
                      <button className="text-green-500 text-sm">Оставить отзыв</button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-xl font-bold">23:55</div>
                      <div className="text-gray-500 text-sm">06 февраля 2025</div>
                      <div className="text-xl font-bold">07:00</div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <div>Г. Каракол</div>
                      <div>Г. Бишкек</div>
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600">
                      Номер машины: 0
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-sm font-medium">600 сом</div>
                      <button className="text-green-500 text-sm">Оставить отзыв</button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-xl font-bold">23:30</div>
                      <div className="text-gray-500 text-sm">31 января 2025</div>
                      <div className="text-xl font-bold">06:25</div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <div>Г. Бишкек</div>
                      <div>Г. Каракол</div>
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600">
                      Номер машины: 0
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-sm font-medium">600 сом</div>
                      <button className="text-green-500 text-sm">Оставить отзыв</button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <footer className="mt-auto border-t border-gray-200 bg-white">
              <div className="flex justify-around py-3">
                <div className="flex flex-col items-center text-xs" onClick={goHome}>
                  <Home size={20} className="text-gray-500" />
                  <span className="text-gray-500">Главная</span>
                </div>
                <div className="flex flex-col items-center text-xs">
                  <Ticket size={20} className="text-green-500" />
                  <span className="text-green-500">Поездки</span>
                </div>
                <div className="flex flex-col items-center text-xs" onClick={() => setStep(9)}>
                  <User size={20} className="text-gray-500" />
                  <span className="text-gray-500">Профиль</span>
                </div>
              </div>
            </footer>
          </div>
        );
        
      case 9: // Profile
        return (
          <div className="flex flex-col h-full bg-gray-100">
            <header className="p-4">
              <h1 className="text-2xl font-bold">Профиль</h1>
            </header>
            
            <div className="flex items-center p-4 bg-white border-b">
              <div className="flex-1">
                <div className="font-medium text-lg">{currentUser?.firstName} {currentUser?.lastName}</div>
                <div className="text-gray-500">{currentUser?.phone}</div>
              </div>
              <button className="text-gray-500">
                <Edit size={20} />
              </button>
            </div>
            
            <div className="p-4 flex flex-col space-y-4">
              <button className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="flex-1 text-left">О Нас</span>
              </button>
              
              <button className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className="flex-1 text-left">Кошелек</span>
              </button>
              
              <button className="flex items-center p-4 bg-white rounded-lg shadow-sm" onClick={logout}>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span className="flex-1 text-left">Выйти</span>
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
            
            <footer className="mt-auto border-t border-gray-200 bg-white">
              <div className="flex justify-around py-3">
                <div className="flex flex-col items-center text-xs" onClick={goHome}>
                  <Home size={20} className="text-gray-500" />
                  <span className="text-gray-500">Главная</span>
                </div>
                <div className="flex flex-col items-center text-xs" onClick={() => setStep(7)}>
                  <Ticket size={20} className="text-gray-500" />
                  <span className="text-gray-500">Поездки</span>
                </div>
                <div className="flex flex-col items-center text-xs">
                  <User size={20} className="text-green-500" />
                  <span className="text-green-500">Профиль</span>
                </div>
              </div>
            </footer>
          </div>
        );
        
      case 10: // Admin - Route Management
        return (
          <div className="flex flex-col h-full bg-gray-100">
            <header className="flex items-center p-4 bg-blue-600 text-white">
              <button onClick={goHome} className="mr-4">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-medium">Управление маршрутами</h1>
            </header>
            
            <div className="p-4">
              <button 
                className="mb-4 bg-green-500 text-white rounded-lg py-2 px-4 flex items-center"
                onClick={() => setShowAddRouteForm(!showAddRouteForm)}
              >
                <Plus size={20} className="mr-2" />
                {showAddRouteForm ? 'Отменить' : 'Добавить новый маршрут'}
              </button>
              
              {showAddRouteForm && (
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                  <h2 className="text-lg font-medium mb-4">Добавление нового маршрута</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Откуда</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          value={newRouteData.from}
                          onChange={(e) => setNewRouteData({...newRouteData, from: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Куда</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          value={newRouteData.to}
                          onChange={(e) => setNewRouteData({...newRouteData, to: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Адрес отправления</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        value={newRouteData.departureAddress}
                        onChange={(e) => setNewRouteData({...newRouteData, departureAddress: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Адрес прибытия</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        value={newRouteData.arrivalAddress}
                        onChange={(e) => setNewRouteData({...newRouteData, arrivalAddress: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Цена (сом)</label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          value={newRouteData.price}
                          onChange={(e) => setNewRouteData({...newRouteData, price: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Длительность (мин)</label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          value={newRouteData.duration}
                          onChange={(e) => setNewRouteData({...newRouteData, duration: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Тип транспорта</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        value={newRouteData.vehicleType}
                        onChange={(e) => setNewRouteData({...newRouteData, vehicleType: e.target.value})}
                      >
                        <option value="автобус">Автобус</option>
                        <option value="маршрутка">Маршрутка</option>
                      </select>
                    </div>
                    
                    <button
                      className="w-full bg-blue-600 text-white rounded-lg py-2"
                      onClick={handleAddRoute}
                    >
                      Добавить маршрут
                    </button>
                  </div>
                </div>
              )}
              
              <button 
                className="mb-4 bg-blue-500 text-white rounded-lg py-2 px-4 flex items-center"
                onClick={() => setShowAddBusForm(!showAddBusForm)}
              >
                <Plus size={20} className="mr-2" />
                {showAddBusForm ? 'Отменить' : 'Добавить новый рейс'}
              </button>
              
              {showAddBusForm && (
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                  <h2 className="text-lg font-medium mb-4">Добавление нового рейса</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Маршрут</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        value={newBusData.routeId}
                        onChange={(e) => setNewBusData({...newBusData, routeId: e.target.value})}
                      >
                        <option value="">Выберите маршрут</option>
                        {routes.map(route => (
                          <option key={route.id} value={route.id}>
                            {route.from} - {route.to}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        value={newBusData.date}
                        onChange={(e) => setNewBusData({...newBusData, date: e.target.value})}
                      >
                        <option value="">Выберите дату</option>
                        <option value="15-05-2025">15.05.2025</option>
                        <option value="16-05-2025">16.05.2025</option>
                        <option value="17-05-2025">17.05.2025</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Время отправления</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="23:00"
                          value={newBusData.departureTime}
                          onChange={(e) => setNewBusData({...newBusData, departureTime: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Время прибытия</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="06:10"
                          value={newBusData.arrivalTime}
                          onChange={(e) => setNewBusData({...newBusData, arrivalTime: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Номер машины</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="01KG123ABC"
                          value={newBusData.busNumber}
                          onChange={(e) => setNewBusData({...newBusData, busNumber: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Количество мест</label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          value={newBusData.totalSeats}
                          onChange={(e) => setNewBusData({...newBusData, totalSeats: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Тип транспорта</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        value={newBusData.vehicleType}
                        onChange={(e) => setNewBusData({...newBusData, vehicleType: e.target.value})}
                      >
                        <option value="автобус">Автобус</option>
                        <option value="маршрутка">Маршрутка</option>
                      </select>
                    </div>
                    
                    <button
                      className="w-full bg-blue-600 text-white rounded-lg py-2"
                      onClick={handleAddBus}
                    >
                      Добавить рейс
                    </button>
                  </div>
                </div>
              )}
              
              <h2 className="font-bold text-lg mt-6 mb-3">Существующие маршруты</h2>
              
              <div className="space-y-4">
                {routes.map(route => (
                  <div key={route.id} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-medium">{route.from} - {route.to}</div>
                      <div className="text-green-500 font-medium">{route.price} сом</div>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      <div>Отправление: {route.departureAddress}</div>
                      <div>Прибытие: {route.arrivalAddress}</div>
                      <div>Длительность: {route.duration} мин</div>
                      <div>Тип транспорта: {route.vehicleType}</div>
                    </div>
                    
                    <div className="mt-3 flex space-x-2">
                      <button className="bg-blue-100 text-blue-600 rounded px-3 py-1 text-sm">
                        Редактировать
                      </button>
                      <button className="bg-red-100 text-red-600 rounded px-3 py-1 text-sm">
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>Unknown step: {step}</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-100">
      {renderScreen()}
    </div>
  );
};

export default App;
