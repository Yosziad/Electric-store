const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  pictureUrl: String,
  description: String,
  date: Number,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
