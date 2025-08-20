const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');

// Create a new bill
router.post('/', async (req, res) => {
  // Validate required fields
  if (!req.body.invoiceNumber || !req.body.total || !req.body.date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const bill = new Bill({
    invoiceNumber: req.body.invoiceNumber,
    customerInfo: req.body.customerInfo,
    cashierInfo: req.body.cashierInfo,
    items: req.body.items,
    total: req.body.total,
    date: req.body.date || new Date().toISOString().split('T')[0],
    time: req.body.time || new Date().toLocaleTimeString(),
  });

  try {
    // Check if the bill with the same invoice number already exists
    const existingBill = await Bill.findOne({ invoiceNumber: bill.invoiceNumber });
    if (existingBill) {
      return res.status(400).json({ message: 'Bill with the same invoice number already exists' });
    }

    const newBill = await bill.save();
    res.status(201).json(newBill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all bills
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find().sort({ date: -1, time: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get bill history
router.get('/history', async (req, res) => {
  try {
    const bills = await Bill.find()
      .sort({ date: -1, time: -1 })
      .select('invoiceNumber cashierInfo customerInfo total date time items');
    
    console.log(`Retrieved ${bills.length} bills`);
    
    res.json(bills);
  } catch (error) {
    console.error('Bill history retrieval error:', {
      message: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ 
      message: 'Error retrieving bill history', 
      error: error.message 
    });
  }
});

// Update earnings and bill count
router.post('/update', async (req, res) => {
  try {
    // You can add any additional logic here for updating earnings
    // This endpoint is mainly for tracking purposes
    res.status(200).json({ message: 'Earnings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get total earnings and total bills
router.get('/stats', async (req, res) => {
  try {
    const totalEarnings = await Bill.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: { $sum: 1 }
        }
      }
    ]);

    if (totalEarnings.length > 0) {
      res.json({
        totalEarnings: totalEarnings[0].total,
        totalBills: totalEarnings[0].count
      });
    } else {
      res.json({ totalEarnings: 0, totalBills: 0 });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get monthly revenue for a specific year
router.get('/monthly-revenue/:year', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const bills = await Bill.aggregate([
      {
        $match: {
          date: {
            $gte: startDate.toISOString().split('T')[0],
            $lte: endDate.toISOString().split('T')[0]
          }
        }
      },
      {
        $group: {
          _id: { $substr: ['$date', 5, 2] }, // Group by month (MM from YYYY-MM-DD)
          revenue: { $sum: "$total" }
        }
      },
      {
        $project: {
          month: {
            $let: {
              vars: {
                monthsInString: [
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ]
              },
              in: {
                $arrayElemAt: ['$$monthsInString', { $subtract: [{ $toInt: '$_id' }, 1] }]
              }
            }
          },
          revenue: 1,
          _id: 0
        }
      },
      { $sort: { month: 1 } }
    ]);
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get yearly revenue
router.get('/yearly-revenue', async (req, res) => {
  try {
    const bills = await Bill.aggregate([
      {
        $group: {
          _id: { $substr: ['$date', 0, 4] }, // Group by year (YYYY from YYYY-MM-DD)
          revenue: { $sum: "$total" }
        }
      },
      {
        $project: {
          year: '$_id',
          revenue: 1,
          _id: 0
        }
      },
      { $sort: { year: 1 } }
    ]);
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific bill by ID
router.get('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (bill) {
      res.json(bill);
    } else {
      res.status(404).json({ message: 'Bill not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a bill
router.delete('/:id', async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (bill) {
      res.json({ message: 'Bill deleted successfully' });
    } else {
      res.status(404).json({ message: 'Bill not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a bill
router.patch('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        bill[key] = req.body[key];
      }
    });

    const updatedBill = await bill.save();
    res.json(updatedBill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bills by date range
router.get('/range/:startDate/:endDate', async (req, res) => {
  try {
    const { startDate, endDate } = req.params;
    const bills = await Bill.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: -1, time: -1 });
    
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;