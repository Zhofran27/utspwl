const express = require('express');
const cors = require('cors');
require('dotenv').config();

const resepRoutes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/resep', resepRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Rempah Nusantara API berjalan! 🌿' });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});