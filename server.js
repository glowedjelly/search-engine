const express = require('express');
const mongoose = require('mongoose');
const Fuse = require('fuse.js');
const Item = require('./models/Item');
require('dotenv').config();

// Add express-rate-limit for basic DoS protection
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up a basic rate limiter: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.get('/', async (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const items = await Item.find({});
  const fuse = new Fuse(items, { keys: ['name', 'description'], threshold: 0.4 });
  const results = query ? fuse.search(query).map(r => r.item) : [];
  res.render('index', { results, query });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
