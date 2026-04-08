const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
require('dotenv').config();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM admins WHERE (email=$1 OR username=$1) AND is_active=true',
      [email]
    );
    if (result.rows.length === 0) return res.status(401).json({ error: 'Admin topilmadi' });
    const admin = result.rows[0];
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ error: 'Parol noto\'g\'ri' });
    const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/change-password', auth(['superadmin', 'admin']), async (req, res) => {
  const { current_password, new_password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM admins WHERE id=$1', [req.admin.id]);
    const admin = result.rows[0];
    const valid = await bcrypt.compare(current_password, admin.password);
    if (!valid) return res.status(400).json({ error: 'Joriy parol noto\'g\'ri' });
    const hashed = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE admins SET password=$1 WHERE id=$2', [hashed, admin.id]);
    res.json({ success: true, message: 'Parol muvaffaqiyatli o\'zgartirildi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
