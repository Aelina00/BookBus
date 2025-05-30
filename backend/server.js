const express = require('express');
const cors = require('cors');
// ЗАМЕНИТЬ на ваш БОЕВОЙ секретный ключ
const stripe = require('stripe')('sk_live_ВАШ_БОЕВОЙ_КЛЮЧ'); 

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://book-bus-swart.vercel.app'] // Добавьте ваш домен
}));
app.use(express.json());

// Реальная оплата
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;

    console.log('Создание реального платежа:', { amount, currency });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // В центах
      currency,
      metadata: {
        service: 'GOBUS Karakol Bus',
        route: metadata.route || '',
        passenger: metadata.passenger || '',
        seats: metadata.seats || '',
        ...metadata
      },
      // Автоматическое подтверждение
      confirmation_method: 'manual',
      confirm: false,
    });

    res.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    });
  } catch (error) {
    console.error('Ошибка создания платежа:', error);
    res.status(400).json({ 
      error: error.message 
    });
  }
});

// Webhook для обработки событий Stripe
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_ВАШ_WEBHOOK_SECRET');
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Обработка событий
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Платеж успешен:', paymentIntent.id);
      // Здесь можно отправить email, обновить базу данных и т.д.
      break;
    case 'payment_intent.payment_failed':
      console.log('Платеж не прошел:', event.data.object);
      break;
    default:
      console.log(`Неизвестное событие: ${event.type}`);
  }

  res.json({received: true});
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Боевой сервер запущен на порту ${PORT}`);
});