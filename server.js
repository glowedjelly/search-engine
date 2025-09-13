const express = require('express');
const mongoose = require('mongoose');
const Fuse = require('fuse.js');
const Item = require('./models/Item');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

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
