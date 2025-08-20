const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// GET all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Check if phone number exists
router.get('/check-phone/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const existingCustomer = await Customer.findOne({ phone });
    res.json({ exists: !!existingCustomer });
  } catch (error) {
    console.error('Error checking phone number:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new customer
router.post('/', async (req, res) => {
  try {
    // Check for existing phone number before creating
    const existingCustomer = await Customer.findOne({ phone: req.body.phone });
    if (existingCustomer) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }

    const customer = new Customer(req.body);
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a customer by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Customer.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT to update a customer by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if phone number exists for another customer
    if (req.body.phone) {
      const existingCustomer = await Customer.findOne({
        phone: req.body.phone,
        _id: { $ne: id }
      });
      if (existingCustomer) {
        return res.status(400).json({ error: 'Phone number already exists' });
      }
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, { 
      new: true,
      runValidators: true
    });
    
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.status(200).json(updatedCustomer);
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;