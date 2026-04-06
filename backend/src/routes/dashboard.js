const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth(['superadmin', 'admin', 'moderator']), async (req, res) => {
  try {
    const [orders, products, users, revenue, daily, topProducts] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM orders'),
      pool.query('SELECT COUNT(*) FROM products'),
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query(`
        SELECT COALESCE(SUM(p.price * oi.qty), 0) as total
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status = 'yetkazildi'
      `),
      pool.query(`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM orders
        WHERE created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY date
      `),
      pool.query(`
        SELECT p.name, SUM(oi.qty) as sold
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        GROUP BY p.id, p.name
        ORDER BY sold DESC
        LIMIT 5
      `)
    ]);

    res.json({
      total_orders: parseInt(orders.rows[0].count),
      total_products: parseInt(products.rows[0].count),
      total_users: parseInt(users.rows[0].count),
      total_revenue: parseFloat(revenue.rows[0].total),
      daily_orders: daily.rows,
      top_products: topProducts.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
