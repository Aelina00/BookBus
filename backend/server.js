const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://karakolbus.kg', 'https://app.karakolbus.kg'],
  credentials: true
}));
app.use(express.json());
app.use(express.raw({ type: 'application/json' }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/karakolbus', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Схемы данных
const UserSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  pushToken: String,
  createdAt: { type: Date, default: Date.now }
});

const OTPSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  isUsed: { type: Boolean, default: false }
});

const RouteSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureAddress: String,
  arrivalAddress: String,
  price: { type: Number, required: true },
  currency: { type: String, default: 'сом' },
  duration: Number,
  vehicleType: { type: String, enum: ['автобус', 'маршрутка'] },
  stops: [{
    name: String,
    time: String
  }],
  isActive: { type: Boolean, default: true }
});

const BusSchema = new mongoose.Schema({
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  date: { type: String, required: true }, // DD-MM-YYYY
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  busNumber: { type: String, required: true },
  carrier: { type: String, default: 'ОсОО "Karakol Bus"' },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  vehicleType: { type: String, enum: ['автобус', 'маршрутка'] },
  bookedSeats: [Number],
  isActive: { type: Boolean, default: true }
});

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  seats: [Number],
  passenger: {
    firstName: String,
    lastName: String,
    phone: String
  },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentMethod: String,
  transactionId: String,
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now }
});

// Модели
const User = mongoose.model('User', UserSchema);
const OTP = mongoose.model('OTP', OTPSchema);
const Route = mongoose.model('Route', RouteSchema);
const Bus = mongoose.model('Bus', BusSchema);
const Booking = mongoose.model('Booking', BookingSchema);

// Middleware для аутентификации
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// SMS сервис (заглушка - замените на реальный SMS API)
const sendSMS = async (phone, message) => {
  try {
    // Здесь должна быть интеграция с SMS-провайдером (Nikita, PlayMobile и т.д.)
    console.log(`SMS to ${phone}: ${message}`);
    
    // Для разработки возвращаем успех
    return { success: true };
  } catch (error) {
    console.error('SMS sending error:', error);
    return { success: false, error: error.message };
  }
};

