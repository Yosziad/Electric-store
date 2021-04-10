const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  pictureUrl: { type: String, required: true },
  description: { type: String, required: true },
  views: { type: Number},
  date: { type: Number, required: true },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
