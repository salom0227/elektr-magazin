const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');

// Barcha adminlar
router.get('/', auth(['superadmin']), async (req, res) => {
  try {
    const result = await pool.query('SELECT id,name,email,role,is_active,created_at FROM admins ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Yangi admin qo'shish
router.post('/', auth(['superadmin']), async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO admins (name,email,password,role) VALUES ($1,$2,$3,$4) RETURNING id,name,email,role',
      [name, email, hash, role || 'admin']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin faollashtirish/o'chirish
router.put('/:id/toggle', auth(['superadmin']), async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE admins SET is_active = NOT is_active WHERE id=$1 RETURNING id,name,is_active',
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rol o'zgartirish
router.put('/:id/role', auth(['superadmin']), async (req, res) => {
  const { role } = req.body;
  try {
    const result = await pool.query(
      'UPDATE admins SET role=$1 WHERE id=$2 RETURNING id,name,role',
      [role, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Parol o'zgartirish
router.put('/:id/password', auth(['superadmin']), async (req, res) => {
  const { password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query('UPDATE admins SET password=$1 WHERE id=$2', [hash, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// O'chirish
router.delete('/:id', auth(['superadmin']), async (req, res) => {
  try {
    await pool.query('DELETE FROM admins WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
