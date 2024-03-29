const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  products: { type: Array, required: true },
  address: { type: String, required: true },
  date: { type: Number, required: true },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
