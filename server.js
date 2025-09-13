const express = require('express');
const mongoose = require('mongoose');
const Fuse = require('fuse.js');
const Item = require('./models/Item');
const path = require('path');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/searchDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.static('public'));

app.get('/autocomplete', async (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const items = await Item.find({});
  const fuse = new Fuse(items, { keys: ['name', 'description'], threshold: 0.3 });
  const results = fuse.search(query).map(r => r.item.name);
  res.json(results.slice(0, 5));
});

app.get('/search', async (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const items = await Item.find({});
  const fuse = new Fuse(items, { keys: ['name', 'description'], threshold: 0.4 });
  const results = fuse.search(query).map(r => r.item);
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
