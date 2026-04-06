const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Barcha foydalanuvchilar
router.get('/', auth(['superadmin', 'admin']), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id,name,email,address,is_verified,created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Foydalanuvchi buyurtmalari
router.get('/:id/orders', auth(['superadmin', 'admin']), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
