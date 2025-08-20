// server/routes/restaurantInfo.js
const express = require('express');
const router = express.Router();
const RestaurantInfo = require('../models/RestaurantInfo');

// Get restaurant info
router.get('/', async (req, res) => {
  try {
    let info = await RestaurantInfo.findOne();
    if (!info) {
      info = new RestaurantInfo({
        name: '',
        address: '',
        pincode: '',
        city: '',
        state: '',
        phone: ''
      });
      await info.save();
    }
    res.json(info);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update restaurant info
router.post('/', async (req, res) => {
  try {
    const { name, address, pincode, city, state, phone } = req.body;
    
    // Validate pincode
    if (!pincode.match(/^[0-9]{6}$/)) {
      return res.status(400).json({ message: 'Invalid pincode format' });
    }

    // Validate phone number
    if (!phone.match(/^[0-9]{10}$/)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    let info = await RestaurantInfo.findOne();
    if (info) {
      info.name = name;
      info.address = address;
      info.pincode = pincode;
      info.city = city;
      info.state = state;
      info.phone = phone;
    } else {
      info = new RestaurantInfo({
        name,
        address,
        pincode,
        city,
        state,
        phone
      });
    }
    
    await info.save();
    res.json(info);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;