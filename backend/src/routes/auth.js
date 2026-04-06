const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mailer = require('../config/mailer');
require('dotenv').config();

// Admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM admins WHERE email=$1 AND is_active=true', [email]);
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

// Parol tiklash — kod yuborish
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query('SELECT * FROM admins WHERE email=$1', [email]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Admin topilmadi' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    await pool.query('UPDATE admins SET reset_otp=$1, reset_expires=$2 WHERE email=$3', [otp, expires, email]);

    await mailer.sendMail({
      from: `"Elektr Magazin Admin" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Parol tiklash kodi',
      html: `
        <div style="font-family:sans-serif;max-width:400px;margin:0 auto;padding:20px">
          <h2 style="color:#1d4ed8">⚡ Admin Panel</h2>
          <p>Parol tiklash kodi:</p>
          <div style="font-size:36px;font-weight:bold;color:#1d4ed8;letter-spacing:8px;text-align:center;padding:20px;background:#eff6ff;border-radius:12px;margin:20px 0">
            ${otp}
          </div>
          <p style="color:#64748b;font-size:13px">Kod 10 daqiqa davomida amal qiladi.</p>
        </div>
      `
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Parol tiklash — yangi parol
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM admins WHERE email=$1 AND reset_otp=$2 AND reset_expires > NOW()',
      [email, otp]
    );
    if (result.rows.length === 0) return res.status(400).json({ error: 'Kod noto\'g\'ri yoki muddati o\'tgan' });
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE admins SET password=$1, reset_otp=NULL, reset_expires=NULL WHERE email=$2', [hash, email]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
