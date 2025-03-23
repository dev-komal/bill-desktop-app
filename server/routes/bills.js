const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');

// Get all bills
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single bill
router.get('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create bill
router.post('/', async (req, res) => {
  const bill = new Bill({
    customerId: req.body.customerId,
    customerName: req.body.customerName,
    customerEmail: req.body.customerEmail,
    customerPhone: req.body.customerPhone,
    customerAddress: req.body.customerAddress,
    customerGstin: req.body.customerGstin,
    items: req.body.items,
    subtotal: req.body.subtotal,
    totalGst: req.body.totalGst,
    totalAmount: req.body.totalAmount,
    date: new Date(req.body.date)
  });

  try {
    const newBill = await bill.save();
    res.status(201).json(newBill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete bill
router.delete('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    await bill.deleteOne();
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 