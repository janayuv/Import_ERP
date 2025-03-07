const express = require('express');
const { Part } = require('../models');
const router = express.Router();

// Create Part
router.post('/:invoiceId', async (req, res) => {
    try {
        const { part_no, description, unit, quantity, price, total } = req.body;

        // Validate required fields
        if (!part_no || !description || !unit || isNaN(quantity) || isNaN(price) || isNaN(total)) {
            return res.status(400).json({ message: 'Missing or invalid fields.' });
        }

        const part = await Part.create({
            part_no,
            description,
            unit,
            quantity,
            price,
            total,
            invoice_id: req.params.invoiceId,
        });
        res.status(201).json(part);
    } catch (error) {
        console.error('Error creating part:', error);
        res.status(500).json({ message: 'Error creating part.', error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { part_no, description, unit, quantity, price, total } = req.body;

        // Validate required fields
        if (!part_no || !description || !unit || isNaN(quantity) || isNaN(price) || isNaN(total)) {
            return res.status(400).json({ message: 'Missing or invalid fields.' });
        }

        await Part.update(
            { part_no, description, unit, quantity, price, total },
            { where: { id } }
        );
        res.status(200).json({ message: 'Part updated successfully.' });
    } catch (error) {
        console.error('Error updating part:', error);
        res.status(500).json({ message: 'Error updating part.', error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Part.destroy({ where: { id } });
        res.status(200).json({ message: 'Part deleted successfully.' });
    } catch (error) {
        console.error('Error deleting part:', error);
        res.status(500).json({ message: 'Error deleting part.', error: error.message });
    }
});

// Get Parts by Invoice ID
router.get('/:invoiceId', async (req, res) => {
    try {
        const parts = await Part.findAll({
            where: { invoice_id: req.params.invoiceId },
        });
        res.json(parts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching parts.', error });
    }
});

module.exports = router;