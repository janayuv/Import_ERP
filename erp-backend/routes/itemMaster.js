// erp-backend/routes/itemMaster.js
const express = require('express');
const router = express.Router();
const ItemMaster = require('../models/ItemMaster');

// Create Item Master record
router.post('/', async (req, res) => {
  try {
    const itemData = req.body; // expects fields: part_no, description, unit, price, hs_code, bcd_percentage, sws_percentage, igst_percentage
    const newItem = await ItemMaster.create(itemData);
    res.status(201).json({ message: 'Item Master created successfully', data: newItem });
  } catch (error) {
    console.error('Error creating Item Master:', error);
    res.status(500).json({ message: 'Error creating Item Master', error: error.message });
  }
});

// Get all Item Masters
router.get('/', async (req, res) => {
  try {
    const items = await ItemMaster.findAll();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching Item Masters:', error);
    res.status(500).json({ message: 'Error fetching Item Masters', error: error.message });
  }
});

// Optionally, add endpoints for updating and deleting an item

module.exports = router;