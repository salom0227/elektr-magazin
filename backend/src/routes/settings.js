const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM settings');
    const obj = {};
    result.rows.forEach(r => obj[r.key] = r.value);
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:key', auth(['superadmin']), async (req, res) => {
  const { value } = req.body;
  try {
    await pool.query(
      'INSERT INTO settings (key,value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value=$2',
      [req.params.key, value]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
