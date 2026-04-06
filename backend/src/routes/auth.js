const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Login yoki parol noto\'g\'ri' });
  }
});

module.exports = router;
