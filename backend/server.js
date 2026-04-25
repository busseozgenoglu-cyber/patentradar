require('dotenv').config({ path: '../.env' });
const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

    if (!email || !payment_amount || !merchant_oid || !user_name) {
      return res.status(400).json({ error: 'Eksik alanlar: email, payment_amount, merchant_oid, user_name zorunludur.' });
    }

    // User basket (required by PayTR)
    const user_basket = [
      ['MarkaRadar Hizmeti', payment_amount, 1]
    ];
    const user_basket_json = JSON.stringify(user_basket);

    // PayTR requires amount in kuruş (multiply by 100)
    const amountInKurus = Math.round(parseFloat(payment_amount) * 100).toString();

    // Build hash string according to PayTR docs
    const hashStr = `${PAYTR_MERCHANT_ID}${user_ip}${merchant_oid}${email}${amountInKurus}0${user_basket_json}${timeout_limit}${debug_on}${test_mode}${lang}${PAYTR_MERCHANT_SALT}`;
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
    test_mode: PAYTR_TEST_MODE
  });
});

const PORT = process.env.BACKEND_PORT || 3001;
app.listen(PORT, () => {
  console.log(`MarkaRadar PayTR Backend`);
  console.log(`Running on http://localhost:${PORT}`);
  console.log(`PayTR configured: ${!!(PAYTR_MERCHANT_ID && PAYTR_MERCHANT_KEY && PAYTR_MERCHANT_SALT)}`);
  console.log(`Test mode: ${PAYTR_TEST_MODE}`);
});
