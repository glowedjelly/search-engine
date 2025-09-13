const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  url: { type: String, unique: true }
});

module.exports = mongoose.model('Item', itemSchema);
