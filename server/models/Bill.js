const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  customerInfo: {
    type: String,
    required: true
  },
  cashierInfo: {
    type: String,
    required: true
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  total: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
billSchema.index({ date: -1, time: -1 });
billSchema.index({ invoiceNumber: 1 });

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;