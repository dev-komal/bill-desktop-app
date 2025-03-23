const mongoose = require('mongoose');

const billItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  gstPercentage: Number,
  quantity: Number,
  totalPrice: Number,
  gstAmount: Number
});

const billSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
    ref: 'Customer'
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  customerAddress: {
    type: String,
    required: true
  },
  customerGstin: String,
  items: [billItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  totalGst: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bill', billSchema); 