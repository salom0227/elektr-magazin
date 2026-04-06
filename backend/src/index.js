const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Elektr magazin API ishlayapti!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portda ishlamoqda`);
});
