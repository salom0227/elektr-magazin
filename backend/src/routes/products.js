const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const supabase = require('../config/supabase');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Barcha mahsulotlar
router.get('/', async (req, res) => {
  try {
    const { category_id, search } = req.query;
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category_id) {
      params.push(category_id);
      query += ` AND p.category_id = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND p.name ILIKE $${params.length}`;
    }

    query += ' ORDER BY p.created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bitta mahsulot
router.get('/:slug', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.name as category_name 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1`,
      [req.params.slug]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Topilmadi' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mahsulot qo'shish (rasm bilan)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, brand, model, voltage, category_id, stock } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();

    let imageUrl = null;

    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const { error } = await supabase.storage
        .from('products')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype
        });
      if (error) throw error;

      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    const result = await pool.query(
      `INSERT INTO products (name, slug, description, price, brand, model, voltage, image, category_id, stock)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [name, slug, description, price, brand, model, voltage, imageUrl, category_id, stock]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mahsulot tahrirlash
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, brand, model, voltage, category_id, stock } = req.body;
    let imageUrl = req.body.existing_image;

    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const { error } = await supabase.storage
        .from('products')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype
        });
      if (error) throw error;
      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    const result = await pool.query(
      `UPDATE products SET name=$1, description=$2, price=$3, brand=$4,
       model=$5, voltage=$6, image=$7, category_id=$8, stock=$9
       WHERE id=$10 RETURNING *`,
      [name, description, price, brand, model, voltage, imageUrl, category_id, stock, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mahsulot o'chirish
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
