// server/models/Cashier.js
const mongoose = require('mongoose');

const CashierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('Cashier', CashierSchema);
