const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Ombor tarixi
router.get('/', auth(['superadmin', 'admin']), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT w.*, p.name as product_name
      FROM warehouse w
      LEFT JOIN products p ON w.product_id = p.id
      ORDER BY w.created_at DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Kirim/chiqim qo'shish
router.post('/', auth(['superadmin', 'admin']), async (req, res) => {
  const { product_id, type, qty, note } = req.body;
  try {
    await pool.query(
      'INSERT INTO warehouse (product_id,type,qty,note) VALUES ($1,$2,$3,$4)',
      [product_id, type, qty, note]
    );
    const change = type === 'kirim' ? qty : -qty;
    await pool.query('UPDATE products SET stock = stock + $1 WHERE id=$2', [change, product_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
