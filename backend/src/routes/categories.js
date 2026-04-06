const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      'UPDATE categories SET name=$1 WHERE id=$2 RETURNING *',
      [name, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
