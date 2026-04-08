const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const axios = require('axios');

router.post('/', async (req, res) => {
  const { name, phone, address, latitude, longitude, items } = req.body;
  try {
    const orderResult = await pool.query(
      'INSERT INTO orders (name, phone, address, latitude, longitude) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [name, phone, address, latitude || null, longitude || null]
    );
    const order = orderResult.rows[0];

    let telegramText = `🛒 *Yangi buyurtma!*\n\n`;
    telegramText += `👤 ${name}\n📞 ${phone}\n📍 ${address}\n\n`;

    let total = 0;
    for (let i = 0; i < items.length; i++) {
      const { product_id, qty } = items[i];
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, qty) VALUES ($1,$2,$3)',
        [order.id, product_id, qty]
      );
      const prod = await pool.query('SELECT name, price FROM products WHERE id=$1', [product_id]);
      if (prod.rows.length > 0) {
        const p = prod.rows[0];
        total += p.price * qty;
        telegramText += `${i + 1}. ${p.name} x${qty} — ${(p.price * qty).toLocaleString()} so'm\n`;
      }
    }
    telegramText += `\n💰 *Jami: ${total.toLocaleString()} so'm*`;

    const BOT = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT = process.env.TELEGRAM_CHAT_ID;

    await axios.post(`https://api.telegram.org/bot${BOT}/sendMessage`, {
      chat_id: CHAT, text: telegramText, parse_mode: 'Markdown'
    });

    if (latitude && longitude) {
      await axios.post(`https://api.telegram.org/bot${BOT}/sendLocation`, {
        chat_id: CHAT, latitude: parseFloat(latitude), longitude: parseFloat(longitude)
      });
    }

    res.json({ success: true, order_id: order.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/status', async (req, res) => {
  const { status, cancel_reason } = req.body;
  try {
    const result = await pool.query(
      'UPDATE orders SET status=$1, cancel_reason=$2 WHERE id=$3 RETURNING *',
      [status, cancel_reason || null, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
