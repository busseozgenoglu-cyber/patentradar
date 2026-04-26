require('dotenv').config({ path: '../.env' });
const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Security: Restrict CORS to known origins in production
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://patentradar.pro', 'https://www.patentradar.pro', 'https://markaradar.com', 'https://www.markaradar.com']
  : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Origin not allowed'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

const {
  PAYTR_MERCHANT_ID,
  PAYTR_MERCHANT_KEY,
  PAYTR_MERCHANT_SALT,
  PAYTR_TEST_MODE = '1'
} = process.env;

if (!PAYTR_MERCHANT_ID || !PAYTR_MERCHANT_KEY || !PAYTR_MERCHANT_SALT) {
  console.error('ERROR: PayTR credentials missing in .env file');
  console.error('Required: PAYTR_MERCHANT_ID, PAYTR_MERCHANT_KEY, PAYTR_MERCHANT_SALT');
}

// Simple in-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // 30 requests per minute

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW };

  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_LIMIT_WINDOW;
  }

  entry.count++;
  rateLimitMap.set(ip, entry);

  if (entry.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ status: 'error', error: 'Çok fazla istek. Lütfen biraz bekleyin.' });
  }

  next();
}

app.use(rateLimit);

// Input validators
function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidAmount(amount) {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && num <= 100000;
}

function isValidString(str, maxLen = 500) {
  return typeof str === 'string' && str.length > 0 && str.length <= maxLen;
}

/**
 * POST /api/paytr-token
 * Creates a PayTR iframe token
 */
app.post('/api/paytr-token', async (req, res) => {
  try {
    const {
      email,
      payment_amount,
      merchant_oid,
      user_name,
      user_address = 'Türkiye',
      user_phone = '05555555555',
      user_ip,
      merchant_ok_url,
      merchant_fail_url,
      timeout_limit = 30,
      debug_on = 0,
      test_mode = parseInt(PAYTR_TEST_MODE, 10),
      lang = 'tr'
    } = req.body;

    // Validation
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Geçersiz e-posta adresi.' });
    }
    if (!isValidString(user_name, 100)) {
      return res.status(400).json({ error: 'Kullanıcı adı gereklidir (max 100 karakter).' });
    }
    if (!isValidAmount(payment_amount)) {
      return res.status(400).json({ error: 'Geçersiz ödeme tutarı.' });
    }
    if (!isValidString(merchant_oid, 64)) {
      return res.status(400).json({ error: 'Geçersiz sipariş numarası.' });
    }
    if (!isValidString(user_ip, 45)) {
      return res.status(400).json({ error: 'Geçersiz IP adresi.' });
    }
    if (!isValidString(merchant_ok_url, 500) || !isValidString(merchant_fail_url, 500)) {
      return res.status(400).json({ error: 'Geçersiz dönüş URL\'leri.' });
    }

    // User basket (required by PayTR)
    const user_basket = [
      ['MarkaRadar Hizmeti', payment_amount, 1]
    ];
    const user_basket_json = JSON.stringify(user_basket);

    // PayTR requires amount in kuruş (multiply by 100)
    const amountInKurus = Math.round(parseFloat(payment_amount) * 100).toString();

    // Build hash string according to PayTR docs
    const hashStr = `${PAYTR_MERCHANT_ID}${user_ip}${merchant_oid}${email}${amountInKurus}${user_basket_json}${merchant_ok_url}${merchant_fail_url}${timeout_limit}${debug_on}${test_mode}${lang}${PAYTR_MERCHANT_SALT}`;
    const paytrToken = crypto.createHmac('sha256', PAYTR_MERCHANT_KEY).update(hashStr).digest('base64');

    const params = new URLSearchParams();
    params.append('merchant_id', PAYTR_MERCHANT_ID);
    params.append('user_ip', user_ip);
    params.append('merchant_oid', merchant_oid);
    params.append('email', email);
    params.append('payment_amount', amountInKurus);
    params.append('currency', 'TL');
    params.append('user_basket', user_basket_json);
    params.append('merchant_ok_url', merchant_ok_url);
    params.append('merchant_fail_url', merchant_fail_url);
    params.append('user_name', user_name);
    params.append('user_address', user_address);
    params.append('user_phone', user_phone);
    params.append('merchant_salt', PAYTR_MERCHANT_SALT);
    params.append('timeout_limit', String(timeout_limit));
    params.append('no_installment', '0');
    params.append('max_installment', '0');
    params.append('debug_on', String(debug_on));
    params.append('test_mode', String(test_mode));
    params.append('lang', lang);
    params.append('paytr_token', paytrToken);

    const response = await axios.post('https://www.paytr.com/odeme/api/get-token', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 30000
    });

    if (response.data.status === 'success') {
      res.json({
        status: 'success',
        token: response.data.token,
        iframe_url: `https://www.paytr.com/odeme/guvenli/${response.data.token}`
      });
    } else {
      console.error('PayTR error:', response.data);
      res.status(400).json({
        status: 'error',
        error: response.data.err_msg || 'PayTR token alınamadı'
      });
    }
  } catch (error) {
    console.error('PayTR token error:', error.response?.data || error.message);
    res.status(500).json({
      status: 'error',
      error: 'PayTR bağlantı hatası. Lütfen daha sonra tekrar deneyin.'
    });
  }
});

/**
 * POST /api/paytr-callback
 * PayTR payment result callback
 */
app.post('/api/paytr-callback', async (req, res) => {
  const { merchant_oid, status, total_amount, hash, payment_type, payment_amount, currency } = req.body;

  if (!merchant_oid || !hash) {
    return res.status(400).send('Missing fields');
  }

  // Verify callback hash
  const callbackHashStr = `${merchant_oid}${PAYTR_MERCHANT_SALT}${status}${total_amount}${currency}${PAYTR_MERCHANT_SALT}`;
  const callbackToken = crypto.createHmac('sha256', PAYTR_MERCHANT_KEY).update(callbackHashStr).digest('base64');

  if (hash !== callbackToken) {
    console.error('PayTR callback hash mismatch');
    return res.status(400).send('Hash mismatch');
  }

  console.log('PayTR callback received:', {
    merchant_oid,
    status,
    payment_amount,
    payment_type,
    currency
  });

  // TODO: Save payment result to database
  // TODO: Update user balance or mark service as paid

  res.send('OK');
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    paytr_configured: !!(PAYTR_MERCHANT_ID && PAYTR_MERCHANT_KEY && PAYTR_MERCHANT_SALT),
    test_mode: PAYTR_TEST_MODE,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: 'error', error: 'Endpoint bulunamadı.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ status: 'error', error: 'Erişim reddedildi.' });
  }
  res.status(500).json({ status: 'error', error: 'Bir hata oluştu.' });
});

const PORT = process.env.BACKEND_PORT || 3001;
app.listen(PORT, () => {
  console.log(`MarkaRadar PayTR Backend`);
  console.log(`Running on http://localhost:${PORT}`);
  console.log(`PayTR configured: ${!!(PAYTR_MERCHANT_ID && PAYTR_MERCHANT_KEY && PAYTR_MERCHANT_SALT)}`);
  console.log(`Test mode: ${PAYTR_TEST_MODE}`);
});
