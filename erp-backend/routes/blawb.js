const express = require('express');
const router = express.Router();
const sequelize = require('../models/index').sequelize;
const BLAWB = require('../models/BLAWB');
const Shipment = require('../models/Shipment');

// Create BL/AWB
router.post('/shipments/:shipmentId/blawb', async (req, res) => {
    try {
        const t = await sequelize.transaction();
        const { shipmentId } = req.params;
        
        // Check if shipment exists
        const shipment = await Shipment.findByPk(shipmentId);
        if (!shipment) {
            await t.rollback();
            return res.status(404).json({ message: 'Shipment not found' });
        }

        const blawbData = { ...req.body, shipment_id: shipmentId };
        const newBlawb = await BLAWB.create(blawbData, { transaction: t });

        await Shipment.update({ status: 'BL_AWB_CREATED' }, {
            where: { id: shipmentId },
            transaction: t
        });

        await t.commit();
        res.status(201).json({ message: 'BL/AWB created successfully', data: newBlawb });
    } catch (error) {
        await t.rollback();
        console.error('Error creating BL/AWB:', error);
        res.status(500).json({ message: 'Error creating BL/AWB.', error: error.message });
    }
});

router.delete('/shipments/:shipmentId/blawb/:blawbId', async (req, res) => {
    try {
        const { shipmentId, blawbId } = req.params;
        const result = await BLAWB.destroy({
            where: { id: blawbId, shipment_id: shipmentId }
        });
        if (!result) {
            return res.status(404).json({ message: 'BL/AWB not found' });
        }
        res.status(200).json({ message: 'BL/AWB deleted successfully' });
    } catch (error) {
        console.error('Error deleting BL/AWB:', error);
        res.status(500).json({ message: 'Error deleting BL/AWB.', error: error.message });
    }
});

// Update BL/AWB
router.put('/shipments/:shipmentId/blawb/:blawbId', async (req, res) => {
    try {
        const t = await sequelize.transaction();
        try {
            const { shipmentId, blawbId } = req.params;
            const updatedData = req.body;

            // Update BL/AWB record using both id and shipment_id for added safety
            const [rowsUpdated, [updatedBlawb]] = await BLAWB.update(updatedData, {
                where: { id: blawbId, shipment_id: shipmentId },
                returning: true,
                transaction: t
            });

            if (rowsUpdated === 0) {
                await t.rollback();
                return res.status(404).json({ message: 'BL/AWB not found.' });
            }

            // Optionally update shipment status
            await Shipment.update({ status: 'BL_AWB_UPDATED' }, {
                where: { id: shipmentId },
                transaction: t
            });

            await t.commit();
            res.status(200).json({ message: 'BL/AWB updated successfully', data: updatedBlawb });
        } catch (error) {
            await t.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Error updating BL/AWB:', error);
        res.status(500).json({ message: 'Error updating BL/AWB.', error: error.message });
    }
});

// Get BL/AWB for a shipment
// routes/blawb.js
router.get('/shipments/:shipmentId/blawb', async (req, res) => {
    try {
        const { shipmentId } = req.params;
        const blawb = await BLAWB.findOne({ where: { shipment_id: Number(shipmentId) } });
        if (!blawb) {
            return res.status(404).json({ message: 'BL/AWB not found' });
        }
        res.status(200).json(blawb);
    } catch (error) {
        console.error('Error fetching BL/AWB:', error);
        res.status(500).json({ message: 'Error fetching BL/AWB.', error: error.message });
    }
});

module.exports = router;