// erp-backend/routes/itemMaster.js
const express = require('express');
const router = express.Router();
const ItemMaster = require('../models/ItemMaster');

// Create Item Master record
router.post('/', async (req, res) => {
  try {
      const itemData = req.body;
      const newItem = await ItemMaster.create(itemData);
      res.status(201).json({ message: 'Item Master created successfully', data: newItem });
  } catch (error) {
      console.error('Error creating Item Master:', error);
      res.status(500).json({ message: 'Error creating Item Master.', error: error.message });
  }
});

// In your erp-backend/routes/itemMaster.js
router.delete('/:id', async (req, res) => {
  try {
    // Replace 'ItemMaster' with your model name if different.
    await ItemMaster.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [updated] = await ItemMaster.update(req.body, { where: { id: req.params.id } });
    if (!updated) {
      return res.status(404).json({ message: 'Item not found' });
    }
    const updatedItem = await ItemMaster.findByPk(req.params.id);
    res.status(200).json({ message: 'Item updated successfully', data: updatedItem });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: 'Error updating item', error: error.message });
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

module.exports = router;