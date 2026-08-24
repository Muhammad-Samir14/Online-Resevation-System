const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: String,
  product: String,
  quantity: Number,
  totalAmount: Number,
  status: String,
  orderDate: String,
  deliveryAddress: String
});

module.exports = mongoose.model('Order', OrderSchema);