// server/routes/cashiers.js
const express = require('express');
const router = express.Router();
const Cashier = require('../models/Cashier');

// Get all cashiers
router.get('/', async (req, res) => {
  try {
    const cashiers = await Cashier.find();
    res.json(cashiers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new cashier
router.post('/', async (req, res) => {
  const { name, experience, email, phone } = req.body;
  const cashier = new Cashier({ name, experience, email, phone });

  try {
    const newCashier = await cashier.save();
    res.status(201).json(newCashier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a cashier
router.put('/:id', async (req, res) => {
  const { name, experience, email, phone } = req.body;

  try {
    const cashier = await Cashier.findById(req.params.id);
    if (!cashier) return res.status(404).json({ message: 'Cashier not found' });

    cashier.name = name;
    cashier.experience = experience;
    cashier.email = email;
    cashier.phone = phone;

    const updatedCashier = await cashier.save();
    res.json(updatedCashier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a cashier
router.delete('/:id', async (req, res) => {
  try {
    const cashier = await Cashier.findById(req.params.id);
    if (!cashier) return res.status(404).json({ message: 'Cashier not found' });

    await cashier.remove();
    res.json({ message: 'Cashier deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
