const express = require('express');
const { Invoice, Part, Shipment } = require('../models');
const router = express.Router();

// Middleware for validating invoice fields
const validateInvoice = (req, res, next) => {
    const { supplier, invoice_no, date, material, invoice_total, currency } = req.body;

    if (!supplier || !invoice_no || !date || !material || !currency || isNaN(invoice_total)) {
        return res.status(400).json({ message: 'Missing or invalid fields.' });
    }
    next();
};

// Create Invoice
router.post('/:shipmentId', validateInvoice, async (req, res) => {
    try {
        console.log('Incoming Request Data:', req.body);

        const { supplier, invoice_no, date, material, currency, invoice_total } = req.body;
        const shipmentId = parseInt(req.params.shipmentId, 10);

        // Ensure shipment exists before inserting the invoice
        const shipmentExists = await Shipment.findByPk(shipmentId);
        if (!shipmentExists) {
            return res.status(400).json({ message: `Shipment ID ${shipmentId} does not exist.` });
        }

        // Create the invoice associated with a shipment
        const invoice = await Invoice.create({
            supplier,
            invoice_no,
            date,
            material,
            currency,
            invoice_total,
            shipment_id: shipmentId,
        });

        console.log('Invoice Created:', invoice.toJSON());
        res.status(201).json(invoice);
    } catch (error) {
        console.error('Error Creating Invoice:', error);
        res.status(500).json({ message: 'Error creating invoice.', error: error.message });
    }
});

// Update Invoice
router.put('/:id', validateInvoice, async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await Invoice.update(req.body, { where: { id } });
        if (updated[0] === 0) return res.status(404).json({ message: 'Invoice not found.' });

        res.status(200).json({ message: 'Invoice updated successfully.' });
    } catch (error) {
        console.error('Error updating invoice:', error);
        res.status(500).json({ message: 'Error updating invoice.', error: error.message });
    }
});

// Delete Invoice (only if no Parts are linked)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if invoice exists
        const invoice = await Invoice.findByPk(id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found.' });
        }

        // Check if parts exist
        const associatedPart = await Part.findOne({ where: { invoice_id: id } });
        if (associatedPart) {
            return res.status(400).json({
                message: 'Cannot delete invoice. Please delete all associated parts first.',
            });
        }

        // Delete invoice if no parts are linked
        await Invoice.destroy({ where: { id } });
        res.status(200).json({ message: `Invoice ${id} deleted successfully.` });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({ message: 'Error deleting invoice.', error: error.message });
    }
});

// Get Invoices by Shipment ID
router.get('/:shipmentId', async (req, res) => {
    try {
        const shipmentId = parseInt(req.params.shipmentId, 10);
        console.log('Requested Shipment ID:', shipmentId);

        const invoices = await Invoice.findAll({ where: { shipment_id: shipmentId } });
        console.log('Fetched Invoices:', invoices);

        if (!invoices.length) {
            return res.status(404).json({ message: 'No invoices found for this shipment.' });
        }

        res.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ message: 'Error fetching invoices.', error });
    }
});

// Get Invoice Details
router.get('/detail/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found.' });
        }
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching invoice.', error: error.message });
    }
});

module.exports = router;