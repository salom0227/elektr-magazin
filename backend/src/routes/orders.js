const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const axios = require('axios');

router.post('/', async (req, res) => {
  const { name, phone, address, items } = req.body;
  try {
    const orderResult = await pool.query(
      'INSERT INTO orders (name, phone, address) VALUES ($1,$2,$3) RETURNING *',
      [name, phone, address]
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
    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      { chat_id: process.env.TELEGRAM_CHAT_ID, text: telegramText, parse_mode: 'Markdown' }
    );
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