// Генерация OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// AUTH ROUTES
app.post('/auth/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone || !/^\+996\d{9}$/.test(phone)) {
      return res.status(400).json({ message: 'Некорректный номер телефона' });
    }

    // Удаляем старые OTP для этого номера
    await OTP.deleteMany({ phone });

    // Генерируем новый OTP
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 минут

    await OTP.create({ phone, code, expiresAt });

    // Отправляем SMS
    const smsResult = await sendSMS(phone, `Ваш код подтверждения: ${code}`);
    
    if (!smsResult.success) {
      return res.status(500).json({ message: 'Ошибка отправки SMS' });
    }

    res.json({ message: 'SMS с кодом отправлен' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

app.post('/auth/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Найдем действующий OTP
    const otpRecord = await OTP.findOne({
      phone,
      code: otp,
      expiresAt: { $gt: new Date() },
      isUsed: false
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Неверный или истекший код' });
    }

    // Помечаем OTP как использованный
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Проверяем, существует ли пользователь
    let user = await User.findOne({ phone });
    let isNewUser = false;

    if (!user) {
      // Создаем нового пользователя
      const tempPassword = await bcrypt.hash('temp_password', 10);
      user = await User.create({
        phone,
        password: tempPassword,
        firstName: '',
        lastName: '',
        isVerified: true
      });
      isNewUser = true;
   } else {
     // Обновляем статус верификации
     user.isVerified = true;
     await user.save();
   }

   // Генерируем JWT токен
   const token = jwt.sign(
     { userId: user._id, phone: user.phone },
     process.env.JWT_SECRET || 'fallback_secret',
     { expiresIn: '30d' }
   );

   res.json({
     token,
     user: {
       id: user._id,
       phone: user.phone,
       firstName: user.firstName,
       lastName: user.lastName,
       role: user.role
     },
     isNewUser
   });
 } catch (error) {
   console.error('Verify OTP error:', error);
   res.status(500).json({ message: 'Внутренняя ошибка сервера' });
 }
});

app.post('/auth/reset-password', async (req, res) => {
 try {
   const { phone, newPassword, otp } = req.body;

   // Проверяем OTP еще раз для безопасности
   const otpRecord = await OTP.findOne({
     phone,
     code: otp,
     isUsed: true // OTP уже должен быть использован в verify-otp
   });

   if (!otpRecord) {
     return res.status(400).json({ message: 'Неверный код подтверждения' });
   }

   // Хешируем новый пароль
   const hashedPassword = await bcrypt.hash(newPassword, 10);

   // Обновляем пользователя
   const user = await User.findOneAndUpdate(
     { phone },
     { 
       password: hashedPassword,
       isVerified: true
     },
     { new: true }
   );

   if (!user) {
     return res.status(404).json({ message: 'Пользователь не найден' });
   }

   // Генерируем новый токен
   const token = jwt.sign(
     { userId: user._id, phone: user.phone },
     process.env.JWT_SECRET || 'fallback_secret',
     { expiresIn: '30d' }
   );

   res.json({
     token,
     user: {
       id: user._id,
       phone: user.phone,
       firstName: user.firstName,
       lastName: user.lastName,
       role: user.role
     }
   });
 } catch (error) {
   console.error('Reset password error:', error);
   res.status(500).json({ message: 'Внутренняя ошибка сервера' });
 }
});

// ROUTES API
app.get('/routes', async (req, res) => {
 try {
   const routes = await Route.find({ isActive: true });
   res.json(routes);
 } catch (error) {
   console.error('Get routes error:', error);
   res.status(500).json({ message: 'Ошибка получения маршрутов' });
 }
});

app.post('/routes', authenticateToken, async (req, res) => {
 try {
   // Проверяем права админа
   const user = await User.findById(req.user.userId);
   if (user.role !== 'admin') {
     return res.status(403).json({ message: 'Недостаточно прав' });
   }

   const route = await Route.create(req.body);
   res.status(201).json(route);
 } catch (error) {
   console.error('Create route error:', error);
   res.status(500).json({ message: 'Ошибка создания маршрута' });
 }
});

app.put('/routes/:id', authenticateToken, async (req, res) => {
 try {
   const user = await User.findById(req.user.userId);
   if (user.role !== 'admin') {
     return res.status(403).json({ message: 'Недостаточно прав' });
   }

   const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
   if (!route) {
     return res.status(404).json({ message: 'Маршрут не найден' });
   }

   res.json(route);
 } catch (error) {
   console.error('Update route error:', error);
   res.status(500).json({ message: 'Ошибка обновления маршрута' });
 }
});

app.delete('/routes/:id', authenticateToken, async (req, res) => {
 try {
   const user = await User.findById(req.user.userId);
   if (user.role !== 'admin') {
     return res.status(403).json({ message: 'Недостаточно прав' });
   }

   await Route.findByIdAndUpdate(req.params.id, { isActive: false });
   res.json({ message: 'Маршрут удален' });
 } catch (error) {
   console.error('Delete route error:', error);
   res.status(500).json({ message: 'Ошибка удаления маршрута' });
 }
});

// BUSES API
app.get('/buses', async (req, res) => {
 try {
   const { date, routeId } = req.query;
   let query = { isActive: true };
   
   if (date) query.date = date;
   if (routeId) query.routeId = routeId;

   const buses = await Bus.find(query).populate('routeId');
   res.json(buses);
 } catch (error) {
   console.error('Get buses error:', error);
   res.status(500).json({ message: 'Ошибка получения рейсов' });
 }
});

app.post('/buses', authenticateToken, async (req, res) => {
 try {
   const user = await User.findById(req.user.userId);
   if (user.role !== 'admin') {
     return res.status(403).json({ message: 'Недостаточно прав' });
   }

   const bus = await Bus.create({
     ...req.body,
     bookedSeats: []
   });
   res.status(201).json(bus);
 } catch (error) {
   console.error('Create bus error:', error);
   res.status(500).json({ message: 'Ошибка создания рейса' });
 }
});

// BOOKINGS API
app.post('/bookings', authenticateToken, async (req, res) => {
 try {
   const { busId, seats, passenger } = req.body;

   // Проверяем доступность мест
   const bus = await Bus.findById(busId);
   if (!bus) {
     return res.status(404).json({ message: 'Рейс не найден' });
   }

   // Проверяем, не заняты ли места
   const occupiedSeats = seats.filter(seat => bus.bookedSeats.includes(seat));
   if (occupiedSeats.length > 0) {
     return res.status(400).json({ 
       message: `Места ${occupiedSeats.join(', ')} уже заняты` 
     });
   }

   // Создаем бронирование
   const booking = await Booking.create({
     userId: req.user.userId,
     busId,
     seats,
     passenger,
     totalAmount: req.body.totalAmount
   });

   // Резервируем места
   bus.bookedSeats.push(...seats);
   bus.availableSeats -= seats.length;
   await bus.save();

   res.status(201).json(booking);
 } catch (error) {
   console.error('Create booking error:', error);
   res.status(500).json({ message: 'Ошибка создания бронирования' });
 }
});

app.get('/bookings/user/:userId', authenticateToken, async (req, res) => {
 try {
   // Пользователь может получить только свои бронирования, админ - любые
   const user = await User.findById(req.user.userId);
   let query = {};
   
   if (user.role === 'admin') {
     query.userId = req.params.userId;
   } else {
     query.userId = req.user.userId;
   }

   const bookings = await Booking.find(query)
     .populate('busId')
     .populate({
       path: 'busId',
       populate: {
         path: 'routeId'
       }
     })
     .sort({ createdAt: -1 });

   res.json(bookings);
 } catch (error) {
   console.error('Get user bookings error:', error);
   res.status(500).json({ message: 'Ошибка получения бронирований' });
 }
});

app.get('/bookings', authenticateToken, async (req, res) => {
 try {
   const user = await User.findById(req.user.userId);
   if (user.role !== 'admin') {
     return res.status(403).json({ message: 'Недостаточно прав' });
   }

   const bookings = await Booking.find()
     .populate('userId')
     .populate('busId')
     .populate({
       path: 'busId',
       populate: {
         path: 'routeId'
       }
     })
     .sort({ createdAt: -1 });

   res.json(bookings);
 } catch (error) {
   console.error('Get all bookings error:', error);
   res.status(500).json({ message: 'Ошибка получения бронирований' });
 }
});

// FREEDOMPAY INTEGRATION
const createFreedomPaySignature = (data, secretKey) => {
 const sortedKeys = Object.keys(data).sort();
 const signString = sortedKeys.map(key => `${key}=${data[key]}`).join('&');
 return crypto.createHmac('sha256', secretKey).update(signString).digest('hex');
};

app.post('/payments/freedompay/create', authenticateToken, async (req, res) => {
 try {
   const { bookingId, returnUrl, cancelUrl } = req.body;

   // Получаем бронирование
   const booking = await Booking.findById(bookingId).populate('busId').populate({
     path: 'busId',
     populate: { path: 'routeId' }
   });

   if (!booking) {
     return res.status(404).json({ message: 'Бронирование не найдено' });
   }

   if (booking.userId.toString() !== req.user.userId) {
     return res.status(403).json({ message: 'Недостаточно прав' });
   }

   // Подготавливаем данные для FreedomPay
   const paymentData = {
     merchant_id: process.env.FREEDOMPAY_MERCHANT_ID,
     amount: Math.round(booking.totalAmount * 100), // В тыйынах
     currency: 'KGS',
     order_id: booking._id.toString(),
     description: `Билет ${booking.busId.routeId.from} → ${booking.busId.routeId.to}`,
     return_url: returnUrl || `${process.env.FRONTEND_URL}/payment/success`,
     cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/payment/cancel`,
     callback_url: `${process.env.BACKEND_URL}/payments/freedompay/callback`,
     customer_phone: booking.passenger.phone,
     timestamp: Date.now()
   };

   // Создаем подпись
   paymentData.signature = createFreedomPaySignature(paymentData, process.env.FREEDOMPAY_SECRET_KEY);

   // Отправляем запрос в FreedomPay
   const freedomPayResponse = await axios.post(
     `${process.env.FREEDOMPAY_API_URL}/payment/create`,
     paymentData
   );

   if (freedomPayResponse.data.success) {
     // Сохраняем ID транзакции
     booking.transactionId = freedomPayResponse.data.transaction_id;
     booking.paymentMethod = 'freedompay';
     await booking.save();

     res.json({
       success: true,
       payment_url: freedomPayResponse.data.payment_url,
       transaction_id: freedomPayResponse.data.transaction_id
     });
   } else {
     res.status(400).json({
       success: false,
       message: freedomPayResponse.data.message || 'Ошибка создания платежа'
     });
   }
 } catch (error) {
   console.error('FreedomPay create payment error:', error);
   res.status(500).json({ 
     success: false, 
     message: 'Ошибка при создании платежа' 
   });
 }
});

app.post('/payments/freedompay/callback', express.raw({ type: 'application/json' }), async (req, res) => {
 try {
   const data = JSON.parse(req.body.toString());
   
   // Проверяем подпись
   const signature = data.signature;
   delete data.signature;
   
   const expectedSignature = createFreedomPaySignature(data, process.env.FREEDOMPAY_SECRET_KEY);
   
   if (signature !== expectedSignature) {
     console.error('Invalid FreedomPay callback signature');
     return res.status(400).send('Invalid signature');
   }

   // Обрабатываем callback
   const booking = await Booking.findById(data.order_id);
   if (!booking) {
     console.error('Booking not found for order_id:', data.order_id);
     return res.status(404).send('Booking not found');
   }

   switch (data.status) {
     case 'SUCCESS':
       booking.paymentStatus = 'paid';
       booking.status = 'confirmed';
       await booking.save();
       
       // Отправляем SMS подтверждение
       await sendSMS(
         booking.passenger.phone,
         `Билет подтвержден! ${booking.busId.routeId.from} → ${booking.busId.routeId.to}, ${booking.busId.date} в ${booking.busId.departureTime}. Места: ${booking.seats.join(', ')}`
       );
       break;

     case 'FAILED':
       booking.paymentStatus = 'failed';
       
       // Освобождаем места
       const bus = await Bus.findById(booking.busId);
       if (bus) {
         bus.bookedSeats = bus.bookedSeats.filter(seat => !booking.seats.includes(seat));
         bus.availableSeats += booking.seats.length;
         await bus.save();
       }
       
       await booking.save();
       break;
   }

   res.status(200).send('OK');
 } catch (error) {
   console.error('FreedomPay callback error:', error);
   res.status(500).send('Internal server error');
 }
});

app.get('/payments/verify/:transactionId', authenticateToken, async (req, res) => {
 try {
   const { transactionId } = req.params;

   // Запрос статуса в FreedomPay
   const statusData = {
     merchant_id: process.env.FREEDOMPAY_MERCHANT_ID,
     transaction_id: transactionId,
     timestamp: Date.now()
   };

   statusData.signature = createFreedomPaySignature(statusData, process.env.FREEDOMPAY_SECRET_KEY);

   const response = await axios.post(
     `${process.env.FREEDOMPAY_API_URL}/payment/status`,
     statusData
   );

   res.json(response.data);
 } catch (error) {
   console.error('Payment verification error:', error);
   res.status(500).json({ message: 'Ошибка проверки платежа' });
 }
});

// PUSH NOTIFICATIONS
app.post('/notifications/register-token', authenticateToken, async (req, res) => {
 try {
   const { token } = req.body;
   
   await User.findByIdAndUpdate(req.user.userId, { pushToken: token });
   
   res.json({ message: 'Токен зарегистрирован' });
 } catch (error) {
   console.error('Register token error:', error);
   res.status(500).json({ message: 'Ошибка регистрации токена' });
 }
});

// Инициализация базы данных
const initializeDatabase = async () => {
 try {
   // Создаем админа по умолчанию
   const adminExists = await User.findOne({ role: 'admin' });
   if (!adminExists) {
     const hashedPassword = await bcrypt.hash('admin123', 10);
     await User.create({
       phone: '+996555123456',
       password: hashedPassword,
       firstName: 'Админ',
       lastName: 'Системы',
       role: 'admin',
       isVerified: true
     });
     console.log('Админ создан: +996555123456 / admin123');
   }

   // Создаем начальные маршруты
   const routesCount = await Route.countDocuments();
   if (routesCount === 0) {
     const initialRoutes = [
       {
         from: 'Бишкек',
         to: 'Каракол',
         departureAddress: 'Г. Бишкек, ул.Ибраимова/Фрунзе',
         arrivalAddress: 'Г. Каракол, ул.Гебзе/Пржевальск',
         price: 600,
         duration: 430,
         vehicleType: 'автобус',
         stops: [
           { name: 'Бишкек (отправление)', time: '23:00' },
           { name: 'Балыкчы', time: '01:30' },
           { name: 'Каракол (прибытие)', time: '06:10' }
         ]
       },
       {
         from: 'Каракол',
         to: 'Бишкек',
         departureAddress: 'Г. Каракол, ул.Гебзе/Пржевальск',
         arrivalAddress: 'Г. Бишкек, ул.Ибраимова/Фрунзе',
         price: 600,
         duration: 430,
         vehicleType: 'автобус',
         stops: [
           { name: 'Каракол (отправление)', time: '23:00' },
           { name: 'Балыкчы', time: '01:30' },
           { name: 'Бишкек (прибытие)', time: '06:10' }
         ]
       }
     ];

     await Route.insertMany(initialRoutes);
     console.log('Начальные маршруты созданы');
   }
 } catch (error) {
   console.error('Database initialization error:', error);
 }
};

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
 console.log(`🚀 Сервер запущен на порту ${PORT}`);
 await initializeDatabase();
});

module.exports = app;