// routes/feedback-routes.js
const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback-model');  // Updated import path

router.post('/', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ 
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Error submitting feedback',
      error: error.message 
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback',
      error: error.message
    });
  }
});

module.exports = router;