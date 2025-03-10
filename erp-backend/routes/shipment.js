const express = require('express');
const { Shipment, Invoice, Part, BLAWB } = require('../models'); // Import all required models
const router = express.Router();

// Create a new shipment
router.post('/', async (req, res) => {
    try {
        const shipment = await Shipment.create({
            shipment_id: `SHIP-${Date.now()}`, // Auto-generated shipment ID
        });
        res.status(201).json(shipment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating shipment.', error: error.message });
    }
});

// Get all shipments
// Updated GET endpoint that includes associated Invoices and BLAWBs
router.get('/', async (req, res) => {
    try {
      const shipments = await Shipment.findAll({
        include: [
          {
            model: Invoice,
            attributes: ['invoice_no', 'date', 'invoice_total'],
          },
          {
            model: BLAWB,
            attributes: ['blawb_no', 'date', 'etd', 'eta'],
          },
        ],
      });
      res.json(shipments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching shipments.', error: error.message });
    }
  });  

// Get total invoice amount for a shipment
router.get('/total/:shipmentId', async (req, res) => {
    try {
        const shipmentId = req.params.shipmentId;
        const total = await Invoice.sum('invoice_total', {
            where: { shipment_id: shipmentId },
        });
        res.json({ total });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating total.', error: error.message });
    }
});

// Create BL/AWB for a shipment only if invoice and parts totals match
router.post('/:id/blawb', async (req, res) => {
    try {
        const { id } = req.params;
        const shipment = await Shipment.findByPk(id);
        if (!shipment) return res.status(404).send('Shipment not found');
    
        // Sum invoice_total from Invoice model using correct column name
        const invoiceTotal = await Invoice.sum('invoice_total', { where: { shipment_id: id } });
        
        // To sum parts totals, first fetch invoices for this shipment
        const invoices = await Invoice.findAll({ where: { shipment_id: id }, attributes: ['id'] });
        const invoiceIds = invoices.map(inv => inv.id);
        
        // Sum total from Part model for these invoices
        const partsTotal = await Part.sum('total', { where: { invoice_id: invoiceIds } });
    
        if (invoiceTotal !== partsTotal) {
            return res.status(400).send('Invoice and parts totals do not match');
        }
    
        // Create BL/AWB record
        const newBlawb = await BLAWB.create({
            ...req.body,
            shipment_id: id, // Use shipment_id field as defined in your model
        });
    
        res.json(newBlawb);
    } catch (error) {
        console.error('Error creating BL/AWB:', error);
        res.status(500).json({ message: 'Error creating BL/AWB.', error: error.message });
    }
});

module.exports = router;